/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Glyphicon, Popover, OverlayTrigger, Panel, Checkbox } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { SliderPicker } from 'react-color';

import { features, types, nGramFeatures, whiteSpaceFeatures } from '../../modules/featuresClean';
import Chart from '../../modules/chartsObj';

const getFeatureName = id => features[id].nameEn;
const getFeatureDimension = id => features[id].dimensions;
const getFeatureType = id => features[id].type;
const hasNumber = str => /\d/.test(str);
const getTrailingNums = str => str.replace(/^\D+/g, '');
const removeNonAlphabetic = str => str.replace(/[^A-Za-z]/g, '');
const cleanFeatureName = id => removeNonAlphabetic(id);
const isNGramFeature = id => nGramFeatures.includes(id);
const isWhiteSpaceFeature = id => whiteSpaceFeatures.includes(id);

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
      settings: {
        groupNGrams: localStorage.getItem('groupNGrams') === 'true',
      },
      lowestNGram: {},
      maxNGram: {},
    };
    this.defaultColors = ['#40bf45', '#4069bf', '#bf4042', '#b840bf', '#24194d', '#bf8d40', '#d279bc'];
    this.curColor = -1; // first call makes +=1 before getting index
  }

  componentWillMount() {
    this.setupFeatures();
  }

  setupFeatures() {
    const { documents } = this.props;
    const featureList = [];
    const distinctFeatures = types;
    const lowestNGram = {};
    const maxNGram = {};
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
      Object.keys(jsonObj).forEach((id) => {
        let featureId = id;
        if (this.state.settings.groupNGrams) {
          if (hasNumber(featureId)) {
            const num = getTrailingNums(id);
            featureId = removeNonAlphabetic(featureId);
            if (lowestNGram[featureId] !== undefined && num < lowestNGram[featureId]) {
              lowestNGram[featureId] = num;
            } else if (lowestNGram[featureId] === undefined) {
              lowestNGram[featureId] = num;
            }
            if (maxNGram[featureId] !== undefined && num > maxNGram[featureId]) {
              maxNGram[featureId] = num;
            } else if (maxNGram[featureId] === undefined) {
              maxNGram[featureId] = num;
            }
          }
        }
        if (featureList.indexOf(featureId) === -1) {
          featureList.push(featureId);
          const featureType = getFeatureType(cleanFeatureName(featureId));
          if (!distinctFeatures[featureType].features.includes(featureId)) {
            distinctFeatures[featureType].features.push(featureId);
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
    this.setState({ lowestNGram });
    this.setState({ maxNGram });
  }

  componentDidMount() {
    this.setCharts();
  }

  getNGramFeatures(docId, featureId) {
    const nGramData = {};
    this.state.documents.forEach((doc) => {
      if (doc._id === docId) {
        const featureData = JSON.parse(doc.featureData);
        Object.entries(featureData).forEach(([k, v]) => {
          if (k.includes(featureId)) {
            nGramData[getTrailingNums(k)] = v;
          }
        });
      }
    });
    return nGramData;
  }

  setCharts() {
    const charts = [];
    this.state.featuresList.forEach((f) => {
      let featureId = f;
      let usedId = f;
      if (this.state.settings.groupNGrams && isNGramFeature(f)) {
        usedId = f + this.state.lowestNGram[f];
      }
      let num;
      if (hasNumber(featureId)) {
        num = getTrailingNums(featureId);
        featureId = removeNonAlphabetic(featureId);
      }
      const data = {};
      const nGrams = {};
      this.state.documents.forEach((doc) => {
        const featureData = JSON.parse(doc.featureData)[usedId];
        if (this.state.settings.groupNGrams && isNGramFeature(f)) {
          nGrams[doc._id] = {
            id: doc._id,
            name: doc.title,
            data: this.getNGramFeatures(doc._id, f),
          };
        }
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
        chart.resetChart();
      };

      const config = {
        htmlId: `chart_${f}`,
        featureId: usedId,
        title: (num ? `${getFeatureName(featureId)} with n = ${num}` : getFeatureName(featureId)),
        dimension: getFeatureDimension(featureId),
        onZoomClick,
        data,
        nGrams,
        curNGram: this.state.lowestNGram[f],
        maxNGram: this.state.maxNGram[f],
        isGroupedNGram: this.state.settings.groupNGrams,
        colors: this.state.colors,
        withWhiteSpace: isWhiteSpaceFeature(featureId),
      };

      const chart = new Chart(config);
      if (getFeatureDimension(featureId) === '1') {
        chart.lineChart();
        // chart.boxplot();
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
    if (this.needToUpdateCharts) {
      this.setCharts();
      this.needToUpdateCharts = false;
    } else {
      this.state.charts.forEach((chart) => {
        chart.chart.reflow();
        chart.chart.redraw();
      });
    }
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

  switchNGrams() {
    const { settings } = this.state;
    settings.groupNGrams = !this.state.settings.groupNGrams;
    localStorage.setItem('groupNGrams', settings.groupNGrams.toString());
    this.setState({ settings });
    this.curColor = -1;
    this.state.charts.forEach((chart) => {
      chart.chart.destroy();
    });
    this.setupFeatures();
    this.needToUpdateCharts = true;
  }

  render() {
    // console.log('render');
    const bigColSize = this.state.bigIds.length === 1 ? 12 : 6;
    const titleColSize = this.state.documents.length > 4 ? 2 : 3;

    const popOverColor = id => (
        <Popover id="popover-positioned-bottom" title="Choose a color for this document">
          <SliderPicker
            color={this.state.colors[id].color}
            onChangeComplete={ (col) => {
              this.changeColor(id, col);
            }}
          />
        </Popover>);

    const popOverSettings = () => (
      <Popover id="popover-positioned-bottom" title="Settings">
        <Checkbox checked={this.state.settings.groupNGrams}
          onChange={() => this.switchNGrams() }>
          group n-grams (switching might take a few seconds)
        </Checkbox>
      </Popover>);

    return (
      <div>
        <Row>
          <Col xs={11} sm={11} md={11} lg={11}>
            <Row>
              {this.state.documents.map(doc => (
                <Col xs={6} sm={4} md={titleColSize} lg={titleColSize} key={`docTitle_${doc._id}`}>
                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <h3 style={{ display: 'inline-block' }}>{doc.title}</h3>
                    </Col>
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popOverColor(doc._id)}>
                      <Glyphicon glyph={this.state.glyphTypes[doc._id]} onClick={() => { this.changeGlyph(doc._id); }}
                        style={{
                        fontSize: '1.2em', color: this.state.colors[doc._id].color, marginTop: '25px', cursor: 'pointer',
                      }}/>
                    </OverlayTrigger>
                  </Row>
                </Col>
               ))}
            </Row>
          </Col>

          <Col xs={1} sm={1} md={1} lg={1}>
            <OverlayTrigger trigger="click" placement="bottom" overlay={popOverSettings()}>
              <Glyphicon glyph="cog" style={{ fontSize: '2em', marginTop: '25px', cursor: 'pointer' }}/>
            </OverlayTrigger>
          </Col>
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
                 <Panel.Title toggle>
                   <h3 style={{ display: 'inline-block' }} onClick={() => { this.changePanel(k); }}>{v.titleEn}</h3>
                   <Glyphicon glyph={this.state.distinctFeatures[k].glyph}
                      style={{
                        fontSize: '1.2em', cursor: 'pointer', marginLeft: '10px',
                      }}
                      onClick={() => { this.changePanel(k); }}
                   />
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
