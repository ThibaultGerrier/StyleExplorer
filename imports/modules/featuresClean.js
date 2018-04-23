const nGramFeatures = [
  'charsNGrams',
  'wordNGrams',
  'nGramOfTags',
];

const whiteSpaceFeatures = [
  'charsNGrams',
];

const types = {
  lexicalFeatures: {
    nameEn: 'All lexical features',
    titleEn: 'Lexical features:',
    features: [],
  },
  syntacticalFeatures: {
    nameEn: 'All syntactical features',
    titleEn: 'Syntactical features:',
    features: [],
  },
  errorFeatures: {
    nameEn: 'All error features',
    titleEn: 'Error features:',
    features: [],
  },
};

const features = {
  avgSyllablesPerSentence: {
    identifier: 'avgSyllablesPerSentence',
    nameEn: 'average syllables per sentence',
    type: 'lexicalFeatures',
    descriptionEn: 'The formula A/B,' +
    'where A = sum of all syllables and' +
    'B = the number of sentences in the text,' +
    'calculates average syllables per sentence. The tokenizer must be able to split the text into syllables. That is not a trivial quest, as not all syllables can be found by using rules. The only way to find 100% of all syllables is to have a lexical database that provides information about syllable splitting.',
    link: 'http://google.com',
    dimensions: '1',
  },
  avgWordFrequencyClass: {
    identifier: 'avgWordFrequencyClass',
    nameEn: 'average word frequency',
    descriptionEn: 'S. M. zu Eissen, B. Stein and M. Kulig describe the word frequency class as the following: "The frequency class of a word is directly connected to Zipf\'s law and can be used as an indicator of a words customariness. ' +
    'Let C be a text corpus, and let |C| be the number of words in C.' +
    'Moreover, let f(w) denote the frequency of a word w ∈ C, and let r(w) denote the rank of w in a word list of C, which is sorted by decreasing frequency.' +
    'We define the word frequency class c(w) of a word w ∈ C as ⌊log2(f(w*)/f(w))⌋, where w* denotes the most frequently used word in C."' +
    'Moreover, they say that the average word frequency class tells something about style complexity and the size of an author\'s vocabulary. With the help of a look-up table (containing the words with their frequency), this feature can be computed in linear time in the number of words.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  avgWordLength: {
    identifier: 'avgWordLength',
    nameEn: 'average word length',
    descriptionEn: 'The formula A/B, where A = sum of length of all words and B = the number of words in the text, calculates the average word length. The tokenizer must be able to create tokens free of special characters e.g.,punctuation marks.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  avgWordsPerSentence: {
    identifier: 'avgWordsPerSentence',
    nameEn: 'average words per sentence',
    descriptionEn: 'The formula A/B, where A = number of words and B = the number of sentences in the text, calculates average words per sentence. Beside being able to tokenize the words of a text, the tokenizer must be able to count the number of sentences.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  charsNGrams: {
    identifier: 'charsNGrams',
    nameEn: 'n-grams for characters',
    descriptionEn: 'It is counted how often n-grams of the characters appear in the whole text. Also, it has to be decided which size N has to be and as before, if the algorithm has to differentiate between lower case and upper case letters (it doesn\'t in this case).',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  compressionRate: {
    identifier: 'compressionRate',
    nameEn: 'compression Rate',
    descriptionEn: 'The main idea behind compression features is that if authors differ in their writing style, compression of their text also has to dier. How exactly the compression works and which type of compression is used per se is not important and can be seen as a black box. However, if authors can be dierentiated with the help of the compression rate, it should be tested which compression algorithm delivers the best results. The compression rate says, by how many percent the original file was compressed. A file of size 10MB gets compressed to a 9MB file. Then, the the compression rate would be 10%. On the other side, compression time measures the time that is needed to compress the text.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  compressionTime: {
    identifier: 'compressionTime',
    nameEn: 'compression Time',
    descriptionEn: 'The main idea behind compression features is that if authors differ in their writing style, compression of their text also has to dier. How exactly the compression works and which type of compression is used per se is not important and can be seen as a black box. However, if authors can be dierentiated with the help of the compression rate, it should be tested which compression algorithm delivers the best results. The compression rate says, by how many percent the original file was compressed. A file of size 10MB gets compressed to a 9MB file. Then, the the compression rate would be 10%. On the other side, compression time measures the time that is needed to compress the text.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  daleChallIndex: {
    identifier: 'daleChallIndex',
    nameEn: 'Dale-Chall Index',
    descriptionEn: 'The Dale Chall Index is an expansion of the Flesch Kincaid Ease and was introduced by E. Dale and J. Chall in 1948. Instead of using the word length to determine how difficult a word was for the reader to understand, Dale and Chall used a list of 763 words that 80% of fourth-grade students could understand. In 1955 by E. D. Jeanne Sterlicht Chall, the list was extended to 3000 words. The raw score of the Dale Chall Index is defined by\n' +
    '0.1579( A/N * 100) + 0.0496(N/B), where\n' +
    'N = Number of words in a text,\n' +
    'A = Number of complex words (not in the 3000-word list)\n' +
    'B = Number of sentences in a text.\n' +
    'However, if the percentage of difficult words is above 5%, 3.6365 is addedto the raw score.\n' +
    'If the score is 4.9 or lower, the text is easily understood by a 4th-grader. A score of 9.0 to 9.9 indicates that a 13th to 15th-grade (college) student is able to understand the text.\n',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  fleschKincaidGrade: {
    identifier: 'fleschKincaidGrade',
    nameEn: 'Flesch-Kindcaid grade',
    descriptionEn: 'The Flesch Reading Ease of Flesch Kincaid grade is a readability test to indicate how difficult a text is to understand. A score from 90 to 100 means that the text is easily understood by an 11-year-old student. A score from 60 to 70 denotes to plain English, which is easily understood by an 13- to 15-year old student, while 0 to 30 means that the text is very difficult to read and understood mainly by university graduates.\n' +
    'For better comprehension, the Time magazine has a Flesch Reading Ease around 52, while the Harvard Law Review scores around the lower 30s. \n' +
    'The Flesch Reading Ease is defined by\n' +
    '206.835 - 1.015(N/A) - 84.6(B/N), where\n' +
    'N = Number of words in a text,\n' +
    'A = Number of sentences in a text and\n' +
    'B = Number of syllables in a text.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  frequencyOfChars: {
    identifier: 'frequencyOfChars',
    nameEn: 'frequency of characters',
    descriptionEn: 'The frequency of characters feature counts the occurrence of every character in the text. On the one hand it has to be decided if white-space characters are counted as well, on the other hand it has to be decided if the algorithm has to differentiate between lower case and upper case letter.',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  frequencyOfSpecialChars: {
    identifier: 'frequencyOfSpecialChars',
    nameEn: 'frequency of special characters',
    descriptionEn: 'The occurrence of every special character in a text is counted. A special character is every character disparate to letters, numbers and white spaces.',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  frequencyOfWords: {
    identifier: 'frequencyOfWords',
    nameEn: 'frequency of words',
    descriptionEn: 'The occurrence of every word within a text is counted. It has to be decided if the algorithm has to dierentiate between lower case and upper case letters.',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  gunningFogIndex: {
    identifier: 'gunningFogIndex',
    nameEn: 'Gunning index',
    descriptionEn: 'Developed by Robert Gunning in 1952, the Gunning Fog Index measures the readability of a text. The formula is\n' +
    '0.4 [(N/A) + 100 (B/N)], where\n' +
    'N = Number of words in a text,\n' +
    'A = Number of sentences in a text and\n' +
    'B = Number of complex words(3 or more syllables long) in a text.\n' +
    'The downside of this readability measure are that not all words with 3 or more syllables are complex (hard to understand).\n' +
    'A score of 6 indicates that the text is easy to understand for a 6th grade student. A text with a score of 12 should not be a problem for a high school senior and 17 indicates that the text is easy to understand for a college graduate.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  honoreMeasure: {
    identifier: 'honoreMeasure',
    nameEn: 'Honore measure',
    descriptionEn: 'Honore\'s Measure (A. Honore) is described by M. Oakes as\n' +
    'R = 100logN / (1-(V1/V), where\n' +
    'N = Number of words in a text,\n' +
    'V = Number of different words in a text, \n' +
    'and V 1 = Number of hapax legomena in a text.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  indexOfDiversity: {
    identifier: 'indexOfDiversity',
    nameEn: 'index of diversity',
    descriptionEn: 'The formula A/B, where A = number of hapax legomena in a text and B = number of words in a text, calculates the index of diversity.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  numberOfHapaxDislegomena: {
    identifier: 'numberOfHapaxDislegomena',
    nameEn: 'number of hapax-dislegomena',
    descriptionEn: 'This is basically the same as number of hapax legomena, however a hapax dislegomenon is a word that occurs exactly twice in a text.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  numberOfHapaxLegomena: {
    identifier: 'numberOfHapaxLegomena',
    nameEn: 'number of hapax-legomena',
    descriptionEn: 'A hapax legomenon is a word that occurs only once within a context, whereas the context can be the written record of an entire language, in all works of an author, or in a single text. For the purpose of this thesis it is the latter one. This feature counts the number of words that occur only once in the text with respect to the size of it, so the value is normalized and can be compared with other texts.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  sichelMeasure: {
    identifier: 'sichelMeasure',
    nameEn: 'Sichel measure',
    descriptionEn: 'Sichel\'s Measure (H. S. Sichel) is described by M. Oakes as:\n' +
    'S = V2 / V, where\n' +
    'V = number of different words in a text and\n' +
    'V 2 = number of hapax dislegomena in a text.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  typeTokenRatio: {
    identifier: 'typeTokenRatio',
    nameEn: 'Type Token Ratio',
    descriptionEn: 'According to K. S. Retherford, the type-token ratio measures the vocabulary diversity of an author. The formula A/B, where A = number of different words in a text(types) and B = number of words in a text(tokens), calculates the type-token ratio. M. Oakes mentions that "the type-token ratio depends on the length of the text (being generally less for longer texts), but is a useful measure of vocabulary richness when the comparison texts are of equal length."',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  wordNGrams: {
    identifier: 'wordNGrams',
    nameEn: 'n-grams for words',
    descriptionEn: 'It is counted how often n-grams of the words appear in the whole text. Also, it has to be decided which size N has to be and as before, if the algorithm has to differentiate between lower case and upper case letters (it doesn\'t in this case).',
    type: 'lexicalFeatures',
    dimensions: '2',
  },
  yuleKMeasure: {
    identifier: 'yuleKMeasure',
    nameEn: 'Yules K measure',
    descriptionEn: 'In 1944, Yule founded the characteristic K to decide if De Imiatione Christi (K value of 84.2) was written by Kempis or Gerson. The K value for works definitely written by Kempis was 59.9, as for Gerson works it was 35.9.\n' +
    'Therefore, it was much more likely thatDe Imiatione Christi was written by Kempis. The K Measure is defined as follows:\n' +
    'K = 10,000 * (M - N)/N^2, where\n' +
    'M = SUM(i^2.Vi.),\n' +
    'N = Number of words in a text and\n' +
    'Vi = Number of words occuring exactly i times.',
    type: 'lexicalFeatures',
    dimensions: '1',
  },
  avgFunctionWordsPerSentence: {
    identifier: 'avgFunctionWordsPerSentence',
    nameEn: 'average function words per sentence',
    descriptionEn: 'The average function words per sentence feature is calculated with\n' +
    'A/B, where\n' +
    'A = Number of function words in the text and\n' +
    'B = Number of Sentences in the text.',
    type: 'syntacticalFeatures',
    dimensions: '1',
  },
  frequencyOfFuntionWords: {
    identifier: 'frequencyOfFuntionWords',
    nameEn: 'frequency of function words',
    descriptionEn: '"Function words have little lexical meaning or have ambiguous meaning, but instead serve to express the grammatical relationship with other words within a sentence, or specify the attitude or mood of the speaker. They signal the structural relationships that words have to one another and are the glue that holds sentences together. Thus, they serve as important elements to the structures of sentences."\n' +
    'X. Chen, P. Hao, R. Chandramouli and K. P. Subbalakshmi mentiones, that syntactical features containing function words can capture an author\'s writing style at the sentence level. For finding functions words, a lexical list of all possible function words is needed. Frequency of function words counts the occurrence of each function word in the text.',
    type: 'syntacticalFeatures',
    dimensions: '2',
  },
  frequencyOfTags: {
    identifier: 'frequencyOfTags',
    nameEn: 'frequency of POS-Tags',
    descriptionEn: 'Every word of the text gets tagged, then the occurrence of each tag is counted.',
    type: 'syntacticalFeatures',
    dimensions: '2',
  },
  nGramOfTags: {
    identifier: 'nGramOfTags',
    nameEn: 'n-gram for tags',
    descriptionEn: 'Given the tagged text, n-grams of the POS-Tags are built and counted, how often the occur.',
    type: 'syntacticalFeatures',
    dimensions: '2',
  },
  punctuationWordRatio: {
    identifier: 'punctuationWordRatio',
    nameEn: 'punctuation ratio',
    descriptionEn: 'The punctuation-word ratio is calculated with\n' +
    'A/B, where\n' +
    'A = Number of punctuation marks in the text and\n' +
    'B = Number of words in the text.',
    type: 'syntacticalFeatures',
    dimensions: '1',
  },
  getAvsAnRule: {
    identifier: 'getAvsAnRule',
    nameEn: 'avs an rule',
    descriptionEn: 'This rule checks, when a word starts with a vowel, the preceding word is \'an\', or when a word does not start with a vowel, the preceding wort is \'a\'.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getCommaWhitespaceRule: {
    identifier: 'getCommaWhitespaceRule',
    nameEn: 'comma whitespace rule',
    descriptionEn: 'This rule checks if there are any formatting errors regarding white spaces and periods, commas, and parenthesis. For example, the rule would math if no white space follows after a comma.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getCompoundRule: {
    identifier: 'getCompoundRule',
    nameEn: 'compound rule',
    descriptionEn: 'This rules checks that compounds are not written as separate words.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getContractionSpellingRule: {
    identifier: 'getContractionSpellingRule',
    nameEn: 'contraction splelling rule',
    descriptionEn: 'This rule checks for commonly wrong spelled phrases.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getDoublePunctuationRule: {
    identifier: 'getDoublePunctuationRule',
    nameEn: 'double punctuation rule',
    descriptionEn: 'This rule matches to the following expression: \'..\'',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getEnglishUnpairedBracketsRule: {
    identifier: 'getEnglishUnpairedBracketsRule',
    nameEn: 'unpaired brackets rule  ',
    descriptionEn: 'This rule triggers when a parenthesis is opened but never closed or the opposite.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getEnglishWordRepeatBeginningRule: {
    identifier: 'getEnglishWordRepeatBeginningRule',
    nameEn: 'word repeat beginning rule',
    descriptionEn: 'This rule triggers if three successive sentences begin with the same word, e.g. "This is fun. This is cool. This is nice."',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getEnglishWordRepeatRule: {
    identifier: 'getEnglishWordRepeatRule',
    nameEn: 'word repeat rule',
    descriptionEn: 'This rule checks if a word is repeated twice, e.g. "the the".',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getMorfologikAmericanSpellerRules: {
    identifier: 'getMorfologikAmericanSpellerRules',
    nameEn: 'morfologik speller rule',
    descriptionEn: 'This rule checks for errors in a morphological way.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getMultipleWhitespaceRule: {
    identifier: 'getMultipleWhitespaceRule',
    nameEn: 'multiple whitespace rule',
    descriptionEn: 'This rule checks if there are multiple whitespaces behind each other.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getSentenceWhitespaceRule: {
    identifier: 'getSentenceWhitespaceRule',
    nameEn: 'sentence whitespace rule',
    descriptionEn: 'Counts the occurrence of all suggestions made to fix the error found by the error rule.',
    type: 'errorFeatures',
    dimensions: '1',
  },
  getUppercaseSentenceStartRule: {
    identifier: 'getUppercaseSentenceStartRule',
    nameEn: 'uppercase sentense start rule',
    descriptionEn: 'This rule checks if a sentence starts with an uppercase letter.',
    type: 'errorFeatures',
    dimensions: '1',
  },
};

export {
  features,
  types,
  nGramFeatures,
  whiteSpaceFeatures,
};
