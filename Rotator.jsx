import React from 'react';
import _ from 'lodash';

export default React.createClass({
  propTypes: {
    pan:      React.PropTypes.number.isRequired,
    tilt:     React.PropTypes.number.isRequired,
    panSpeed: React.PropTypes.number,
    tiltSpeed:React.PropTypes.number,
    onRotate: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      panSpeed: 0.01,
      tiltSpeed: 0.01,
    };
  },
  onMouseDown(e) {
    if (e.button === 0) {
      e.preventDefault();
      this.mouseDown = true;
      this.startPan = this.props.pan;
      this.startTilt = this.props.tilt;
      this.startX = e.clientX;
      this.startY = e.clientY;
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp, true);
    }
  },
  onMouseUp(e) {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      this.mouseDown = false;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp, true);
    }
  },
  onMouseMove(e) {
    if (this.mouseDown) {
      e.preventDefault();
      if (this.mouseDown && this.props.onRotate) {
        var {panSpeed, tiltSpeed} = this.props;
        this.props.onRotate({
          pan:  this.startPan   + (e.clientX - this.startX) * panSpeed,
          tilt: this.startTilt  - (e.clientY - this.startY) * tiltSpeed,
        });
      }
    }
  },
  componentDidMount() {
    React.findDOMNode(this.refs.root).addEventListener('mousedown', this.onMouseDown);
  },
  componentWillUnmount() {
    React.findDOMNode(this.refs.root).removeEventListener('mousedown', this.onMouseDown);
  },
  render() {
    var {pan, tilt, style, children} = this.props;

    return <div ref="root" style={_.assign({}, style, {
        transform: `rotateX(${tilt}rad) rotateY(${pan}rad)`,
        transformStyle: 'preserve-3d',
      })}>
      {children}
    </div>
  },
});