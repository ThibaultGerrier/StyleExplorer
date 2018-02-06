import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Documents from './documents';
import rateLimit from '../../modules/rate-limit.js';

const spawn = require('child_process').spawn;
const fs = require('fs');

export const upsertDocument = new ValidatedMethod({
  name: 'documents.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    date: { type: Date, optional: false },
    title: { type: String, optional: true },
    body: { type: String, optional: true },
    author: { type: String, optional: false },
    authorName: { type: String, optional: false },
    isPublic: { type: Boolean, optional: false },
    featureCompletion: { type: Number, optional: false },
    featureData: { type: String, optional: true },
  }).validator(),
  run(document) {
    return Documents.upsert({ _id: document._id }, { $set: document });
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'documents.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    return Documents.remove(_id);
  },
});


export const changePublicity = new ValidatedMethod({
  name: 'documents.changePublicity',
  validate: new SimpleSchema({
    _id: { type: String },
    toPublic: { type: Boolean },
  }).validator(),
  run({ _id, toPublic }) {
    Documents.update({ _id }, { $set: { isPublic: toPublic } });
  },
});


function isNumber(n) { return !isNaN(parseFloat(n)); }

function extend(a, b) {
  for (const key in b) {
    if (b.hasOwnProperty(key)) { a[key] = b[key]; }
  }
  return a;
}

function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
}

function javaDone(_id, hash) {
  // future.wait();

  // console.log('java is done');
  Meteor.bindEnvironment(Meteor._sleepForMs(1000));

  const result = fs.readFileSync(`C:\\Users\\thibault\\WebstormProjects\\MyProject\\texts\\textresult_${_id}${hash}.json`, 'utf8');
  // console.log(result);
  // console.log('result is here');

  fs.unlinkSync(`C:\\Users\\thibault\\WebstormProjects\\MyProject\\texts\\textresult_${_id}${hash}.json`);
  // console.log('json file deleted');

  const doc = Documents.findOne(_id);
  const mergedJson = extend(JSON.parse(doc.featureData), JSON.parse(result));
  // console.log(JSON.stringify(mergedJson));
  Documents.update({ _id }, { $set: { featureData: JSON.stringify(mergedJson) } });
  // /console.log('doc updated');
}

if (Meteor.isServer) {
  Meteor.methods({
    runJava(_id, text, features, thirdArg) {
      check(_id, String);
      check(text, String);
      check(features, String);
      check(thirdArg, String);

      // text = text.replace(/(?:\r\n|\r|\n)/g, '');

      const Future = Npm.require('fibers/future');
      const future = new Future();

      const hash = Math.abs(hashCode(features));

      fs.writeFile(`C:\\Users\\thibault\\WebstormProjects\\MyProject\\texts\\text_${_id}${hash}.txt`, text, (err) => {
        if (err) throw err;
        // console.log('The file has been saved!');
      });

      const cmd = spawn('cmd', ['/c', `java -jar C:\\Users\\thibault\\eclipse_workspace\\misc\\TextFeatures-master\\out\\artifacts\\TextFeaturesMaven_jar\\TextFeaturesMaven.jar ${_id}${hash} ${thirdArg} ${features}`]);
      cmd.stdout.on('data',
        Meteor.bindEnvironment((data) => {
          if (isNumber(data)) {
            Documents.update({ _id }, { $set: { featureCompletion: parseFloat(data) } });
          }
        }));
      cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      const onClose = Meteor.bindEnvironment(
        () => {
          // console.log(`child process exited with code`);
          javaDone(_id, hash);
        },
        (e) => {
          throw e;
        }
      );

      cmd.on('close', onClose);
    },
  });
}


rateLimit({
  methods: [
    upsertDocument,
    removeDocument,
    changePublicity,
  ],
  limit: 5,
  timeRange: 1000,
});

