/* eslint-disable max-len */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, FormControl, FormGroup, Form, Button, Glyphicon } from 'react-bootstrap';
import DocumentsList from '../containers/DocumentsList.js';

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  getInitialState() {
    return { showModal: false };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
      {
        Meteor.userId() ?
        <div className="Documents">
          <Col xs={ 12 }>
            <Form inline>
              <div className="page-header clearfix">
                <h4 className="pull-left">My Documents</h4>
                <div className="pull-right">
                  <FormGroup>
                    <FormControl type="text" name="search" value={this.state.searchTerm} onChange={ this.handleChange }
                                 placeholder="Search"/>
                  </FormGroup>
                  {' '}
                  <Link to="/documents/new">
                    <Button bsStyle="success">New Document</Button>
                  </Link>
                  {' '}
                  <Link to="/documents/new-multiple">
                    <Button bsStyle="primary">Multiple New Document</Button>
                  </Link>
                </div>
              </div>
            </Form>
            <DocumentsList {...this.props} searchTerm={this.state.searchTerm}/>
          </Col>
        </div>
        :
        <div>
          <h4> You can create, upload, view and compare your own documents when you are logged in</h4>
          <Button href="/login" bsStyle="success">Login <Glyphicon glyph="new-window"/></Button> &nbsp;
          <Button href="/signup" bsStyle="primary">Signup <Glyphicon glyph="new-window"/></Button>
        </div>
      }
      </div>
    );
  }
}

export default Documents;
