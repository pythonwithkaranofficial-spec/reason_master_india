const fs = require('fs');
const path = require('path');

const topicsDir = path.join(__dirname, '../data/topics');
const questionsDir = path.join(__dirname, '../data/questions');

const alphabetSeriesQuestions = [
  {
    questionText: "Find the missing term in the alphabet series: B, D, G, K, P, ?",
    options: ["U", "V", "W", "X"],
    correctIndex: 1,
    difficulty: "easy",
    hint: "Observe the successive increments between letters: +2, +3, +4...",
    explanation: "The positional increments between letters increase by 1 at each step: B(2) + 2 = D(4); D(4) + 3 = G(7); G(7) + 4 = K(11); K(11) + 5 = P(16); P(16) + 6 = V(22). Hence, the missing letter is V.",
    solutionSteps: [
      "Step 1: Convert letters to alphabetical positions: B=2, D=4, G=7, K=11, P=16.",
      "Step 2: Calculate step differences: 4-2=2, 7-4=3, 11-7=4, 16-11=5.",
      "Step 3: Next increment is +6: 16 + 6 = 22, which corresponds to letter V."
    ],
    examTags: ["SSC CGL", "RRB NTPC", "IBPS CLERK"]
  },
  {
    questionText: "What comes next in the sequence: Z, X, V, T, R, ?",
    options: ["O", "P", "Q", "N"],
    correctIndex: 1,
    difficulty: "easy",
    hint: "Letters are decreasing by a constant step.",
    explanation: "Each letter is 2 positions behind the previous letter in reverse alphabetical order: Z(26) - 2 = X(24); X(24) - 2 = V(22); V(22) - 2 = T(20); T(20) - 2 = R(18); R(18) - 2 = P(16).",
    solutionSteps: [
      "Step 1: Identify positions: Z=26, X=24, V=22, T=20, R=18.",
      "Step 2: Observe constant subtraction of 2.",
      "Step 3: Next term is 18 - 2 = 16 = P."
    ],
    examTags: ["SSC CHSL", "RRB GROUP D"]
  },
  {
    questionText: "Complete the series: A, C, F, J, O, ?",
    options: ["T", "U", "V", "W"],
    correctIndex: 1,
    difficulty: "easy",
    hint: "Add triangular number increments (+2, +3, +4, +5, +6).",
    explanation: "A(1) + 2 = C(3); C(3) + 3 = F(6); F(6) + 4 = J(10); J(10) + 5 = O(15); O(15) + 6 = U(21). The correct next letter is U.",
    solutionSteps: [
      "Step 1: Letters correspond to numbers 1, 3, 6, 10, 15.",
      "Step 2: Add 6 to 15 to get 21.",
      "Step 3: 21st letter of English alphabet is U."
    ],
    examTags: ["SSC CGL", "IBPS PO"]
  },
  {
    questionText: "Find the next letter in the series: D, H, L, P, T, ?",
    options: ["W", "X", "Y", "Z"],
    correctIndex: 1,
    difficulty: "easy",
    hint: "Common difference of 4 letters.",
    explanation: "Each letter shifts forward by 4 positions: D(4)+4=H(8); H(8)+4=L(12); L(12)+4=P(16); P(16)+4=T(20); T(20)+4=X(24).",
    solutionSteps: [
      "Step 1: Check positional values: 4, 8, 12, 16, 20.",
      "Step 2: Add common difference (+4) to 20 = 24.",
      "Step 3: 24th letter is X."
    ],
    examTags: ["SSC MTS", "DELHI POLICE"]
  },
  {
    questionText: "What comes next in the letter group series: AB, DE, GH, JK, ?",
    options: ["LM", "MN", "NO", "MO"],
    correctIndex: 1,
    difficulty: "easy",
    hint: "Notice the skip of 1 letter between consecutive 2-letter pairs.",
    explanation: "AB (skip C) DE (skip F) GH (skip I) JK (skip L) MN. The next term is MN.",
    solutionSteps: [
      "Step 1: Look at the first letter of each pair: A(+3)→D(+3)→G(+3)→J(+3)→M.",
      "Step 2: Look at the second letter: B(+3)→E(+3)→H(+3)→K(+3)→N.",
      "Step 3: Combine to get MN."
    ],
    examTags: ["SSC CGL", "IBPS CLERK"]
  },
  {
    questionText: "Find the missing pair in the series: AZ, BY, CX, DW, ?",
    options: ["EV", "FU", "EW", "EU"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "Each pair consists of complementary opposite letters from opposite ends of the alphabet.",
    explanation: "A is 1st from start, Z is 1st from end. B is 2nd, Y is 2nd from end. Following this pattern: 5th letter from start is E, and 5th from end is V. Pair is EV.",
    solutionSteps: [
      "Step 1: First letters increase sequentially: A, B, C, D, E.",
      "Step 2: Second letters decrease sequentially: Z, Y, X, W, V.",
      "Step 3: The complementary pair is EV."
    ],
    examTags: ["SSC CGL", "RRB NTPC", "SBI PO"]
  },
  {
    questionText: "Complete the sequence: CX, FU, IR, LO, ?",
    options: ["PK", "OL", "NM", "OM"],
    correctIndex: 1,
    difficulty: "medium",
    hint: "First letters increase by 3; second letters decrease by 3.",
    explanation: "First letters: C(3) + 3 = F(6); F(6) + 3 = I(9); I(9) + 3 = L(12); L(12) + 3 = O(15). Second letters: X(24) - 3 = U(21); U(21) - 3 = R(18); R(18) - 3 = O(15); O(15) - 3 = L(12). Result is OL.",
    solutionSteps: [
      "Step 1: Track first element: 3, 6, 9, 12 -> 15 (O).",
      "Step 2: Track second element: 24, 21, 18, 15 -> 12 (L).",
      "Step 3: Combine: OL."
    ],
    examTags: ["SSC CHSL", "IBPS PO"]
  },
  {
    questionText: "Find the next term in the series: WFB, TGD, QHG, ?",
    options: ["NIK", "NIL", "OIK", "MIK"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "Track all three letters independently with their individual step differences.",
    explanation: "1st letter: W(23) - 3 = T(20); T(20) - 3 = Q(17); Q(17) - 3 = N(14). 2nd letter: F(6) + 1 = G(7); G(7) + 1 = H(8); H(8) + 1 = I(9). 3rd letter: B(2) + 2 = D(4); D(4) + 3 = G(7); G(7) + 4 = K(11). Combined: NIK.",
    solutionSteps: [
      "Step 1: 1st letter decreases by 3: Q - 3 = N.",
      "Step 2: 2nd letter increases by 1: H + 1 = I.",
      "Step 3: 3rd letter increases by (+2, +3, +4): G(7) + 4 = K(11).",
      "Step 4: Result: NIK."
    ],
    examTags: ["SSC CGL", "SBI CLERK"]
  },
  {
    questionText: "Which term replaces the question mark in: BZA, DYC, FXE, ?",
    options: ["HWG", "GVF", "HVF", "GWG"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "1st letter (+2), 2nd letter (-1), 3rd letter (+2).",
    explanation: "1st letter: B(+2)→D(+2)→F(+2)→H. 2nd letter: Z(-1)→Y(-1)→X(-1)→W. 3rd letter: A(+2)→C(+2)→E(+2)→G. Hence, HWG.",
    solutionSteps: [
      "Step 1: First letter: F + 2 = H.",
      "Step 2: Middle letter: X - 1 = W.",
      "Step 3: Last letter: E + 2 = G.",
      "Step 4: Result: HWG."
    ],
    examTags: ["SSC CGL", "RRB JE"]
  },
  {
    questionText: "What comes next in the series: EJO, TYD, INS, ?",
    options: ["XCH", "WCG", "YDI", "XCI"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Notice that every letter is shifted by 5 positions forward (mod 26).",
    explanation: "E(5)+5=J(10)+5=O(15); O(15)+5=T(20)+5=Y(25)+5=D(4); D(4)+5=I(9)+5=N(14)+5=S(19); S(19)+5=X(24)+5=C(3)+5=H(8). The next triplet is XCH.",
    solutionSteps: [
      "Step 1: Check continuous step between each letter: +5 across the board.",
      "Step 2: S(19) + 5 = 24 = X.",
      "Step 3: X(24) + 5 = 29 mod 26 = 3 = C.",
      "Step 4: C(3) + 5 = 8 = H.",
      "Step 5: Result: XCH."
    ],
    examTags: ["IBPS PO", "SBI PO"]
  },
  {
    questionText: "Find the missing letter cluster: GH, JL, NQ, ?",
    options: ["SW", "TV", "SX", "TW"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "First letter increment increases by 1 each time (+3, +4, +5); second letter increment also increases (+4, +5, +6).",
    explanation: "1st letters: G(7) + 3 = J(10); J(10) + 4 = N(14); N(14) + 5 = S(19). 2nd letters: H(8) + 4 = L(12); L(12) + 5 = Q(17); Q(17) + 6 = W(23). Result is SW.",
    solutionSteps: [
      "Step 1: 1st letters: 7 (+3) 10 (+4) 14 (+5) 19 -> S.",
      "Step 2: 2nd letters: 8 (+4) 12 (+5) 17 (+6) 23 -> W.",
      "Step 3: Result: SW."
    ],
    examTags: ["SSC CGL", "CDS"]
  },
  {
    questionText: "Find the next term in the word reduction series: PERPENDICULAR, ERPENDICULA, RPENDICUL, ?",
    options: ["PENDICU", "PENDICUL", "ERPEN", "ENDICU"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Alternate removal of front and back letters.",
    explanation: "From PERPENDICULAR: remove first letter 'P' and last letter 'R' -> ERPENDICULA. Then from ERPENDICULA: remove first letter 'E' and last letter 'A' -> RPENDICUL. Next: remove first letter 'R' and last letter 'L' -> PENDICU.",
    solutionSteps: [
      "Step 1: Notice pattern: 1st step dropped P (start) and R (end).",
      "Step 2: 2nd step dropped E (start) and A (end).",
      "Step 3: 3rd step must drop R (start) and L (end) from RPENDICUL, leaving PENDICU."
    ],
    examTags: ["SSC CGL", "IBPS PO", "UPSC CSAT"]
  },
  {
    questionText: "Complete the series: AI, BL, CN, DP, ?",
    options: ["EQ", "ER", "ES", "FQ"],
    correctIndex: 1,
    difficulty: "medium",
    hint: "1st letter is consecutive; 2nd letter differences: +3, +2, +2, +2.",
    explanation: "1st letters: A, B, C, D, E. 2nd letters: I(9) + 3 = L(12); L(12) + 2 = N(14); N(14) + 2 = P(16); P(16) + 2 = R(18). Result: ER.",
    solutionSteps: [
      "Step 1: First letter is E.",
      "Step 2: Second letter is 16 + 2 = 18 = R.",
      "Step 3: Result: ER."
    ],
    examTags: ["SSC CHSL", "RRB NTPC"]
  },
  {
    questionText: "What is the missing term in the double-letter series: DF, GJ, KM, NQ, RT, ?",
    options: ["UX", "UW", "VX", "VY"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Check difference between pairs and between successive terms.",
    explanation: "1st letters: D(4)+3=G(7)+4=K(11)+3=N(14)+4=R(18)+3=U(21). 2nd letters: F(6)+4=J(10)+3=M(13)+4=Q(17)+3=T(20)+4=X(24). Result is UX.",
    solutionSteps: [
      "Step 1: 1st letters alternate +3 and +4: 18 + 3 = 21 (U).",
      "Step 2: 2nd letters alternate +4 and +3: 20 + 4 = 24 (X).",
      "Step 3: Result: UX."
    ],
    examTags: ["SSC CGL", "SBI PO"]
  },
  {
    questionText: "Find the next term in the alphanumeric series: 2B, 4C, 8E, 14H, ?",
    options: ["22L", "20K", "22K", "24L"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Numbers have increments +2, +4, +6, +8. Letters have increments +1, +2, +3, +4.",
    explanation: "Numbers: 2(+2)→4(+4)→8(+6)→14(+8)→22. Letters: B(+1)→C(+2)→E(+3)→H(+4)→L. Combining both gives 22L.",
    solutionSteps: [
      "Step 1: Number sequence: 2, 4, 8, 14 -> difference increases by 2: 14 + 8 = 22.",
      "Step 2: Letter sequence: B(2), C(3), E(5), H(8) -> difference increases by 1: 8 + 4 = 12 = L.",
      "Step 3: Result: 22L."
    ],
    examTags: ["SSC CGL", "IBPS PO", "RRB NTPC"]
  }
];

const codedBloodRelationQuestions = [
  {
    questionText: "If 'A × B' means 'A is the father of B', 'A ÷ B' means 'A is the daughter of B', 'A + B' means 'A is the sister of B', which of the following represents 'P is the aunt of Q'?",
    options: ["P + R × Q", "P × R + Q", "P ÷ R × Q", "Q + R × P"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "An aunt is the sister of one's father or mother.",
    explanation: "In 'P + R × Q': P + R means P is sister of R. R × Q means R is father of Q. Therefore, P is sister of Q's father, which makes P the aunt of Q.",
    solutionSteps: [
      "Step 1: Break down P + R × Q: P + R means P is sister of R.",
      "Step 2: R × Q means R is father of Q.",
      "Step 3: Father's sister is aunt. Hence, P is aunt of Q."
    ],
    examTags: ["SSC CGL", "IBPS PO", "SBI PO"]
  },
  {
    questionText: "If 'P + Q' means P is brother of Q, 'P - Q' means P is sister of Q, 'P × Q' means P is mother of Q. Which represents that 'M is the maternal uncle of N'?",
    options: ["M + K × N", "M × K + N", "M - K × N", "N + K × M"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "Maternal uncle is mother's brother.",
    explanation: "In 'M + K × N': M + K means M is brother of K. K × N means K is mother of N. Brother of mother is maternal uncle. Hence M is maternal uncle of N.",
    solutionSteps: [
      "Step 1: Maternal uncle = mother's brother.",
      "Step 2: K × N makes K the mother of N.",
      "Step 3: M + K makes M the brother of K. Result: M + K × N."
    ],
    examTags: ["IBPS PO", "SBI CLERK", "RRB NTPC"]
  },
  {
    questionText: "If A $ B means A is son of B, A # B means A is brother of B, and A * B means A is mother of B. What does P # Q $ R * S mean?",
    options: ["P is brother of S", "P is son of S", "P is father of S", "P is uncle of S"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "Trace the generation tree step by step.",
    explanation: "P # Q means P is brother of Q. Q $ R means Q is son of R. R * S means R is mother of S. This means P, Q, and S are all children of R. Since P is male (brother of Q), P is brother of S.",
    solutionSteps: [
      "Step 1: P is brother of Q (P is male).",
      "Step 2: Q is son of R (R is parent of P and Q).",
      "Step 3: R is mother of S (R is mother of P, Q, and S).",
      "Step 4: P is brother of S."
    ],
    examTags: ["SSC CGL", "LIC AAO"]
  },
  {
    questionText: "If P % Q means P is father of Q, P & Q means P is sister of Q, P @ Q means P is son of Q. In 'H % J & K @ L', how is H related to L?",
    options: ["Husband", "Brother", "Father", "Son"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Find the common children of H and L.",
    explanation: "H % J means H is father of J. J & K means J is sister of K (so H is father of K too). K @ L means K is son of L (so L is mother of K). Since H is father of K and L is mother of K, H is husband of L.",
    solutionSteps: [
      "Step 1: H is father of J and K.",
      "Step 2: L is mother of K.",
      "Step 3: Therefore, H and L are husband and wife. H is husband of L."
    ],
    examTags: ["IBPS PO", "SBI PO", "SSC CGL"]
  },
  {
    questionText: "If 'A + B' means A is brother of B, 'A - B' means A is sister of B, 'A * B' means A is father of B. In 'M * N + O - P', how is M related to P?",
    options: ["Father", "Uncle", "Brother", "Grandfather"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "N, O, and P are all siblings.",
    explanation: "M * N means M is father of N. N + O means N is brother of O. O - P means O is sister of P. Thus N, O, and P are all siblings. M is the father of all of them, including P.",
    solutionSteps: [
      "Step 1: M is father of N.",
      "Step 2: N, O, P are siblings.",
      "Step 3: Hence M is father of P."
    ],
    examTags: ["SSC CHSL", "RRB NTPC"]
  },
  {
    questionText: "If 'P ÷ Q' means P is sister of Q, 'P × Q' means P is brother of Q, 'P - Q' means P is mother of Q, 'P + Q' means P is father of Q. Which of the following means 'T is the nephew of S'?",
    options: ["S × R + T × M", "S ÷ R + T", "T × R + S", "S - R + T"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Nephew is the male child of a sibling.",
    explanation: "In 'S × R + T × M': S is brother of R. R is father of T (R + T). T is male because T × M means T is brother of M. Since T is male and the child of S's brother R, T is the nephew of S.",
    solutionSteps: [
      "Step 1: S and R are brothers (S × R).",
      "Step 2: R is father of T (R + T).",
      "Step 3: T is male (T × M).",
      "Step 4: Therefore, T is nephew of S."
    ],
    examTags: ["IBPS PO", "SBI PO"]
  },
  {
    questionText: "If 'P @ Q' means P is sister of Q, 'P # Q' means P is father of Q, 'P * Q' means P is brother of Q. How is M related to P in 'M @ N # O * P'?",
    options: ["Paternal Aunt", "Maternal Aunt", "Sister", "Mother"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Sister of father is paternal aunt.",
    explanation: "M @ N means M is sister of N. N # O means N is father of O. O * P means O is brother of P. Since N is father of O and P, and M is sister of N, M is the paternal aunt of P.",
    solutionSteps: [
      "Step 1: N is father of P.",
      "Step 2: M is sister of N.",
      "Step 3: Father's sister is paternal aunt."
    ],
    examTags: ["SSC CGL", "UPSC CSAT"]
  },
  {
    questionText: "If 'A × B' means A is wife of B, 'A + B' means A is brother of B, 'A - B' means A is daughter of B. In 'P × Q + R - S', how is P related to S?",
    options: ["Daughter-in-law", "Daughter", "Sister-in-law", "Mother"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Q is the son of S.",
    explanation: "R - S means R is daughter of S. Q + R means Q is brother of R (so Q is son of S). P × Q means P is wife of Q. Wife of son is daughter-in-law. Hence P is daughter-in-law of S.",
    solutionSteps: [
      "Step 1: Q and R are children of S (Q is male).",
      "Step 2: P is wife of Q (son of S).",
      "Step 3: Result: P is daughter-in-law of S."
    ],
    examTags: ["SSC CGL", "IBPS CLERK"]
  },
  {
    questionText: "If 'A $ B' means A is brother of B, 'A @ B' means A is mother of B, 'A # B' means A is daughter of B. How is K related to M in 'K # L @ M $ N'?",
    options: ["Sister", "Daughter", "Mother", "Aunt"],
    correctIndex: 0,
    difficulty: "medium",
    hint: "Both K and M are children of L.",
    explanation: "K # L means K is daughter of L. L @ M means L is mother of M. M $ N means M is brother of N. Thus K, M, and N are all children of L. Since K is female (daughter of L), K is the sister of M.",
    solutionSteps: [
      "Step 1: L is mother of K and M.",
      "Step 2: K is female.",
      "Step 3: Therefore, K is sister of M."
    ],
    examTags: ["RRB NTPC", "SSC CGL"]
  },
  {
    questionText: "If 'P + Q' means P is daughter of Q, 'P - Q' means P is brother of Q, 'P × Q' means P is mother of Q. If 'A × B - C + D', how is A related to D?",
    options: ["Wife", "Sister", "Mother", "Daughter"],
    correctIndex: 0,
    difficulty: "hard",
    hint: "Check the parents of C and B.",
    explanation: "A × B means A is mother of B. B - C means B is brother of C (so A is mother of C). C + D means C is daughter of D (so D is parent of C). Since A is mother and D is the other parent, A is wife of D.",
    solutionSteps: [
      "Step 1: A is mother of B and C.",
      "Step 2: C is daughter of D.",
      "Step 3: Both A and D are parents of C. A is female, so D is male. A is wife of D."
    ],
    examTags: ["SSC CGL", "IBPS PO"]
  }
];

const numberClassificationQuestions = [
  {
    questionText: "Find the odd one out from the following numbers: 13, 17, 23, 27",
    options: ["13", "17", "23", "27"],
    correctIndex: 3,
    difficulty: "easy",
    hint: "Check prime vs composite properties.",
    explanation: "13, 17, and 23 are all prime numbers with no divisors other than 1 and themselves. 27 is a composite number (3 × 3 × 3 = 27). Hence 27 is the odd one out.",
    solutionSteps: [
      "Step 1: Check primes: 13, 17, 23 are prime.",
      "Step 2: 27 = 3³, composite.",
      "Step 3: Result is 27."
    ],
    examTags: ["SSC CGL", "RRB NTPC"]
  },
  {
    questionText: "Choose the odd number pair: 14 - 49, 16 - 64, 18 - 80, 20 - 100",
    options: ["14 - 49", "16 - 64", "18 - 80", "20 - 100"],
    correctIndex: 2,
    difficulty: "easy",
    hint: "Look at the square of half the first number: (n / 2)².",
    explanation: "(14/2)² = 7² = 49; (16/2)² = 8² = 64; (20/2)² = 10² = 100. But for 18: (18/2)² = 9² = 81, whereas 80 is given. Hence 18 - 80 is the odd pair.",
    solutionSteps: [
      "Step 1: In 14 - 49: 14 / 2 = 7, 7² = 49.",
      "Step 2: In 16 - 64: 16 / 2 = 8, 8² = 64.",
      "Step 3: In 18 - 80: 18 / 2 = 9, 9² = 81 ≠ 80.",
      "Step 4: Result is 18 - 80."
    ],
    examTags: ["SSC CHSL", "IBPS CLERK"]
  },
  {
    questionText: "Find the odd number out from the group: 28, 65, 126, 215",
    options: ["28", "65", "126", "215"],
    correctIndex: 3,
    difficulty: "medium",
    hint: "Relate numbers to cubes: n³ + 1.",
    explanation: "28 = 3³ + 1; 65 = 4³ + 1; 126 = 5³ + 1. But 215 = 6³ - 1 (216 - 1). All others are of the form n³ + 1, whereas 215 is n³ - 1.",
    solutionSteps: [
      "Step 1: 3³ + 1 = 27 + 1 = 28.",
      "Step 2: 4³ + 1 = 64 + 1 = 65.",
      "Step 3: 5³ + 1 = 125 + 1 = 126.",
      "Step 4: 6³ + 1 = 217 ≠ 215 (215 is 6³ - 1). Result: 215."
    ],
    examTags: ["SSC CGL", "RRB JE"]
  },
  {
    questionText: "Find the odd number: 121, 169, 225, 289",
    options: ["121", "169", "225", "289"],
    correctIndex: 2,
    difficulty: "medium",
    hint: "Check whether the base of each square is prime or composite.",
    explanation: "121 = 11² (11 is prime); 169 = 13² (13 is prime); 289 = 17² (17 is prime). But 225 = 15² where 15 is a composite number (3 × 5). Hence 225 is the odd one out.",
    solutionSteps: [
      "Step 1: Find square roots: √121=11, √169=13, √225=15, √289=17.",
      "Step 2: 11, 13, 17 are prime numbers.",
      "Step 3: 15 is composite. Result: 225."
    ],
    examTags: ["SSC CGL", "SBI PO"]
  },
  {
    questionText: "Find the odd pair: 7:42, 8:56, 9:72, 10:95",
    options: ["7:42", "8:56", "9:72", "10:95"],
    correctIndex: 3,
    difficulty: "easy",
    hint: "Rule: n : n × (n - 1).",
    explanation: "7 × 6 = 42; 8 × 7 = 56; 9 × 8 = 72. But 10 × 9 = 90, not 95. Hence 10:95 is the odd pair.",
    solutionSteps: [
      "Step 1: Check pattern n * (n-1).",
      "Step 2: 7*6=42, 8*7=56, 9*8=72.",
      "Step 3: 10*9=90 ≠ 95. Result: 10:95."
    ],
    examTags: ["SSC MTS", "RRB GROUP D"]
  },
  {
    questionText: "Find the odd number out: 35, 49, 63, 75",
    options: ["35", "49", "63", "75"],
    correctIndex: 3,
    difficulty: "easy",
    hint: "Check divisibility by 7.",
    explanation: "35 (7 × 5), 49 (7 × 7), and 63 (7 × 9) are all exact multiples of 7. 75 is not divisible by 7 (75 = 7 × 10 + 5).",
    solutionSteps: [
      "Step 1: Test divisibility by 7.",
      "Step 2: 35/7=5, 49/7=7, 63/7=9.",
      "Step 3: 75/7 = 10.71 (not divisible). Result: 75."
    ],
    examTags: ["SSC CGL", "DELHI POLICE"]
  },
  {
    questionText: "Find the odd one out: 144, 168, 196, 256",
    options: ["144", "168", "196", "256"],
    correctIndex: 1,
    difficulty: "easy",
    hint: "Check for perfect squares.",
    explanation: "144 = 12², 196 = 14², and 256 = 16² are all perfect squares. 168 is not a perfect square (between 12²=144 and 13²=169).",
    solutionSteps: [
      "Step 1: √144 = 12 (integer).",
      "Step 2: √196 = 14 (integer).",
      "Step 3: √256 = 16 (integer).",
      "Step 4: √168 ≈ 12.96 (not a square). Result: 168."
    ],
    examTags: ["SSC CHSL", "RRB NTPC"]
  },
  {
    questionText: "Find the odd pair: 12 - 144, 13 - 169, 14 - 196, 15 - 220",
    options: ["12 - 144", "13 - 169", "14 - 196", "15 - 220"],
    correctIndex: 3,
    difficulty: "easy",
    hint: "Second number is the square of the first number.",
    explanation: "12² = 144, 13² = 169, 14² = 196. But 15² = 225, whereas 220 is given. Hence 15 - 220 is the odd pair.",
    solutionSteps: [
      "Step 1: Check squares: 12²=144, 13²=169, 14²=196.",
      "Step 2: 15² = 225 ≠ 220.",
      "Step 3: Result: 15 - 220."
    ],
    examTags: ["SSC CGL", "IBPS CLERK"]
  },
  {
    questionText: "Find the odd one out: 111, 222, 333, 445",
    options: ["111", "222", "333", "445"],
    correctIndex: 3,
    difficulty: "easy",
    hint: "Check digit repetition.",
    explanation: "In 111, 222, and 333, all three digits are identical (repdigit numbers divisible by 111). 445 has two 4s and one 5. Hence 445 is the odd one out.",
    solutionSteps: [
      "Step 1: 111, 222, 333 are multiples of 111 with uniform digits.",
      "Step 2: 445 has non-identical digits (4 and 5).",
      "Step 3: Result: 445."
    ],
    examTags: ["SSC MTS", "RRB GROUP D"]
  },
  {
    questionText: "Find the odd number: 23, 29, 31, 39",
    options: ["23", "29", "31", "39"],
    correctIndex: 3,
    difficulty: "easy",
    hint: "Check prime numbers in the 20s and 30s.",
    explanation: "23, 29, and 31 are prime numbers. 39 is a composite number divisible by 3 and 13 (3 × 13 = 39). Hence 39 is the odd one out.",
    solutionSteps: [
      "Step 1: Check primes: 23, 29, 31 have no divisors.",
      "Step 2: 39 = 3 × 13 (composite).",
      "Step 3: Result: 39."
    ],
    examTags: ["SSC CGL", "RRB NTPC"]
  }
];

function formatExamTags(tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return ["SSC CGL", "IBPS PO", "RRB NTPC"];
  }
  return tags.map(t => String(t).replace(/_/g, ' ').toUpperCase());
}

function transformMCQToPractice(q) {
  return {
    questionText: q.questionText,
    options: q.options,
    correctIndex: q.correctIndex,
    difficulty: q.difficulty || "medium",
    hint: q.hint || "Analyze the pattern and apply the standard shortcut rules.",
    explanation: q.explanation || (Array.isArray(q.solutionSteps) ? q.solutionSteps.join("\n") : String(q.solutionSteps || "")),
    solutionSteps: Array.isArray(q.solutionSteps) ? q.solutionSteps.join("\n") : (q.solutionSteps || q.explanation || ""),
    examTags: formatExamTags(q.examTags),
    figureRef: q.figureRef
  };
}

function run() {
  const topicFiles = fs.readdirSync(topicsDir).filter(f => f.endsWith('.json'));
  let totalTopicsFixed = 0;
  let totalSubtopicsFixed = 0;

  topicFiles.forEach(f => {
    const topicId = f.replace('.json', '');
    const topicFilePath = path.join(topicsDir, f);
    const topicData = JSON.parse(fs.readFileSync(topicFilePath, 'utf-8'));

    const qFilePath = path.join(questionsDir, f);
    let qList = [];
    if (fs.existsSync(qFilePath)) {
      const qData = JSON.parse(fs.readFileSync(qFilePath, 'utf-8'));
      qList = qData.questions || qData;
    }

    let modified = false;

    if (topicData.subtopics) {
      topicData.subtopics.forEach(sub => {
        const hasDummy = (sub.practiceQuestions || []).some(q =>
          (q.questionText && q.questionText.includes('Apply the concepts')) ||
          (q.options && q.options.includes('Option A'))
        );

        if (hasDummy || (sub.practiceQuestions && sub.practiceQuestions.length < 5)) {
          console.log(`Fixing topic: ${topicId}, subtopic: ${sub.id} (${sub.name})`);

          let newQuestions = [];

          if (topicId === 'coding_decoding') {
            if (sub.id === 'letter_coding') {
              const letterPool = qList.filter(q => !/\d+/.test(q.options.join(' ')) && !/\d+/.test(q.questionText));
              const chosen = letterPool.slice(0, 20);
              newQuestions = chosen.map(transformMCQToPractice);
            } else {
              // number_coding
              const numPool = qList.filter(q => /\d+/.test(q.options.join(' ')) || /\d+/.test(q.questionText));
              const chosen = (numPool.length >= 20 ? numPool : qList).slice(0, 20);
              newQuestions = chosen.map(transformMCQToPractice);
            }
          } else if (topicId === 'direction_sense') {
            if (sub.id === 'shadow_direction') {
              const shadowPool = qList.filter(q => q.subtopicId === 'shadow_direction' || /shadow|morning|evening|sunrise|sunset/i.test(q.questionText));
              const chosen = shadowPool.slice(0, 20);
              newQuestions = chosen.map(transformMCQToPractice);
            } else {
              // simple_direction
              const simplePool = qList.filter(q => !/shadow|morning|evening|sunrise|sunset/i.test(q.questionText));
              const chosen = simplePool.slice(0, 20);
              newQuestions = chosen.map(transformMCQToPractice);
            }
          } else if (topicId === 'series_completion') {
            if (sub.id === 'number_series') {
              const chosen = qList.slice(0, 20);
              newQuestions = chosen.map(transformMCQToPractice);
            } else {
              // alphabet_series
              newQuestions = alphabetSeriesQuestions;
            }
          } else if (topicId === 'blood_relations' && sub.id === 'coded_blood_relation') {
            newQuestions = [...(sub.practiceQuestions || []), ...codedBloodRelationQuestions];
          } else if (topicId === 'classification' && sub.id === 'number_classification') {
            newQuestions = [...(sub.practiceQuestions || []), ...numberClassificationQuestions];
          } else {
            // Standard single or multi subtopic: select 20 balanced questions (6 Easy, 8 Medium, 6 Hard)
            let subPool = qList;
            if (sub.id && !sub.id.endsWith('_core')) {
              const matching = qList.filter(q => q.subtopicId === sub.id);
              if (matching.length >= 10) {
                subPool = matching;
              }
            }

            const easy = subPool.filter(q => q.difficulty === 'easy');
            const med = subPool.filter(q => q.difficulty === 'medium');
            const hard = subPool.filter(q => q.difficulty === 'hard');

            const chosen = [
              ...easy.slice(0, 6),
              ...med.slice(0, 8),
              ...hard.slice(0, 6)
            ];

            // If shortfall, fill from remainder
            if (chosen.length < 20) {
              const chosenIds = new Set(chosen.map(q => q.id));
              const remaining = subPool.filter(q => !chosenIds.has(q.id));
              chosen.push(...remaining.slice(0, 20 - chosen.length));
            }

            newQuestions = chosen.map(transformMCQToPractice);
          }

          if (newQuestions.length > 0) {
            sub.practiceQuestions = newQuestions;
            modified = true;
            totalSubtopicsFixed++;
          }
        }
      });
    }

    if (modified) {
      fs.writeFileSync(topicFilePath, JSON.stringify(topicData, null, 2), 'utf-8');
      totalTopicsFixed++;
    }
  });

  console.log(`\nCOMPLETED: Fixed ${totalSubtopicsFixed} subtopics across ${totalTopicsFixed} topic files.`);
}

run();
