/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import Public from '../pages/Public';
import Authenticated from '../pages/Authenticated';
import AppNavigation from '../components/AppNavigation';
import Index from '../pages/Index';
import Documents from '../pages/Documents';
import NewDocument from '../pages/NewDocument';
import EditDocument from '../containers/EditDocument';
import ViewDocument from '../containers/ViewDocument';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import NewMultipleDocuments from '../pages/NewMultipleDocuments';
import PublicDocuments from '../pages/PublicDocuments';
import CompareDocuments from '../containers/CompareDocuments';
import About from '../pages/About';
import Documentation from '../pages/Documentation';

class App extends React.Component {
  render() {
    return (
  <Router>
    <div className="App">
      <AppNavigation {...this.props} />
      <Grid>
        <Switch>
          <Route exact name="index" path="/" component={Index}/>
          <Authenticated exact path="/documents" component={Documents} {...this.props} />
          <Authenticated exact path="/documents/new" component={NewDocument} {...this.props} />
          <Authenticated exact path="/documents/new-multiple" component={NewMultipleDocuments} {...this.props} />
          <Authenticated exact path="/documents/:_id" component={ViewDocument} {...this.props} />
          <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...this.props} />
          <Authenticated exact path="/compare/:_ids/" component={CompareDocuments} {...this.props} />
          <Authenticated exact path="/public" component={PublicDocuments} {...this.props} />
          <Public exact path="/signup" component={Signup} {...this.props} />
          <Public exact path="/login" component={Login} {...this.props} />
          <Route exact path="/about" component={About} {...this.props} />
          <Route exact path="/documentation" component={Documentation} {...this.props} />
          <Route component={NotFound}/>
        </Switch>
      </Grid>
    </div>
  </Router>
    );
  }
}

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

export default container(composer, App);
