// src/scripts/audit-options.js
const fs = require('fs');
const path = require('path');

function auditDir(dirPath, label) {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
  let totalFiles = 0;
  let totalQuestions = 0;
  let dupOptions = 0;
  let invalidLen = 0;
  let invalidDice = 0;
  let dummyDistractors = 0;
  let invalidCorrectIndex = 0;

  for (const f of files) {
    totalFiles++;
    const data = JSON.parse(fs.readFileSync(path.join(dirPath, f), 'utf8'));
    let questions = [];
    if (data.questions) questions = data.questions;
    if (data.subtopics) {
      for (const s of data.subtopics) {
        if (s.practiceQuestions) questions.push(...s.practiceQuestions);
        if (s.workedExamples) questions.push(...s.workedExamples);
      }
    }

    for (const q of questions) {
      totalQuestions++;
      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
        invalidCorrectIndex++;
      }
      if (!q.options || q.options.length !== 4) {
        invalidLen++;
      } else {
        const unique = new Set(q.options);
        if (unique.size !== 4) {
          dupOptions++;
          console.log(`[Duplicate options] in ${label}/${f}: ${JSON.stringify(q.options)}`);
        }
        if (f.includes('cubes_and_dice')) {
          const isDiceFace = /face opposite|opposite to|opposite of|which number is on the face|number on the face/i.test(q.questionText || '');
          if (isDiceFace) {
            const hasOver6 = q.options.some(opt => {
              const n = parseInt(opt, 10);
              return !isNaN(n) && (n < 1 || n > 6);
            });
            if (hasOver6) {
              invalidDice++;
              console.log(`[Invalid dice options] in ${label}/${f}: ${JSON.stringify(q.options)}`);
            }
          }
        }
        if (q.options.some(opt => /curved squiggles|open circle without shaded/i.test(opt))) {
          dummyDistractors++;
          console.log(`[Dummy distractor] in ${label}/${f}: ${JSON.stringify(q.options)}`);
        }
      }
    }
  }
  console.log(`[${label}] Files: ${totalFiles}, Questions: ${totalQuestions}, Duplicates: ${dupOptions}, InvalidLen: ${invalidLen}, InvalidDice: ${invalidDice}, DummyDistractors: ${dummyDistractors}, InvalidIndex: ${invalidCorrectIndex}`);
}

console.log('--- AUDIT REPORT ---');
auditDir(path.join(__dirname, '../data/questions'), 'questions');
auditDir(path.join(__dirname, '../data/topics'), 'topics');
