import React, {Component} from 'react';
import * as d3 from 'd3';
import './TypeDistanceWidget.css';
import * as dataProcessing from './../../../../dataProcessing';


class TypeDistanceWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: props.locations,
            typeDistance: dataProcessing.getTypeDistance(props.locations),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
                typeDistance: dataProcessing.getTypeDistance(nextProps.locations)
            }
        );
    }

    componentDidMount() {
        this.d3rener();
    }

    componentDidUpdate() {
        this.d3rener();
    }

    d3rener() {
        let startAngle = 0,
            prevDistance = 0,
            endAngle = 2 * Math.PI,
            colors = d3.scaleOrdinal()
                .range(["#7acd64", "#f8bf22", "#d86304"]),
            allDistance;

        let svg = d3.select(this.node).select("svg");

        let data = this.state.typeDistance;
        if (data.length > 0) {
            if (data.length === 1) {
               allDistance = data[0].distance;
            }
            else {
                allDistance = data.reduce((previousValue, currentValue, i) => {
                    return (i > 1) ? previousValue + Number(currentValue.distance) : Number(previousValue.distance) + Number(currentValue.distance);
                });
            }
            data.forEach((item) => {
                item.startAngle = startAngle;
                item.endAngle = (Number(item.distance) + prevDistance) / allDistance * endAngle;
                prevDistance += Number(item.distance);
                startAngle = prevDistance / allDistance * endAngle;

            });
        }

        let arc = d3.arc().outerRadius(100).innerRadius(30);

        svg.select("g").remove();

        let arcs = svg.append("g")
            .attr("transform", "translate(105, 105)")
            .selectAll("path.arc")
            .data(data)
            .enter()

        arcs.append("path")
            .attr("class", "arc")
            .on('click', function(d) {
                this.props.dataSetChanged('type', d.type);
            }.bind(this))
            .attr("fill", function (d, i) {
                return colors(i);
            })
            .transition().duration(1000)
            .attrTween("d", function (d) {
                let start = {startAngle: 0, endAngle: 0};
                let interpolate = d3.interpolate(start, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });
        arcs.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.type +"\n"+ d.distance
            });

        arcs.exit().remove();
    }




    render() {
        return (
            <div className={'widget'} id={'type-distance-widget'}>
                <p className='my-heading'>Type-Distance</p>
                <div ref={node => this.node = node}>
                    <svg></svg>
                </div>
            </div>
        )
    }
}

export default TypeDistanceWidget;