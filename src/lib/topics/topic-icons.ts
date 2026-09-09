import { LucideIcon } from "lucide-react";
import {
  // Verbal (25 topics)
  Type,
  GitCompare,
  BrainCircuit,
  Users,
  Zap,
  Filter,
  Binary,
  Compass,
  Lightbulb,
  Scale,
  Navigation,
  EqualNot,
  ArrowRightLeft,
  CircleDot,
  Boxes,
  Building2,
  CalendarClock,
  ListOrdered,
  RotateCcw,
  Rows3,
  TrendingUp,
  MessagesSquare,
  Brain,
  CheckCircle2,
  GitMerge,
  // Non-Verbal (14 topics)
  Shapes,
  Hash,
  Dice5,
  Scan,
  Puzzle,
  LayoutGrid,
  Calculator,
  FlipHorizontal,
  Grid3X3,
  PlayCircle,
  ScanEye,
  Scissors,
  FoldVertical,
  FlipVertical,
  // Fallbacks
  BookOpen,
  Eye,
} from "lucide-react";

export interface TopicIconDef {
  icon: LucideIcon;
  category: "verbal" | "nonverbal";
  label: string;
}

/**
 * Verified Lucide icon registry for all 39 Reasoning Topics.
 * Each topic is paired with an intuitive, distinctive icon.
 */
export const TOPIC_ICON_MAP: Record<string, TopicIconDef> = {
  // Verbal Reasoning (25 Topics)
  alphabet_test: { icon: Type, category: "verbal", label: "Alphabet Test" },
  analogy: { icon: GitCompare, category: "verbal", label: "Analogy" },
  analytical_reasoning: { icon: BrainCircuit, category: "verbal", label: "Analytical Reasoning" },
  blood_relations: { icon: Users, category: "verbal", label: "Blood Relations" },
  cause_and_effect: { icon: Zap, category: "verbal", label: "Cause and Effect" },
  classification: { icon: Filter, category: "verbal", label: "Classification / Odd One Out" },
  coding_decoding: { icon: Binary, category: "verbal", label: "Coding-Decoding" },
  course_of_action: { icon: Compass, category: "verbal", label: "Course of Action" },
  critical_reasoning: { icon: Lightbulb, category: "verbal", label: "Critical Reasoning" },
  data_sufficiency: { icon: Scale, category: "verbal", label: "Data Sufficiency" },
  direction_sense: { icon: Navigation, category: "verbal", label: "Direction Sense Test" },
  inequality: { icon: EqualNot, category: "verbal", label: "Inequality" },
  input_output: { icon: ArrowRightLeft, category: "verbal", label: "Input-Output" },
  logical_venn_diagrams: { icon: CircleDot, category: "verbal", label: "Logical Venn Diagrams" },
  puzzles_box: { icon: Boxes, category: "verbal", label: "Puzzles — Box / Stacking" },
  puzzles_floor: { icon: Building2, category: "verbal", label: "Puzzles — Floor-based" },
  puzzles_scheduling: { icon: CalendarClock, category: "verbal", label: "Puzzles — Scheduling" },
  ranking_order: { icon: ListOrdered, category: "verbal", label: "Ranking, Order & Sequence" },
  seating_circular: { icon: RotateCcw, category: "verbal", label: "Seating Arrangement — Circular" },
  seating_linear: { icon: Rows3, category: "verbal", label: "Seating Arrangement — Linear" },
  series_completion: { icon: TrendingUp, category: "verbal", label: "Series Completion" },
  statement_argument: { icon: MessagesSquare, category: "verbal", label: "Statement & Argument" },
  statement_assumption: { icon: Brain, category: "verbal", label: "Statement & Assumption" },
  statement_conclusion: { icon: CheckCircle2, category: "verbal", label: "Statement & Conclusion" },
  syllogism: { icon: GitMerge, category: "verbal", label: "Syllogism" },

  // Non-Verbal Reasoning (14 Topics)
  analytical_figure_classification: { icon: Shapes, category: "nonverbal", label: "Analytical Figure Classification" },
  counting_figures: { icon: Hash, category: "nonverbal", label: "Counting Figures" },
  cubes_and_dice: { icon: Dice5, category: "nonverbal", label: "Cubes and Dice" },
  embedded_figures: { icon: Scan, category: "nonverbal", label: "Embedded Figures" },
  figure_completion: { icon: Puzzle, category: "nonverbal", label: "Figure Completion" },
  grouping_figures: { icon: LayoutGrid, category: "nonverbal", label: "Grouping of Figures" },
  mathematical_operations: { icon: Calculator, category: "nonverbal", label: "Mathematical Operations" },
  mirror_images: { icon: FlipHorizontal, category: "nonverbal", label: "Mirror Images" },
  missing_character: { icon: Grid3X3, category: "nonverbal", label: "Missing Character" },
  nonverbal_series: { icon: PlayCircle, category: "nonverbal", label: "Non-Verbal Series" },
  odd_figure_out: { icon: ScanEye, category: "nonverbal", label: "Odd Figure Out" },
  paper_cutting: { icon: Scissors, category: "nonverbal", label: "Paper Cutting" },
  paper_folding: { icon: FoldVertical, category: "nonverbal", label: "Paper Folding" },
  water_images: { icon: FlipVertical, category: "nonverbal", label: "Water Images" },
};

/**
 * Returns the icon definition for a given topic ID, with graceful fallback.
 */
export function getTopicIconDef(topicId: string, fallbackCategory?: "verbal" | "nonverbal"): TopicIconDef {
  const cleanId = topicId ? topicId.trim().replace(/^topic-/, "") : "";
  if (cleanId && TOPIC_ICON_MAP[cleanId]) {
    return TOPIC_ICON_MAP[cleanId];
  }

  // Safe fallback
  const isVerbal = fallbackCategory === "verbal" || !fallbackCategory;
  return {
    icon: isVerbal ? BookOpen : Eye,
    category: isVerbal ? "verbal" : "nonverbal",
    label: cleanId ? cleanId.replace(/_/g, " ") : "Topic",
  };
}

/**
 * Returns just the Lucide icon component for a topic ID.
 */
export function getTopicIcon(topicId: string, fallbackCategory?: "verbal" | "nonverbal"): LucideIcon {
  return getTopicIconDef(topicId, fallbackCategory).icon;
}
