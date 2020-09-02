import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PERIODS } from '../../../../constants/periods';
import './PeriodControls.scss';

export default class PeriodControls extends Component {
  setPeriodToDay = () => {
    const { onPeriodChange } = this.props;

    onPeriodChange(PERIODS.day);
  }

  setPeriodToWeek = () => {
    const { onPeriodChange } = this.props;

    onPeriodChange(PERIODS.week);
  }

  setPeriodToMonth = () => {
    const { onPeriodChange } = this.props;

    onPeriodChange(PERIODS.month);
  }

  render() {
    return (
      <div className="period-controls">
        <button
          type="button"
          onClick={this.setPeriodToDay}
          className="period-controls__btn"
        >
          1 day
        </button>

        <button
          type="button"
          onClick={this.setPeriodToWeek}
          className="period-controls__btn"
        >
          1 week
        </button>

        <button
          type="button"
          onClick={this.setPeriodToMonth}
          className="period-controls__btn"
        >
          1 month
        </button>
      </div>
    );
  }
}

PeriodControls.propTypes = {
  onPeriodChange: PropTypes.func.isRequired,
};
