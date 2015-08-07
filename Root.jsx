import React from 'react';
import _ from 'lodash';

import Rotator from './Rotator';
import RubiksCube from './RubiksCube';
import createCubies from './createCubies';

import prefix from './prefix';

import isMobile from './detectmobilebrowser';

React.initializeTouchEvents(true);

var cubeOptions = {
  size: 3,
  cubieSize: 100,
};

cubeOptions.spacing = cubeOptions.cubieSize * 0.05;

require('./Root.sass');

export default React.createClass({
  getInitialState() {
    return {
      pan: Math.PI / 3,
      tilt: -Math.PI / 5,
      scale: isMobile ? 0.5 : 1,
      cubies: createCubies(cubeOptions),
      showHeaders: true,
      //, false, [
      //   "   rrr",
      //   "   RRR",
      //   "   tot",
      //   "gBttyttYbwww",
      //   "gGgyYybBbwww",
      //   "ggttGttbbwww",
      //   "   tRt",
      //   "   ooo",
      //   "   ooo",
      // ]),
    };
  },
  onRotate(rotation) {
    this.setState({...rotation, showHeaders: false});
  },
  onRotateCubies(newCubies) {
    this.setState({cubies: newCubies, showHeaders: false});
  },
  render() {
    var {pan, tilt, scale, showHeaders, cubies} = this.state;

    var headersClassName = 'headers';
    if (!showHeaders) headersClassName += ' hidden';

    return <div className="root">
      <div className={headersClassName}>
        <h1>{"React/CSS3 Rubik's Cube"}</h1>
        <h5>Work in progress.  On mobile, use two fingers to rotate and zoom.</h5>
        <h5>{"Mobile browsers seem to suck at detecting what 3D transformed element you tapped, " +
             "so maybe I'll eventually implement that manually."}</h5>
      </div>
      <div className="viewport">
        <Rotator className="rotator" onRotate={this.onRotate} pan={pan} tilt={tilt} scale={scale}>
          <RubiksCube metrics={cubeOptions} onRotateCubies={this.onRotateCubies}>
            {cubies}
          </RubiksCube>
        </Rotator>
      </div>
    </div>;
  }
});