const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');
const topicsDir = path.join(__dirname, '..', 'src', 'data', 'topics');
const reportsDir = path.join(__dirname, '..', 'public', 'assets', 'reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const nonVerbalTopics = new Set([
  'mirror_images',
  'water_images',
  'paper_folding',
  'paper_cutting',
  'embedded_figures',
  'figure_completion',
  'counting_figures',
  'cubes_and_dice',
  'nonverbal_series',
  'odd_figure_out',
  'grouping_figures',
  'analytical_figure_classification',
  'mathematical_operations',
  'missing_character'
]);

const verbalDiagramTopics = new Set([
  'seating_linear',
  'seating_circular',
  'direction_sense',
  'blood_relations',
  'puzzles_floor',
  'puzzles_box',
  'puzzles_scheduling',
  'logical_venn_diagrams'
]);

const report = {
  generatedAt: new Date().toISOString(),
  totalTopics: 39,
  totalQuestions: 0,
  totalWorkedExamples: 0,
  totalEmbeddedPracticeQuestions: 0,
  classificationCounts: {
    typeA_textOnly: 0,
    typeB_optionalVisual: 0,
    typeC_visualRequired: 0,
    typeD_existingVisualRendered: 0,
    typeE_visualOptionsRequired: 0
  },
  byTopic: {}
};

// 1. Audit Question Banks (19,500 Questions)
const qFiles = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));

for (const file of qFiles) {
  const filePath = path.join(questionsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const topicId = data.topicId || file.replace('.json', '');
  const questions = data.questions || [];
  
  report.totalQuestions += questions.length;
  
  const isNonVerbal = nonVerbalTopics.has(topicId);
  const isVerbalDiagram = verbalDiagramTopics.has(topicId);
  
  let topicTypeA = 0;
  let topicTypeB = 0;
  let topicTypeC = 0;
  let topicTypeD = 0;
  let topicTypeE = 0;
  
  for (const q of questions) {
    if (isNonVerbal) {
      topicTypeC++;
      topicTypeD++; // Handled dynamically by NonVerbalFigureRenderer SVG vector engine
      
      // Check if options are figures/rotation angles/faces
      const hasFigureOptions = q.options.some(opt => 
        opt.includes('°') || 
        opt.includes('Clockwise') || 
        opt.includes('Figure') || 
        opt.includes('Opposite') ||
        opt.length === 1 && /[A-Z0-9]/.test(opt)
      );
      if (hasFigureOptions) {
        topicTypeE++;
      }
    } else if (isVerbalDiagram) {
      topicTypeB++;
      topicTypeA++; // Primary format is text, visual is optional aid
    } else {
      topicTypeA++;
    }
  }
  
  report.classificationCounts.typeA_textOnly += (isNonVerbal ? 0 : topicTypeA);
  report.classificationCounts.typeB_optionalVisual += topicTypeB;
  report.classificationCounts.typeC_visualRequired += topicTypeC;
  report.classificationCounts.typeD_existingVisualRendered += topicTypeD;
  report.classificationCounts.typeE_visualOptionsRequired += topicTypeE;
  
  report.byTopic[topicId] = {
    totalQuestions: questions.length,
    category: isNonVerbal ? 'nonverbal' : 'verbal',
    typeA: isNonVerbal ? 0 : topicTypeA,
    typeB: topicTypeB,
    typeC: topicTypeC,
    typeD: topicTypeD,
    typeE: topicTypeE
  };
}

// 2. Audit Topics Curriculum (Worked Examples & Practice Questions)
const tFiles = fs.readdirSync(topicsDir).filter(f => f.endsWith('.json'));

for (const file of tFiles) {
  const filePath = path.join(topicsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const topicId = data.id || file.replace('.json', '');
  
  let exCount = 0;
  let prCount = 0;
  
  if (data.subtopics && Array.isArray(data.subtopics)) {
    for (const sub of data.subtopics) {
      if (sub.examples) exCount += sub.examples.length;
      if (sub.practiceQuestions) prCount += sub.practiceQuestions.length;
    }
  }
  
  report.totalWorkedExamples += exCount;
  report.totalEmbeddedPracticeQuestions += prCount;
  
  if (report.byTopic[topicId]) {
    report.byTopic[topicId].workedExamples = exCount;
    report.byTopic[topicId].embeddedPractice = prCount;
  }
}

const outputPath = path.join(reportsDir, 'question_classification_report.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');

console.log('--- REASONMASTER INDIA QUESTION AUDIT SUMMARY ---');
console.log(`Total Master Questions Audited: ${report.totalQuestions}`);
console.log(`Total Worked Examples Audited: ${report.totalWorkedExamples}`);
console.log(`Total Embedded Practice Questions Audited: ${report.totalEmbeddedPracticeQuestions}`);
console.log(`Type A (Text Only): ${report.classificationCounts.typeA_textOnly}`);
console.log(`Type B (Optional Visual Diagram): ${report.classificationCounts.typeB_optionalVisual}`);
console.log(`Type C (Visual Required): ${report.classificationCounts.typeC_visualRequired}`);
console.log(`Type D (Existing Vector Figures Rendered): ${report.classificationCounts.typeD_existingVisualRendered}`);
console.log(`Type E (Visual Option Support): ${report.classificationCounts.typeE_visualOptionsRequired}`);
console.log(`Report written to: ${outputPath}`);
