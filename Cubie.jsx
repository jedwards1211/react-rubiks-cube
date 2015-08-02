import React from 'react/addons';
import _ from 'lodash';

require('./Cubie.sass');

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  onStickerClick(e, sideVector) {
    this.props.onStickerClick && this.props.onStickerClick(e, this, sideVector);
  },
  render() {
    var {styles, left, right, top, bottom, front, back, style, 
        onStickerClick, className} = this.props; 

    return <div className={className ? className + ' cubie' : 'cubie'} style={style}>
      <div className="front" style={styles.front}>
        {front && <div className="sticker" onClick={e => this.onStickerClick(e, [0,0,1])}/>}
      </div>
      <div className="back" style={styles.back}>
        {back && <div className="sticker" onClick={e => this.onStickerClick(e, [0,0,-1])}/>}
      </div>
      <div className="top" style={styles.top}>
        {top && <div className="sticker" onClick={e => this.onStickerClick(e, [0,-1,0])}/>}
      </div>
      <div className="bottom" style={styles.bottom}>
        {bottom && <div className="sticker" onClick={e => this.onStickerClick(e, [0,1,0])}/>}
      </div>
      <div className="left" style={styles.left}>
        {left && <div className="sticker" onClick={e => this.onStickerClick(e, [-1,0,0])}/>}
      </div>
      <div className="right" style={styles.right}>
        {right && <div className="sticker" onClick={e => this.onStickerClick(e, [1,0,0])}/>}
      </div>
    </div>
  }
});