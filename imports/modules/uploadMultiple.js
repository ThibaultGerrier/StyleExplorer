import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import {_} from 'meteor/underscore';
import { upsertDocument } from '../api/documents/methods.js';
import './validation.js';
import features from './features.js';


let component;

const handleUpsert = () => {
  //console.log(component);
  _.each(component.state.list, (ele) =>{
    //console.log(ele);

    const upsert = {
      date: new Date,
      title: ele[0].toString().trim(),
      body: ele[1].toString().trim(),
      author: Meteor.userId(),
      authorName: Meteor.user().profile.name.first + ' ' +  Meteor.user().profile.name.last,
      isPublic: document.querySelector('[value=isPublic]').checked,
      featureCompletion: 0.0,
      featureData: '{}',
    };

    let selectedCheckboxes = new Set();
    for(let i = 0; i < features.features.length; i++){
      for(let j = 0; j < features.features[i].length; j++){
        let f = document.querySelector(`[value=${features.features[i][j].split(' - ')[0]}]`).checked;
        if(f === true){
          selectedCheckboxes.add(document.querySelector(`[value=${features.features[i][j].split(' - ')[0]}]`).value);
        }
      }
    }
    if(document.querySelector('[value=all]').checked === true){
      selectedCheckboxes.add('all');
    }

    let featureStr = '';
    for (let item of selectedCheckboxes){
      featureStr += item + ' ';
    }
    featureStr = featureStr.substring(0, featureStr.length - 1);

    let thirdArg;
    if(document.querySelector('[value=maxRadio]').checked === true){
      thirdArg = 'n_max=' + document.querySelector('[name=maxInput]').value;
    } else {
      thirdArg = 'n_exact=' + document.querySelector('[name=exactInput]').value.split(' ').join('.');
    }

    upsertDocument.call(upsert, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        //component.documentEditorForm.reset();
        //Bert.alert('Document(s) successfully uploaded', 'success');
        //browserHistory.push('/documents');
        Meteor.call('runJava', response.insertedId , upsert.body, featureStr, thirdArg);
      }
    });
  });

  Bert.alert('Document(s) successfully uploaded', 'success');
  browserHistory.push('/documents');
};

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

const validate = () => {
  jQuery.validator.addMethod("isIntValidate", function(value, element) {
    return this.optional(element) || isInt(value);
  }, "Must be one integer between 2 and 5. (eg. '2 3 4')");

  jQuery.validator.addMethod("isArrayOfInts", function(value, element) {
    let arr = value.split(' ');
    let  b = true;
    for(let i=0; i<arr.length; i++){
      b = b && isInt(arr[i]);
      if(arr[i]<2 || arr[i]>5){
        b=false;
      }
    }
    return this.optional(element) || b;
  }, "Must be one or more integer between 2 and 5. (eg. '2 3 4')");

  $(component.documentEditorForm).validate({
    rules: {
      maxInput: {
        required: "#maxRadio:checked",
        isIntValidate: true,
        range: [2, 5]
      },
      exactInput: {
        required: "#exactRadio:checked",
        isArrayOfInts: true,
      },
    },
    messages: {
      maxInput: {
        required: 'If you want to use max please enter a number between 2 and 5'
      },
      exactInput: {
        required: 'If you want to use exact please enter numbers between 2 and 5'
      }
    },
    submitHandler() { handleUpsert(); },
  });
};


export default function uploadMultiple(data){
  component = data.component;
  validate();
}
