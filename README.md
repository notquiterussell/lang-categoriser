# Text Categoriser

## Introduction

A simple text categoriser which uses the NFC emotion categories to perform sentiment analysis of arbitrary text.

## Installation

```bash
npm install lang-categoriser
```

## Useage

```javascript
(async () => {
  try {
    var text = await category('I love cats but I am allergic to then.');
    console.log(JSON.stringify(text, null, 2));
  } catch (e) {}
})();
```

Result:

```javascript
{
  "scores": {
    "joy": 0.2,
    "positive": 0.2,
    "anticipation": 0.2,
    "sadness": 0.2,
    "surprise": 0.2,
    "trust": 0.2
  },
  "tokens": {
    "positive": {
      "love": [
        "joy",
        "positive",
        "anticipation",
        "sadness",
        "surprise",
        "trust"
      ],
    },
    "negative": {}
  }
}
```
