import React, { Component } from 'react';
import * as d3 from 'd3';
import * as classNames from 'classnames';

import '../styles/Summary.css';

class SourceText extends Component {
  constructor(props) {
    super(props);
    const data = this.aggregateData(props.data);

    this.state = {
      data: data,
    };
  }

  aggregateData(data) {
    let transformed = d3.nest()
      .key((d) => { return d.outputIndex; })
      .key((d) => { return d.outputToken; })
      .rollup((g) => { return d3.sum(g, (d) => { return d.weight; })})      
      .entries(data);

    // each index has only 1 token so the values array will be of length 1
    transformed = transformed.map((d) => {
      return { outputIndex: d.key, outputToken: d.values[0].key, weight: +d.values[0].value };
    });
  
    return transformed;
  }

  render() {
    const text = this.state.data.map((d) => {
      const className = classNames({
        token: true,
        selected: d.selected
      });

      if (d.selected) {
        console.log('selected!');
      }
      
      return (
        <span className={className} key={d.outputIndex} onMouseEnter={() => {
          d.selected = true;
          this.props.filterData(d, (datum) => { return +datum.outputIndex; });
          this.forceUpdate();
        }} onMouseLeave={() => {
          d.selected = false;
          this.forceUpdate();
        }}>
          {`${d.outputToken} `}
        </span>
      );
    });

    return (
      <p className="Summary" onMouseLeave={() => {
        this.props.clearFilter();
      }}>
        {text}
      </p>
    )
  }
}

export default SourceText;