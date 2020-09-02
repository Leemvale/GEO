import React, { Component } from 'react';
import './DistanceWidget.css';
import * as dataProcessing from '../../../../dataProcessing';
import * as d3 from 'd3';
import WeekDaysLabel from "../../../../Plagins/WeekDaysLabel/WeekDaysLabel";
import DateOfWeekDaysLabel from "../../../../Plagins/DateOfWeekDaysLabel/DateOfWeekDaysLabel";
import moment from "moment/moment"; //don't delete use for format


class DistanceWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detalisation: props.detalisation,
            dataForVisualisation: this.getDataForVisualisation(props.detalisation, props.locations),
        };
    }

    getDataForVisualisation(detalisation, locations) {
        if (detalisation === "day"){
            return dataProcessing.getIntervalsWithDistances(this.props.intervals, locations)
        }  else {
            return dataProcessing.getDataDistance(locations)
        }

    }
    componentWillReceiveProps(nextProps) {
        this.setState({
                detalisation: nextProps.detalisation,
                dataForVisualisation: this.getDataForVisualisation(nextProps.detalisation, nextProps.locations)
            }
        );
    }

    d3render(){
        const node = this.node;
        let data = this.state.dataForVisualisation;
        let grid = document.getElementById('distance-bar').getBoundingClientRect().width/(this.state.detalisation === 'day' ? 12 : this.props.activeDays.length);
        console.log(data);

        if (this.state.detalisation === 'day'){
        let myBar = d3.select(node).selectAll("div.v-bar")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "v-bar")
            .append("span");

        // Update
        d3.select(node).selectAll("div.v-bar")
            .data(data)
            .style("height", function (d) {
                return (d.value * 0.05) + "px";
            })
            .style("width", grid-4 + "px")
            .style("left", function (d) {
                return ((d.intervalNumber - 1) * grid) + "px";
            })
            .select("span")
            .text(function (d) {
                return d.value;
            })
            .style("writing-mode", "vertical-lr");
        d3.select(node).selectAll("div.v-bar")
            .data(data)
            .exit()
            .remove();
        } else {
            let myBar = d3.select(node).selectAll("div.v-bar")
                .data(data)
                .enter()
                .append("div")
                .attr("class", "v-bar")
                .on('click', function (d) {
                    this.setState({
                        detalisation: 'day',
                    });
                    this.props.detalisationChanged('day');

                }.bind(this))
                .append("span");

            // Update
            d3.select(node).selectAll("div.v-bar")
                .data(data)
                .style("height", function (d) {
                    return (d.distance * 0.01) + "px";
                })
                .style("width", grid-4 + "px")
                .style("left", function (d) {
                    if (this.state.detalisation === 'month'){
                        return (((new Date(d.date).getDate())-1) * grid) + "px";
                    } else {
                        return (new Date(d.date).getDay() * grid) + "px";
                    }
                }.bind(this))
                .select("span")
                .text(function (d) {
                    return d.distance;
                })
                .style("writing-mode", "vertical-lr");
            d3.select(node).selectAll("div.v-bar")
                .data(data)
                .exit()
                .remove();
        }


    }

    componentDidMount(){
        this.d3render()
    }
    componentDidUpdate(){
        this.d3render()
    }

    render() {
        return (
            <div className = {'distance-widget widget'}>
                <p className = {'my-heading'}>Distance</p>
                <p className={'date'}> {this.props.currentDate.format("MMMM YYYY")} </p>
                <DateOfWeekDaysLabel activeDays = {this.props.activeDays} state = {'horizontal'}/>
                <div ref={node => this.node = node} id = "distance-bar"></div>
            </div>
        )
    }
}
export default DistanceWidget ;