import React, { Component } from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';

import '../styles/Summary.css';

import StringUtil from './StringUtil';

class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = Summary.getDerivedStateFromProps(props);

    this.tracking = {
      start: -1,  // the start index of the selection
      end: -1,  // the end index of the selection
      brushing: false,  // true if user is brushing through text
    }

    this.update = this.update.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return Summary.getStateFromProps(nextProps);
  }

  render() {
    const text = [];
    
    for (let i = 0; i < this.state.data.length; i++) {
      const d = this.state.data[i];

      // retrieve the string to display
      let prevToken;
      let nextToken;
      if (i >= 1) { prevToken = this.state.data[i - 1].outputToken; }
      if (i < this.state.data.length - 1) { nextToken = this.state.data[i + 1].outputToken; }
      const string = StringUtil.getCleanString(prevToken, d.outputToken, nextToken);

      const className = classNames({
        token: true,
        selected: d.selected
      });

      text.push(
        <span className={className} key={d.outputIndex}
        
        onMouseEnter={() => {
          if (!this.props.getHold()) {
            this.tracking.end = d.outputIndex;
            if (!this.tracking.brushing) {
              this.tracking.start = d.outputIndex;
            }
            this.update();
          }
        }}
        
        onMouseDown={() => {
          if (this.props.getHold()) {
            this.props.setHold(false);
            this.tracking.start = this.tracking.end = d.outputIndex;            
            this.update();
          } else {
            this.tracking.brushing = true;
          }
        }}
        
        onMouseUp={() => {
          if (this.tracking.brushing) {
            this.tracking.brushing = false;
            this.props.setHold(true);
          }
        }}>
          {string}
        </span>
      );
    };

    return (
      <p className="Summary" onMouseLeave={() => {
        if (!this.props.getHold()) {
          this.props.clearFilter();
          this.tracking = {
            start: -1,
            end: -1,
            brushing: false,
          };
          this.props.setHold(false);
          this.update();
        }
      }}>
        {text}
      </p>
    )
  }

  update() {
    const selected = (d) => {
      return (d.outputIndex >= this.tracking.start && d.outputIndex <= this.tracking.end) ||
        (d.outputIndex <= this.tracking.start && d.outputIndex >= this.tracking.end);
    }

    if (this.tracking.start !== -1 && this.tracking.end !== -1) {
      this.props.filterData(selected);
    }
  }

  static aggregateData(data) {
    let transformed = d3.nest()
      .key((d) => { return d.outputIndex; })
      .key((d) => { return d.outputToken; })
      .key((d) => { return d.selected; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})      
      .entries(data);

    // each index has only 1 token so the values array will be of length 1
    transformed = transformed.map((d) => {
      return {
        outputIndex: +d.key,
        outputToken: d.values[0].key,
        selected: d.values[0].values[0].key === "true",
        selectedweight: +d.values[0].values[0].value 
      };
    });
  
    return transformed;
  }

  static getStateFromProps(props) {
    return {
      data: Summary.aggregateData(props.data)
    }
  }

}

export default Summary;