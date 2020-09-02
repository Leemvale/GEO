import React, { Component } from 'react';
import './Widgets.css';

import DistanceWidget from './DistanceWidget/DistanceWidget';
import Calendar from './Calendar/Calendar';
import ActivityWidget from './ActivityWidget/ActivityWidget';
import TypeDistanceWidget from './TypeDistanceWidget/TypeDistanceWidget';

class Widgets extends Component {

    constructor () {
        super();
        let intervals = ['00:00, 02:00', '02:00, 04:00', '04:00, 06:00', '06:00, 08:00', '08:00, 10:00', '10:00, 12:00',
            '12:00, 14:00', '14:00, 16:00', '16:00, 18:00', '18:00, 20:00', '20:00, 22:00', '22:00, 24:00'];
        this.state = {
            intervals: intervals
        }
    }


    render () {
        return (
            <div id={'widgets'}>
                <Calendar
                    currentDate = {this.props.currentDate}
                    dateChanged = {this.props.dateChanged}
                    activeDays = {this.props.activeDays}
                />
                <DistanceWidget
                    locations = {this.props.dataSet}
                    currentDate = {this.props.currentDate}
                    activeDays = {this.props.activeDays}
                    dataSetChanged = {this.props.dataSetChanged}
                    detalisation = {this.props.detalisation}
                    intervals = {this.state.intervals}
                    detalisationChanged={this.props.detalisationChanged}
                />
                <TypeDistanceWidget
                    locations = {this.props.dataSet}
                    dataSetChanged = {this.props.dataSetChanged}
                />
                <ActivityWidget
                    locations = {this.props.dataSet}
                    activeDays = {this.props.activeDays}
                    detalisation = {this.props.detalisation}
                    currentDate = {this.props.currentDate}
                    dataSetChanged = {this.props.dataSetChanged}
                    intervals = {this.state.intervals}
                />
            </div>
        )
    }
}
export default Widgets;