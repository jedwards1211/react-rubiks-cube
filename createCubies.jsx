import React from 'react';
import _ from 'lodash';

import prefix from './prefix';

import Cubie from './Cubie';

import isMobile from './detectmobilebrowser';

var defaultStickers = [
  "   WWW",
  "   WWW",
  "   WWW",
  "RRRBBBOOOGGG",
  "RRRBBBOOOGGG",
  "RRRBBBOOOGGG",
  "   YYY",
  "   YYY",
  "   YYY"
];

var defaultStickerClasses ={
  W: 'white',
  R: 'red',
  B: 'blue',
  O: 'orange',
  G: 'green',
  Y: 'yellow',
  A: 'gray',
  w: 'white translucent',
  r: 'red translucent',
  b: 'blue translucent',
  o: 'orange translucent',
  g: 'green translucent',
  y: 'yellow translucent',
  t: 'translucent',
};

/**
 * @param {number} metrics.size - the number of cubies on one side
 *     (e.g. 3 means a 3x3x3)
 * @param {number} metrics.cubieSize - the size of a side of a cubie,
 *      in px
 * @param {number} metrics.spacing - the spacing between cubies, in px
 * @param {string[]} stickers - the sticker class map.  e.g. for a default
 *      3x3x3, this would be:
 * [
 *   "   www",
 *   "   www",
 *   "   www",
 *   "rrrbbboooggg",
 *   "rrrbbboooggg",
 *   "rrrbbboooggg",
 *   "   yyy",
 *   "   yyy",
 *   "   yyy"
 * ]
 * @param {object} stickerClasses - a map from char in stickers to the
 *      class for that char
 */
export default function createCubies(options) {//metrics, solid = true, stickers = defaultStickers, stickerClasses = defaultStickerClasses) {
  var {size = 3, 
      cubieSize = 50, 
      spacing, 
      solid = true, 
      stickers = defaultStickers, 
      stickerClasses = defaultStickerClasses} = options;

  if (spacing === undefined) spacing = cubieSize * 0.05;

  function getFace(stickers, row1, col1) {
    return stickers.slice(row1, row1 + size).map(s => [...s].slice(col1, col1 + size));
  }

  function getStickerClass(a) {
    return a.map(ch => stickerClasses[ch]);
  }

  var upStickers    = getFace(stickers, 0,    size).map(getStickerClass);
  var leftStickers  = getFace(stickers, size,    0).map(getStickerClass);
  var frontStickers = getFace(stickers, size, size).map(getStickerClass);
  var rightStickers = getFace(stickers, size, size * 2).map(a => getStickerClass(a.slice(0).reverse()));
  var backStickers  = getFace(stickers, size, size * 3).map(a => getStickerClass(a.slice(0).reverse()));
  var downStickers  = getFace(stickers, size * 2, size).slice(0).reverse().map(getStickerClass);

  var totalSize = size * cubieSize + spacing * (size - 1);
  var totalSize2 = totalSize / 2;
  var cubieSize2 = cubieSize / 2;

  function forEachOuter(size, cb) {
    for (let x = 0; x < size; x++) {
      var xSide = x === 0 || x === size - 1;
      for (let y = 0; y < size; y++) {
        var ySide = y === 0 || y === size - 1;
        for (let z = 0; z < size; z++) {
          var zSide = z === 0 || z === size - 1;
          if (xSide || ySide || zSide) {
            cb([x,y,z]);
          }
        }
      }
    }
  }

  var ztrans = `translateZ(${cubieSize2}px)`;

  var styles = _.mapValues({
    left:   {transform: 'rotateY(-90deg) ' + ztrans},
    right:  {transform: 'rotateY(90deg) ' + ztrans},
    up:     {transform: 'rotateX(90deg) ' + ztrans},
    down:   {transform: 'rotateX(-90deg) ' + ztrans},
    front:  {transform: ztrans},
    back:   {transform: 'rotateY(180deg) ' + ztrans},
  }, prefix);

  var cubies = [];

  forEachOuter(size, i => {
    var origin = [
      i[0] * (cubieSize + spacing),
      i[1] * (cubieSize + spacing),
      i[2] * (cubieSize + spacing) - totalSize2 + cubieSize2,
    ];
    var transformOrigin = [
      totalSize2 - origin[0],
      totalSize2 - origin[1],
      -origin[2],
    ];
    var position = i.map(v => v - (size - 1) * 0.5);
    var matrix = [1,0,0,0,0,1,0,0,0,0,1,0,origin[0],origin[1],origin[2],1];

    if (isMobile) {
      matrix[14] = 0; // transform origin seems to be implemented inconsistently
                      // between mobile/desktop
    }

    var style = prefix({
      width: cubieSize,
      height: cubieSize,
      transformOrigin: transformOrigin.map(i => i + 'px').join(' '),
      transform: `matrix3d(${matrix.join(',')})`,
    });

    cubies.push(<Cubie 
      key={i.join(',')}
      solid={solid}
      left  ={i[0] === 0        && leftStickers [i[1]][i[2]]}
      right ={i[0] === size - 1 && rightStickers[i[1]][i[2]]}
      up    ={i[1] === 0        && upStickers   [i[2]][i[0]]}
      down  ={i[1] === size - 1 && downStickers [i[2]][i[0]]}
      front ={i[2] === size - 1 && frontStickers[i[1]][i[0]]}
      back  ={i[2] === 0        && backStickers [i[1]][i[0]]}
      position={position}
      matrix={matrix}
      styles={styles}
      style={style}/>);
  });

  return cubies;
};