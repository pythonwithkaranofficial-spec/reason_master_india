"use client";

import React from "react";
import { MirrorReflectionSVG } from "./MirrorReflectionSVG";
import { WaterSurfaceSVG } from "./WaterSurfaceSVG";
import { CubeDiceSVG } from "./CubeDiceSVG";
import { TriangleCountingSVG } from "./TriangleCountingSVG";
import { PaperFoldPunchSVG } from "./PaperFoldPunchSVG";
import { MatrixCompletionSVG } from "./MatrixCompletionSVG";
import { MissingCharacterSVG } from "./MissingCharacterSVG";
import { SeriesRotationSVG } from "./SeriesRotationSVG";
import { EmbeddedFigureSVG, EmbeddedShapeType } from "./EmbeddedFigureSVG";
import { OddFigureOutSVG, OddFigurePatternType } from "./OddFigureOutSVG";

interface NonVerbalFigureRendererProps {
  topicId: string;
  questionText?: string;
  figureRef?: string;
  isSolution?: boolean;
}

// Helper to extract target uppercase word for mirror/water questions
function extractTargetWord(questionText: string, fallback = "QUALITY"): string {
  // Check after double line breaks: \n\n([A-Z]{3,12})
  const multilineMatch = questionText.match(/\n\n([A-Z]{3,12})/);
  if (multilineMatch) return multilineMatch[1];

  // Check quotes: "WORD"
  const quoteMatch = questionText.match(/["']([A-Z]{3,12})["']/);
  if (quoteMatch) return quoteMatch[1];

  // Check word after "given word ... "
  const givenWordMatch = questionText.match(/(?:given\s+word|word)\s*(?:is|:)?\s*([A-Z]{3,12})/i);
  if (givenWordMatch) return givenWordMatch[1].toUpperCase();

  // Match standalone uppercase word that is not a keyword
  const IGNORE_WORDS = new Set([
    "FIND", "WHAT", "WHICH", "CHOOSE", "GIVEN", "WHEN", "MIRROR", "IMAGE", "WATER", "REFLECTED", "REFLECTION",
    "LINE", "SURFACE", "OPTION", "OPTIONS", "CORRECT", "SELECT", "SHOWS", "SEEN", "CLOCK", "TIME", "PLANE"
  ]);

  const allWords = questionText.match(/\b([A-Z]{3,12})\b/g) || [];
  for (const w of allWords) {
    if (!IGNORE_WORDS.has(w)) return w;
  }

  return fallback;
}

export function NonVerbalFigureRenderer({
  topicId,
  questionText = "",
  figureRef,
  isSolution = false,
}: NonVerbalFigureRendererProps) {
  const normalizedTopic = topicId.toLowerCase();
  const text = questionText.toLowerCase();

  // 1. Mirror Images
  if (normalizedTopic === "mirror_images" || figureRef?.includes("mirror")) {
    if (text.includes("clock") || text.includes("time") || /:\d{2}/.test(questionText)) {
      const match = questionText.match(/(\d{1,2}:\d{2})/);
      const time = match ? match[1] : "3:25";
      return <MirrorReflectionSVG type="clock" time={time} isSolution={isSolution} />;
    }

    const word = extractTargetWord(questionText, "QUALITY");
    return <MirrorReflectionSVG type="word" content={word} isSolution={isSolution} />;
  }

  // 2. Water Images
  if (normalizedTopic === "water_images" || figureRef?.includes("water")) {
    if (text.includes("clock") || text.includes("time") || /:\d{2}/.test(questionText)) {
      const match = questionText.match(/(\d{1,2}:\d{2})/);
      const time = match ? match[1] : "4:20";
      return <WaterSurfaceSVG type="clock" time={time} isSolution={isSolution} />;
    }

    const word = extractTargetWord(questionText, "DISC");
    return <WaterSurfaceSVG type="word" content={word} isSolution={isSolution} />;
  }

  // 3. Cubes and Dice
  if (
    normalizedTopic === "cubes_and_dice" ||
    normalizedTopic === "cube_and_dice" ||
    figureRef?.includes("cube") ||
    figureRef?.includes("dice")
  ) {
    // Painted Cube sliced into smaller cubes
    if (
      text.includes("painted") ||
      text.includes("cut into") ||
      text.includes("sliced into") ||
      text.includes("coloured") ||
      text.includes("colored") ||
      text.includes("cm")
    ) {
      const cmMatch = questionText.match(/(\d+)\s*cm/i);
      const cubeSize = cmMatch ? Math.min(Math.max(parseInt(cmMatch[1], 10), 2), 4) : 3;
      return <CubeDiceSVG mode="painted_cube" paintedCubeN={cubeSize} isSolution={isSolution} />;
    }

    // Unfolded Net
    if (
      text.includes("unfold") ||
      text.includes("net") ||
      text.includes("sheet") ||
      text.includes("flatten")
    ) {
      return <CubeDiceSVG mode="unfolded" isSolution={isSolution} />;
    }

    // Multi-Position Dice (Die I and Die II)
    if (
      text.includes("two position") ||
      text.includes("position 1") ||
      text.includes("position i") ||
      text.includes("die i") ||
      text.includes("die 1") ||
      text.includes("opposite to") ||
      text.includes("opposite")
    ) {
      const pos1Match = questionText.match(/position\s*(?:1|i)[:\s]+faces?\s*([^.\n]+)/i);
      const pos2Match = questionText.match(/position\s*(?:2|ii)[:\s]+faces?\s*([^.\n]+)/i);

      const f1 = pos1Match ? pos1Match[1].match(/\b([A-Za-z0-9])\b/g) : null;
      const f2 = pos2Match ? pos2Match[1].match(/\b([A-Za-z0-9])\b/g) : null;

      if (f1 && f1.length >= 3 && f2 && f2.length >= 3) {
        return (
          <CubeDiceSVG
            mode="multi_position"
            positions={[
              { label: "Position (I)", top: f1[0], front: f1[1], right: f1[2] },
              { label: "Position (II)", top: f2[0], front: f2[1], right: f2[2] },
            ]}
            isSolution={isSolution}
          />
        );
      }

      // Standard multi-position fallback
      return (
        <CubeDiceSVG
          mode="multi_position"
          positions={[
            { label: "Position (I)", top: "3", front: "1", right: "2" },
            { label: "Position (II)", top: "3", front: "5", right: "6" },
          ]}
          isSolution={isSolution}
        />
      );
    }

    // Standard Die face check
    const faceMatch = questionText.match(/opposite\s+to\s+(?:the\s+face\s+showing\s+)?(?:number\s+)?([1-6])/i);
    const front = faceMatch ? faceMatch[1] : "2";

    return <CubeDiceSVG mode="isometric" topFace="1" frontFace={front} rightFace="3" isSolution={isSolution} />;
  }

  // 4. Counting Figures
  if (normalizedTopic === "counting_figures" || figureRef?.includes("counting")) {
    // 5-Pointed Star
    if (text.includes("star") || text.includes("5-pointed") || text.includes("pentagram")) {
      return <TriangleCountingSVG figureType="star" isSolution={isSolution} />;
    }

    // Grid of Squares (n x n)
    if (
      text.includes("square") &&
      (text.includes("grid") || text.includes("row") || text.includes("chessboard") || text.includes("×") || text.includes("x"))
    ) {
      const gridMatch = questionText.match(/(\d+)\s*[x×]\s*(\d+)/i);
      const n = gridMatch ? Math.min(Math.max(parseInt(gridMatch[1], 10), 2), 5) : 3;
      return <TriangleCountingSVG figureType="grid_squares" gridRows={n} gridCols={n} isSolution={isSolution} />;
    }

    // Grid of Rectangles (m x n)
    if (text.includes("rectangle")) {
      const rectMatch =
        questionText.match(/(\d+)\s*(?:rows?|x|×)\s*(?:and\s*)?(\d+)\s*col/i) ||
        questionText.match(/(\d+)\s*[x×]\s*(\d+)/i);
      const r = rectMatch ? Math.min(Math.max(parseInt(rectMatch[1], 10), 2), 4) : 3;
      const c = rectMatch ? Math.min(Math.max(parseInt(rectMatch[2], 10), 2), 5) : 4;
      return <TriangleCountingSVG figureType="grid_rectangles" gridRows={r} gridCols={c} isSolution={isSolution} />;
    }

    // Square with Diagonals and Medians
    if (
      text.includes("diagonal") ||
      text.includes("median") ||
      text.includes("quadrilateral") ||
      (text.includes("square") && text.includes("triangle"))
    ) {
      return <TriangleCountingSVG figureType="square_diagonals" isSolution={isSolution} />;
    }

    // Partitioned Triangle (apex to base)
    const partMatch = questionText.match(/(\d+)\s*(?:small\s+)?(?:base\s+)?(?:compartments?|partitions?|segments?|parts?)/i);
    const partitions = partMatch ? Math.min(Math.max(parseInt(partMatch[1], 10), 2), 6) : 3;
    return <TriangleCountingSVG figureType="partitioned_triangle" partitions={partitions} isSolution={isSolution} />;
  }

  // 5. Paper Folding
  if (normalizedTopic === "paper_folding") {
    let foldingType: "circle_diameters" | "triangles" | "square_circle" | "lines" = "circle_diameters";
    if (text.includes("triangle") || text.includes("hexagram")) {
      foldingType = "triangles";
    } else if (text.includes("square") && text.includes("circle")) {
      foldingType = "square_circle";
    } else if (text.includes("line") || text.includes("parallel")) {
      foldingType = "lines";
    }
    return <PaperFoldPunchSVG mode="paper_folding" foldingType={foldingType} isSolution={isSolution} />;
  }

  // 6. Paper Cutting
  if (normalizedTopic === "paper_cutting" || figureRef?.includes("paper")) {
    let cuttingType: "square_quarter_circle" | "semicircle_triangle_notch" | "diagonal_diamond" | "quarter_two_cuts" = "square_quarter_circle";
    if (text.includes("triangle") || text.includes("notch")) {
      cuttingType = "semicircle_triangle_notch";
    } else if (text.includes("diamond") || text.includes("rhombus")) {
      cuttingType = "diagonal_diamond";
    } else if (text.includes("two cut") || text.includes("two hole") || text.includes("2 cut")) {
      cuttingType = "quarter_two_cuts";
    }
    return <PaperFoldPunchSVG mode="paper_cutting" cuttingType={cuttingType} isSolution={isSolution} />;
  }

  // 7. Figure Completion
  if (normalizedTopic === "figure_completion") {
    let archetype: "concentric_arcs" | "floral_diamond" | "circular_mandala" | "grid_cross" = "concentric_arcs";
    if (text.includes("diamond") || text.includes("rhombus")) {
      archetype = "floral_diamond";
    } else if (text.includes("circle") || text.includes("ring") || text.includes("mandala")) {
      archetype = "circular_mandala";
    } else if (text.includes("cross") || text.includes("grid")) {
      archetype = "grid_cross";
    }
    return <MatrixCompletionSVG mode="figure_completion" completionType={archetype} isSolution={isSolution} />;
  }

  // 8. Matrix Completion
  if (normalizedTopic === "matrix_completion" || figureRef?.includes("matrix")) {
    return <MatrixCompletionSVG mode="symbol_matrix" isSolution={isSolution} />;
  }

  // 9. Embedded Figures
  if (normalizedTopic === "embedded_figures" || figureRef?.includes("embedded")) {
    let shapeType: EmbeddedShapeType = "z_shape";
    if (text.includes("triangle")) {
      shapeType = "triangle";
    } else if (text.includes("\"f\"") || text.includes("letter f") || text.includes("arm")) {
      shapeType = "f_shape";
    } else if (text.includes("diamond") || text.includes("rhombus")) {
      shapeType = "diamond";
    }
    return <EmbeddedFigureSVG shapeType={shapeType} isSolution={isSolution} />;
  }

  // 10. Odd Figure Out
  if (normalizedTopic === "odd_figure_out" || figureRef?.includes("odd")) {
    let patternType: OddFigurePatternType = "open_closed";
    if (text.includes("symmetr")) {
      patternType = "symmetry";
    } else if (text.includes("rotat") || text.includes("clock") || text.includes("arrow")) {
      patternType = "rotation";
    } else if (text.includes("vertice") || text.includes("even") || text.includes("odd number") || text.includes("sides")) {
      patternType = "vertices";
    }
    return <OddFigureOutSVG patternType={patternType} isSolution={isSolution} />;
  }

  // 11. Grouping Figures & Analytical Figure Classification
  if (
    normalizedTopic === "grouping_figures" ||
    normalizedTopic === "analytical_figure_classification" ||
    figureRef?.includes("classification")
  ) {
    return <OddFigureOutSVG patternType="open_closed" isSolution={isSolution} />;
  }

  // 12. Non-Verbal Series
  if (normalizedTopic === "nonverbal_series" || figureRef?.includes("series")) {
    let seriesType: "arrow" | "dots" | "sides" | "sectors" = "arrow";
    if (text.includes("dot")) {
      seriesType = "dots";
    } else if (text.includes("side") || text.includes("polygon") || text.includes("triangle")) {
      seriesType = "sides";
    } else if (text.includes("sector") || text.includes("quadrant") || text.includes("shade")) {
      seriesType = "sectors";
    }
    return <SeriesRotationSVG seriesType={seriesType} isSolution={isSolution} />;
  }

  // 13. Missing Character
  if (normalizedTopic === "missing_character" || figureRef?.includes("missing")) {
    // Parse markdown table if present (ignoring dashed separator lines like |---|---|)
    const tableLines = questionText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("|") && l.endsWith("|"));

    const contentLines = tableLines.filter((l) => !/^\|[\s-:]+\|$/.test(l) && !l.includes("---"));

    if (contentLines.length >= 2) {
      const grid = contentLines.map((line) =>
        line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim())
      );

      if (grid.length >= 2 && grid[0].length >= 2) {
        return <MissingCharacterSVG mode="grid" grid={grid} isSolution={isSolution} />;
      }
    }

    // Check if circle quadrants
    if (text.includes("circle") || text.includes("quadrant") || text.includes("sector")) {
      const sectorMatches = Array.from(questionText.matchAll(/sector\s+(\d+)[^\d]+opposite[^\d]+(?:to\s+)?(\d+)/gi));
      let qVals: { top: string | number; right: string | number; bottom: string | number; left: string | number } = {
        top: 2,
        right: 3,
        bottom: 8,
        left: "?",
      };
      if (sectorMatches.length >= 2) {
        qVals = {
          top: sectorMatches[0][1],
          bottom: sectorMatches[0][2],
          right: sectorMatches[1][1],
          left: "?",
        };
      }
      return <MissingCharacterSVG mode="circle_quadrants" quadrantValues={qVals} isSolution={isSolution} />;
    }

    // Check if cross-shaped
    if (text.includes("cross") || text.includes("arms")) {
      const armMatch = questionText.match(/(?:arm\s*numbers?|outer\s*numbers?)[^\d]*(\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+(?:and\s*)?(\d+)/i);
      let cVals: { top: string | number; right: string | number; bottom: string | number; left: string | number; center: string | number } = {
        top: 4,
        right: 5,
        bottom: 6,
        left: 3,
        center: "?",
      };
      if (armMatch) {
        cVals = {
          top: armMatch[1],
          right: armMatch[2],
          bottom: armMatch[3],
          left: armMatch[4],
          center: "?",
        };
      }
      return <MissingCharacterSVG mode="cross" crossValues={cVals} isSolution={isSolution} />;
    }

    return <MissingCharacterSVG mode="grid" isSolution={isSolution} />;
  }

  // Not a visual non-verbal question
  return null;
}
