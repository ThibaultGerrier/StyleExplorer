/* eslint-disable no-undef */
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { _ } from 'meteor/underscore';
import { upsertDocument } from '../api/documents/methods.js';
import './validation.js';
import features from './features.js';
import validate from './uploadValidation';

let component;

const handleUpsert = () => {
  // console.log(component);
  if (component.state.list.length > 5) {
    Bert.alert('Cannot upload more then 5 documents at once', 'danger');
    return;
  }
  _.each(component.state.list, (ele) => {
    // console.log(ele);

    const upsert = {
      date: new Date(),
      title: ele[0].toString().trim(),
      body: ele[1].toString().trim(),
      author: Meteor.userId(),
      authorName: Meteor.user().username,
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
      thirdArg = `n_exact=${document.querySelector('[name=exactInput]').value.split(' ').join('.')}`;
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

    upsertDocument.call(upsert, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.call('runJava', response.insertedId, upsert.body, featureStr, thirdArg, paragraphOptions);
      }
    });
  });

  Bert.alert('Document(s) successfully uploaded', 'success');
  component.props.history.push('/documents');
};

export default function uploadMultiple(data) {
  ({ component } = data);
  validate(component, handleUpsert);
}
