import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as dataProcessing from '../../../../dataProcessing';
import HeatMap from '../../../diagrams/HeatMap/HeatMap';
import './ActivityWidget.scss';

class ActivityWidget extends Component {
  constructor(props) {
    super(props);

    const { intervals, locations } = this.props;
    this.state = {
      intervalsWithDistances: dataProcessing.getIntervalsWithDistances(intervals, locations),
    };
  }

  componentDidUpdate() {
    const { intervals, locations } = this.props;
    this.state = {
      intervalsWithDistances: dataProcessing.getIntervalsWithDistances(intervals, locations),
    };
  }

  render() {
    const { activeDays, intervals } = this.props;
    const { intervalsWithDistances } = this.state;

    const activeDaysLabels = activeDays.map((day) => moment(day).date());

    return (
      <div className="activity-widget widget">
        <header className="activity-widget__header my-heading">Activity</header>
        <div className="activity-widget__diagram">
          <HeatMap
            data={intervalsWithDistances}
            xValues={activeDaysLabels}
            yValues={intervals}
          />
        </div>
      </div>
    );
  }
}

ActivityWidget.propTypes = {
  intervals: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeDays: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ActivityWidget;
