/* eslint-disable no-undef */

import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import './validation.js';

let component;

const login = () => {
  const username = document.querySelector('[name="username"]').value;
  const password = document.querySelector('[name="password"]').value;

  Meteor.loginWithPassword(username, password, (error) => {
    if (error) {
      Bert.alert(error.reason, 'error');
    } else {
      Bert.alert('Logged in!', 'success');

      const { location } = component.props;
      if (location.state && location.state.nextPathname) {
        component.props.history.push(location.state.nextPathname);
      } else {
        component.props.history.push('/');
      }
    }
  });
};

const validate = () => {
  $(component.loginForm).validate({
    rules: {
      username: {
        required: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      username: {
        required: 'Need a username here.',
      },
      password: {
        required: 'Need a password here.',
      },
    },
    submitHandler() { login(); },
  });
};

export default function handleLogin(options) {
  ({ component } = options);
  validate();
}
