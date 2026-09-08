/**
 * Master Topics Summary Index
 * Auto-generated from data pipeline.
 */

export interface TopicSummary {
  id: string;
  name: string;
  category: "verbal" | "nonverbal";
  subtopicCount: number;
  exampleCount: number;
  practiceCount: number;
  shortcutSummary: string;
  subtopics: {
    id: string;
    name: string;
    exampleCount: number;
    practiceCount: number;
  }[];
}

export const ALL_TOPICS_SUMMARY: TopicSummary[] = [
  {
    "id": "alphabet_test",
    "name": "Alphabet Test",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Memorize EJOTY (E=5, J=10, O=15, T=20, Y=25) to instantly locate any letter's position. For opposite letters, sum is always 27 (A+Z=27, B+Y=27).",
    "subtopics": [
      {
        "id": "alphabet_test_core",
        "name": "Alphabet Test — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "analogy",
    "name": "Analogy",
    "category": "verbal",
    "subtopicCount": 3,
    "exampleCount": 10,
    "practiceCount": 20,
    "shortcutSummary": "Identify the relationship in the given pair first (e.g., synonym, antonym, part-whole, cause-effect, tool-worker), then find the pair that mirrors that exact relationship. Never jump to options without naming the relationship type.",
    "subtopics": [
      {
        "id": "word_analogy",
        "name": "Word-based Analogy",
        "exampleCount": 5,
        "practiceCount": 10
      },
      {
        "id": "number_analogy",
        "name": "Number-based Analogy",
        "exampleCount": 3,
        "practiceCount": 5
      },
      {
        "id": "alphabet_analogy",
        "name": "Alphabet-based Analogy",
        "exampleCount": 2,
        "practiceCount": 5
      }
    ]
  },
  {
    "id": "analytical_reasoning",
    "name": "Analytical Reasoning",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Create a matrix/table with all variables. List all conditions. Fill in definite clues first, then use elimination. Cross off impossible combinations systematically.",
    "subtopics": [
      {
        "id": "analytical_reasoning_core",
        "name": "Analytical Reasoning — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "blood_relations",
    "name": "Blood Relations",
    "category": "verbal",
    "subtopicCount": 2,
    "exampleCount": 7,
    "practiceCount": 22,
    "shortcutSummary": "Draw a family tree using symbols (+ for male, − for female, = for married, arrows for parent→child) as you read the statement, left to right. Never solve in your head beyond 2 relations.",
    "subtopics": [
      {
        "id": "direct_relation",
        "name": "Direct Blood Relation",
        "exampleCount": 5,
        "practiceCount": 20
      },
      {
        "id": "coded_blood_relation",
        "name": "Coded Blood Relation",
        "exampleCount": 2,
        "practiceCount": 2
      }
    ]
  },
  {
    "id": "cause_and_effect",
    "name": "Cause and Effect",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Identify which event could have led to the other. The cause always precedes the effect in time. If both events are independent or consequences of a common cause, neither is the cause of the other.",
    "subtopics": [
      {
        "id": "cause_and_effect_core",
        "name": "Cause and Effect — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "classification",
    "name": "Classification / Odd One Out",
    "category": "verbal",
    "subtopicCount": 2,
    "exampleCount": 7,
    "practiceCount": 22,
    "shortcutSummary": "Find the common property shared by all but one item. The odd one out is the item that does NOT share that property. Always check at least two possible groupings before finalizing.",
    "subtopics": [
      {
        "id": "word_classification",
        "name": "Word-based Classification",
        "exampleCount": 5,
        "practiceCount": 20
      },
      {
        "id": "number_classification",
        "name": "Number-based Classification",
        "exampleCount": 2,
        "practiceCount": 2
      }
    ]
  },
  {
    "id": "coding_decoding",
    "name": "Coding-Decoding",
    "category": "verbal",
    "subtopicCount": 2,
    "exampleCount": 6,
    "practiceCount": 40,
    "shortcutSummary": "Compare each letter in the word with its coded letter. Find the shift pattern (e.g., each letter +2). Apply the same shift to decode. For number/symbol coding, map each code to its meaning using the given examples.",
    "subtopics": [
      {
        "id": "letter_coding",
        "name": "Letter Coding",
        "exampleCount": 3,
        "practiceCount": 20
      },
      {
        "id": "number_coding",
        "name": "Number/Symbol Coding",
        "exampleCount": 3,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "course_of_action",
    "name": "Course of Action",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "A proper course of action must be practical, address the problem stated, and not be an extreme or impractical solution.",
    "subtopics": [
      {
        "id": "course_of_action_core",
        "name": "Course of Action — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "critical_reasoning",
    "name": "Critical Reasoning / Assertion & Reason",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Determine if the Assertion is true/false independently. Then check if the Reason is true/false. Finally, check if the Reason correctly explains the Assertion.",
    "subtopics": [
      {
        "id": "critical_reasoning_core",
        "name": "Critical Reasoning / Assertion & Reason — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "data_sufficiency",
    "name": "Data Sufficiency",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Check each statement independently first, then together. A statement is sufficient if it alone provides enough information to answer the question definitively.",
    "subtopics": [
      {
        "id": "data_sufficiency_core",
        "name": "Data Sufficiency — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "direction_sense",
    "name": "Direction Sense Test",
    "category": "verbal",
    "subtopicCount": 2,
    "exampleCount": 6,
    "practiceCount": 40,
    "shortcutSummary": "Always draw a compass (N-S-E-W) and trace the path step by step on paper. Mark each turn. Use Pythagoras theorem for shortest distance when the path forms a right triangle.",
    "subtopics": [
      {
        "id": "simple_direction",
        "name": "Simple Direction Problems",
        "exampleCount": 3,
        "practiceCount": 20
      },
      {
        "id": "shadow_direction",
        "name": "Shadow-based Direction",
        "exampleCount": 3,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "inequality",
    "name": "Inequality",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Chain the inequalities. If A > B and B > C, then A > C (transitive). For coded inequality, first decode the symbols, then chain. No conclusion can be drawn if the chain breaks (e.g., A > B and C > B gives no relation between A and C).",
    "subtopics": [
      {
        "id": "inequality_core",
        "name": "Inequality — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "input_output",
    "name": "Input-Output",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Track how the machine rearranges elements step by step. Identify the rule (e.g., smallest number moves to left, words arrange alphabetically). Apply the same rule to predict the next step.",
    "subtopics": [
      {
        "id": "input_output_core",
        "name": "Input-Output — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "logical_venn_diagrams",
    "name": "Logical Venn Diagrams",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Determine the relationship between given items: completely overlapping (one is a subset of another), partially overlapping (some shared members), or completely separate (no shared members). Then identify the matching diagram.",
    "subtopics": [
      {
        "id": "logical_venn_diagrams_core",
        "name": "Logical Venn Diagrams — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "puzzles_box",
    "name": "Puzzles — Box/Stacking",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "For box stacking, draw a vertical stack. Place boxes based on clues about which box is above/below which. Count boxes between two positions carefully.",
    "subtopics": [
      {
        "id": "puzzles_box_core",
        "name": "Puzzles — Box/Stacking — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "puzzles_floor",
    "name": "Puzzles — Floor-based",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Number floors from bottom (1) to top. Create a table with floor numbers as rows and person/attribute as columns. Fill in the most definitive clues first.",
    "subtopics": [
      {
        "id": "puzzles_floor_core",
        "name": "Puzzles — Floor-based — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "puzzles_scheduling",
    "name": "Puzzles — Scheduling",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Create a table with days/months as columns and people/activities as rows. Fill in the most constrained clues first. Eliminate impossible assignments systematically.",
    "subtopics": [
      {
        "id": "puzzles_scheduling_core",
        "name": "Puzzles — Scheduling — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "ranking_order",
    "name": "Ranking, Order & Sequence",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Use the formula: Total = Rank from Top + Rank from Bottom − 1. For finding rank from one end given the other, rearrange: Rank from other end = Total − Given rank + 1.",
    "subtopics": [
      {
        "id": "ranking_order_core",
        "name": "Ranking, Order & Sequence — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "seating_circular",
    "name": "Seating Arrangement — Circular",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "In circular arrangements, draw a circle with equally spaced positions. Clockwise = Right, Anticlockwise = Left. 'Facing center' means everyone looks inward; 'facing outward' means everyone looks out.",
    "subtopics": [
      {
        "id": "seating_circular_core",
        "name": "Seating Arrangement — Circular — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "seating_linear",
    "name": "Seating Arrangement — Linear",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Start with the person whose position is most defined. Draw a horizontal line with positions marked. Place definite clues first, then use elimination for remaining persons.",
    "subtopics": [
      {
        "id": "seating_linear_core",
        "name": "Seating Arrangement — Linear — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "series_completion",
    "name": "Series Completion",
    "category": "verbal",
    "subtopicCount": 2,
    "exampleCount": 6,
    "practiceCount": 40,
    "shortcutSummary": "Find the pattern by checking differences between consecutive terms. If first differences are not constant, check second differences. For letter series, convert to numbers (A=1, B=2...) and find the pattern.",
    "subtopics": [
      {
        "id": "number_series",
        "name": "Number Series",
        "exampleCount": 3,
        "practiceCount": 20
      },
      {
        "id": "alphabet_series",
        "name": "Alphabet Series",
        "exampleCount": 3,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "statement_argument",
    "name": "Statement & Argument",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "A strong argument directly relates to the statement topic, gives a definitive reason (not vague), and does not make universal or emotional claims.",
    "subtopics": [
      {
        "id": "statement_argument_core",
        "name": "Statement & Argument — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "statement_assumption",
    "name": "Statement & Assumption",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "An assumption is something that must be TRUE for the statement to make sense. If the statement remains meaningful even without the assumption, the assumption is NOT implicit.",
    "subtopics": [
      {
        "id": "statement_assumption_core",
        "name": "Statement & Assumption — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "statement_conclusion",
    "name": "Statement & Conclusion",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "A conclusion must logically follow from the statement without adding outside knowledge. If it requires an assumption not in the statement, it does not follow.",
    "subtopics": [
      {
        "id": "statement_conclusion_core",
        "name": "Statement & Conclusion — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "syllogism",
    "name": "Syllogism",
    "category": "verbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Draw Venn diagrams for each statement. For \"All A are B\" draw A circle completely inside B. For \"Some A are B\" draw overlapping circles. For \"No A is B\" draw separate circles. Then check if conclusions follow from all possible valid diagrams.",
    "subtopics": [
      {
        "id": "syllogism_core",
        "name": "Syllogism — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "analytical_figure_classification",
    "name": "Analytical Figure Classification",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Figures are pre-sorted into two groups based on a hidden rule. Identify the rule by comparing the two groups, then classify the question figure into the correct group.",
    "subtopics": [
      {
        "id": "analytical_figure_classification_core",
        "name": "Analytical Figure Classification — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "counting_figures",
    "name": "Counting Figures",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "For triangles: count smallest triangles first, then combinations of 2, 3, etc. For squares: count 1×1, 2×2, 3×3, etc. Use systematic labeling (assign letters to vertices/intersection points).",
    "subtopics": [
      {
        "id": "counting_figures_core",
        "name": "Counting Figures — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "cubes_and_dice",
    "name": "Cubes and Dice",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "In a standard die, opposite faces sum to 7 (1↔6, 2↔5, 3↔4). For painted cube problems: corner cubes have 3 painted faces, edge cubes have 2, face cubes have 1, inner cubes have 0.",
    "subtopics": [
      {
        "id": "cubes_and_dice_core",
        "name": "Cubes and Dice — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "embedded_figures",
    "name": "Embedded Figures",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Look at the question figure and mentally overlay it on each option figure. The embedded figure must be present as-is (same size, same orientation, no rotation) within the complex figure.",
    "subtopics": [
      {
        "id": "embedded_figures_core",
        "name": "Embedded Figures — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "figure_completion",
    "name": "Figure/Pattern Completion",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Look at the incomplete figure and identify its symmetry (vertical, horizontal, or rotational). The missing part must complete the symmetry pattern.",
    "subtopics": [
      {
        "id": "figure_completion_core",
        "name": "Figure/Pattern Completion — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "grouping_figures",
    "name": "Grouping of Identical Figures",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Identify which figures are rotations of each other (identical when rotated) and group them. Figures that require flipping (mirror image) are NOT identical — they are different.",
    "subtopics": [
      {
        "id": "grouping_figures_core",
        "name": "Grouping of Identical Figures — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "mathematical_operations",
    "name": "Mathematical Operations",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Replace the substituted symbols with their original mathematical operators, then solve the expression following BODMAS order. Double-check by verifying the equation balances.",
    "subtopics": [
      {
        "id": "mathematical_operations_core",
        "name": "Mathematical Operations — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "mirror_images",
    "name": "Mirror Images",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "In a mirror image, left and right are reversed, but top and bottom stay the same. Imagine a vertical mirror placed to the right of the figure — the image flips horizontally.",
    "subtopics": [
      {
        "id": "mirror_images_core",
        "name": "Mirror Images — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "missing_character",
    "name": "Missing Character in Matrix/Grid",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Check rows, columns, and diagonals for patterns: sum, product, difference, or sequence. The pattern must be consistent across all complete rows/columns — then apply it to the incomplete one.",
    "subtopics": [
      {
        "id": "missing_character_core",
        "name": "Missing Character in Matrix/Grid — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "nonverbal_series",
    "name": "Non-Verbal Series",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Observe how elements change from one figure to the next: rotation (clockwise/anticlockwise), addition/removal of elements, movement of elements, and change in shading. Apply the pattern to predict the next figure.",
    "subtopics": [
      {
        "id": "nonverbal_series_core",
        "name": "Non-Verbal Series — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "odd_figure_out",
    "name": "Odd Figure Out",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Compare all figures for a common property: number of sides, open vs closed, number of internal elements, shading, rotation pattern, or symmetry. The odd one lacks this property.",
    "subtopics": [
      {
        "id": "odd_figure_out_core",
        "name": "Odd Figure Out — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "paper_cutting",
    "name": "Paper Cutting",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Similar to paper folding — track each fold, note where the cut is made, then unfold. The cut appears symmetrically mirrored about each fold line when unfolded.",
    "subtopics": [
      {
        "id": "paper_cutting_core",
        "name": "Paper Cutting — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "paper_folding",
    "name": "Paper Folding",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "Track each fold carefully: which part overlaps which. When holes are punched, unfold in reverse order. Each fold doubles the number of holes symmetrically.",
    "subtopics": [
      {
        "id": "paper_folding_core",
        "name": "Paper Folding — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  },
  {
    "id": "water_images",
    "name": "Water Images",
    "category": "nonverbal",
    "subtopicCount": 1,
    "exampleCount": 5,
    "practiceCount": 20,
    "shortcutSummary": "In a water image, top and bottom are reversed, but left and right stay the same. Imagine the figure reflected in water below it — it flips vertically (upside down).",
    "subtopics": [
      {
        "id": "water_images_core",
        "name": "Water Images — Core Concepts",
        "exampleCount": 5,
        "practiceCount": 20
      }
    ]
  }
];
