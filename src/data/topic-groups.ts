export interface TopicCluster {
  id: string;
  title: string;
  description: string;
  topicIds: string[];
}

export const VERBAL_CLUSTERS: TopicCluster[] = [
  {
    id: "verbal_language",
    title: "Language & Word Basics",
    description: "Vocabulary relationships, letter properties, alphabetical ordering, and classification.",
    topicIds: [
      "analogy",
      "classification",
      "alphabet_test",
    ],
  },
  {
    id: "verbal_sequences",
    title: "Coding, Numbers & Sequences",
    description: "Cipher patterns, letter/number series, operator substitutions, and missing terms.",
    topicIds: [
      "coding_decoding",
      "series_completion",
      "missing_character",
      "mathematical_operations",
      "inequality",
    ],
  },
  {
    id: "verbal_relations_puzzles",
    title: "Relations, Order & Puzzles",
    description: "Family tree mapping, compass navigation, rankings, floor/box arrangements, and seating layouts.",
    topicIds: [
      "blood_relations",
      "direction_sense",
      "ranking_order",
      "seating_linear",
      "seating_circular",
      "puzzles_box",
      "puzzles_floor",
      "puzzles_scheduling",
    ],
  },
  {
    id: "verbal_deductive",
    title: "Deductive & Analytical Logic",
    description: "Venn logic, categorical syllogisms, multi-step data sufficiency, machine input-output, and analytical reasoning.",
    topicIds: [
      "syllogism",
      "logical_venn_diagrams",
      "data_sufficiency",
      "input_output",
      "analytical_reasoning",
    ],
  },
  {
    id: "verbal_critical",
    title: "Critical & High-Level Reasoning",
    description: "Formal assumptions, valid inferences, strong arguments, causal relationships, and actionable policy decisions.",
    topicIds: [
      "statement_assumption",
      "statement_conclusion",
      "statement_argument",
      "cause_and_effect",
      "course_of_action",
      "critical_reasoning",
    ],
  },
];

export const NON_VERBAL_CLUSTERS: TopicCluster[] = [
  {
    id: "nonverbal_patterns",
    title: "Patterns & Sequential Series",
    description: "Stepwise geometric rotations, figure matrix progression, pattern completion, and visual analogies.",
    topicIds: [
      "nonverbal_series",
      "figure_completion",
      "analytical_figure_classification",
      "pattern_completion",
    ],
  },
  {
    id: "nonverbal_spatial",
    title: "Spatial Reflections & 3D Geometry",
    description: "Horizontal and vertical axis reflections, punch-fold geometry, standard/general dice rules, and 3D painted cubes.",
    topicIds: [
      "mirror_images",
      "water_images",
      "paper_folding",
      "paper_cutting",
      "cubes_and_dice",
    ],
  },
  {
    id: "nonverbal_visual_analysis",
    title: "Visual Decomposition & Geometry",
    description: "Hidden geometry extraction, polygon/triangle counting theorems, dot region constraints, and shape construction.",
    topicIds: [
      "embedded_figures",
      "counting_figures",
      "dot_situation",
      "grouping_of_images",
      "shape_construction",
    ],
  },
];
