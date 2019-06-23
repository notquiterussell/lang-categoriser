const csv = require('csv-parser');
const fs = require('fs');
const stem = require('wink-porter2-stemmer');

const wordCategories = {};

const main = () => {
  fs.createReadStream(__dirname + '/nrc-emotion.tsv')
    .pipe(csv({ separator: '\t', headers: ['word', 'name', 'score'] }))
    .on('data', category => {
      if (category.score != '0') {
        const word = stem(category.word);
        wordCategories[word] = wordCategories[word] || [];
        wordCategories[word].push(category.name);
      }
    })
    .on('end', () => {
      // Because we stem the words we may end up with non-uniques
      Object.keys(wordCategories).forEach(word => {
        wordCategories[word] = [...new Set(wordCategories[word])];
      });

      fs.writeFileSync('../src/data.json', JSON.stringify(wordCategories));
    });
};

main();
