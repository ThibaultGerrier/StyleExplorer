import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert, ProgressBar, Glyphicon, Col, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';

const handleNav = (_id) => {
  browserHistory.push(`/documents/${_id}`);
};

export default class DocumentsList extends React.Component{
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
  };

  componentDidMount() {
    let documents = this.props.documents;
    documents.map((doc) => {
      this.setState(({list}) => ({list: list.concat([[doc._id, false]])}));
    });
  }

  toggle(_id){
    let index;
    for(let i=0; i<this.state.list.length; i++){
      if(_id === this.state.list[i][0]){
        index=i;
        break;
      }
    }
    let q = this.state.list;
    q[index][1] = !q[index][1];
    this.setState({list : q });
  }

  compare(){
    let selectedDocs = [];
    this.state.list.map((ele) => {
      if(ele[1]===true){
        selectedDocs.push(ele[0]);
      }
    });
    if(selectedDocs.length < 2){
      Bert.alert('Please select at least 2 documents', 'danger');
    } else if (selectedDocs.length > 10){
      Bert.alert('Please don\'t select more than 5 documents', 'danger');
    }
    else{
      browserHistory.push(`/compare/${selectedDocs.join('.')}`);
    }
  }

  render(){
    let documents = this.props.documents;
    return(
      documents.length > 0 ?
        <div>
          <ListGroup className="DocumentsList" >
            {documents.map(({ _id, title, featureData, featureCompletion }, index) => (
            <div key={ _id }>
              <Col xs={11} sm={11}  md={11} >
                {this.state.list[index] != null && this.state.list[index][1] === false ?
                  <ListGroupItem onClick={ () => handleNav(_id) }>
                    { title }
                    {featureData === '{}' && <ProgressBar active now={featureCompletion * 100}
                                                          label={`${Math.floor(featureCompletion * 100)}%`}/>}
                  </ListGroupItem>
                  :
                  <ListGroupItem active onClick={ () => handleNav(_id)}>
                    { title }
                    {featureData === '{}' && <ProgressBar active now={featureCompletion * 100}
                                                          label={`${Math.floor(featureCompletion * 100)}%`}/>}
                  </ListGroupItem>
                }

              </Col>
              {this.state.list[index] != null && this.state.list[index][1] === false ?
                <Glyphicon glyph="ok pull-right" onClick={() => this.toggle(_id)}
                           style={{fontSize: "1.5em", color: 'grey', marginRight: "30px", cursor: 'pointer'}}/>
                : <Glyphicon glyph="ok pull-right" onClick={() => this.toggle(_id)}
                             style={{fontSize: "1.5em", color: 'green', marginRight: "30px", cursor: 'pointer'}}/>
              }
            </div>
          ))}
          </ListGroup>
          <Col xs={11} sm={11}  md={11} >
          </Col>
          <Col xs={1} sm={1}  md={1} >
            <Button bsStyle='success' onClick={() => this.compare()}> Compare </Button>
            <br/>
            <br/>
            <br/>
          </Col>
        </div>
        : <Alert bsStyle="warning">No documents yet.</Alert>
    );
  }
}

DocumentsList.propTypes = {
  documents: PropTypes.array,
};
