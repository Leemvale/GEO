import React, { Component } from 'react';
import './ActivityWidget.css'
import * as d3 from 'd3';
import moment from "moment/moment";
import * as dataProcessing from './../../../../dataProcessing';
import DateOfWeekDaysLabel from "../../../../Plagins/DateOfWeekDaysLabel/DateOfWeekDaysLabel";


class ActivityWidget extends Component {
    constructor(props){
        super(props);
        this.state = {
            intervals: this.props.intervals,
            IntervalsWithDistances: dataProcessing.getIntervalsWithDistances(props.intervals, props.locations),
        };

    }

    componentWillReceiveProps(nextProps){
        this.setState({
            IntervalsWithDistances: dataProcessing.getIntervalsWithDistances(nextProps.intervals, nextProps.locations)
            }
        )
    }

    d3render() {
        let data = this.state.IntervalsWithDistances;
        console.log(data);
        if (this.props.detalisation === 'week' || this.props.detalisation === 'day') {
            const margin = {top: 30, right: 0, bottom: 100, left: 30},
                width = document.getElementById('activity-widget-svg').getBoundingClientRect().width,
                height = document.getElementById('activity-widget-svg').getBoundingClientRect().height,
                gridWidth = Math.floor(width / this.state.intervals.length),
                gridHeight = Math.floor(height / 7),
                colors = ["#fcecff", "#f4d5ff", "#e9bbff", "#db9fff", "#d087ff", "#bf6bff", "#b04fef"];

            const svg = d3.select("#activity-widget-svg");

            const colorScale = d3.scaleLinear()
                .domain([0, colors.length, d3.max(data, (d) => d.value)])
                .range(colors);

            const cards = svg.selectAll(".hour")
                .data(data, (d) => d.day + ':' + d.intervalNumber);

            cards.append("title");

            cards.enter()
                .append("rect")
                .attr("x", (d) => (d.intervalNumber - 1) * gridWidth)
                .attr("y", (d) => (d.day - 1) * gridHeight)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridWidth)
                .attr("height", gridHeight)
                .style("fill", colors[0])
                .merge(cards)
                .transition()
                .duration(1000)
                .style("fill", (d) => colorScale(d.value));

            cards.select("title").text((d) => d.value);

            cards.exit().remove();
        }
        if (this.props.detalisation === 'month') {
            const width = document.getElementById('activity-widget-svg').getBoundingClientRect().width,
                height = document.getElementById('activity-widget-svg').getBoundingClientRect().height,
                gridWidth = Math.floor(width / this.props.currentDate.daysInMonth()),
                gridHeight = Math.floor(height / this.state.intervals.length),
                colors = ["#fcecff", "#f4d5ff", "#e9bbff", "#db9fff", "#d087ff", "#bf6bff", "#b04fef"];

            const svg = d3.select("#activity-widget-svg");

            const colorScale = d3.scaleLinear()
                .domain([0, colors.length, d3.max(data, (d) => d.value)])
                .range(colors);

            const cards = svg.selectAll("rect.interval")
                .data(data);

            cards.enter()
                .append("rect")
                    .attr("x", (d) => ((d.day - 2) * gridWidth))
                    .attr("y", (d) => ((d.intervalNumber - 1) * gridHeight))
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("class", "interval bordered")
                    .attr("width", gridWidth)
                    .attr("height", gridHeight)
                    .style("fill", (d) => colorScale(d.value))
                .append("title")
                .text((d) => { return d.value });

            cards.merge(cards)
                    .transition()
                    .duration(1000);

            cards.exit().remove();
        }

    }

    componentDidMount(){
        this.d3render()
    }

    componentDidUpdate() {
        this.d3render()
    }

    render () {
        const Intervals = (function(){
            return this.state.intervals.map(function(item){
                return <p key={item} className = {this.props.detalisation === 'month' ? 'vertical-label':'interval-label'} onClick={() => this.props.dataSetChanged('interval', item)}>
                    {item}
                </p>
            }.bind(this))
        }.bind(this));
        const ActivityInner = (function(){
            if(this.props.detalisation === 'week' || this.props.detalisation === 'day'){
                return <div id = 'activity-inner'>
                            <DateOfWeekDaysLabel activeDays = {this.props.activeDays} state = {'vertical'}/>
                            <div id = 'svg-block'>
                                <Intervals/>
                                <svg id={'activity-widget-svg'}></svg>
                             </div>
                        </div>
            }
            if(this.props.detalisation === 'month'){
                return <div id = 'activity-inner'>
                    <div style={{width:"15%"}}>
                    <Intervals/>
                    </div>
                    <div id = 'svg-block'>
                        <DateOfWeekDaysLabel activeDays = {this.props.activeDays} state = {'horizontal'}/>
                        <svg id={'activity-widget-svg'}></svg>
                    </div>
                </div>
            }
        }.bind(this));
        return (
            <div className = 'widget' id='activity-widget'>
                <p className = 'my-heading'>Activity</p>
                <ActivityInner/>
            </div>
        )
    }
}

export default ActivityWidget