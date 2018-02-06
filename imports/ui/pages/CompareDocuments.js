/* eslint-disable max-len */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Col , Row, Button, Glyphicon } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import update from 'react-addons-update';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import NotFound from './NotFound';
import features from '../../modules/features';
import Loading from "../components/Loading";


const SortableItem = SortableElement((props) => (
    <div>
      <Row className='topDivider'>
        <Col xs={2} sm={2}  md={2} className='text-center'>
          <Button className="glyphicon glyphicon-remove pull-left" aria-hidden="true" onClick={() => props.remove(props.feature)} style={{border: '0px solid transparent', fontSize: '1.2em',
            color: 'grey', marginRight: '5px', marginTop: '7px', cursor: 'pointer', backgroundColor: 'transparent', outline: 'none', boxShadow: 'none'}}/>
          <h5>
            {props.getPrettyVersion(props.feature)}
          </h5>
        </Col>
        {props.docs.map((doc, index) => (
          <Col xs={props.col} sm={props.col}  md={props.col} className='leftDivider text-center' key={'item' + index} >
            {props.getFeatureData(doc,props.feature)}
          </Col>
        ))}
      </Row>
    </div>
  )
);


const SortableList = SortableContainer((props) => {
  return(
    <div>
      {props.items.map((feature, index) => (
        <SortableItem key={`item-${index}`}
                      index={index}
                      feature={feature}
                      docs={props.docs}
                      col={props.col}
                      getPrettyVersion={props.getPrettyVersion.bind(this)}
                      getFeatureData={props.getFeatureData.bind(this)}
                      remove={props.remove.bind(this)}
        />
      ))}
    </div>
  )
});



export default class CompareDocuments extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    whichFeaturesList: [],
    computeFeatureList: [],
    docs: [],
    deletedAll: false,
    computedAll:false,
  };

  allFeatures = [];

  componentDidMount() {
    let documents = this.props.documents;
    let featureList = [];
    let docIds = [];
    documents.map((doc) => {
      let jsonObj = JSON.parse(doc.featureData);
      Object.keys(jsonObj).map((ele) => {
        let feature = ele.toString();
        if(featureList.indexOf(feature) === -1) {
          featureList.push(ele);
        }
      });
      docIds.push(doc);
    });
    this.setState({whichFeaturesList: featureList.sort()});
    this.setState({docs: docIds});

    let computeFeatureList = [];
    documents.map((doc) => {
      let jsonObj = JSON.parse(doc.featureData);
      featureList.map((feature) => {
        if(jsonObj[feature] == null){
          computeFeatureList.push([doc._id, feature, false]);
        }
      })
    });
    this.setState({computeFeatureList: computeFeatureList});

    Object.keys(features.features).map((ele) => (
      Object.keys(features.features[ele]).map((inner) => (
          this.allFeatures.push(features.features[ele][inner])
        )
      )
    ));
  }

  getKey = (id, tag) => {
    return tag + id;
  };

  getPrettyVersion(ele){
    let arr = this.allFeatures;
    let regex = /\d/g;
    let n = '';
    if(regex.test(ele)){
      n = `, with n=${ele.substring(ele.length-1, ele.length)}`;
    }
    ele = ele.substring(0,ele.length-1);
    for(let i=0;i<arr.length;i++){
      if(arr[i].includes(ele)){
        return arr[i].split(' - ')[1] + n;
      }
    }
  }

  remove (ele){
    if (this.state.whichFeaturesList.length <= 1){
      Bert.alert('Sorry won\'t remove, if there is only one left', 'danger');
      return;
    }
    let index = 0;
    for(let i=0; i<this.state.whichFeaturesList.length; i++){
      if(this.state.whichFeaturesList[i] === ele){
        index = i;
      }
    }
    this.setState({
      whichFeaturesList: update(this.state.whichFeaturesList, {$splice: [[index, 1]]})
    });
    Bert.alert('Removed: '+ this.getPrettyVersion(ele), 'success');
  }

  getFeatureData(doc, ele){
    let jsonObj = JSON.parse(doc.featureData);
    //console.log(this.state.computeFeatureList[doc._id, ele]);

    let index = -1;
    for(let i=0; i<this.state.computeFeatureList.length; i++){
      if(this.state.computeFeatureList[i][0]===doc._id && this.state.computeFeatureList[i][1]===ele){
        index = i;
        break;
      }
    }

    if(jsonObj[ele] != null){
      return(<h5>{jsonObj[ele].toString().substring(0,10)}</h5>)
    } else {
      return(
        <div>
          {!this.state.computeFeatureList[index][2] ?
            <Button onClick={() => this.compute(doc, ele) } style={{marginTop: '7px', marginBottom: '7px'}}>
              Compute
            </Button>
            : <Loading/>
          }
        </div>
      )
    }
  }

  removeAllNotComputed(){
    let documents = this.props.documents;
    let notComputedList = [];
    documents.map((doc) => {
      let jsonObj = JSON.parse(doc.featureData);
      this.state.whichFeaturesList.map((feature) => {
        if(jsonObj[feature]==null){
          notComputedList.push([doc.title, feature]);
        }
      })
    });

    let whichFeaturesListOld = this.state.whichFeaturesList;
    notComputedList.map((ele) => {
      for(let i=0; i<this.state.whichFeaturesList.length; i++){
        if(this.state.whichFeaturesList[i] === ele[1]){
          whichFeaturesListOld.splice(i, 1);
          break;
        }
      }
    });
    this.setState({whichFeaturesList: whichFeaturesListOld});
    this.setState({deletedAll:true, computedAll:true})
  }

  computeAllNotComputed(){
    let oldStateFeatureList = this.state.computeFeatureList;
    for(let i=0; i<oldStateFeatureList.length; i++){
      oldStateFeatureList[i][2]=true;
    }
    this.setState({computeFeatureList: oldStateFeatureList});


    let documents = this.props.documents;

    documents.map((doc) => {
      let notComputedList = [];
      let jsonObj = JSON.parse(doc.featureData);
      this.state.whichFeaturesList.map((feature) => {
        if(jsonObj[feature]==null){
          notComputedList.push(feature);
        }
      });

      let featureStr = '';
      for (let item of notComputedList){
        featureStr += item + ' ';
      }
      featureStr = featureStr.substring(0, featureStr.length - 1);
      console.log(featureStr);

      Meteor.call('runJava', doc._id, doc.body, featureStr, 'n_max=3');
      Bert.alert('Computing the missing features, this may take some time...', 'success');
    });

    this.setState({deletedAll:true, computedAll:true})
  }

  compute(doc, feature){

    let index = -1;
    for(let i=0; i<this.state.computeFeatureList.length; i++){
      if(this.state.computeFeatureList[i][0]===doc._id && this.state.computeFeatureList[i][1]===feature){
        index = i;
        break;
      }
    }
    let oldStateFeatureList = this.state.computeFeatureList;
    oldStateFeatureList[index][2]=true;
    this.setState({computeFeatureList: oldStateFeatureList});

    let regex = /\d/g;
    let n;
    let thirdArg;
    if(regex.test(feature)){
      n = feature.substring(feature.length-1, feature.length);
      thirdArg = 'n_exact=' + n;
    }else{
      thirdArg = 'n_exact=2'
    }
    Meteor.call('runJava', doc._id, doc.body, feature, thirdArg);
    Bert.alert('Computing: '+ this.getPrettyVersion(feature) + ' for ' + doc.title, 'success');
  }

  removeDoc(docId){
    let docs = this.state.docs;
    if(docs.length<=1){
      Bert.alert('Sorry won\'t remove, if there is only one left', 'danger');
      return;
    }
    for (let i=0; i< docs.length; i++){
      if(docs[i]._id === docId){
        docs.splice(i, 1);
        this.setState({docs: docs});
        break;
      }
    }
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let {whichFeaturesList} = this.state;
    this.setState({
      whichFeaturesList: arrayMove(whichFeaturesList, oldIndex, newIndex),
    });
  };

  render() {
    //basically i have the docs in the state and the props, when removing i only remove in the state,
    //when in compute something, only the props will get the update, so i have to "synchronize" the 2 every
    //time there is a change
    let documentsfromState = this.state.docs;
    let documentsfromProps = this.props.documents;
    let documents = [];

    if(documentsfromProps!=null && documentsfromState!=null){
      for(let i=0; i<documentsfromState.length; i++){
        for(let j=0; j<documentsfromProps.length; j++){
          if(documentsfromState[i]._id===documentsfromProps[j]._id){
            documents.push(documentsfromProps[i]);
          }
        }
      }
    }

    //documents = this.state.docs;
    //console.log(this.state.docs);

    let size = documents.length;
    //if(size < 2 || size > 6){
    //  alert('too many / too few documents');
    //  browserHistory.push('/');
    //}
    const col = Math.floor(10 / size);
    let index=0;
    let index2=0;

    return documents ? (
      <div>
        {(!this.state.deletedAll && this.state.computeFeatureList.length !=0) &&
        <div>
          <Button onClick={() => this.removeAllNotComputed()}> remove all non-computed features </Button>
          <br/>
          <br/>
          <Button onClick={() => this.computeAllNotComputed()}> compute all non-computed feaures </Button>
          <br/><br/>
        </div>
        }

        {size <=5 &&
        <Row>
          <Col xs={2} sm={2}  md={2} lg={2} className='text-center'>
            <h3>Features</h3>
          </Col>
          {documents.map((doc) => (
            <Col xs={col} sm={col}  md={col} lg={col} className='leftDivider text-center' key={this.getKey(index++, 'h1')}>
              <h3 style={{display: 'inline-block'}}>{doc.title}</h3>
              <Glyphicon glyph='remove pull-right' onClick={() => this.removeDoc(doc._id)}
                         style={{fontSize: '1.2em', color: 'grey', marginRight: '9px', marginTop: '25px', cursor: 'pointer'}}/>
            </Col>
          ))}
        </Row>
        }

        <SortableList items={this.state.whichFeaturesList}
                      onSortEnd={this.onSortEnd}
                      docs={documents}
                      col={col}
                      computeList={this.state.computeFeatureList}
                      getPrettyVersion={this.getPrettyVersion.bind(this)}
                      getFeatureData={this.getFeatureData.bind(this)}
                      remove={this.remove.bind(this)}
        />
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    ) : <NotFound />;
  }
}

CompareDocuments.propTypes = {
  doc: PropTypes.object,
};

//export default ViewDocument;
