import React, { Component } from 'react';
import moment from 'moment/moment';
import * as d3 from 'd3';

import Map from './Map/Map';
import Widgets from './Widgets/Widgets';
import PeriodControls from './components/PeriodControls/PeriodControls';
import * as dataProcessing from '../../dataProcessing';
import { PERIODS } from '../../constants/periods';
import './MapWithWidgets.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      dataSet: [],
      widgetsIsOpen: false,
      activeDays: this.getActiveDays(moment(), 'week'),
      selectedDate: moment().startOf(PERIODS.day),
      detalisation: 'week',
    };
  }

  componentDidMount() {
    d3.csv('data/new_path1.csv', (err, data) => {
      if (err) {
        return;
      }
      this.setState({
        locations: data,
        dataSet: data,
      });
    });
  }

  getActiveDays = (selectedDate, period) => {
    switch (period) {
      case PERIODS.day: return [selectedDate];
      case PERIODS.week: return this.getActiveDaysForWeek(selectedDate);
      case PERIODS.month: return this.getActiveDaysForMonth(selectedDate);
      default: return this.getActiveDaysForWeek(selectedDate);
    }
  }

  widgetsClick = () => {
    const { widgetsIsOpen } = this.state;
    this.setState({
      widgetsIsOpen: !widgetsIsOpen,
    });
  }

  dateChanged = (newDate) => {
    const { detalisation, locations } = this.state;
    const activeDays = this.getActiveDays(newDate, detalisation);
    this.setState({
      selectedDate: newDate,
      activeDays,
      dataSet: locations.filter((location) => (
        (new Date(location.date) >= activeDays[0]) &&
        (new Date(location.date) < moment(activeDays[activeDays.length - 1]).add(1, 'days'))
      )),
    });
  }

  dataSetChanged = (type, parametr) => {
    const { dataSet } = this.state;
    let newDataSet;
    if (type === 'type') {
      newDataSet = dataSet.filter((location) => location.type === parametr);
    }
    if (type === 'date') {
      newDataSet = dataSet
        .filter((location) => new Date(location.date).toDateString() === parametr);
    }
    this.setState({
      dataSet: newDataSet,
    });
    if (type === 'interval') {
      const interval = parametr.split(',');
      newDataSet = dataSet.filter((location) => {
        const date = new Date(location.date);
        return (
          (date.getHours() * 60 + date.getMinutes() >= dataProcessing.minutesOfDay(interval[0])) &&
            (date.getHours() * 60 + date.getMinutes() < dataProcessing.minutesOfDay(interval[1]))
        );
      });
    }
    this.setState({
      dataSet: newDataSet,
    });
  }

  periodChanged = (newPeriod) => {
    const { selectedDate, locations } = this.state;
    const activeDays = this.getActiveDays(selectedDate, newPeriod);
    this.setState({
      detalisation: newPeriod,
      activeDays,
      dataSet: locations.filter((location) => (
        (new Date(location.date) >= activeDays[0]) &&
          (new Date(location.date) < moment(activeDays[activeDays.length - 1]).add(1, 'days'))
      )),
    });
  }

  getActiveDaysForWeek = (date) => {
    const daysPerWeekNumber = 7;
    const daysBlank = Array(daysPerWeekNumber).fill(null);
    return daysBlank.map((_, index) => moment(date).day(index));
  }

  getActiveDaysForMonth = (date) => {
    const daysPerMonth = date.daysInMonth();
    const daysBlank = Array(daysPerMonth).fill(null);
    return daysBlank.map((_, index) => moment(date).date(index + 1));
  }

  unsetFilters = () => {
    const { activeDays, locations } = this.state;
    this.setState({
      dataSet: locations.filter((location) => (
        (new Date(location.date) >= activeDays[0]) &&
          (new Date(location.date) < moment(activeDays[activeDays.length - 1]).add(1, 'days'))
      )),
    });
  }

  render() {
    const {
      widgetsIsOpen,
      dataSet,
      selectedDate,
      activeDays,
      detalisation,
    } = this.state;

    const widgets = widgetsIsOpen && (
      <Widgets
        dataSet={dataSet}
        currentDate={selectedDate}
        activeDays={activeDays}
        dateChanged={this.dateChanged}
        dataSetChanged={this.dataSetChanged}
        detalisation={detalisation}
        periodChanged={this.periodChanged}
      />
    );

    return (
      <div style={{ width: '100%', height: window.innerHeight, position: 'relative' }}>
        <Map
          data={dataSet}
        />

        <button
          type="button"
          onClick={this.widgetsClick}
          id="onMapWgtsBtn"
        >
          {widgetsIsOpen ? 'Less' : 'More'}
        </button>

        <div id="widgetsWithDitail">
          <PeriodControls
            onPeriodChange={this.periodChanged}
          />

          <button
            type="button"
            onClick={this.unsetFilters}
            className="ditalBtn attention"
          >
            Unset Filters
          </button>

          {widgets}
        </div>
      </div>
    );
  }
}
export default App;
