import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { features } from '../../modules/featuresClean';

const getFeatureDescription = id => (features[id] ? features[id].descriptionEn : '');

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.isChecked,
    };
  }

  toggleCheckboxChange() {
    const { handleCheckboxChange, label } = this.props;
    this.setState({ isChecked: !this.state.isChecked });
    handleCheckboxChange(label.split(' - ')[1]);
  }

  render() {
    const { label, title } = this.props;
    const { isChecked } = this.state;

    const value = label.split(' - ')[0];
    const prettyLabel = label.split(' - ')[1];

    const bold = prettyLabel.includes('features');

    return (
      <div className="checkbox" title={title || getFeatureDescription(value)}>
        <label>
          <input
            type="checkbox"
            value={value}
            checked={isChecked}
            onChange={() => { this.toggleCheckboxChange(); }}
          />
          {bold ? <b>{prettyLabel}</b> : prettyLabel}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  isChecked: PropTypes.bool,
};

export default Checkbox;
