import React from 'react';
import { Jumbotron } from 'react-bootstrap';

const Index = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>StyleExplorer</h2>
      <p>Welcome to StyleExplorer, a tool where you can visualize your texts</p>
      <p style={ { fontSize: '16px', color: '#aaa' } }>Currently at v0.0.1</p>		
    </Jumbotron>
    <div className="text-center" style={{marginTop:'50px'}}>      
      <p>powered by</p>
      <div><a target="_blank" href="https://dbis-informatik.uibk.ac.at"><img src='dbis-logo.png' height="100"/></a></div>
      <div><a target="_blank" href="https://www.uibk.ac.at"><img src='uibk-logo.png' height="100"/></a></div>
    </div>
  </div>
);

export default Index;
