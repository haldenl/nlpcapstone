import React, { Component } from 'react';
import * as d3 from 'd3';
import '../styles/App.css';

import SourceText from './SourceText';
import Summary from './Summary';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };

    this.filterData = this.filterData.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount() {
    d3.json('data/data_0.json').then((data) => {
      this._data = data;
      this.setState({data: data});
    });  
  }  

  render() {
    if (this.state.data === null) {
      return (
        <div className="App">
          loading...
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="left">
            <SourceText data={this.state.data}/>
          </div>
          <div className="middle"></div>
          <div className="right">
            <Summary data={this.state.data} filterData={this.filterData}
              clearFilter={this.clearFilter} />
          </div>
        </div>
      )
    }
  }

  filterData(datum, accessor) {
    const newData = this._data.filter((d) => {
      return accessor(d) === accessor(datum);
    });

    console.log(newData);

    this.setState({ data: newData });
  }

  clearFilter() {
    this.setState({ data: this._data });
  }
}

export default App;
