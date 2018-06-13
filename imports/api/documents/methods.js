/* eslint-disable max-len */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Documents from './documents';
import rateLimit from '../../modules/rate-limit.js';

const { spawn } = require('child_process');
const fs = require('fs');

const { jarLocation, textLocation } = Meteor.settings.public;

console.log(jarLocation);

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

function memorySizeOf(obj) {
  let bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (const key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return `${bytes} bytes`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(3)} KiB`;
    else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(3)} MiB`;
    return `${(bytes / 1073741824).toFixed(3)} GiB`;
  }

  return formatByteSize(sizeOf(obj));
}

const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);
const avg = arr => sum(arr) / arr.length;

const sortAndSlice = (a, sliceCount) =>
  Object.entries(a)
    .sort(([, av], [, bv]) => bv - av)
    .slice(0, sliceCount)
    .reduce((o, [k, v]) => {
      o[k] = v;
      return o;
    }, {});

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

function escapeRegExp(str) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
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
  console.log('java is done');
  const howManyNGrams = 100;

  Meteor.bindEnvironment(Meteor._sleepForMs(1000));
  const result = fs.readFileSync(`${textLocation}/textresult_${_id}${hash}.json`, 'utf8');
  fs.unlinkSync(`${textLocation}/textresult_${_id}${hash}.json`);

  let parsed = JSON.parse(result);
  console.log(memorySizeOf(parsed));

  if (!parsed['no features were computed']) {
    Object.entries(parsed).forEach(([prop, value]) => {
      if (!Array.isArray(value)) {
        const occ = {};
        Object.entries(value).forEach(([comb, arr]) => {
          occ[comb] = avg(arr);
        });
        const r = sortAndSlice(occ, howManyNGrams);
        Object.keys(r).forEach((k) => {
          r[k] = value[k];
        });
        parsed[prop] = r;
      }
    });
  } else {
    parsed = {
      noFeatures: '',
    };
  }

  console.log(memorySizeOf(parsed));

  const doc = Documents.findOne(_id);
  const mergedJson = extend(JSON.parse(doc.featureData), parsed);
  // console.log(JSON.stringify(mergedJson));
  Documents.update({ _id }, { $set: { featureData: JSON.stringify(mergedJson) } });
  // /console.log('doc updated');
}

if (Meteor.isServer) {
  Meteor.methods({
    runJava(_id, text, features, thirdArg, paragraphOptions) {
      check(_id, String);
      check(text, String);
      check(features, String);
      check(thirdArg, String);
      check(paragraphOptions, Object);

      // eslint-disable-next-line no-control-regex
      let cleanText = text.replace(/[^\x00-\x7Féàèùâêîôûçëïüäöß]/ig, '');
      cleanText = cleanText.replace(/[\r]+/g, '');
      if (paragraphOptions.numEmptyLines.checked) {
        const numLines = parseInt(paragraphOptions.numEmptyLines.value, 10) + 1; // 1 empty line is \n\n, \n is only newline
        const regex = `[\n]{${numLines}}`;
        const re = new RegExp(regex, 'g');
        cleanText = cleanText.replace(re, '$par$');
      }
      if (paragraphOptions.specCharSeq.checked) {
        const specSeq = paragraphOptions.specCharSeq.value;
        const re = new RegExp(escapeRegExp(specSeq), 'g');
        cleanText = cleanText.replace(re, '$par$');
      }

      cleanText = cleanText.replace(/\s+/g, ' ').trim();

      const hash = Math.abs(hashCode(features));

      const fileLocationName = `${textLocation}/text_${_id}${hash}.txt`;
      fs.writeFileSync(fileLocationName, cleanText);

      const cmd = spawnProcess('.', `java -jar ${jarLocation} ${fileLocationName} ${thirdArg} ${features}`);
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

