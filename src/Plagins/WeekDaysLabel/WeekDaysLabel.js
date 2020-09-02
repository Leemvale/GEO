import React, { Component } from 'react';
import './WeekDaysLabel.css'

class WeekDaysLabel extends Component {
    constructor () {
        super();
        this.state = {
            orient: "horizontal",
            labels: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        }
    }

    render () {
        return (
            <div className = {this.props.state === 'horizontal'? 'horizontal-week-days' : 'vertical-week-days'}>
                {this.state.labels.map(function (i) {
                return <div className={'week-item'} key={i}>{i}</div>
                })}
            </div>
        )
    }
}
export default WeekDaysLabel;
