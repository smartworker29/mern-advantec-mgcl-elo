/* eslint-disable newline-before-return */
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import GoogleMapReact from 'google-map-react';
import ClusterMarker from './markers/ClusterMarker';
import SimpleMarker from './markers/SimpleMarker';
import supercluster from 'points-cluster';
import * as _ from 'lodash';

export const gMap = ({
  hoverDistance, options,
  mapProps: { center, zoom },
  onChange,
  clusters,
  onChildMouseEnter,
  onChildClick,
  selectedMarker
}) => (
  <GoogleMapReact
    options={options}
    hoverDistance={hoverDistance}
    center={center}
    zoom={zoom}
    bootstrapURLKeys={{key: 'AIzaSyDYJ8d9-x2HXzamwTMBbqftgQnKPgM44Vs', v: '3.37', libraries: 'places' }}
    onChange={onChange}
    onChildMouseEnter={onChildMouseEnter}
    onChildClick={onChildClick}
    selectedMarker={selectedMarker}
  >
    {
      clusters
        .map((cluster, index) => {
          console.log('------ selected marker', selectedMarker);
          return (
          cluster.numPoints === 1
            ? <SimpleMarker key={`simplemarker_${index}`} {...cluster} selectedMarker={selectedMarker === `simplemarker_${index}` } />
            : <ClusterMarker key={`clustermarker_${index}`} {...cluster} />
        );
      })
    }
  </GoogleMapReact>
);

gMap.propTypes = {
  hoverDistance: PropTypes.number,
  options: PropTypes.object,
  mapProps: PropTypes.object,
  onChange: PropTypes.func,
  onChildMouseEnter: PropTypes.func,
  onChildClick: PropTypes.func,
  clusters: PropTypes.array,
  selectedMarker: PropTypes.string
};

export const gMapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    hoverDistance: 30,
    options: {
      minZoom: 3,
      maxZoom: 15,
      mapTypeControl: true,
      animatedZoom: true
    },
  }),
  // withState so you could change markers if you want
  withState(
    'markers',
    'setMarkers',
    props => props.markersData
  ),
  withState(
    'selectedMarker',
    'setSelectedMarker',
    undefined
  ),
  withState(
    'hoveredMarkerId',
    'setHoveredMarkerId',
    -1
  ),
  withState(
    'mapProps',
    'setMapProps',
    {
      center: { lat: 36.256251, lng: -99.56321 },
      zoom: 10,
    }
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => ({ center, zoom, bounds }) => {
      setMapProps({ center, zoom, bounds });
    },
    onChildMouseEnter: ({ setHoveredMarkerId }) => (hoverKey, { id }) => {
      console.log('----- hover event');
      setHoveredMarkerId(id);
    },
    onChildClick: ({ setSelectedMarker }) => (id) => {
      setSelectedMarker(id);
    },
  }),
  // precalculate clusters if markers data has changed
  withPropsOnChange(
    ['markers'],
    ({ markers = [], clusterRadius, options: { minZoom, maxZoom } }) => ({
      getCluster: supercluster(
        markers,
        {
          minZoom,
          maxZoom,
          radius: clusterRadius
        }
      ),
    })
  ),
  // get clusters specific for current bounds and zoom
  withPropsOnChange(
    ['mapProps', 'getCluster'],
    ({ mapProps, getCluster }) => ({
      clusters: mapProps.bounds
        ? getCluster(mapProps)
          .map(({ wx, wy, numPoints, points }) => ({
            lat: wy,
            lng: wx,
            text: '' + numPoints,
            numPoints,
            id: `${numPoints}_${points[0].id}`,
          }))
        : [],
    })
  ),
  // set hovered
  withPropsOnChange(
    ['clusters', 'hoveredMarkerId'],
    ({ clusters, hoveredMarkerId }) => ({
      clusters: clusters
        .map(cluster => ({
          ...cluster,
          hovered: cluster.id === hoveredMarkerId,
        })),
    })
  ),
);

export default gMapHOC(gMap);
