import React from 'react';
import _ from 'lodash';

import Cubie from './Cubie';

export default function createCubies(metrics) {
  var {size, cubieSize, spacing} = metrics;
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

  var styles = {
    left:   {transform: 'rotateY(-90deg) ' + ztrans},
    right:  {transform: 'rotateY(90deg) ' + ztrans},
    top:    {transform: 'rotateX(90deg) ' + ztrans},
    bottom: {transform: 'rotateX(-90deg) ' + ztrans},
    front:  {transform: ztrans},
    back:   {transform: 'rotateY(180deg) ' + ztrans},
  };

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
    cubies.push(<Cubie 
      key={i.join(',')}
      left={i[0] === 0}
      right={i[0] === size - 1}
      top={i[1] === 0}
      bottom={i[1] === size - 1}
      front={i[2] === size - 1}
      back={i[2] === 0}
      position={position}
      matrix={matrix}
      styles={styles}
      style={{
        width: cubieSize,
        height: cubieSize,
        transformOrigin: transformOrigin.map(i => i + 'px').join(' '),
        transform: `matrix3d(${matrix.join(',')})`,
      }}/>);
  });

  return cubies;
};