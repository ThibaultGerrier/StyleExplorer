/* eslint-disable max-len, no-return-assign */

import React from 'react';
import { ListGroup, Button, Glyphicon,ListGroupItem, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import {_} from 'meteor/underscore';
import update from 'react-addons-update';
import { Bert } from 'meteor/themeteorchef:bert';
import uploadMultiple from '../../modules/uploadMultiple.js';
import Features from "./Features";

export default class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
  };

  componentDidMount() {
    uploadMultiple({ component: this });
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if(rejectedFiles.length != 0) {
      alert('Rejected files: ' + rejectedFiles.map(ele=>(ele.name)));
    }
    let fileTitleArr =[];
    _.each(acceptedFiles,(file) => {
      fileTitleArr.push(file.name);
      let read = new FileReader();
      //read.readAsBinaryString(file);
      read.readAsText(file);
      read.onloadend = () => {
        //let to = read.result.length< 300 ? read.result.length : 300;
        this.setState(({list}) => ({ list: list.concat([[file.name, read.result]])}));
      };
    });
    Bert.alert('Added file(s): '+ fileTitleArr, 'success');
  };

  remove (eleTitle){
    let index = 0;
    for(let i=0; i<this.state.list.length; i++){
      if(this.state.list[i][0] === eleTitle){
        index = i;
      }
    }
    //console.log(index);
    this.setState({
      list: update(this.state.list, {$splice: [[index, 1]]})
    });
    Bert.alert('Removed file'+eleTitle[0], 'success');
  }

  render() {
    const { doc } = this.props;
    let index=0;
    return (
      <form
        ref={ form => (this.documentEditorForm = form) }
        onSubmit={ event => event.preventDefault() }
      >

        <Dropzone onDrop={this.onDrop} multiple={true} accept={'text/plain'} style={{borderWidth: "2px", borderColor: "black", borderStyle: "dashed", borderRadius: "4px", margin: "20px", padding: "20px", width: "100%", transition: "all 0.5s"}}>
          <h4 style={{ textAlign: "center"}}>Try dropping a text files here, or click to select file to upload.<br/><Glyphicon glyph="upload" style={{fontSize: "1.5em"}}/></h4>
        </Dropzone>

        <h4>Currently added Documents:</h4>
        <ListGroup>
          {this.state.list.length != 0 ?
            this.state.list.map((ele) => (
              <ListGroupItem header={ele[0]} key={index++}>
                <Row>
                  <Col xs={11} sm={11}  md={11} >
                    {ele[1].length< 300 ?
                      ele[1].substring(0,ele[1].length)
                      :ele[1].substring(0,300) + ' ...'}
                  </Col>
                  <Glyphicon glyph="remove pull-right" style={{color: "grey", marginRight:"30px", fontSize: '1.5em',}} onClick={() => this.remove(ele[0])} />
                </Row>
              </ListGroupItem>)
            )
            : 'Currently no documents uploaded'}
        </ListGroup>


        <Features/>
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
