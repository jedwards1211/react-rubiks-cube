import React from 'react/addons';
import _ from 'lodash';

require('./Cubie.sass');

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  onStickerClick(e, sideVector) {
    this.props.onStickerClick && this.props.onStickerClick(e, this, sideVector);
  },
  render() {
    var {styles, solid, left, right, up, down, front, back, style, 
        onStickerClick, className} = this.props; 

    return <div className={className ? className + ' cubie' : 'cubie'} style={style}>
      {(solid || front) && <div className="front" style={styles.front}>
        {front && <div className={'sticker ' + front} 
        onClick={e => this.onStickerClick(e, [0,0,1])}
        onTouchTap={e => this.onStickerClick(e, [0,0,1])}/>}
      </div>}
      {(solid || back) && <div className="back" style={styles.back}>
        {back && <div className={'sticker ' + back} 
        onClick={e => this.onStickerClick(e, [0,0,-1])}
        onTouchTap={e => this.onStickerClick(e, [0,0,-1])}/>}
      </div>}
      {(solid || up) && <div className="up" style={styles.up}>
        {up && <div className={'sticker ' + up} 
        onClick={e => this.onStickerClick(e, [0,-1,0])}
        onTouchTap={e => this.onStickerClick(e, [0,-1,0])}/>}
      </div>}
      {(solid || down) && <div className="down" style={styles.down}>
        {down && <div className={'sticker ' + down}
        onClick={e => this.onStickerClick(e, [0,1,0])}
        onTouchTap={e => this.onStickerClick(e, [0,1,0])}/>}
      </div>}
      {(solid || left) && <div className="left" style={styles.left}>
        {left && <div className={'sticker ' + left}
        onClick={e => this.onStickerClick(e, [-1,0,0])}
        onTouchTap={e => this.onStickerClick(e, [-1,0,0])}/>}
      </div>}
      {(solid || right) && <div className="right" style={styles.right}>
        {right && <div className={'sticker ' + right}
        onClick={e => this.onStickerClick(e, [1,0,0])}
        onTouchTap={e => this.onStickerClick(e, [1,0,0])}/>}
      </div>}
    </div>
  }
});