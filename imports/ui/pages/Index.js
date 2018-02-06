import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';


const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>Writing Styles</h2>
      <p>Welcome to Writing Styles, a tool where you can visualize your texts</p>
      <p style={ { fontSize: '16px', color: '#aaa' } }>Currently at v0.0.1</p>
    </Jumbotron>
  </div>
);

export default Index;
