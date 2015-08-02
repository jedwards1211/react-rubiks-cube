import React from 'react';
import _ from 'lodash';

import Rotator from './Rotator';
import RubiksCube from './RubiksCube';
import createCubies from './createCubies';


var metrics = {
  size: 3,
  cubieSize: 100,
  spacing: 5,
};

export default React.createClass({
  getInitialState() {
    return {
      pan: Math.PI / 3,
      tilt: -Math.PI / 5,
      cubies: createCubies(metrics),
    };
  },
  onRotate(rotation) {
    this.setState(rotation);
  },
  onRotateCubies(newCubies) {
    this.setState({cubies: newCubies});
  },
  render() {
    var {pan, tilt, cubies} = this.state;

    return <div style={{
      textAlign: 'center'      
    }}>
      <h1>React/CSS3 Rubik's Cube</h1>
      <div style={{
        width: 310,
        margin: 'auto',
      }}>
        Work in progress.  Touch not yet supported.
        <div style={{
          display: 'inline-block',
          perspective: '1000px',
          paddingTop: 100,
        }}>
          <Rotator style={{display: 'inline-block'}} onRotate={this.onRotate} pan={pan} tilt={tilt}>
            <RubiksCube style={{}} metrics={metrics} onRotateCubies={this.onRotateCubies}>
              {cubies}
            </RubiksCube>
          </Rotator>
        </div>
      </div>
    </div>;
  }
});