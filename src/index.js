const fs = require('fs');

const nlp = require('wink-nlp-utils');
const stem = require('wink-porter2-stemmer');

let categoryDictionary = {};

const ready = new Promise(resolve => {
  fs.readFile(__dirname + '/data.json', (err, data) => {
    if (err) throw err;
    categoryDictionary = JSON.parse(data);
    resolve();
  });
});

/**
 * Ascertain the categories that a given utterance belongs to.
 *
 * The result is an object containing scores and tokens:
 *
 * {
 *  "scores": {
 *    "joy": 0.2,
 *    "positive": 0.2,
 *    "anticipation": 0.2,
 *    "sadness": 0.2,
 *    "surprise": 0.2,
 *    "trust": 0.2
 *  },
 *  "tokens": {
 *    "positive": {
 *      "love": [
 *        "joy",
 *        "positive",
 *        "anticipation",
 *        "sadness",
 *        "surprise",
 *        "trust"
 *      ]
 *    },
 *    "negative": {}
 *  }
 * }
 *
 * @param {string} utterance
 * @returns {object}
 */
const category = async (utterance = '') => {
  await ready;

  let tokens = nlp.string.tokenize(utterance, true).reduce((result, el) => {
    if (el.tag == 'word') {
      result.push(el.value);
    }
    return result;
  }, []);

  tokens = nlp.tokens.propagateNegations(tokens, 5);
  tokens = nlp.tokens.removeWords(tokens);
  const totalWords = tokens.length;

  const categories = {
    scores: {},
    tokens: {
      positive: {},
      negative: {},
    },
  };

  Object.keys(tokens).reduce((_, pos) => {
    const word = tokens[pos].toLowerCase();
    const negate = word.startsWith('!');
    if (negate) {
      word = wordStemmed.split('!')[1];
    }

    const wordStemmed = stem(word);
    const c = categoryDictionary[wordStemmed];
    if (negate) {
      categories.tokens.negative[word] = c || null;
    } else {
      categories.tokens.positive[word] = c || null;
    }

    if (c) {
      const score = negate ? -1 : 1;
      c.reduce((_, cat) => {
        categories.scores[cat] = categories.scores[cat] || 0;
        categories.scores[cat] += score;
      }, {});
    }
  }, {});

  // Now scale the categories as a probability
  Object.keys(categories.scores).forEach(category => {
    categories.scores[category] = categories.scores[category] / totalWords;
  });
  return categories;
};

module.exports = { category };
