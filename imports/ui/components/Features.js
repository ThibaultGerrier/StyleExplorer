/* eslint-disable max-len */

import React from 'react';
import { FormControl, Row, Col, Checkbox } from 'react-bootstrap';
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

  createCheckbox(label) {
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
      />
    );
  }

  createCheckboxes(i) {
    return features.features[i].map(label => this.createCheckbox(label));
  }

  render() {
    return (
      <div>
        {this.createCheckbox('isPublic - make the document public')}
        <br/>
        { this.createCheckbox('all - all features') }
        <div className="OuterMostClass row">
          <div className="outerClass col-md-4">
            <h4> Lexical features</h4>
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
            <h4> Choose n for the n-grams </h4>
            <Row>
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
            <Row>
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
                <FormControl type="text" name="exactInput" onClick={() => this.setState({ selectedOption: 'exact' })}/>
              </Col>
            </Row>
          </Col>
          <Col xs={ 12 } sm={ 12 } md={ 6 } lg={6} >
            <h4>Paragraphs</h4>
            <Row>
              <Col xs={ 6 } sm={ 6 } md={ 4 } lg={ 4 }>
                <Checkbox id="emptyLines" checked={this.state.emptyLines.enabled}
                          onChange={e => this.setState({ emptyLines: { enabled: e.target.checked, value: this.state.emptyLines.value } }) }>
                  Number of empty lines:
                </Checkbox>
              </Col>
              <Col xs={ 4 } sm={ 4 } md={ 4 } lg={ 4 }>
                <FormControl type="text" name="emptyLinesInput" value={this.state.emptyLines.value} onChange={e => this.setState({ emptyLines: { value: e.target.value, enabled: this.state.emptyLines.enabled } })}>
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
                <FormControl type="text" name="charSeqInput" value={this.state.charSeq.value} onChange={e => this.setState({ charSeq: { value: e.target.value, enabled: this.state.charSeq.enabled } })}>
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
