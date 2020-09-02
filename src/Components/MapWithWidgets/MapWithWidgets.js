import React, { Component } from 'react';

import Leaflet from 'leaflet'
import Map from './Map/Map'
import * as d3 from 'd3'
import Widgets from './Widgets/Widgets'
import moment from "moment/moment";
import "./MapWithWidgets.css"
import * as dataProcessing from "../../dataProcessing";


Leaflet.Icon.Default.imagePath =
    '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            locations: [],
            dataSet: [],
            widgetsIsOpen: false,
            activeDays: this.getActiveDays(moment(), 'week'),
            currentDate: moment(),
            detalisation: 'week'
        }
        this.widgetsClick = this.widgetsClick.bind(this);
    }

    componentDidMount() {
        d3.csv('data/new_path1.csv', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            this.setState({
                locations: data,
                dataSet: data
            })
        })
    }

    getActiveDays(currentDate, detalisation){
        switch (detalisation) {
            case "day": return [moment(new Date(currentDate.toDate().toDateString()))];
            case "week": return this.getWeekDays(currentDate);
            case "month": return this.getMonthDays(currentDate);
        }
    }

    widgetsClick() {
        this.setState({
            widgetsIsOpen: !this.state.widgetsIsOpen
        })
    }

    dateChanged(newDate){
        let activeDays = this.getActiveDays(newDate, this.state.detalisation);
        console.log(activeDays, this.state.detalisation);
        this.setState({
            currentDate: newDate,
            activeDays: activeDays,
            dataSet: this.state.locations.filter(function (location) {
                return (new Date(location.date) >= activeDays[0]) &&
                    (new Date(location.date) < moment(activeDays[activeDays.length - 1]).add(1, 'days'))
            })
        })
    }


    dataSetChanged(type, parametr){
        let newDataSet;
        console.log(parametr);
        if (type === 'type') {
           newDataSet = this.state.dataSet.filter(function (location) {
                return location.type === parametr;
            });
        }
        if (type === 'date') {
            newDataSet = this.state.dataSet.filter(function (location) {
                return new Date(location.date).toDateString() === parametr;
            });
        }
        this.setState({
            dataSet: newDataSet
        })
        if (type === 'interval') {
            let interval = parametr.split(',');
            newDataSet = this.state.dataSet.filter(function (location) {
                 let date = new Date(location.date);
                 return (date.getHours() * 60 + date.getMinutes() >= dataProcessing.minutesOfDay(interval[0])) &&
                    (date.getHours() * 60 + date.getMinutes()  < dataProcessing.minutesOfDay(interval[1]));
            });
        }
        this.setState({
            dataSet: newDataSet
        })
    }

    detalisationChanged(newDetalisation) {
        let activeDays = this.getActiveDays(this.state.currentDate, newDetalisation);
        this.setState({
            detalisation: newDetalisation,
            activeDays: activeDays,
            dataSet: this.state.locations.filter(function (location) {
                return (new Date(location.date) >= activeDays[0]) &&
                    (new Date(location.date) < moment(activeDays[activeDays.length - 1]).add(1, 'days'))
            })
        });
    }
    getWeekDays(date){
        let currnetDate = new Date(date.toDate().toDateString());
        let labels = [moment(currnetDate)];
        let dayOfWeek = currnetDate.getDay();
        for(let i = dayOfWeek + 1; i < 7; i++){
            let nextDate = moment(currnetDate).add(i - dayOfWeek, 'days');
            labels.push(nextDate);
        }
        for(let i = dayOfWeek-1; i >= 0; i--){
            let prevDate = moment(currnetDate).subtract(dayOfWeek - i, 'days');
            labels.unshift(prevDate);
        }
        return labels;
    }

    getMonthDays(date){
        let daysCounter = date.daysInMonth(),
            begin = date.format("YYYY-MM-01"),
            days = [];
        for(let i = 0; i < daysCounter; i++) {
            days.push(moment(begin).add(i, "days"))
        }
        return days;
    }

    unsetFilters(){
        let activeDays = this.state.activeDays;
        this.setState({
            dataSet: this.state.locations.filter(function (location) {
                return (new Date(location.date) >= activeDays[0]) &&
                    (new Date(location.date) < moment(activeDays[activeDays.length - 1]).add(1, 'days'))
            })
        })
    }

    render() {
        const widgets = this.state.widgetsIsOpen && <Widgets dataSet = {this.state.dataSet}
                                                             currentDate = {this.state.currentDate}
                                                             activeDays = {this.state.activeDays}
                                                             dateChanged = {this.dateChanged.bind(this)}
                                                             dataSetChanged = {this.dataSetChanged.bind(this)}
                                                             detalisation = {this.state.detalisation}
                                                             detalisationChanged = {this.detalisationChanged.bind(this)}
        />
        return (
            <div style = {{width:100+'%', height:window.innerHeight, position:'relative'}}>
                <Map
                    data = {this.state.dataSet}
                />
                <button onClick={this.widgetsClick} id={'onMapWgtsBtn'}>{this.state.widgetsIsOpen ? 'Less' : 'More'}</button>
                <div id={'widgetsWithDitail'}>
                    <div className={'ditalBtns'}>
                        <button onClick={() => {this.detalisationChanged("day")}} className={'ditalBtn'} >1 day</button>
                        <button onClick={() => {this.detalisationChanged("week")}} className={'ditalBtn'}>1 week</button>
                        <button onClick={() => {this.detalisationChanged("month")}} className={'ditalBtn'}>1 month</button>
                        <button onClick={() => {this.unsetFilters()}} className={'ditalBtn attention'}>Unset Filters</button>
                    </div>
                    {widgets}
                </div>
            </div>
        );
    }
}
export default App;
