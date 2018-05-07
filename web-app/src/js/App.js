import React, { Component } from 'react';
import * as d3 from 'd3';
import Minimap from 'react-minimap';
import '../styles/Minimap.css';
import '../styles/App.css';

import SourceText from './SourceText';
import Summary from './Summary';
import MinimapChild from './MinimapChild';
import Flowmap from './Flowmap';

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
    d3.json('data/data_5.json').then((data) => {
      data = data.map((d) => {
        return {
          inputIndex: +d.inputIndex,
          inputToken: d.inputToken,
          outputIndex: +d.outputIndex,
          outputToken: d.outputToken,
          weight: +d.weight
        };
      });
      
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
            <Minimap selector=".token" childComponent={MinimapChild} width={100} keepAspectRatio={true}>
              <SourceText id="SourceText" data={this.state.data}/>
            </Minimap>
          </div>
          <div className="middle">
            <Flowmap data={this.state.data}/>
          </div>
          <div className="right">
            <Summary data={this.state.data} filterData={this.filterData}
              clearFilter={this.clearFilter} />
          </div>
        </div>
      )
    }
  }

  filterData(filter) {
    const newData = this._data.filter((d) => {
      return filter(d);
    });

    this.setState({ data: newData });
  }

  clearFilter() {
    this.setState({ data: this._data });
  }
}

export default App;
