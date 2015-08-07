import React from 'react';
import _ from 'lodash';

import prefix from './prefix';

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
  };
}

function touchDist(touches) {
  if (touches.length === 2) {
    var dx = touches[0].pageX - touches[1].pageX;
    var dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  }  
}

export default React.createClass({
  propTypes: {
    pan:      React.PropTypes.number.isRequired,
    tilt:     React.PropTypes.number.isRequired,
    scale:    React.PropTypes.number.isRequired,
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
  onTouchStart(e) {
    if (!_.keys(this.touches).length) {
      this.startPan = this.props.pan;
      this.startTilt = this.props.tilt;
    }
    else {
      e.preventDefault();
    }

    _.forEach(e.changedTouches, t => this.touches[t.identifier] = _.assign({}, copyTouch(t), {
      startPageX: t.pageX,
      startPageY: t.pageY,
    }));

    var touchValues = _.values(this.touches);
    if (touchValues.length === 2) {
      this.startScale = this.props.scale;
      this.startDist = touchDist(touchValues);
    }
  },
  onTouchMove(e) {
    e.preventDefault();
    _.forEach(e.changedTouches, t => _.assign(this.touches[t.identifier], copyTouch(t)));
    var touchCount = _.keys(this.touches).length;
    if (touchCount === 2) {
      var startPageX = _.sum(this.touches, t => t.startPageX) / touchCount;
      var startPageY = _.sum(this.touches, t => t.startPageY) / touchCount;
      var pageX = _.sum(this.touches, t => t.pageX) / touchCount;
      var pageY = _.sum(this.touches, t => t.pageY) / touchCount;
      var dist = touchDist(_.values(this.touches));
      var {panSpeed, tiltSpeed} = this.props;
      this.props.onRotate({
        pan:   this.startPan   + (pageX - startPageX) * panSpeed,
        tilt:  this.startTilt  - (pageY - startPageY) * tiltSpeed,
        scale: this.startScale * dist / this.startDist,
      });
    }
  },
  onTouchEnd(e) {
    _.forEach(e.changedTouches, t => delete this.touches[t.identifier]);
  },
  onTouchCancel(e) {
    this.onTouchEnd(e);
  },
  componentWillMount() {
    this.touches = {};
  },
  componentDidMount() {
    React.findDOMNode(this.refs.root).addEventListener('mousedown', this.onMouseDown);
  },
  componentWillUnmount() {
    React.findDOMNode(this.refs.root).removeEventListener('mousedown', this.onMouseDown);
  },
  render() {
    var {pan, tilt, scale, style, children} = this.props;

    var style = _.assign({}, style, prefix({
      transformStyle: 'preserve-3d',
    }));

    var rotatorStyle = prefix({
      transform: `scale(${scale}) rotateX(${tilt}rad) rotateY(${pan}rad)`,
      transformStyle: 'preserve-3d',
    });

    return <div ref="root" 
      {...this.props} 
      style={style}
      onTouchStart={this.onTouchStart}
      onTouchMove={this.onTouchMove}
      onTouchEnd={this.onTouchEnd}
      onTouchCancel={this.onTouchCancel}>
      <div ref="rotator" style={rotatorStyle}>
        {children}
      </div>
    </div>
  },
});