import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {
  state = {
    isChecked: this.props.isChecked,
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(label.split(' - ')[1]);
  };

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;

    const value = label.split(' - ')[0];
    const prettyLabel = label.split(' - ')[1];

    let bold = prettyLabel.includes('features');
    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={value}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
          {bold ? <b>{prettyLabel}</b>: prettyLabel}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default Checkbox;
