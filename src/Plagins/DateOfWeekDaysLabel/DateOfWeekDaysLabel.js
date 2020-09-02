import React, { Component } from 'react';
import './DateOfWeekDaysLabel.css'
import moment from 'moment';

class DateOfWeekDaysLabel extends Component {
    constructor (props) {
        super(props);
        this.state ={
            activeDays: props.activeDays
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            activeDays: nextProps.activeDays
            }
        )
    }
    render () {
        let grid = 378/(this.props.activeDays.length);
        return (
            <div className = {this.props.state === 'horizontal'? 'horizontal-week-days' : 'vertical-week-days'}>
                {this.state.activeDays.length > 1 ?

                    this.state.activeDays.map(function (i) {
                    return <div className={'week-item'} style={{width: grid}} key={i}>{i.format("DD")}</div>
                }) : null}

            </div>
        )
    }
}
export default DateOfWeekDaysLabel;