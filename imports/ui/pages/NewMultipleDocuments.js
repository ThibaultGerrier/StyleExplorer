import React from 'react';
import MultipleDocumentEditor from '../components/MultipleDocumentEditor.js';

const NewMultipleDocument = props => (
  <div className="NewDocuments">
    <h4 className="page-header">New Documents</h4>
    <MultipleDocumentEditor {...props}/>
  </div>
);

export default NewMultipleDocument;

