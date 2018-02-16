/* eslint-disable max-len */

import React from 'react';
import { FormControl, Row, Col, Checkbox, Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';

import MyCheckbox from './Checkbox';
import features from '../../modules/features.js';

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
    };
  }

  toggleCheckbox(label) {
    const { selectedCheckboxes } = this.state;
    if (selectedCheckboxes.has(label)) {
      selectedCheckboxes.delete(label);
    } else {
      selectedCheckboxes.add(label);
    }
    this.setState({ selectedCheckboxes });
  }

  createCheckbox(label, title) {
    let isChecked = false;
    if (this.state.featureData != null) {
      const featureJson = JSON.parse(this.state.featureData);
      Object.keys(featureJson).forEach((feature) => {
        if (feature.includes(label.split(' - ')[0])) {
          isChecked = true;
        }
      });
    }
    return (
      <MyCheckbox
        label={label}
        handleCheckboxChange={() => this.toggleCheckbox}
        key={label}
        isChecked={isChecked}
        title={title}
      />
    );
  }

  createCheckboxes(i) {
    return features.features[i].map(label => this.createCheckbox(label));
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
        {this.createCheckbox('isPublic - make the document public', 'If you choose to make your document public, other users will be able to see your document, its features and be able to make a private copy of it')}
        <br/>
        { this.createCheckbox('all - all features') }
        <div className="OuterMostClass row">
          <div className="outerClass col-md-4">
            <h4 title="">
              Lexical features</h4>
            { this.createCheckboxes(0) }
          </div>
          <div className="outerClass2 col-md-4">
            <h4> Syntactical features </h4>
            { this.createCheckboxes(1) }
          </div>
          <div className="outerClass3 col-md-4">
            <h4> Error features </h4>
            { this.createCheckboxes(2) }
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
            <Row>
              <Col xs={ 4 } sm={ 4 } md={ 3 } lg={ 3 } >
                <input
                  type="radio"
                  value="maxRadio"
                  name="radio_option"
                  id="maxRadio"
                  title="Select up to how many combinations the N-grams should go.&#013
                  e.g entering '4' will calculate n-grams for n=2, n=3 and n=4"
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
            <Row>
              <Col xs={ 4 } sm={ 4 } md={ 3 } lg={ 3 }>
                <input
                  type="radio"
                  value="exactRadio"
                  name="radio_option"
                  id="exactRadio"
                  title="If you want only specific Ns for N-grams you can enter only the numbers you want, separated by a single space.&#013;
                   eg. '2 4' will give you N-grams with n=2 and n=4"
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
            <Row>
              <Col xs={ 6 } sm={ 6 } md={ 4 } lg={ 4 }>
                <Checkbox id="emptyLines" checked={this.state.emptyLines.enabled}
                          onChange={e => this.setState({ emptyLines: { enabled: e.target.checked, value: this.state.emptyLines.value } }) }>
                  Number of empty lines:
                </Checkbox>
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl
                  type="text"
                  name="emptyLinesInput"
                  value={this.state.emptyLines.value}
                  title="number, denoting how many empty lines should separate paragraphs"
                  onChange={e => this.setState({ emptyLines: { value: e.target.value, enabled: this.state.emptyLines.enabled } })}>
                </FormControl>
              </Col>
            </Row>
            <Row>
              <Col xs={ 6 } sm={ 6 } md={ 4 } lg={ 4 }>
                <Checkbox id="charSeq" checked={this.state.charSeq.enabled}
                          onChange={e => this.setState({ charSeq: { enabled: e.target.checked, value: this.state.charSeq.value } }) }>
                  Special character sequence:
                </Checkbox>
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl
                  type="text"
                  name="charSeqInput"
                  value={this.state.charSeq.value}
                  title="sequence of characters that separates 2 paragraphs&#013;
                  eg. with '$new_par$':&#013;
                  hello how are you $new_par$ my name is nobody&#013;
                  both those parts will be treated as 1 paragraph, so in total there will be 2."
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
