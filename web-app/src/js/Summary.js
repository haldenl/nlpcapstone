import React, { Component } from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';

import '../styles/Summary.css';

class Summary extends Component {
  constructor(props) {
    super(props);
    const data = Summary.aggregateData(props.data);

    this.state = {
      data: data,
    };

    this.tracking = {
      start: -1,
      end: -1,
      brushing: false,
      hold: false
    }

    this.update = this.update.bind(this);
  }

  render() {
    const text = this.state.data.map((d) => {
      const className = classNames({
        token: true,
        selected: d.selected
      });

      return (
        <span className={className} key={d.outputIndex}
        
        onMouseEnter={() => {
          if (!this.tracking.hold) {
            this.tracking.end = d.outputIndex;
            if (!this.tracking.brushing) {
              this.tracking.start = d.outputIndex;
            }
            this.update();
          }
        }}
        
        onMouseDown={() => {
          if (this.tracking.hold) {
            this.tracking.hold = false;
            this.tracking.start = this.tracking.end = d.outputIndex;            
            this.update();
          } else {
            this.tracking.brushing = true;
          }
        }}
        
        onMouseUp={() => {
          if (this.tracking.brushing) {
            this.tracking.brushing = false;
            this.tracking.hold = true;
          }
        }}>
          {`${d.outputToken} `}
        </span>
      );
    });

    return (
      <p className="Summary" onMouseLeave={() => {
        if (!this.tracking.hold) {
          this.props.clearFilter();
          this.tracking = {
            start: -1,
            end: -1,
            brushing: false,
            hold: false
          };
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

    const newData = this.state.data.map((d) => {
      return {
        ...d,
        selected: selected(d)
      }
    });

    this.setState({
      data: newData
    });
  }

  static aggregateData(data) {
    let transformed = d3.nest()
      .key((d) => { return d.outputIndex; })
      .key((d) => { return d.outputToken; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})      
      .entries(data);

    // each index has only 1 token so the values array will be of length 1
    transformed = transformed.map((d) => {
      return { outputIndex: +d.key, outputToken: d.values[0].key, weight: +d.values[0].value };
    });
  
    return transformed;
  }

}

export default Summary;