/**
 * Created by thibault on 18/04/2017.
 */
const lexicalFeatures = [
  'allLexical - all lexical features',
  'avgSyllablesPerSentence - average Syllables per sentence',
  'avgWordFrequencyClass - average word frequency',
  'avgWordLength - average word length',
  'avgWordsPerSentence - average words per sentence',
  'charsNGrams - n-grams for characters',
  'compressionRate - compression Rate',
  'compressionTime - compression Time',
  'daleChallIndex - Dale-Chall Index',
  'fleschKincaidGrade - Flesch-Kindcaid grade',
  'frequencyOfChars - frequency of characters',
  'frequencyOfSpecialChars - frequency of special characters',
  'frequencyOfWords - frequency of words',
  'gunningFogIndex - Gunning index',
  'honoreMeasure - Honore measure',
  'indexOfDiversity - index of diversity',
  'numberOfHapaxDislegomena - number of hapax-dislegomena',
  'numberOfHapaxLegomena - number of hapax-legomena',
  'sichelMeasure - Sichel measure',
  'typeTokenRatio - type token Ration',
  'wordNGrams - n-grams for words',
  'yuleKMeasure - YuleK measure',
];

const syntacticalFeatures = [
  'allSyntactical - all syntactical features',
  'avgFunctionWordsPerSentence - average function words per sentence',
  'frequencyOfFuntionWords - frequency of function words',
  'frequencyOfTags - frequency of tags',
  'nGramOfTags - n-gram for tags',
  'punctuationWordRatio - punctuation ratio',
];

const errorFeatures = [
  'allError - all errors features',
  'getAvsAnRule - avs an rule',
  'getCommaWhitespaceRule - comma whitespace rule',
  'getCompoundRule - compound rule',
  'getContractionSpellingRule - contraction splelling rule',
  'getDoublePunctuationRule - double punctuation rule',
  'getEnglishUnpairedBracketsRule - unpaired brackets rule  ',
  'getEnglishWordRepeatBeginningRule - word repeat beginning rule',
  'getEnglishWordRepeatRule - word repeat rule',
  'getMorfologikAmericanSpellerRules - morfologik speller rule',
  'getMultipleWhitespaceRule - multiple whitespace rule',
  'getSentenceWhitespaceRule - sentence whitespace rule',
  'getUppercaseSentenceStartRule - uppercase sentense start rule',
];

export default {
  features : [
    lexicalFeatures,
    syntacticalFeatures,
    errorFeatures,
  ]
};
