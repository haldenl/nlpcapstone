import React, { Component } from 'react';
import * as d3 from 'd3';

import '../styles/SourceText.css';

import StringUtil from './StringUtil';

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
    const text = [];
    
    for (let i = 0; i < this.state.data.length; i++) {
      const d = this.state.data[i];

      // retrieve the string to display
      let prevToken;
      let nextToken;
      if (i >= 1) { prevToken = this.state.data[i - 1].inputToken; }
      if (i < this.state.data.length - 1) { nextToken = this.state.data[i + 1].inputToken; }
      const string = StringUtil.getCleanString(prevToken, d.inputToken, nextToken);

      const backgroundColor = this.state.color(d.weight);
      text.push(
        <span className="token" key={d.inputIndex} style={{backgroundColor: backgroundColor}}>
          {string}
        </span>
      );
    };

    return (
      <div className="SourceText">
        <p className="text">
          {text}
        </p>
      </div>
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