import React, { Component } from 'react';
import * as d3 from 'd3';
import Minimap from 'react-minimap';
import '../styles/Minimap.css';
import '../styles/App.css';

import SourceText from './SourceText';
import Summary from './Summary';
import MinimapChild from './MinimapChild';
import Flowmap from './Flowmap';
import PosController from './PosController';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };

    this.hold = false;

    this.filterData = this.filterData.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.getHold = this.getHold.bind(this);
    this.setHold = this.setHold.bind(this);
  }

  componentDidMount() {
    d3.json('data/machine_data_0.json').then((data) => {
      data = data.map((d) => {
        return {
          inputIndex: +d.inputIndex,
          inputToken: d.inputToken,
          inputPos: d.inputPos,
          outputIndex: +d.outputIndex,
          outputToken: d.outputToken,
          outputPos: d.outputPos,
          weight: +d.weight
        };
      });

      const outputPartsOfSpeech = d3.nest()
        .key((d) => { return d.outputPos})
        .entries(data)
        .map((d) => { return d.key });

      this._outputPartsOfSpeech = outputPartsOfSpeech;
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
              <SourceText data={this.state.data} filterData={this.filterData}
                clearFilter={this.clearFilter}/>
            </Minimap>
          </div>
          <div className="middle">
            <Flowmap data={this.state.data} filterData={this.filterData}
              clearFilter={this.clearFilter} getHold={this.getHold} setHold={this.setHold}/>
          </div>
          <div className="right">
            <PosController data={this.state.data}
              partsOfSpeech={this._outputPartsOfSpeech} filterData={this.filterData}
              clearFilter={this.clearFilter} getHold={this.getHold} setHold={this.setHold}/>
            <Summary data={this.state.data} filterData={this.filterData}
              clearFilter={this.clearFilter} getHold={this.getHold} setHold={this.setHold}/>
          </div>
        </div>
      )
    }
  }

  filterData(filter) {
    const newData = this._data.map((d) => {
      return {
        ...d,
        selected: filter(d)
      }
    });

    this.setState({ data: newData });
  }

  clearFilter() {
    this.setState({ data: this._data });
  }

  getHold() {
    return this.hold;
  }

  setHold(hold) {
    this.hold = hold;
  }
}

export default App;
