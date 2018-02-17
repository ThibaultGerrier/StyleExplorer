/* eslint-disable no-undef */

import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

let component;

const getUserData = () => ({
  username: document.querySelector('[name="username"]').value,
  password: document.querySelector('[name="password"]').value,
});

const signup = () => {
  const user = getUserData();

  Accounts.createUser(user, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      component.props.history.push('/');
      Bert.alert('Welcome!', 'success');
    }
  });
};

const validate = () => {
  $(component.signupForm).validate({
    rules: {
      username: {
        required: true,
      },
      password: {
        required: true,
        minlength: 3,
      },
    },
    messages: {
      username: {
        required: 'Need a username here.',
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least 3 characters, please.',
      },
    },
    submitHandler() { signup(); },
  });
};

export default function handleSignup(options) {
  ({ component } = options);
  validate();
}
