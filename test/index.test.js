const { category } = require('../src/index.js')();

describe('Categoriser tests', () => {
  it('Can parse a string', async () => {
    expect(await category('Hello')).toEqual({
      scores: {},
      tokens: {
        negative: {},
        positive: {},
      },
    });
  });

  it('Can give positive scores', async () => {
    expect(await category('I love you')).toEqual({
      scores: {
        anticipation: 0.5,
        joy: 0.5,
        positive: 0.5,
        sadness: 0.5,
        surprise: 0.5,
        trust: 0.5,
      },
      tokens: {
        negative: {},
        positive: {
          love: ['joy', 'positive', 'anticipation', 'sadness', 'surprise', 'trust'],
        },
      },
    });
  });

  it('Can give negative scores', async () => {
    expect(await category('I do not love you')).toEqual({
      scores: {
        anticipation: -0.3333333333333333,
        joy: -0.3333333333333333,
        positive: -0.3333333333333333,
        sadness: -0.3333333333333333,
        surprise: -0.3333333333333333,
        trust: -0.3333333333333333,
      },
      tokens: {
        negative: {
          love: ['joy', 'positive', 'anticipation', 'sadness', 'surprise', 'trust'],
        },
        positive: {},
      },
    });
  });

  it('Can load a different data file', async () => {
    const categoriser = require('../src/index.js')(__dirname + '/sample.json');
    expect(await categoriser.category('I do not love you')).toEqual({
      scores: {},
      tokens: {
        negative: {},
        positive: {},
      },
    });
  });

  it('I love cats but I am allergic to then.', async () => {
    const categoriser = require('../src/index.js')(__dirname + '/sample.json');
    expect(await category('I love cats but I am allergic to then.')).toEqual({
      scores: {
        joy: 0.2,
        positive: 0.2,
        anticipation: 0.2,
        sadness: 0.2,
        surprise: 0.2,
        trust: 0.2,
      },
      tokens: {
        positive: {
          love: ['joy', 'positive', 'anticipation', 'sadness', 'surprise', 'trust'],
        },
        negative: {},
      },
    });
  });
});
