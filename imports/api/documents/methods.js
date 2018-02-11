import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Documents from './documents';
import rateLimit from '../../modules/rate-limit.js';

const config = require('../../../config/default');
const { spawn } = require('child_process');
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


function isNumber(n) { return !Number.isNaN(parseFloat(n)); }


function extend(a, b) {
  return Object.assign(a, b);
}

function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    /* eslint-disable no-bitwise */
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
    /* eslint-enable no-bitwise */
  }
  return hash;
}

function spawnWindowsProcess(dir, cmd) {
  return spawn('cmd.exe', ['/c', cmd], { cwd: dir });
}

function spawnLinuxProcess(dir, cmd) {
  const cmdParts = cmd.split(/\s+/);
  return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir });
}

function spawnProcess(dir, cmd) {
  return (process.platform.toLowerCase().indexOf('win') >= 0)
    ? spawnWindowsProcess(dir, cmd)
    : spawnLinuxProcess(dir, cmd);
}


function javaDone(_id, hash) {
  // console.log('java is done');
  Meteor.bindEnvironment(Meteor._sleepForMs(1000));

  const result = fs.readFileSync(`${Meteor.absolutePath}/texts/textresult_${_id}${hash}.json`, 'utf8');
  // console.log(result);
  // console.log('result is here');

  fs.unlinkSync(`${Meteor.absolutePath}/texts/textresult_${_id}${hash}.json`);
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

      let cleanText = text.replace(/[\n]{3}/g, '$par$').replace(/\s+/g, ' ').trim(); // 3 should probably be a parameter
      // eslint-disable-next-line no-control-regex
      cleanText = cleanText.replace(/[^\x00-\x7F]/g, '');

      const hash = Math.abs(hashCode(features));

      fs.writeFileSync(`${Meteor.absolutePath}/texts/text_${_id}${hash}.txt`, cleanText);

      const cmd = spawnProcess('.', `java -jar ${config.jarLocation} ${_id}${hash} ${thirdArg} ${features}`);
      console.log('started with ', _id);
      cmd.stdout.on(
        'data',
        Meteor.bindEnvironment((data) => {
          // console.log(data.toString('utf8'));
          if (isNumber(data)) {
            Documents.update({ _id }, { $set: { featureCompletion: parseFloat(data) } });
          }
        }),
      );
      cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      const onClose = Meteor.bindEnvironment(
        () => {
          console.log('done with ', _id);
          // console.log(`child process exited with code`);
          javaDone(_id, hash);
        },
        (e) => {
          console.log(e);
          throw e;
        },
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

