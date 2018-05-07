import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import '../styles/Flowmap.css';

class Flowmap extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  static margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

  static weightScale = 1.5;
  static nodeWidth = 10;

  constructor(props) {
    super(props);
    this.state = Flowmap.getStateFromProps(props);
  }

  componentDidMount() {
    const height = this.divElement.clientHeight - Flowmap.margin.top - Flowmap.margin.bottom;
    const width = this.divElement.clientWidth - Flowmap.margin.left - Flowmap.margin.right;

    const inputScale = d3.scaleBand()
      .range([0, height])
      .domain(this.state.inputNodes.map((d) => {
        return d.inputIndex;
      }));
    const inputWeightDomain = [0, d3.max(this.state.inputNodes, (d) => {
        return d.totalWeight * Flowmap.weightScale;
    })];
    const inputColorScale = d3.scaleSequential(d3.interpolateBlues).domain(inputWeightDomain);

    const outputScale = d3.scaleBand()
      .range([0, height])
      .domain(this.state.outputNodes.map((d) => {
        return d.outputIndex;
      }));
    const outputWeightDomain = d3.extent(this.state.outputNodes, (d) => {
        return d.totalWeight;
    });
    const outputColorScale = d3.scaleSequential(d3.interpolateOranges).domain(outputWeightDomain);

    const xScale = d3.scaleOrdinal()
      .range([0, (width - Flowmap.nodeWidth) / 2, width - Flowmap.nodeWidth])
      .domain(['input', 'middle', 'output']);

    // for the lines
    const line = d3.line()
      .x((d) => { return xScale(d.source); })
      .y((d) => {
        return d.source === 'input' ? inputScale(d.node) : outputScale(d.node);
      })
      .curve(d3.curveBundle.beta(0.5));

    this.chart = d3.select(this.divElement).append('g')
      .attr('transform', `translate(${Flowmap.margin.left}, ${Flowmap.margin.top})`);

    this.inputNodes = this.chart.append('g');
    this.inputNodes.selectAll('.rect')
      .data(this.state.inputNodes)
      .enter()
      .append('rect')
      .attr('class', 'rect input')
      .attr('x', xScale('input'))
      .attr('y', (d) => { return inputScale(d.inputIndex)})
      .attr('width', Flowmap.nodeWidth)
      .attr('height', inputScale.bandwidth())
      .attr('fill', (d) => { return inputColorScale(d.totalWeight); });

    this.outputNodes = this.chart.append('g');
    this.outputNodes.selectAll('.rect')
      .data(this.state.outputNodes)
      .enter()
      .append('rect')
      .attr('class', 'rect output')
      .attr('x', xScale('output'))
      .attr('y', (d) => { return outputScale(d.outputIndex)})
      .attr('width', Flowmap.nodeWidth)
      .attr('height', outputScale.bandwidth())
      .attr('fill', (d) => { return outputColorScale(d.totalWeight); });

    // this.edges = this.chart.append('g');
    // this.edges.selectAll('.line')
    //   .data(this.state.outputNodes)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'line')
    //   .attr('d', (d) => { return line(this.getInputAttention(d.outputIndex)); })
    //   .attr('opacity', (d) => { return d.totalWeight / this.state.weightDomain[1]; });
  }

  render() {
    return (
      <svg className="Flowmap" ref={ (divElement) => this.divElement = divElement }>
      </svg>
    )
  }

  static getStateFromProps(props) {
    const data = props.data;
    const inputNodes = d3.nest()
      .key((d) => { return d.inputIndex; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})
      .entries(data)
      .map((d) => { return {inputIndex: +d.key, totalWeight: +d.value }; });

    const outputNodes = d3.nest()
      .key((d) => { return d.outputIndex; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})
      .entries(data)
      .map((d) => { return {outputIndex: +d.key, totalWeight: +d.value }; });

    const weightDomain = d3.extent(data, (d) => { return d.weight; });

    return {
      data,
      inputNodes,
      outputNodes,
      weightDomain
    };
  }

  getInputAttention(outputNode) {
    const filtered = this.state.data.filter((d) => { return d.outputIndex === outputNode; });

    const paths = [];
    filtered.forEach((d) => {
      if (d.weight > this.state.weightDomain[1] * 0.25) {
        paths.push({
          source: 'input',
          node: +d.inputIndex,
          weight: +d.weight
        });

        paths.push({
          source: 'middle',
          node: 30,
          weight: +d.weight
        });
  
        paths.push({
          source: 'output',
          node: +d.outputIndex,
          weight: +d.weight
        });
      }
    });
   
    return paths;
  }

  getOutputAttention(inputNode) {
    return this.state.data.filter((d) => { return d.inputIndex === inputNode; });
  }
}

export default Flowmap;