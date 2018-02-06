import React from 'react';
import PropTypes from 'prop-types';
import DocumentEditor from '../components/DocumentEditor';
import NotFound from './NotFound';

const EditDocument = ({ doc }) => {
  return doc ? (
    <div className="EditDocument">
      <h4 className="page-header">Editing "{ doc.title }"</h4>
      <DocumentEditor doc={ doc }/>
    </div>
  ) : <NotFound />;
};

EditDocument.propTypes = {
  doc: PropTypes.object,
};

export default EditDocument;
