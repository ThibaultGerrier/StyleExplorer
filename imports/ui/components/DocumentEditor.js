/* eslint-disable max-len, no-return-assign */

import React from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Row, Col, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { _ } from 'meteor/underscore';
import documentEditor from '../../modules/document-editor.js';
import Features from './Features';

export default class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    documentEditor({ component: this });
    setTimeout(() => {
      document.querySelector('[name="title"]').focus();
    }, 0);
  }

  onDrop(acceptedFiles, rejectedFiles) {
    if (rejectedFiles.length !== 0) {
      alert(`Rejected files: ${rejectedFiles.map(ele => (ele.name))}`);
    }

    _.each(acceptedFiles, (file) => {
      document.querySelector('[name="title"]').value = file.name;
      const read = new FileReader();
      // read.readAsBinaryString(file);
      read.readAsText(file);
      read.onloadend = function () {
        document.querySelector('[name="body"]').value = read.result;
      };
    });
  }

  render() {
    const { doc } = this.props;

    return (
      <form
      ref={ form => (this.documentEditorForm = form) }
      onSubmit={ event => event.preventDefault() }
      >
        <Row>
          <Col xs={ 9 } sm={ 9 } md={ 9 } >
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl
                type="text"
                name="title"
                defaultValue={ doc && doc.title }
                placeholder="Please enter a title"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Body</ControlLabel>
              <FormControl
                componentClass="textarea"
                name="body"
                defaultValue={ doc && doc.body }
                placeholder="And some text ..."
                style={{ height: 200 }}
              />
            </FormGroup>
          </Col>
          <Col xs={ 3 } sm={ 3 } md={ 3 } >
            <Dropzone onDrop={this.onDrop} multiple={false} accept={'text/plain'} style={{
             borderWidth: '2px', borderColor: 'black', borderStyle: 'dashed', borderRadius: '4px', margin: '20px', padding: '20px', width: '200px', transition: 'all 0.5s',
            }}>
              <h4 style={{ textAlign: 'center' }}>Try dropping a text files here, or click to select file to upload.<br/><Glyphicon glyph="upload" style={{ fontSize: '1.5em' }}/></h4>
            </Dropzone>
          </Col>
        </Row>

        <Features featureData={doc && doc.featureData}/>
        <br/><br/>
        <Button type="submit" bsStyle="success">
          { doc && doc._id ? 'Save Changes' : 'Add Document' }
        </Button>
        <br/>
        <br/>
        <br/>
      </form>
    );
  }
}

DocumentEditor.propTypes = {
  doc: PropTypes.object,
};

