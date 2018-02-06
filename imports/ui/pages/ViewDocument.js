/* eslint-disable max-len */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, ProgressBar, Collapse, Glyphicon, Row, Col, Panel, Nav } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import fileDownload from 'react-file-download';
import { upsertDocument } from '../../api/documents/methods.js';
import { removeDocument, changePublicity } from '../../api/documents/methods';
import NotFound from './NotFound';

const handleEdit = (_id) => {
  browserHistory.push(`/documents/${_id}/edit`);
};

const handleRemove = (_id) => {
  if (confirm('Are you sure? This is permanent!')) {
    removeDocument.call({ _id }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        browserHistory.push('/documents');
      }
    });
  }
};

const handlePublicity = (_id, toPublic) => {
  changePublicity.call({ _id, toPublic }, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Changed publicity!', 'success');
      browserHistory.push('/documents');
    }
  });
};

const printJson = (str) => {
  let json = JSON.parse(str);
  return JSON.stringify(json, null, 2);
};

const printJsonGrid = (data, options) => {
  if (data.toString().includes('no features were computed'))
    return;

  const collapsible = true;
  const defaultExpanded = false;
  const col = options ? 4 : 12;


  let jsonObj = JSON.parse(data);
  let id = 0;
  return Object.keys(jsonObj).map((ele) =>{
    let id2 = 0;
      return (
        <Col xs={12} sm={6} md={col} key={getKey(id++,'json')}>
          <Panel header={ele.toString()} collapsible={collapsible} defaultExpanded={defaultExpanded} style={{cursor: 'pointer'}}>
            [{Array.isArray(jsonObj[ele]) ?       // one dimensional array
              jsonObj[ele].map((num) => (
                num % 1 != 0 ?
                  num.toFixed(3)
                  :num

              )).join(' ,')
              :                               // 2 dimensions (eg. n-grams)
              Object.keys(jsonObj[ele]).map((elearr) => {
                return(
                  <div key={getKey(id2++,'list')}>
                    <Col xs={12} sm={6} md={6}>
                      {elearr} :
                    </Col>
                    {
                      jsonObj[ele][elearr].map((num) => (
                          num.toFixed(3)
                     )).join(' ,')
                    }
                    <br/>
                  </div>
                )
            })
          }]
          </Panel>
        </Col>
      )
    }
  );
};

const getKey = (id, tag) => {
  return tag + id;
};

const makePrivateCopy = (doc) => {
  console.log(doc);
  const copy = {
    date: new Date,
    title: doc.title + ' by ' + doc.authorName,
    body: doc.body,
    author: Meteor.userId(),
    authorName: Meteor.user().profile.name.first + ' ' +  Meteor.user().profile.name.last,
    isPublic: false,
    featureCompletion: doc.featureCompletion,
    featureData: doc.featureData,
  };
  upsertDocument.call(copy, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('made a private copy', 'success');
    }});
};


export default class ViewDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let doc = this.props.doc;

    if(doc.isPublic===false && doc.author != Meteor.userId()){ // someone trying to access a private document of another user
      alert('nice try');
      browserHistory.push('/');
      return null;
    }

    let makePublicPrivate = null;
    if (doc.isPublic) {
      makePublicPrivate =
        <Button onClick={ () => handlePublicity(doc._id, false) } className="text-success">make private</Button>;
    } else {
      makePublicPrivate =
        <Button onClick={ () => handlePublicity(doc._id, true) } className="text-success">make public</Button>;
    }
    let index = 0;
    let progressbar = <ProgressBar active now={doc.featureCompletion * 100} label={`${Math.floor(doc.featureCompletion * 100)}%`}/>;

    return doc ? (
      <div className="ViewDocument">
        <div className="page-header clearfix">
          <h3 className="pull-left">{ doc && doc.title }</h3>

          {doc.options &&
            <div>
            {doc.author === Meteor.userId() ?
              <ButtonToolbar className="pull-right">
                <ButtonGroup bsSize="small">
                  <Button onClick={ () => handleEdit(doc._id) }>Edit</Button>
                  <Button onClick={ () => handleRemove(doc._id) } className="text-danger">Delete</Button>
                  {makePublicPrivate}
                </ButtonGroup>
              </ButtonToolbar>
              :<div>
                <h4 className="pull-right">
                  Author: {doc.authorName}
                </h4>
                <br/>
                <br/>
                <Button className="pull-right" onClick={() => makePrivateCopy(doc)}>make private copy</Button>
              </div>
            }
            </div>
          }
        </div>

        {doc.options &&
          <div>
            <Button bsSize="large" block onClick={() => this.setState({openText: !this.state.openText})}>Show
              text</Button>
            <Collapse in={this.state.openText}>
              <div >
                <div style={{whiteSpace: "pre-wrap"}}>
                  <br/>
                  {doc.body.split("$par$").map(i => {
                    return <div key={getKey(index++, 'body')}> {i}<br/><br/></div>;
                  })}
                </div>
              </div>
            </Collapse>
            <br/><br/>
            <Row>
              <Col xs={11} sm={11} md={11}>
                <h4>Features</h4>
              </Col>
              <Col xs={1} sm={1} md={1}>
                <Button bsSize="small" bsStyle="primary" className="pull-right" onClick={() => {
                  fileDownload(doc.featureData, doc.title + '.json')
                }}>Download as .json <Glyphicon glyph="download" style={{fontSize: "1.5em"}}/></Button>
              </Col>
            </Row>
            {doc.featureData === '{}' && progressbar}
            <Button bsSize="large" block onClick={() => this.setState({openFeatures: !this.state.openFeatures})}>Show raw results</Button>
            <Collapse in={this.state.openFeatures}>
              <pre id="json">
                {doc.featureData != null ? printJson(doc.featureData) : 'Features are not yet ready.'}
              </pre>
            </Collapse>
            <br/>
          </div>
        }
        <Row>
          {doc.featureData != null &&  printJsonGrid(doc.featureData, doc.options)}
        </Row>
      </div>
    ) : <NotFound />;
  }
}

ViewDocument.propTypes = {
  doc: PropTypes.object,
};

//export default ViewDocument;
