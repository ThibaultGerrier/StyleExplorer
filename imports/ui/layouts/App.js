import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import AppNavigation from '../containers/AppNavigation.js';

const App = ({ children }) => (
  <div>
    <AppNavigation/>
    <Grid fluid style={{width: '80%'}}>
      { children }
    </Grid>
  </div>
);


App.propTypes = {
  children: PropTypes.node,
};

export default App;
