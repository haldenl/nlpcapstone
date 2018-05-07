import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../styles/MinimapChild.css';


class MinimapChild extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    node: PropTypes.any,
  };

  render() {
    const {width, height, left, top} = this.props;
    
    return (
      <div
        style={{
          position: 'absolute',
          width,
          height,
          left,
          top,
          backgroundColor: this.props.node.style.backgroundColor
        }}
        className="MinimapChild"
      ></div>
    );
  }
}

export default MinimapChild;