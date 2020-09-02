import React, { Component } from 'react';
import {Circle, Popup, CircleMarker} from 'react-leaflet'
import './Locations.css'
import {distance} from "../../../../dataProcessing";
import moment from "moment/moment";

class Locations extends Component {

    constructor (props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount(){

    }

render() {
    let locations = this.props.data;
    let currentLocations = [],
        currentStopsItems = [],
        currentStops = [];

    locations.forEach(function (item, i) {
        if (i === 0 || (i > 0 && distance([locations[i - 1], item]) > 10)) {
            currentLocations.push(
                <Circle key={item.date} center={[Number(item.lat), Number(item.lon)]}
                        className={'location'} radius={5}>
                    <Popup>
                        <span>You were here on {new Date(item.date).toDateString()} at {new Date(item.date).toLocaleTimeString()} </span>
                    </Popup>
                </Circle>)
        } else {
            currentStopsItems.push(item)
        }
    });
    let time = 10;
    currentStopsItems.forEach(function (item,i ) {
        if (i > 0 && (Date.parse(item.date) - Date.parse(currentStopsItems[i - 1].date)) <= 10000){
            time += 10;
        } else {
            let style = {fill: "#d3d356", stroke: "#fcff7f"};
            if (time >= 10) {style = {fill: "#d3d356", stroke: "#fcff7f"}}
            if (time >= 60) {style = {fill: "#bce34a", stroke: "#c2ff92"}}
            if (time >= 60*10) {style = {fill: "#7ebe73", stroke: "#41ff4c"}}
            if (time >= 60*30) {style = {fill: "#19be98", stroke: "#53ffa3"}}
            if (time >= 60*60) {style = {fill: "#34bebe", stroke: "#5ae1ff"}}
            if (time >= 60*60*2) {style = {fill: "#4a84be", stroke: "#7cbcff"}}

            currentLocations.push(
                <CircleMarker key={item.date} center={[Number(item.lat), Number(item.lon)]}
                    className={'stop'} fillColor={style.fill} color = {style.stroke} radius={10}>
                <Popup>
                    <span>You were here for {time} seconds</span>
                </Popup>
                </CircleMarker>)
            time = 0;
        }
    });

    return (
        <div>
            {currentLocations}
            {currentStops}
        </div>
    )
}
}
export default Locations;
