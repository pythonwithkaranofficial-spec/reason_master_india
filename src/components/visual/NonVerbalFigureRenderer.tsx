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

interface NonVerbalFigureRendererProps {
  topicId: string;
  questionText?: string;
  figureRef?: string;
}

export function NonVerbalFigureRenderer({
  topicId,
  questionText = "",
  figureRef,
}: NonVerbalFigureRendererProps) {
  const normalizedTopic = topicId.toLowerCase();
  const text = questionText.toLowerCase();

  // 1. Mirror Images
  if (normalizedTopic === "mirror_images" || figureRef?.includes("mirror")) {
    if (text.includes("clock") || text.includes("time") || text.includes(":")) {
      // Extract clock time like 3:25 or 8:40
      const match = questionText.match(/(\d{1,2}:\d{2})/);
      const time = match ? match[1] : "3:25";
      return <MirrorReflectionSVG type="clock" time={time} />;
    }

    // Check for word in uppercase or quotes
    const wordMatch = questionText.match(/\b([A-Z]{3,8})\b/);
    const word = wordMatch ? wordMatch[1] : "QUALITY";
    return <MirrorReflectionSVG type="word" content={word} />;
  }

  // 2. Water Images
  if (normalizedTopic === "water_images" || figureRef?.includes("water")) {
    const wordMatch = questionText.match(/\b([A-Z]{3,8})\b/);
    const word = wordMatch ? wordMatch[1] : "DISC";
    return <WaterSurfaceSVG content={word} />;
  }

  // 3. Cubes and Dice
  if (normalizedTopic === "cubes_and_dice" || normalizedTopic === "cube_and_dice" || figureRef?.includes("cube") || figureRef?.includes("dice")) {
    if (text.includes("unfold") || text.includes("net") || text.includes("sheet") || text.includes("flatten")) {
      return <CubeDiceSVG mode="unfolded" />;
    }
    return <CubeDiceSVG mode="isometric" topFace="1" frontFace="2" rightFace="3" />;
  }

  // 4. Counting Figures
  if (normalizedTopic === "counting_figures" || figureRef?.includes("counting")) {
    if (text.includes("square") || text.includes("diagonal") || text.includes("median") || text.includes("quadrilateral")) {
      return <TriangleCountingSVG figureType="square_diagonals" />;
    }
    return <TriangleCountingSVG figureType="partitioned_triangle" partitions={3} />;
  }

  // 5. Paper Folding & Cutting
  if (
    normalizedTopic === "paper_folding" ||
    normalizedTopic === "paper_cutting" ||
    figureRef?.includes("paper")
  ) {
    return <PaperFoldPunchSVG />;
  }

  // 6. Figure Completion & Matrix Completion
  if (
    normalizedTopic === "figure_completion" ||
    normalizedTopic === "matrix_completion" ||
    normalizedTopic === "embedded_figures" ||
    figureRef?.includes("matrix") ||
    figureRef?.includes("completion")
  ) {
    return <MatrixCompletionSVG />;
  }

  // 7. Missing Character
  if (normalizedTopic === "missing_character" || figureRef?.includes("missing")) {
    return <MissingCharacterSVG />;
  }

  // 8. Non-Verbal Series & Odd Figure Out
  if (
    normalizedTopic === "nonverbal_series" ||
    normalizedTopic === "odd_figure_out" ||
    normalizedTopic === "grouping_figures" ||
    normalizedTopic === "analytical_figure_classification" ||
    figureRef?.includes("series")
  ) {
    return <SeriesRotationSVG />;
  }

  // Not a visual non-verbal question
  return null;
}
