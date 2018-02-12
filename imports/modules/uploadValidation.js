/* eslint-disable no-undef */
import './validation.js';

function isInt(s) {
  return /^\+?[1-9][\d]*$/.test(s);
}

const validate = (component, cb) => {
  // do not change functions to arrow functions as the "this" context will get lost
  jQuery.validator.addMethod(
    'isInt', function (value, element) {
      return this.optional(element) || isInt(value);
    }
    , 'Must be a positive integer',
  );

  jQuery.validator.addMethod('isArrayOfInts', function (value, element) {
    const arr = value.split(' ');
    let b = true;
    for (let i = 0; i < arr.length; i += 1) {
      b = b && isInt(arr[i]);
      if (arr[i] < 2 || arr[i] > 5) {
        b = false;
      }
    }
    return this.optional(element) || b;
  }, "Must be one ore more integer between 2 and 5. (eg. '2 3 4')");

  jQuery.validator.addMethod('isNotEmpty', function (value, element) {
    return this.optional(element) || (value.trim() !== '' && value !== null && value !== undefined);
  }, "Can't be empty or only space");

  $(component.documentEditorForm).validate({
    rules: {
      title: {
        required: true,
      },
      body: {
        required: true,
      },
      maxInput: {
        required: '#maxRadio:checked',
        isInt: true,
        range: [2, 5],
      },
      exactInput: {
        required: '#exactRadio:checked',
        isArrayOfInts: true,
      },
      emptyLinesInput: {
        required: '#emptyLines:checked',
        isInt: true,
      },
      charSeqInput: {
        required: '#charSeq:checked',
        isNotEmpty: true,
      },
    },
    messages: {
      title: {
        required: 'A title is needed in here.',
      },
      body: {
        required: 'This needs some text.',
      },
      maxInput: {
        required: 'If you want to use max, please enter a number between 2 and 5',
      },
      exactInput: {
        required: 'If you want to use exact, please enter numbers between 2 and 5',
      },
    },
    submitHandler() { cb(); },
  });
};

export default validate;
