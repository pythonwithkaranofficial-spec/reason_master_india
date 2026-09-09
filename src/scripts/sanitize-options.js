// src/scripts/sanitize-options.js
const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '../data/questions');

function loadJson(fileName) {
  const filePath = path.join(questionsDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(fileName, data) {
  const filePath = path.join(questionsDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('--- Starting comprehensive options sanitization ---');

// 1. cubes_and_dice.json
{
  const data = loadJson('cubes_and_dice.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const isDiceFace = /face opposite|opposite to|opposite of|which number is on the face|number on the face/i.test(q.questionText);
    if (isDiceFace) {
      const correctVal = parseInt(q.options[q.correctIndex], 10);
      if (!isNaN(correctVal) && correctVal >= 1 && correctVal <= 6) {
        const allFaces = [1, 2, 3, 4, 5, 6].filter(f => f !== correctVal);
        const newOptions = [...q.options];
        let hasInvalid = false;
        for (let i = 0; i < 4; i++) {
          if (i === q.correctIndex) continue;
          const val = parseInt(newOptions[i], 10);
          if (isNaN(val) || val < 1 || val > 6) {
            hasInvalid = true;
          }
        }
        if (hasInvalid) {
          const chosen = allFaces.slice(0, 3).map(String);
          let chosenIdx = 0;
          for (let i = 0; i < 4; i++) {
            if (i === q.correctIndex) {
              newOptions[i] = String(correctVal);
            } else {
              newOptions[i] = chosen[chosenIdx++];
            }
          }
          q.options = newOptions;
          fixedCount++;
        }
      }
    }
  }
  saveJson('cubes_and_dice.json', data);
  console.log(`[cubes_and_dice.json] Fixed ${fixedCount} dice face questions with out-of-range options.`);
}

// 2. odd_figure_out.json
{
  const data = loadJson('odd_figure_out.json');
  let cleanedCount = 0;
  for (const q of data.questions) {
    q.options = q.options.map(opt => {
      if (/^Figure\s+[A-D]/i.test(opt)) {
        const match = opt.match(/^(Figure\s+[A-D])/i);
        if (match) {
          cleanedCount++;
          return match[1];
        }
      }
      return opt;
    });
  }
  saveJson('odd_figure_out.json', data);
  console.log(`[odd_figure_out.json] Normalized ${cleanedCount} figure options to clean labels.`);
}

// 3. nonverbal_series.json
{
  const data = loadJson('nonverbal_series.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const text = q.questionText;
    const corr = q.options[q.correctIndex];
    let distractors = [];

    if (/An arrow pointing North in Fig 1/i.test(text)) {
      distractors = [
        "An arrow pointing South-West (rotated 225°)",
        "An arrow pointing West (rotated 270°)",
        "An arrow pointing North-West (rotated 315°)",
        "An arrow pointing North (complete 360° rotation)"
      ];
    } else if (/A square containing 1 dot/i.test(text)) {
      distractors = [
        "A square containing 4 dots (no change in dot count)",
        "A square containing 6 dots (skipping count to 6)",
        "A square containing 3 dots (decreasing dot count)",
        "A square containing 2 dots (reverse sequence)"
      ];
    } else if (/A geometric figure with 3 sides/i.test(text)) {
      distractors = [
        "An 8-sided regular polygon (Octagon, skipping one side)",
        "A 6-sided regular polygon (Hexagon, repeating previous figure)",
        "A 5-sided regular polygon (Pentagon, decreasing side count)",
        "A 4-sided regular polygon (Square, restarting sequence)"
      ];
    } else if (/A shaded sector in a circle rotating 90°/i.test(text)) {
      distractors = [
        "A circle with the Top quadrant sector shaded (reverting to start)",
        "A circle with the Right quadrant sector shaded (clockwise reversal)",
        "A circle with both Top and Bottom quadrant sectors shaded",
        "A circle with all four quadrant sectors shaded"
      ];
    }

    if (distractors.length > 0) {
      const available = distractors.filter(d => d !== corr);
      let dIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== q.correctIndex) {
          q.options[i] = available[dIdx++] || "Figure with inverted orientation";
        }
      }
      fixedCount++;
    }
  }
  saveJson('nonverbal_series.json', data);
  console.log(`[nonverbal_series.json] Updated ${fixedCount} questions with realistic series distractors.`);
}

// 4. paper_folding.json
{
  const data = loadJson('paper_folding.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const text = q.questionText;
    const corr = q.options[q.correctIndex];
    let distractors = [];

    if (/vertical diameter/i.test(text)) {
      distractors = [
        "A circle with only the vertical diameter remaining",
        "A circle with two parallel vertical chords",
        "A circle divided into four quadrants with one quadrant shaded",
        "Two concentric circles without any diameters"
      ];
    } else if (/upward pointing equilateral triangle/i.test(text)) {
      distractors = [
        "Two disjoint triangles touching only at their apex",
        "A single upward-pointing triangle with a horizontal base line",
        "A diamond (rhombus) formed by inverted triangular bases",
        "A large equilateral triangle with inverted shaded corners"
      ];
    } else if (/solid dark square in the top-left/i.test(text)) {
      distractors = [
        "A square sheet half with both square and circle superimposed in top-left",
        "A square sheet half with only the square remaining visible",
        "A square sheet half containing the dark square at top-left and dark circle at top-right",
        "An empty square sheet half with both symbols removed"
      ];
    } else if (/three parallel horizontal lines/i.test(text)) {
      distractors = [
        "Six parallel horizontal lines with twice the line density",
        "Three diagonal lines extending from corner to corner",
        "A solid dark rectangular block covering the sheet",
        "An empty half-sheet with all line strokes canceling out"
      ];
    }

    if (distractors.length > 0) {
      const available = distractors.filter(d => d !== corr);
      let dIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== q.correctIndex) {
          q.options[i] = available[dIdx++];
        }
      }
      fixedCount++;
    }
  }
  saveJson('paper_folding.json', data);
  console.log(`[paper_folding.json] Updated ${fixedCount} questions with realistic folding distractors.`);
}

// 5. paper_cutting.json
{
  const data = loadJson('paper_cutting.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const text = q.questionText;
    const corr = q.options[q.correctIndex];
    let distractors = [];

    if (/A square sheet of paper is folded in half from left to right/i.test(text)) {
      distractors = [
        "Only two circular holes along the central horizontal fold line",
        "A single large circular hole at the center of the sheet",
        "Eight small circular holes arranged in a ring",
        "One circular hole positioned in the top-left corner only"
      ];
    } else if (/A circular paper is folded in half to form a semicircle/i.test(text)) {
      distractors = [
        "Two triangular notches at opposite ends of the horizontal diameter",
        "A single triangular notch at the top edge of the circle",
        "Six triangular notches arranged unevenly around the perimeter",
        "Three triangular notches grouped on one half of the circumference"
      ];
    } else if (/A square paper is folded diagonally from bottom-left/i.test(text)) {
      distractors = [
        "Two diamond holes along the main diagonal axis",
        "A single diamond hole centered on the square",
        "Eight diamond holes distributed along all four outer edges",
        "Four triangular holes pointing outwards towards the corners"
      ];
    } else if (/A square sheet is folded into half vertically/i.test(text)) {
      distractors = [
        "Four circular holes, one at each of the four outer corners",
        "Four circular holes forming a single small square at the center",
        "Six circular holes arranged in two parallel columns",
        "Two circular holes along the primary vertical fold axis"
      ];
    }

    if (distractors.length > 0) {
      const available = distractors.filter(d => d !== corr);
      let dIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== q.correctIndex) {
          q.options[i] = available[dIdx++];
        }
      }
      fixedCount++;
    }
  }
  saveJson('paper_cutting.json', data);
  console.log(`[paper_cutting.json] Updated ${fixedCount} questions with realistic cutting distractors.`);
}

// 6. figure_completion.json
{
  const data = loadJson('figure_completion.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const text = q.questionText;
    const corr = q.options[q.correctIndex];
    let distractors = [];

    if (/two concentric circular arcs connected to the central origin/i.test(text)) {
      distractors = [
        "Figure with concentric circular arcs curving outward towards bottom-right corner",
        "Figure with a single straight diagonal line without any circular arcs",
        "Figure with perpendicular cross lines and no diagonal stroke",
        "Figure with concentric circular arcs inverted along the horizontal axis"
      ];
    } else if (/symmetrical floral design/i.test(text)) {
      distractors = [
        "Figure with leaf petal pointing towards bottom-left instead of top-right",
        "Figure with leaf petal pointing towards top-right but with a single horizontal hatching stroke",
        "Figure with a blank petal without internal hatching strokes",
        "Figure with two opposing petals intersecting at right angles"
      ];
    } else if (/circular mandala/i.test(text)) {
      distractors = [
        "A quadrant wedge with all three concentric rings shaded solid dark",
        "A quadrant wedge with outer and inner rings shaded and middle ring open",
        "A quadrant wedge with middle ring shaded but lacking the radial spoke line",
        "A quadrant wedge with three radial spoke lines and no shaded rings"
      ];
    } else if (/2x2 grid/i.test(text)) {
      distractors = [
        "Quarter-section containing diagonal arm ending in square and vertical arm with circle (swapped ends)",
        "Quarter-section containing only the diagonal arm without vertical arm",
        "Quarter-section containing vertical arm ending in circle and horizontal arm ending in triangle",
        "Quarter-section with both arms ending in squares"
      ];
    }

    if (distractors.length > 0) {
      const available = distractors.filter(d => d !== corr);
      let dIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== q.correctIndex) {
          q.options[i] = available[dIdx++];
        }
      }
      fixedCount++;
    }
  }
  saveJson('figure_completion.json', data);
  console.log(`[figure_completion.json] Updated ${fixedCount} questions with realistic completion distractors.`);
}

// 7. embedded_figures.json
{
  const data = loadJson('embedded_figures.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const text = q.questionText;
    const corr = q.options[q.correctIndex];
    let candidateOptions = [];

    if (/capital letter "Z"/i.test(text)) {
      candidateOptions = [
        "Figure (A) containing a zig-zag step ladder structure",
        "Figure (B) featuring circular interlocking rings",
        "Figure (C) consisting of an architectural window frame",
        "Figure (D) depicting a kite and geometric lattice"
      ];
    } else if (/equilateral triangle pointing upward/i.test(text)) {
      candidateOptions = [
        "Figure (A) containing disjoint curved wave patterns",
        "Figure (B) featuring an isometric hexagonal prism grid",
        "Figure (C) consisting of concentric rectangular frames",
        "Figure (D) depicting a series of parallel vertical bars"
      ];
    } else if (/capital letter "F"/i.test(text)) {
      candidateOptions = [
        "Figure (A) containing a zig-zag diamond network",
        "Figure (B) featuring an elliptical spiral pattern",
        "Figure (C) consisting of an architectural window frame",
        "Figure (D) depicting an open polygonal curve"
      ];
    } else if (/diamond shape \(rhombus\)/i.test(text)) {
      candidateOptions = [
        "Figure (A) containing concentric circular rings",
        "Figure (B) featuring a rectangular brickwork pattern",
        "Figure (C) consisting of an open three-legged star",
        "Figure (D) depicting a kite and geometric lattice"
      ];
    }

    if (candidateOptions.length > 0) {
      const matchingCandidate = candidateOptions.find(c => {
        const letter = corr.match(/Figure\s*\(([A-D])\)/i);
        if (letter) return c.includes(`(${letter[1].toUpperCase()})`);
        return false;
      }) || corr;

      const otherCandidates = candidateOptions.filter(c => c !== matchingCandidate);
      let cIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i === q.correctIndex) {
          q.options[i] = matchingCandidate;
        } else {
          q.options[i] = otherCandidates[cIdx++];
        }
      }
      fixedCount++;
    }
  }
  saveJson('embedded_figures.json', data);
  console.log(`[embedded_figures.json] Updated ${fixedCount} questions with realistic candidate figure options.`);
}

// 8. analytical_figure_classification.json
{
  const data = loadJson('analytical_figure_classification.json');
  let fixedCount = 0;
  for (const q of data.questions) {
    const text = q.questionText;
    const corr = q.options[q.correctIndex];
    let distractors = [];

    if (/outer polygon has exactly one more side than the inner polygon/i.test(text)) {
      distractors = [
        "A square enclosing a regular pentagon (4 sides outer, 5 sides inner)",
        "A regular hexagon enclosing a triangle (6 sides outer, 3 sides inner)",
        "A regular pentagon enclosing an equilateral triangle (5 sides outer, 3 sides inner)",
        "A triangle enclosing a square (3 sides outer, 4 sides inner)"
      ];
    } else if (/divided into exactly eight congruent parts/i.test(text)) {
      distractors = [
        "A regular hexagon divided into six congruent triangles",
        "A square divided into four congruent triangles by two diagonals",
        "A circle divided into ten congruent sectors",
        "An equilateral triangle divided into three congruent trapezoids"
      ];
    } else if (/three identical circles intersect/i.test(text)) {
      distractors = [
        "Two intersecting circles touching a third tangential circle",
        "Three concentric circles with equal radial spacing",
        "Three mutually exclusive disjoint circles",
        "Three circles arranged in a straight collinear line"
      ];
    } else if (/exactly 25% \(one quarter\) of its total area shaded/i.test(text)) {
      distractors = [
        "A circle divided into four quadrants with two quadrants shaded (50%)",
        "An equilateral triangle with three smaller congruent triangles inside and one shaded (33%)",
        "A regular hexagon with three of its six triangular sectors shaded (50%)",
        "A square with half of its area shaded diagonally (50%)"
      ];
    }

    if (distractors.length > 0) {
      const available = distractors.filter(d => d !== corr);
      let dIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== q.correctIndex) {
          q.options[i] = available[dIdx++];
        }
      }
      fixedCount++;
    }
  }
  saveJson('analytical_figure_classification.json', data);
  console.log(`[analytical_figure_classification.json] Updated ${fixedCount} questions with realistic classification distractors.`);
}

// 9. Deduplication pass for analogy.json, direction_sense.json, series_completion.json, logical_venn_diagrams.json
{
  // 9a. analogy.json
  const analogy = loadJson('analogy.json');
  let analogyFixed = 0;
  for (const q of analogy.questions) {
    const seen = new Set();
    for (let i = 0; i < 4; i++) {
      if (seen.has(q.options[i])) {
        const isNum = /^\d+$/.test(q.options[i]);
        if (isNum) {
          let candidate = parseInt(q.options[i], 10) + 2;
          while (q.options.includes(String(candidate))) candidate += 2;
          q.options[i] = String(candidate);
        } else if (/^[A-Z]$/.test(q.options[i])) {
          const charCode = q.options[i].charCodeAt(0);
          let candidate = String.fromCharCode(charCode === 90 ? 65 : charCode + 1);
          while (q.options.includes(candidate)) {
            candidate = String.fromCharCode(((candidate.charCodeAt(0) - 65 + 1) % 26) + 65);
          }
          q.options[i] = candidate;
        }
        analogyFixed++;
      }
      seen.add(q.options[i]);
    }
  }
  saveJson('analogy.json', analogy);
  console.log(`[analogy.json] Deduplicated ${analogyFixed} duplicate options.`);

  // 9b. direction_sense.json
  const dirSense = loadJson('direction_sense.json');
  let dirFixed = 0;
  for (const q of dirSense.questions) {
    const seen = new Set();
    for (let i = 0; i < 4; i++) {
      if (seen.has(q.options[i])) {
        const match = q.options[i].match(/^(\d+)\s*(km|m)$/i);
        if (match) {
          let num = parseInt(match[1], 10);
          const unit = match[2];
          let candidate = `${num + 1} ${unit}`;
          while (q.options.includes(candidate)) {
            num += 2;
            candidate = `${num} ${unit}`;
          }
          q.options[i] = candidate;
          dirFixed++;
        }
      }
      seen.add(q.options[i]);
    }
  }
  saveJson('direction_sense.json', dirSense);
  console.log(`[direction_sense.json] Deduplicated ${dirFixed} duplicate options.`);

  // 9c. series_completion.json
  const series = loadJson('series_completion.json');
  let seriesFixed = 0;
  for (const q of series.questions) {
    const seen = new Set();
    for (let i = 0; i < 4; i++) {
      if (seen.has(q.options[i])) {
        const isNum = /^-?\d+$/.test(q.options[i]);
        if (isNum) {
          let candidate = parseInt(q.options[i], 10) + 1;
          while (q.options.includes(String(candidate))) candidate++;
          q.options[i] = String(candidate);
          seriesFixed++;
        }
      }
      seen.add(q.options[i]);
    }
  }
  saveJson('series_completion.json', series);
  console.log(`[series_completion.json] Deduplicated ${seriesFixed} duplicate options.`);

  // 9d. logical_venn_diagrams.json
  const venn = loadJson('logical_venn_diagrams.json');
  const vennAlternatives = [
    "Three mutually intersecting circles sharing a common central region",
    "One large circle enclosing two separate disjoint circles",
    "One large circle enclosing two mutually intersecting circles",
    "Two disjoint circles, one of which is enclosed within a third circle"
  ];
  let vennFixed = 0;
  for (const q of venn.questions) {
    const seen = new Set();
    for (let i = 0; i < 4; i++) {
      if (seen.has(q.options[i])) {
        const alt = vennAlternatives.find(a => !q.options.includes(a)) || "One large circle enclosing two concentric circles";
        q.options[i] = alt;
        vennFixed++;
      }
      seen.add(q.options[i]);
    }
  }
  saveJson('logical_venn_diagrams.json', venn);
  console.log(`[logical_venn_diagrams.json] Deduplicated ${vennFixed} duplicate options.`);
}

console.log('--- Sanitization complete ---');
