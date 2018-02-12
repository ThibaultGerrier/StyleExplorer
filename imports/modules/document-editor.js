/* eslint-disable no-undef */
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { upsertDocument } from '../api/documents/methods.js';
import './validation.js';
import features from './features.js';
import validate from './uploadValidation';

let component;

const handleUpsert = () => {
  const { doc } = component.props;

  const confirmation = doc && doc._id ? 'Document updated!' : 'Document added!';
  const upsert = {
    date: new Date(),
    title: document.querySelector('[name="title"]').value.trim(),
    body: document.querySelector('[name="body"]').value.trim(),
    author: Meteor.userId(),
    authorName: `${Meteor.user().profile.name.first} ${Meteor.user().profile.name.last}`,
    isPublic: document.querySelector('[value=isPublic]').checked,
    featureCompletion: 0.0,
    featureData: '{}',
  };

  const selectedCheckboxes = new Set();
  for (let i = 0; i < features.features.length; i += 1) {
    for (let j = 0; j < features.features[i].length; j += 1) {
      const f = document.querySelector(`[value=${features.features[i][j].split(' - ')[0]}]`).checked;
      if (f === true) {
        selectedCheckboxes.add(document.querySelector(`[value=${features.features[i][j].split(' - ')[0]}]`).value);
      }
    }
  }
  if (document.querySelector('[value=all]').checked === true) {
    selectedCheckboxes.add('all');
  }

  let featureStr = '';
  selectedCheckboxes.forEach((item) => {
    featureStr += `${item} `;
  });
  featureStr = featureStr.substring(0, featureStr.length - 1);

  let thirdArg;
  if (document.querySelector('[value=maxRadio]').checked === true) {
    thirdArg = `n_max=${document.querySelector('[name=maxInput]').value}`;
  } else {
    thirdArg = `n_exact=${document.querySelector('[name=exactInput]').value.split(' ').join('.')}`; // '2 5 3' -> 2.5.3
  }

  const paragraphOptions = {
    numEmptyLines: {
      checked: document.querySelector('[id=emptyLines]').checked,
      value: document.querySelector('[name=emptyLinesInput]').value,
    },
    specCharSeq: {
      checked: document.querySelector('[id=charSeq]').checked,
      value: document.querySelector('[name=charSeqInput]').value,
    },
  };

  if (doc && doc._id) upsert._id = doc._id;
  upsertDocument.call(upsert, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      component.documentEditorForm.reset();
      Bert.alert(confirmation, 'success');
      component.props.history.push(`/documents/${response.insertedId || doc._id}`);

      Meteor.call('runJava', response.insertedId || doc._id, upsert.body, featureStr, thirdArg, paragraphOptions);
    }
  });
};

export default function documentEditor(options) {
  ({ component } = options);
  validate(component, handleUpsert);
}
