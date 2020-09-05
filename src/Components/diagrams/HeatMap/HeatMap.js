import React, { Component } from 'react';
import { select, scaleLinear, max } from 'd3';
import PropTypes from 'prop-types';

import './HeatMap.scss';

export default class HeatMap extends Component {
  componentDidMount() {
    this.d3Render();
  }

  componentDidUpdate() {
    this.d3Render();
  }

  d3Render = () => {
    const {
      xValues,
      yValues,
      data,
      colors,
    } = this.props;

    const svg = select('#heatmap-svg');

    const { width, height } = svg.node().getBoundingClientRect();
    const cellWidth = width / xValues.length;
    const cellHeight = height / yValues.length;

    const colorScale = scaleLinear()
      .domain([0, colors.length, max(data, (d) => d.value)])
      .range(colors);

    const cards = svg.selectAll('.cell')
      .data(data, (d) => `${d.day}:${d.intervalNumber}`);

    cards.enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('x', (d) => (d.intervalNumber - 1) * cellWidth)
      .attr('y', (d) => (d.day - 1) * cellHeight)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('fill', colors[0])
      .transition()
      .duration(1000)
      .style('fill', (d) => colorScale(d.value));

    cards.append('title').text((d) => d.value);

    cards.exit().remove();
  }

  render() {
    const { xValues, yValues } = this.props;
    const xLabels = xValues.map((value) => <span>{value}</span>);
    const yLabels = yValues.map((value) => <span>{value}</span>);

    return (
      <div className="heatmap">
        <div className="x-labels">{xLabels}</div>
        <div className="heatmap-container">
          <div className="y-labels">{yLabels}</div>
          <svg id="heatmap-svg" />
        </div>
      </div>
    );
  }
}

HeatMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  yValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
};

HeatMap.defaultProps = {
  colors: ['#fcecff', '#f4d5ff', '#e9bbff', '#db9fff', '#d087ff', '#bf6bff', '#b04fef'],
};
