import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as classNames from 'classnames';

import '../styles/Flowmap.css';

class Flowmap extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    filterData: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired
  };

  static margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

  static weightScale = 1.5;
  static nodeWidth = 10;
  static quantiles = 100;  // the top n quantile is displayed

  constructor(props) {
    super(props);

    this.state = Flowmap.getInitialStateFromProps(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const filteredEdges = nextProps.data.filter((d) => {
      return prevState.quantile(d.weight) >= Flowmap.quantiles - 1;
    });

    return {
      ...prevState,
      filteredEdges
    };
  }

  componentDidMount() {
    const height = this.divElement.clientHeight - Flowmap.margin.top - Flowmap.margin.bottom;
    const width = this.divElement.clientWidth - Flowmap.margin.left - Flowmap.margin.right;

    this.state.inputScale.range([0, height])
    this.state.outputScale.range([0, height])
    this.state.xScale.range([0, width - Flowmap.nodeWidth])

    this.chart = d3.select(this.divElement).append('g')
      .attr('transform', `translate(${Flowmap.margin.left}, ${Flowmap.margin.top})`);

    this.inputNodes = this.chart.append('g');
    this.inputNodes.selectAll('.node')
      .data(this.state.inputNodes)
      .enter()
      .append('rect')
      .attr('class', 'node input')
      .attr('x', this.state.xScale('input'))
      .attr('y', (d) => { return this.state.inputScale(d.inputIndex)})
      .attr('width', Flowmap.nodeWidth)
      .attr('height', this.state.inputScale.bandwidth())
      .attr('fill', (d) => { return this.state.inputColorScale(d.totalWeight); });

    this.outputNodes = this.chart.append('g')
      .on('mouseleave', () => { this.props.clearFilter(); });
    this.outputNodes.selectAll('.node')
      .data(this.state.outputNodes)
      .enter()
      .append('rect')
      .attr('class', 'node output')
      .attr('x', this.state.xScale('output'))
      .attr('y', (d) => { return this.state.outputScale(d.outputIndex)})
      .attr('width', Flowmap.nodeWidth)
      .attr('height', this.state.outputScale.bandwidth())
      .attr('fill', (d) => { return this.state.outputColorScale(d.totalWeight); })
      .on('mouseover', (d) => {
        console.log(d);
        this.props.filterData(((datum) => { return datum.outputIndex === d.outputIndex; }));
      });

    /* EDGES */

    this.edges = this.chart.append('g');
    this.edges.selectAll('.edge')
      .data(this.state.filteredEdges)
      .enter()
      .append('path')
      .attr('class', (d) => {
        return classNames({
          'edge': true,
          'selected': d.selected
        });
      })
      .attr('d', this.state.path)
      .style('stroke-width', (d) => { return this.state.edgeWidthScale(d.weight); });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.edges.selectAll('.edge')
      .data(this.state.filteredEdges)
      .attr('class', (d) => {
        return classNames({
          'edge': true,
          'selected': d.selected
        });
      });
  }

  render() {
    return (
      <svg className="Flowmap" ref={ (divElement) => this.divElement = divElement }>
      </svg>
    )
  }

  static getInitialStateFromProps(props) {
    const state = {};

    state.data = props.data;
    state.inputNodes = d3.nest()
      .key((d) => { return d.inputIndex; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})
      .entries(state.data)
      .map((d) => { return {inputIndex: +d.key, totalWeight: +d.value }; });

    state.outputNodes = d3.nest()
      .key((d) => { return d.outputIndex; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})
      .entries(state.data)
      .map((d) => { return {outputIndex: +d.key, totalWeight: +d.value }; });

    state.weightDomain = d3.extent(state.data, (d) => { return d.weight; });

    state.inputScale = d3.scaleBand()
      .domain(state.inputNodes.map((d) => {
        return d.inputIndex;
      }));
    state.inputWeightDomain = [0, d3.max(state.inputNodes, (d) => {
        return d.totalWeight * Flowmap.weightScale;
    })];
    state.inputColorScale = d3.scaleSequential(d3.interpolateBlues).domain(state.inputWeightDomain);

    state.outputScale = d3.scaleBand()
      .domain(state.outputNodes.map((d) => {
        return d.outputIndex;
      }));
    state.outputWeightDomain = d3.extent(state.outputNodes, (d) => {
        return d.totalWeight;
    });
    state.outputColorScale = d3.scaleSequential(d3.interpolateOranges).domain(state.outputWeightDomain);
    state.outputColorScaleGrey = d3.scaleSequential(d3.interpolateGreys).domain(state.outputWeightDomain);

    state.xScale = d3.scaleOrdinal()
      .domain(['input', 'output']);

    // to get the top k%
    state.quantile = d3.scaleQuantile()
      .range(d3.range(Flowmap.quantiles))
      .domain(state.data.map((d) => { return d.weight; }));
    
    state.filteredEdges = state.data.filter((d) => {
        return state.quantile(d.weight) >= Flowmap.quantiles - 1;
    });

    state.edgeWidthScale = d3.scaleLinear()
      .range([1, 2])
      .domain(d3.extent(state.filteredEdges, (d) => {
        return d.weight;
      }));

    state.line = d3.line();
    state.path = (d) => {
        return state.line(state.xScale.domain().map((sequence) => {
          let x;
          let y;
          if (sequence === 'input') {
            x = state.xScale(sequence) + Flowmap.nodeWidth;
            y = state.inputScale(d.inputIndex) + (state.inputScale.bandwidth() / 2);
          } else if (sequence === 'output') {
            x = state.xScale(sequence);
            y = state.outputScale(d.outputIndex) + (state.outputScale.bandwidth() / 2);
          }
          return [x, y];
        }));
      }

    return state;
  }

  getInputAttention(outputNode) {
    const filtered = this.state.data.filter((d) => { return d.outputIndex === outputNode; });
    return filtered;
  }

  getOutputAttention(inputNode) {
    return this.state.data.filter((d) => { return d.inputIndex === inputNode; });
  }
}

export default Flowmap;