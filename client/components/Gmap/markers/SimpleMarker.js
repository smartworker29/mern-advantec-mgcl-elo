import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import { Motion } from 'react-motion';
import { clusterMarkerHOC } from './ClusterMarker.js';

export const simpleMarker = ({
  styles,
  defaultMotionStyle, motionStyle,
  selectedMarker,
  text
}) => (
  <Motion
    defaultStyle={defaultMotionStyle}
    style={motionStyle}
  >
  {
    ({ scale }) => (
      <div
        style={{
          ...styles.marker,
          backgroundImage: !selectedMarker ? 'url(\'./img/mapCheckedIcon.svg\')' : 'url(\'./img/mapIcon.svg\')',
          transform: `translate3D(0, 0, 0) scale(${selectedMarker ? scale * 1.5 : scale}, ${selectedMarker ? scale * 1.5 : scale})`,
        }}
      >
        {selectedMarker &&
          <span style={{ ...styles.text }}>{ text }</span>
        }
      </div>
    )
  }
  </Motion>
);


simpleMarker.propTypes = {
  styles: PropTypes.object,
  text: PropTypes.string,
  selectedMarker: PropTypes.bool,
  defaultMotionStyle: PropTypes.object,
  motionStyle: PropTypes.object
};


export const simpleMarkerHOC = compose(
  defaultProps({
    styles: {
      marker: {
        position: 'absolute',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
        width: 39,
        height: 64,
        top: -64,
        left: -19.5,
        transformOrigin: '19.5px 64px',
        margin: 0,
        padding: 0
      },
      text: {
        position: 'absolute',
        bottom: -5,
        textAlign: 'center',
        width: '100%',
        display: 'inline-block',
        background: 'white',
        border: '1px solid lightblue',
        borderRadius: 3,
        padding: '1px 0'
      }
    },
    initialScale: 0.3,
    defaultScale: 0.6,
    hoveredScale: 0.7,
  }),
  // resuse HOC
  clusterMarkerHOC
);

export default simpleMarkerHOC(simpleMarker);
