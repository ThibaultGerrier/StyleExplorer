/* eslint-disable max-len */

import React from 'react';
import { FormControl, Row, Col, Checkbox, Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { features } from '../../modules/featuresClean.js';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
const removeNonAlphabetic = str => str.replace(/[^A-Za-z]/g, '');

export default class Features extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'max',
      featureData: props.featureData,
      selectedCheckboxes: new Set(),
      emptyLines: {
        enabled: true,
        value: 2,
      },
      charSeq: {
        enabled: true,
        value: '$new_par$',
      },
      features: {
        lexicalFeatures: {},
        syntacticalFeatures: {},
        errorFeatures: {},
        allLexical: false,
        allSyntactical: false,
        allError: false,
        all: false,
      },
    };
    Object.values(features).forEach((f) => {
      this.state.features[f.type][f.identifier] = false;
    });
    if (this.state.featureData != null) {
      const featureJson = JSON.parse(this.state.featureData);
      Object.keys(featureJson).forEach((feature) => {
        Object.entries(this.state.features).forEach(([key, val]) => {
          if (typeof val === 'object' && Object.keys(val).includes(removeNonAlphabetic(feature))) {
            this.state.features[key][removeNonAlphabetic(feature)] = true;
          }
        });
      });
    }
  }

  componentDidMount() {
    this.setAllBoxes();
  }

  createCheckBoxGroup(type) {
    const allStr = `all${capitalizeFirstLetter(type)}`;
    return <div>
      <Checkbox value={allStr} checked={this.state.features[allStr]} onClick={() => {
        const stateFeatures = this.state.features;
        const catFeature = stateFeatures[`${type}Features`];
        stateFeatures[allStr] = !stateFeatures[allStr];
        // console.log(catFeature);
        Object.keys(catFeature).forEach((f) => {
          catFeature[f] = stateFeatures[allStr];
        });
        // console.log(catFeature);
        stateFeatures[catFeature] = catFeature;
        this.setState({ features: stateFeatures });
        this.setAllBoxes();
      }} onChange={() => {}}>
        <b>all {type} features</b>
      </Checkbox>
      {Object.values(features).filter(f => f.type === `${type}Features`).map(f =>
        <Checkbox key={f.identifier} title={f.descriptionEn} value={f.identifier}
                   checked={this.state.features[`${type}Features`][f.identifier]}
                  onClick={() => this.switchBox(f.type, f.identifier)}
                  onChange={() => {}}
        >
          {f.nameEn}
        </Checkbox>)}
    </div>;
  }

  setAllBoxes() {
    const featureState = this.state.features;
    Object.entries(this.state.features).forEach(([type, val]) => {
      if (typeof val !== 'object' && type !== 'all') {
        const allType = `${type.substring(3).toLocaleLowerCase()}Features`;
        featureState[type] = Object.values(this.state.features[allType]).reduce((acc, cur) => acc && cur, true);
      }
    });
    featureState.all = Object.entries(this.state.features).filter(([key, val]) => typeof val !== 'object' && key !== 'all').map(([, val]) => val).reduce((acc, cur) => acc && cur, true);
    this.setState({ features: featureState });
  }

  switchBox(type, id) {
    const featureState = this.state.features;
    featureState[type][id] = !featureState[type][id];
    this.setState({ features: featureState });
    this.setAllBoxes();
  }

  render() {
    const popOverNGrams = () => (
      <Popover id="popover-positioned-bottom" title="Choose n for n-grams">
        These options allow you to choose a n for the different features using n-grams:<br/>
        word n-grams, character n-grams and n-grams for tags.<br/>
        You can choose between maximum or exactly.
      </Popover>);

    const popOverParagraphs = () => (
      <Popover id="popover-positioned-bottom" title="Paragraphs">
        These options allow you to specify what makes a paragraph.<br/>
        Either by choosing a number of empty lines or using your own paragraph separator string.<br/>
        The different features will then be computed for each paragraph separately, resulting in more data.<br/>
        If you don&apos;t know what to enter, look into your text, see how many empty lines you have after each eg. chapter and enter that number into the field.<br/>
        Disabling the paragraph options will result in only a single paragraph for your whole text.
      </Popover>);

    return (
      <div>
        <Checkbox value="isPublic" title="If you choose to make your document public, other users will be able to see your document, its features and be able to make a private copy of it">
          make the document public
        </Checkbox>
        <br/>
        <Checkbox value="all" checked={this.state.features.all} onClick={() => {
          const stateFeatures = this.state.features;
          stateFeatures.all = !stateFeatures.all;
          Object.entries(stateFeatures).forEach(([key, val]) => {
            if (typeof val === 'object') {
              Object.keys(val).forEach((f) => {
                stateFeatures[key][f] = stateFeatures.all;
              });
            } else if (val !== 'all') {
              stateFeatures[key] = stateFeatures.all;
            }
          });
          this.setState({ features: stateFeatures });
        }} onChange={() => {}}>
          <b>all features</b>
        </Checkbox>
        <div className="OuterMostClass row">
          <div className="outerClass col-md-4">
            <h4>Lexical features</h4>
            { this.createCheckBoxGroup('lexical') }
          </div>
          <div className="outerClass2 col-md-4">
            <h4> Syntactical features </h4>
            { this.createCheckBoxGroup('syntactical') }
          </div>
          <div className="outerClass3 col-md-4">
            <h4> Error features </h4>
            { this.createCheckBoxGroup('error') }
          </div>
        </div>

        <Row>
          <Col xs={ 12 } sm={ 12 } md={ 6 } lg={6}>
            <h4 style={{ display: 'inline-block' }}> Choose n for the n-grams </h4>
            <OverlayTrigger trigger="click" placement="right" overlay={popOverNGrams()}>
              <Glyphicon glyph='question-sign'
                         onClick={() => console.log('asd')}
                         style={{
                           marginLeft: '10px', fontSize: '1.0em', color: 'grey', marginRight: '9px', marginTop: '25px', cursor: 'pointer',
                         }}/>
            </OverlayTrigger>
            <Row title="Select up to how many combinations the N-grams should go.&#013
                  e.g entering '4' will calculate n-grams for n=2, n=3 and n=4">
              <Col xs={ 4 } sm={ 4 } md={ 3 } lg={ 3 } >
                <input
                  type="radio"
                  value="maxRadio"
                  name="radio_option"
                  id="maxRadio"
                  checked={this.state.selectedOption === 'max'}
                  onChange={() => this.setState({ selectedOption: 'max' })}
                />
                &nbsp;Maximum:
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl type="text" name="maxInput" defaultValue="3"
                             onClick={() => this.setState({ selectedOption: 'max' })}/>
              </Col>
            </Row>
            <br/>
            <Row title="If you want only specific Ns for N-grams you can enter only the numbers you want, separated by a single space.&#013;
                   eg. '2 4' will give you N-grams with n=2 and n=4">
              <Col xs={ 4 } sm={ 4 } md={ 3 } lg={ 3 }>
                <input
                  type="radio"
                  value="exactRadio"
                  name="radio_option"
                  id="exactRadio"
                  checked={this.state.selectedOption === 'exact'}
                  onChange={() => this.setState({ selectedOption: 'exact' })}
                />
                &nbsp;Exactly:
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl type="text" name="exactInput" defaultValue="2 3 4" onClick={() => this.setState({ selectedOption: 'exact' })}/>
              </Col>
            </Row>
          </Col>
          <Col xs={ 12 } sm={ 12 } md={ 6 } lg={6} >
            <h4 style={{ display: 'inline-block' }}>Paragraphs</h4>
            <OverlayTrigger trigger="click" placement="right" overlay={popOverParagraphs()}>
              <Glyphicon glyph='question-sign'
                         onClick={() => console.log('asd')}
                         style={{
                         marginLeft: '10px', fontSize: '1.0em', color: 'grey', marginRight: '9px', marginTop: '25px', cursor: 'pointer',
                        }}/>
            </OverlayTrigger>
            <Row title="number denoting how many empty lines should separate paragraphs">
              <Col xs={ 6 } sm={ 6 } md={ 4 } lg={ 4 }>
                <Checkbox
                  title="number denoting how many empty lines should separate paragraphs"
                  id="emptyLines"
                  checked={this.state.emptyLines.enabled}
                  onChange={e => this.setState({ emptyLines: { enabled: e.target.checked, value: this.state.emptyLines.value } }) }>
                  Number of empty lines:
                </Checkbox>
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl
                  type="text"
                  name="emptyLinesInput"
                  value={this.state.emptyLines.value}
                  onChange={e => this.setState({ emptyLines: { value: e.target.value, enabled: this.state.emptyLines.enabled } })}>
                </FormControl>
              </Col>
            </Row>
            <Row title="sequence of characters that separates 2 paragraphs&#013;
                  eg. with '$new_par$':&#013;
                  hello how are you $new_par$ my name is nobody&#013;
                  both those parts will be treated as 1 paragraph, so in total there will be 2.">
              <Col xs={ 6 } sm={ 6 } md={ 4 } lg={ 4 }>
                <Checkbox
                  title="sequence of characters that separates 2 paragraphs&#013;
                  eg. with '$new_par$':&#013;
                  hello how are you $new_par$ my name is nobody&#013;
                  both those parts will be treated as 1 paragraph, so in total there will be 2."
                  id="charSeq"
                  checked={this.state.charSeq.enabled}
                  onChange={e => this.setState({ charSeq: { enabled: e.target.checked, value: this.state.charSeq.value } }) }>
                  Special character sequence:
                </Checkbox>
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl
                  type="text"
                  name="charSeqInput"
                  value={this.state.charSeq.value}
                  onChange={e => this.setState({ charSeq: { value: e.target.value, enabled: this.state.charSeq.enabled } })}>
                </FormControl>
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
    );
  }
}

Features.propTypes = {
  featureData: PropTypes.string,
};
