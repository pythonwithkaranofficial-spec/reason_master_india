const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');
const topicsDir = path.join(__dirname, '..', 'src', 'data', 'topics');

const questionFiles = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));
const topicFiles = fs.readdirSync(topicsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${questionFiles.length} question files and ${topicFiles.length} topic files.`);

let totalQuestions = 0;
const topicSummary = {};

const nonVerbalTopicIds = [
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
];

for (const file of questionFiles) {
  const filePath = path.join(questionsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const topicId = data.topicId || file.replace('.json', '');
  const count = data.questions ? data.questions.length : 0;
  totalQuestions += count;
  
  const isNonVerbal = nonVerbalTopicIds.includes(topicId);
  topicSummary[topicId] = {
    file,
    count,
    isNonVerbal,
    sample: data.questions && data.questions.length > 0 ? data.questions[0] : null
  };
}

console.log(`Total questions across all files: ${totalQuestions}`);
console.log(`Non-verbal topics question count:`, Object.entries(topicSummary)
  .filter(([_, v]) => v.isNonVerbal)
  .map(([k, v]) => `${k}: ${v.count}`)
  .join(', ')
);
