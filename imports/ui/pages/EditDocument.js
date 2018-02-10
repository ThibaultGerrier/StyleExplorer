import React from 'react';
import PropTypes from 'prop-types';
import DocumentEditor from '../components/DocumentEditor';
import NotFound from './NotFound';

class EditDocument extends React.Component {
  render() {
    const { doc } = this.props;
    return doc ? (
      <div className="EditDocument">
        <h4 className="page-header">Editing &quot;{doc.title}&quot;</h4>
        <DocumentEditor {...this.props}/>
      </div>
    ) : <NotFound/>;
  }
}

EditDocument.propTypes = {
  doc: PropTypes.object,
};

export default EditDocument;
