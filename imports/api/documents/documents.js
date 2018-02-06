import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

const Documents = new Mongo.Collection('Documents');
export default Documents;

Documents.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Documents.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});


const LexicalFeatures = new SimpleSchema({
  avgSyllablesPerSentence: {
    type: Number,
  },
});

const SyntacticalFeatures = new SimpleSchema({
  avgFunctionWordsPerSentence: {
    type: Number,
  },
});

const Errorfeatures = new SimpleSchema({
  getAvsAnRule: {
    type: Number,
  },
});

const FeatureData = new SimpleSchema({
  lexicalFeatures: {
    type: LexicalFeatures,
  },
  syntacticalFeatures: {
    type: SyntacticalFeatures,
  },
  errorFeatures: {
    type: Errorfeatures,
  },
});

Documents.schema = new SimpleSchema({
  date: {
    type: Date,
    label: 'date',
  },
  title: {
    type: String,
    label: 'The title of the document.',
  },
  body: {
    type: String,
    label: 'The body of the document.',
  },
  author: {
    type: String,
    label: 'Author ID',
  },
  authorName: {
    type: String,
    label: 'Author Name',
  },
  isPublic: {
    type: Boolean,
    label: 'Is the document public',
  },
  featureCompletion: {
    type: Number,
    label: 'How far is the calculation done',
    decimal: true,
  },
  featureData: {
    type: String,
    label: 'The Data from the features',
    optional: true,
  },
});

Documents.attachSchema(Documents.schema);

Factory.define('document', Documents, {
  title: () => 'Factory Title',
  body: () => 'Factory Body',
  author: () => 'Factory Author',
  isPublic: () => false,
});
