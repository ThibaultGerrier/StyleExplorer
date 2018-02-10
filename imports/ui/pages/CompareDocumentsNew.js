/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Glyphicon, Popover, OverlayTrigger, Panel } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { SliderPicker } from 'react-color';

import { features, types } from '../../modules/featuresClean';
import Chart from '../../modules/chartsObj';

const getFeatureName = id => features[id].nameEn;
const getFeatureDimension = id => features[id].dimensions;
const getFeatureType = id => features[id].type;
const hasNumber = str => /\d/.test(str);
const getTrailingNums = str => str.replace(/^\D+/g, '');
const removeNonAlphabetic = str => str.replace(/[^A-Za-z]/g, '');
const cleanFeatureName = id => removeNonAlphabetic(id);


const updateToFirstPlace = (arr, e) => {
  if (e.length === 0) {
    return arr.sort();
  }
  const r = e.slice();
  arr.sort().forEach((j) => {
    if (!e.includes(j)) {
      r.push(j);
    }
  });
  return r;
};

export default class CompareDocumentsNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      featuresList: [],
      distinctFeatures: {},
      documents: [],
      bigIds: [],
      colors: {},
      glyphTypes: {},
      intervalId: 0,
    };
    this.defaultColors = ['#40bf45', '#4069bf', '#bf4042', '#b840bf', '#24194d', '#bf8d40', '#d279bc'];
    this.curColor = -1; // first call makes +=1 before getting index
  }

  componentWillMount() {
    const { documents } = this.props;
    const featureList = [];
    const distinctFeatures = types;
    Object.keys(distinctFeatures).forEach((key) => {
      distinctFeatures[key].features = [];
      distinctFeatures[key].collapsed = localStorage.getItem(`panel-collapsed-${key}`) === 'true';
      distinctFeatures[key].glyph = distinctFeatures[key].collapsed ? 'chevron-down' : 'chevron-up';
    });
    const colors = {};
    const glyphTypes = {};
    documents.forEach((doc) => {
      colors[doc._id] = {
        color: this.nextColor(),
      };
      glyphTypes[doc._id] = 'chevron-down';
      const jsonObj = JSON.parse(doc.featureData);
      Object.keys(jsonObj).forEach((ele) => {
        const feature = ele.toString();
        if (featureList.indexOf(feature) === -1) {
          featureList.push(ele);
          const featureId = cleanFeatureName(ele);
          if (!distinctFeatures[getFeatureType(featureId)].features.includes(ele)) {
            distinctFeatures[getFeatureType(featureId)].features.push(ele);
          }
        }
      });
    });
    Object.keys(distinctFeatures).forEach((key) => {
      distinctFeatures[key].features.sort();
    });
    this.setState({ colors });
    this.setState({ glyphTypes });
    this.setState({ featuresList: featureList.sort() });
    this.setState({ documents });
    this.setState({ distinctFeatures });
  }

  componentDidMount() {
    this.setCharts();
  }

  setCharts() {
    const charts = [];
    this.state.featuresList.forEach((f) => {
      let id = f;
      let num;
      if (hasNumber(id)) {
        num = getTrailingNums(id);
        id = removeNonAlphabetic(id);
      }
      const data = {};
      this.state.documents.forEach((doc) => {
        const featureData = JSON.parse(doc.featureData)[f];
        data[doc._id] = {
          id: doc._id,
          name: doc.title,
          data: featureData || [],
        };
      });
      // }

      const onZoomClick = (identifier, chart) => {
        let { bigIds } = this.state;
        if (bigIds.includes(identifier)) {
          bigIds = bigIds.filter(item => item !== identifier);
          chart.switchSize();
        } else if (bigIds.length >= 2) {
          Bert.alert('Cannot magnify more than 2 charts', 'danger');
          return;
        } else {
          bigIds.push(identifier);
          chart.switchSize();
          this.scrollToTop();
        }
        this.setState({ bigIds });
        let { featuresList } = this.state;
        featuresList = updateToFirstPlace(featuresList, bigIds);
        this.setState({ featuresList });
        chart.create();
      };

      const config = {
        htmlId: `chart_${f}`,
        title: (num ? `${getFeatureName(id)} with n = ${num}` : getFeatureName(id)),
        dimension: getFeatureDimension(id),
        onZoomClick,
        data,
        colors: this.state.colors,
      };

      const chart = new Chart(config);
      if (getFeatureDimension(id) === '1') {
        // chart.lineChart();
        chart.boxplot();
      } else {
        chart.columnChart();
      }
      chart.create();
      charts.push(chart);
    });
    this.setState({ charts });
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - 50);
  }

  scrollToTop() {
    const intervalId = setInterval(this.scrollStep.bind(this), 16.66);
    this.setState({ intervalId });
  }

  componentDidUpdate() {
    // console.log(this.state.charts);
    this.state.charts.forEach((chart) => {
      chart.chart.reflow();
      chart.chart.redraw();
    });
  }

  changeColor(docId, color) {
    const colorState = this.state.colors;
    colorState[docId].color = color.hex;
    this.setState({ colors: colorState });
    this.state.charts.forEach((chart) => {
      chart.setColor(docId, color.hex);
    });
  }

  changeGlyph(id) {
    const { glyphTypes } = this.state;
    glyphTypes[id] = glyphTypes[id] === 'chevron-down' ? 'chevron-up' : 'chevron-down';
    this.setState({ glyphTypes });
  }

  changePanel(id) {
    const { distinctFeatures } = this.state;
    distinctFeatures[id].glyph = distinctFeatures[id].glyph === 'chevron-down' ? 'chevron-up' : 'chevron-down';
    distinctFeatures[id].collapsed = !distinctFeatures[id].collapsed;
    localStorage.setItem(`panel-collapsed-${id}`, distinctFeatures[id].collapsed.toString());
    this.setState({ distinctFeatures });
  }

  nextColor() {
    this.curColor += 1;
    return this.defaultColors[this.curColor];
  }

  render() {
    // console.log('render');
    const bigColSize = this.state.bigIds.length === 1 ? 12 : 6;
    const titleColSize = this.state.documents.length > 4 ? 2 : 3;

    const popOver = id => (
        <Popover id="popover-positioned-bottom" title="Choose a color for this document">
          <SliderPicker
            color={this.state.colors[id].color}
            onChangeComplete={ (col) => {
              this.changeColor(id, col);
            }}
          />
        </Popover>);

    return (
      <div>
        <Row>
          {this.state.documents.map(doc => (
            <Col xs={6} sm={4} md={titleColSize} lg={titleColSize} key={`docTitle_${doc._id}`}>
              <Row>
                <Col xs={10} sm={10} md={10} lg={10}>
                  <h3 style={{ display: 'inline-block' }}>{doc.title}</h3>
                </Col>
                <OverlayTrigger trigger="click" placement="bottom" overlay={popOver(doc._id)}>
                  <Glyphicon glyph={this.state.glyphTypes[doc._id]} onClick={() => { this.changeGlyph(doc._id); }}
                    style={{
                    fontSize: '1.2em', color: this.state.colors[doc._id].color, marginTop: '25px', cursor: 'pointer',
                  }}/>
                </OverlayTrigger>
              </Row>
            </Col>
           ))}
        </Row>
        <br/>

         {this.state.bigIds.map((f, i) => (
           <div key={`col_chart_${f}`}>
             <Col xs={12} sm={bigColSize} md={bigColSize} lg={bigColSize}>
               <div id={`chart_${f}`}/>
             </Col>
             {i === this.state.bigIds.length - 1 && <div> &nbsp; <hr/> </div>}
           </div>
         ))}

         {Object.entries(this.state.distinctFeatures).map(([k, v]) => {
           if (v.features.length === 0) {
             return null;
           }
           return (
             <Panel id="collapsible-panel-example-2" key={`panel_${k}`} defaultExpanded={!this.state.distinctFeatures[k].collapsed}
               style={{ border: 'none' }}>
               <Panel.Heading style={{ backgroundColor: 'white', border: 'none' }}>
                 <Panel.Title toggle onClick={() => { this.changePanel(k); }}>
                   <h3 style={{ display: 'inline-block' }}>{v.titleEn}</h3>
                   <Glyphicon glyph={this.state.distinctFeatures[k].glyph}
                      style={{
                        fontSize: '1.2em', cursor: 'pointer', marginLeft: '10px',
                      }}/>
                 </Panel.Title>
               </Panel.Heading>
               <Panel.Collapse>
                 <Panel.Body style={{ padding: '5px' }}>
                   {v.features.map((f) => {
                     if (this.state.bigIds.includes(f)) {
                       return null;
                     }
                     return (
                       <div key={`col_chart_${f}`}>
                         <Col xs={6} sm={4} md={3} lg={3}>
                           <div id={`chart_${f}`}/>
                         </Col>
                       </div>
                     );
                   })}
                 </Panel.Body>
               </Panel.Collapse>
             </Panel>
           );
         })}
      </div>
    );
  }
}

CompareDocumentsNew.propTypes = {
  documents: PropTypes.array,
};
