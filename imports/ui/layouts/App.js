/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import getTrackerLoader from '../../modules/trackerLoader';
import Public from '../pages/Public';
import Authenticated from '../pages/Authenticated';
import AppNavigation from '../components/AppNavigation';
import Index from '../pages/Index';
import Documents from '../pages/Documents';
import NewDocument from '../pages/NewDocument';
import EditDocument from '../containers/EditDocument';
import ViewDocument from '../containers/ViewDocument';
import Login from '../pages/Login';
import RecoverPassword from '../pages/RecoverPassword';
import ResetPassword from '../pages/ResetPassword';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import NewMultipleDocuments from '../pages/NewMultipleDocuments';
import PublicDocuments from '../pages/PublicDocuments';
import CompareDocuments from '../containers/CompareDocuments';
import About from '../pages/About';

const App = appProps => (
  <Router>
    <div className="App">
      <AppNavigation {...appProps} />
      <Grid>
        <Switch>
          <Route exact name="index" path="/" component={Index}/>
          <Authenticated exact path="/documents" component={Documents} {...appProps} />
          <Authenticated exact path="/documents/new" component={NewDocument} {...appProps} />
          <Authenticated exact path="/documents/new-multiple" component={NewMultipleDocuments} {...appProps} />
          <Authenticated exact path="/documents/:_id" component={ViewDocument} {...appProps} />
          <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...appProps} />
          <Authenticated exact path="/compare/:_ids/" component={CompareDocuments} {...appProps} />
          <Authenticated exact path="/public" component={PublicDocuments} {...appProps} />
          <Public path="/signup" component={Signup} {...appProps} />
          <Public path="/login" component={Login} {...appProps} />
          <Public path="/about" component={About} {...appProps} />
          <Route name="recover-password" path="/recover-password" component={RecoverPassword}/>
          <Route name="reset-password" path="/reset-password/:token" component={ResetPassword}/>
          <Route component={NotFound}/>
        </Switch>
      </Grid>
    </div>
  </Router>
);

App.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
};

const composer = (props, onData) => {
  const loggingIn = Meteor.loggingIn();
  onData(null, {
    loggingIn,
    authenticated: !loggingIn && !!Meteor.userId(),
  });
};

export default compose(getTrackerLoader(composer))(App);
