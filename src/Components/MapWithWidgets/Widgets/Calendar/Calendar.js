import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "./Calendar.css"

import 'react-datepicker/dist/react-datepicker.css';

class Calendar extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className = 'widget' id = "calendar">
                <DatePicker
                    inline
                    selected={this.props.currentDate}
                    onSelect={this.props.dateChanged}
                    highlightDates={this.props.activeDays.length > 1 ? this.props.activeDays : []}
                />
            </div>
        )
    }
}

export default Calendar
