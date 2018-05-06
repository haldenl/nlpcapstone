import React, { Component } from 'react';
import * as d3 from 'd3';

import '../styles/SourceText.css';

const WEIGHT_SCALE = 1.5;

class SourceText extends Component {
  constructor(props) {
    super(props);

    this.state = SourceText.getStateFromProps(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return SourceText.getStateFromProps(nextProps);
    }
  }

  render() {
    const text = this.state.data.map((d) => {
      const backgroundColor = this.state.color(d.weight);
      return (
        <span key={d.inputIndex} style={{backgroundColor: backgroundColor}}>
          {`${d.inputToken} `}
        </span>
      );
    });

    return (
      <p className="SourceText">
        {text}
      </p>
    )
  }

  static getStateFromProps(props) {
    const data = SourceText.aggregateData(props.data);

    const weightDomain = [0, d3.max(data, (d) => {
      return d.weight * WEIGHT_SCALE;
    })];

    return {
      data: data,
      color: d3.scaleSequential(d3.interpolateBlues).domain(weightDomain)
    };
  }

  static aggregateData(data) {
    let transformed = d3.nest()
      .key((d) => { return d.inputIndex; })
      .key((d) => { return d.inputToken; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})      
      .entries(data);

    // each index has only 1 token so the values array will be of length 1
    transformed = transformed.map((d) => {
      return { inputIndex: d.key, inputToken: d.values[0].key, weight: +d.values[0].value };
    });
  
    return transformed;
  }
}

export default SourceText;