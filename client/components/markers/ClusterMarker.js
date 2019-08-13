import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withPropsOnChange from 'recompose/withPropsOnChange';
import pure from 'recompose/pure';
import { Motion, spring } from 'react-motion';

export const clusterMarker = ({
  styles, numPoints,
  defaultMotionStyle, motionStyle,
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
          transform: `translate3D(0,0,0) scale(${scale}, ${scale})`
        }}
      >
        <div
          style={styles.text}
        >
          {numPoints}
        </div>
      </div>
    )
  }
  </Motion>
);

clusterMarker.propTypes = {
  styles: PropTypes.object,
  numPoints: PropTypes.number,
  defaultMotionStyle: PropTypes.object,
  motionStyle: PropTypes.object
};

export const clusterMarkerHOC = compose(
  defaultProps({
    text: '0',
    styles: {
      marker: {
        position: 'absolute',
        cursor: 'pointer',
        width: 30,
        height: 30,
        left: -15,
        top: -15,
        border: '5px solid #004336',
        borderRadius: '50%',
        backgroundColor: 'white',
        textAlign: 'center',
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {

      }
    },
    initialScale: 0.6,
    defaultScale: 1,
    hoveredScale: 1.15,
    hovered: false,
    stiffness: 320,
    damping: 7,
    precision: 0.001,
  }),
  // pure optimization can cause some effects you don't want,
  // don't use it in development for markers
  pure,
  withPropsOnChange(
    ['initialScale'],
    ({ initialScale, defaultScale, $prerender }) => ({
      initialScale,
      defaultMotionStyle: { scale: $prerender ? defaultScale : initialScale },
    })
  ),
  withPropsOnChange(
    ['hovered'],
    ({
      hovered, hoveredScale, defaultScale,
      stiffness, damping, precision,
    }) => ({
      hovered,
      motionStyle: {
        scale: spring(
          hovered ? hoveredScale : defaultScale,
          { stiffness, damping, precision }
        ),
      },
    })
  )
);

export default clusterMarkerHOC(clusterMarker);