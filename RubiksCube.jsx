import React from 'react';
import _ from 'lodash';

import prefix from './prefix';

import * as matrix from './matrix';

function round(a) {
  return Math.round(a);
}

var axisRotations = [
  matrix.rotX(Math.PI * 0.5),
  matrix.rotY(Math.PI * 0.5),
  matrix.rotZ(Math.PI * 0.5),
];

function ease(t) {
  return t<.5 ? 2*t*t : -1+(4-2*t)*t;
}

export default React.createClass({
  propTypes: {
  },
  rotateQueue: [],
  onStickerClick(e, cubie, sideVector) {
    e.preventDefault();

    if (!this.props.onRotateCubies) return;

    if (this.interval) {
      this.rotateQueue.push([_.cloneDeep(e), cubie, sideVector]);
      return;
    }

    var maxIndex = this.props.metrics.size - 1;
    var actualSide = matrix.mvmulRotation(cubie.props.matrix, sideVector).map(round);
    var rotateAxis = actualSide.findIndex(i => i !== 0);
    var sideLimit = (this.props.metrics.size - 2) * 0.5;

    this.cubiesToRotate = {};

    React.Children.forEach(this.props.children, cubie => {
      var actualPosition = matrix.mvmulRotation(cubie.props.matrix, cubie.props.position);
      if ((actualPosition[rotateAxis] < -sideLimit && actualSide[rotateAxis] < 0) ||
          (actualPosition[rotateAxis] >  sideLimit && actualSide[rotateAxis] > 0)) {
        this.cubiesToRotate[cubie.key] = cubie;
      }  
    });

    var angle = e.button === 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
    angle *= actualSide[rotateAxis];

    this.targetMatrix = matrix.rot[rotateAxis](angle);
    for (var i = 0; i < 12; i++) {
      this.targetMatrix[i] = Math.round(this.targetMatrix[i]);
    }

    var rotateTime = 500;
    var startTime = Date.now();
    this.interval = setInterval(() => {
      var elapsed = Date.now() - startTime;
      if (elapsed > rotateTime) {
        this.finishCurrentRotation();
      }
      else {
        this.rotateCubies(this.cubiesToRotate, matrix.rot[rotateAxis](angle * ease(elapsed / rotateTime)));
      }
    }, 20);
  },
  rotateCubies(cubies, rotation) {
    if (!this.props.onRotateCubies) return;

    this.props.onRotateCubies(this.props.children.map(cubie => {
      if (cubie.key in cubies) {
        cubie = cubies[cubie.key];
        var newMatrix = matrix.mmulRotation(rotation, cubie.props.matrix);
        var newStyle = _.assign(cubie.props.style, prefix({
          transform: `matrix3d(${newMatrix.join(',')})`
        }));
        return React.cloneElement(cubie, {matrix: newMatrix, style: newStyle});
      }
      return cubie;
    }));
  },
  finishCurrentRotation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
      this.rotateCubies(this.cubiesToRotate, this.targetMatrix);
      setTimeout(() => {
        var next = this.rotateQueue.shift();
        if (next) {
          this.onStickerClick.apply(this, next);
        }
      }, 0);
    }
  },
  render() {
    var {metrics, children, style, className, ...props} = this.props;
    var {cubieSize, spacing, size} = metrics;

    children = React.Children.map(children, child => React.cloneElement(child, {onStickerClick: this.onStickerClick}));

    var totalSize = size * cubieSize + spacing * (size - 1);

    var style = _.assign({}, style, prefix({
      width: totalSize,
      height: totalSize,
      transformStyle: 'preserve-3d',
    }));

    if (className) className += ' react-rubiks-cube';
    else className = 'react-rubiks-cube';

    return <div className={className} style={style} {...props}>
      {children}
    </div>
  }
});