import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';

import { features } from '../../modules/featuresClean';
import { createChart } from '../../modules/charts';

const getFeatureName = id => features[id].nameEn;
const getFeatureDimension = id => features[id].dimensions;
const hasNumber = str => /\d/.test(str);
const getTrailingNums = str => str.replace(/^\D+/g, '');
const removeNonAlphabetic = str => str.replace(/[^A-Za-z]/g, '');

const updateToFirstPlace = (arr, e) => {
  if (e.length === 0) {
    return arr.sort();
  }
  const r = e.slice();
  for (const j of arr.sort()) {
    if (!e.includes(j)) {
      r.push(j);
    }
  }
  return r;
};

export default class CompareDocumentsNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featuresList: [],
      documents: [],
      bigIds: [],
    };
  }

  componentWillMount() {
    const documents = this.props.documents;
    const featureList = [];
    documents.forEach((doc) => {
      const jsonObj = JSON.parse(doc.featureData);
      Object.keys(jsonObj).forEach((ele) => {
        const feature = ele.toString();
        if (featureList.indexOf(feature) === -1) {
          featureList.push(ele);
        }
      });
    });
    this.setState({ featuresList: featureList.sort() });
    this.setState({ documents });
  }

  componentDidMount() {
    // this.setChart('chart1');
    this.setCharts();
  }

  setCharts() {
    const charts = [];
    console.log(this.state.featuresList);
    this.state.featuresList.forEach((f) => {
      let id = f;
      let num;
      if (hasNumber(id)) {
        num = getTrailingNums(id);
        id = removeNonAlphabetic(id);
      }
      const data = {};
      if (getFeatureDimension(id) !== '1') {
        console.log('not 1');
      } else {
        this.state.documents.forEach((doc) => {
          const featureData = JSON.parse(doc.featureData)[f];
          data[doc._id] = {
            name: doc.title,
            data: featureData || [],
          };
        });
      }

      const onZoomClick = (identifier) => {
        let bigIds = this.state.bigIds;
        if (bigIds.includes(identifier)) {
          bigIds = bigIds.filter(item => item !== identifier);
        } else if (bigIds.length >= 2) {
          Bert.alert('Cannot magnify more than 2 charts', 'danger');
          return;
        } else {
          bigIds.push(identifier);
        }
        this.setState({ bigIds });
        let featuresList = this.state.featuresList;
        featuresList = updateToFirstPlace(featuresList, bigIds);
        this.setState({ featuresList });
      };

      charts.push(
        createChart(
          `chart_${f}`, // html id
          (num ? `${getFeatureName(id)} with n = ${num}` : getFeatureName(id)), // title
          data, // data
          onZoomClick
        )
      );
    });
    this.setState({ charts });
  }

  componentDidUpdate() {
    console.log('update');
    this.state.charts.forEach((chart) => {
      chart.reflow();
      chart.redraw();
    });
  }

  render() {
    console.log('render');
    const bigColSize = this.state.bigIds.length === 1 ? 12 : 6;
    return (
      <div>
        <h1>Comparison of Documents</h1>
        <Row>
          {this.state.featuresList.map((f, id) => (
            this.state.bigIds.includes(f) ?
            <div key={`col_chart_${f}`}>
              <Col xs={12} sm={bigColSize} md={bigColSize} lg={bigColSize}>
                <div id={`chart_${f}`}/>
              </Col>
              {id === this.state.bigIds.length - 1 && <div> &nbsp; <hr/> </div>}
            </div>
            :
            <div key={`col_chart_${f}`}>
              <Col xs={6} sm={4} md={3} lg={3}>
                <div id={`chart_${f}`}/>
              </Col>
            </div>
            )
          )}
        </Row>
      </div>
    );
  }
}

CompareDocumentsNew.propTypes = {
  documents: PropTypes.array,
};
