const types = {
  lexicalFeatures: {
    nameEn: 'All lexical features',
    features: [],
  },
  syntacticalFeatures: {
    nameEn: 'All syntactical features',
    features: [],
  },
  errorFeatures: {
    nameEn: 'All error features',
    features: [],
  },
};

const features = {
  avgSyllablesPerSentence: {
    identifier: 'avgSyllablesPerSentence',
    nameEn: 'average syllables per sentence',
    type: 'lexicalFeatures',
    descriptionEn: 'asd',
    link: 'http://google.com',
    dimensions: '1',
  },
  avgWordFrequencyClass: {
    identifier: 'avgWordFrequencyClass',
    nameEn: 'average word frequency',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  avgWordLength: {
    identifier: 'avgWordLength',
    nameEn: 'average word length',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  avgWordsPerSentence: {
    identifier: 'avgWordsPerSentence',
    nameEn: 'average words per sentence',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  charsNGrams: {
    identifier: 'charsNGrams',
    nameEn: 'n-grams for characters',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  compressionRate: {
    identifier: 'compressionRate',
    nameEn: 'compression Rate',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  compressionTime: {
    identifier: 'compressionTime',
    nameEn: 'compression Time',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  daleChallIndex: {
    identifier: 'daleChallIndex',
    nameEn: 'Dale-Chall Index',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  fleschKincaidGrade: {
    identifier: 'fleschKincaidGrade',
    nameEn: 'Flesch-Kindcaid grade',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  frequencyOfChars: {
    identifier: 'frequencyOfChars',
    nameEn: 'frequency of characters',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  frequencyOfSpecialChars: {
    identifier: 'frequencyOfSpecialChars',
    nameEn: 'frequency of special characters',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  frequencyOfWords: {
    identifier: 'frequencyOfWords',
    nameEn: 'frequency of words',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  gunningFogIndex: {
    identifier: 'gunningFogIndex',
    nameEn: 'Gunning index',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  honoreMeasure: {
    identifier: 'honoreMeasure',
    nameEn: 'Honore measure',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  indexOfDiversity: {
    identifier: 'indexOfDiversity',
    nameEn: 'index of diversity',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  numberOfHapaxDislegomena: {
    identifier: 'numberOfHapaxDislegomena',
    nameEn: 'number of hapax-dislegomena',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  numberOfHapaxLegomena: {
    identifier: 'numberOfHapaxLegomena',
    nameEn: 'number of hapax-legomena',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  sichelMeasure: {
    identifier: 'sichelMeasure',
    nameEn: 'Sichel measure',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  typeTokenRatio: {
    identifier: 'typeTokenRatio',
    nameEn: 'type token Ration',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  wordNGrams: {
    identifier: 'wordNGrams',
    nameEn: 'n-grams for words',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  yuleKMeasure: {
    identifier: 'yuleKMeasure',
    nameEn: 'YuleK measure',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  avgFunctionWordsPerSentence: {
    identifier: 'avgFunctionWordsPerSentence',
    nameEn: 'average function words per sentence',
    type: 'syntacticalFeatures',
    dimensions: '1',
  },
  frequencyOfFuntionWords: {
    identifier: 'frequencyOfFuntionWords',
    nameEn: 'frequency of function words',
    type: 'syntacticalFeatures',
    dimensions: '2',
  },
  frequencyOfTags: {
    identifier: 'frequencyOfTags',
    nameEn: 'frequency of tags',
    type: 'syntacticalFeatures',
    dimensions: '2',
  },
  nGramOfTags: {
    identifier: 'nGramOfTags',
    nameEn: 'n-gram for tags',
    type: 'syntacticalFeatures',
    dimensions: '2',
  },
  punctuationWordRatio: {
    identifier: 'punctuationWordRatio',
    nameEn: 'punctuation ratio',
    type: 'syntacticalFeatures',
    dimensions: '1',
  },
  getAvsAnRule: {
    identifier: 'getAvsAnRule',
    nameEn: 'avs an rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getCommaWhitespaceRule: {
    identifier: 'getCommaWhitespaceRule',
    nameEn: 'comma whitespace rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getCompoundRule: {
    identifier: 'getCompoundRule',
    nameEn: 'compound rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getContractionSpellingRule: {
    identifier: 'getContractionSpellingRule',
    nameEn: 'contraction splelling rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getDoublePunctuationRule: {
    identifier: 'getDoublePunctuationRule',
    nameEn: 'double punctuation rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getEnglishUnpairedBracketsRule: {
    identifier: 'getEnglishUnpairedBracketsRule',
    nameEn: 'unpaired brackets rule  ',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getEnglishWordRepeatBeginningRule: {
    identifier: 'getEnglishWordRepeatBeginningRule',
    nameEn: 'word repeat beginning rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getEnglishWordRepeatRule: {
    identifier: 'getEnglishWordRepeatRule',
    nameEn: 'word repeat rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getMorfologikAmericanSpellerRules: {
    identifier: 'getMorfologikAmericanSpellerRules',
    nameEn: 'morfologik speller rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getMultipleWhitespaceRule: {
    identifier: 'getMultipleWhitespaceRule',
    nameEn: 'multiple whitespace rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getSentenceWhitespaceRule: {
    identifier: 'getSentenceWhitespaceRule',
    nameEn: 'sentence whitespace rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getUppercaseSentenceStartRule: {
    identifier: 'getUppercaseSentenceStartRule',
    nameEn: 'uppercase sentense start rule',
    type: 'errorFeatures',
    dimensions: '1',
  },
};

export {
  features,
  types,
};
