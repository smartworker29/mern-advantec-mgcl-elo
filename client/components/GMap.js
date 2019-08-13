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
import geoJSON from './geojson.json';


function buildCoordinatesArrayFromString(MultiGeometryCoordinates){
  var finalData = [];
  var grouped = MultiGeometryCoordinates.split("\n");

  grouped.forEach(function(item, i){
      let a = item.trim().split(',');

      finalData.push({
          lng: parseFloat(a[0]),
          lat: parseFloat(a[1])
      });
  });

  return finalData;
}

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '15px';
  controlText.style.paddingRight = '15px';
  controlText.innerHTML = 'Counties';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    const style = map.data.getStyle();
    map.data.setStyle({
      ...style,
      visible: !style.visible,
    });
  });
}

const apiIsLoaded = (map, maps) => {
  map.data.addGeoJson(geoJSON);
  map.data.setStyle({
    strokeWeight: 1,
    strokeColor: 'green',
    visible: true,
  });
  const centerControlDiv = document.createElement('div');
  const centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

};

export const gMap = ({
  hoverDistance, options,
  mapProps: { center, zoom },
  onChange,
  clusters,
  onChildMouseEnter,
  onChildClick,
  selectedMarker,
  selectedWellItem
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
    yesIWantToUseGoogleMapApiInternals
    onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
  >
    {
      clusters
        .map((cluster, index) => {
          return (
          cluster.numPoints === 1
            ? (
            <SimpleMarker
              key={`simplemarker_${cluster.id}`}
              {...cluster}
              selectedMarker={selectedWellItem.lat === cluster.lat && selectedWellItem.lng === cluster.lng}
            />)
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
  selectedMarker: PropTypes.string,
  selectedWellItem: PropTypes.object
};

export const gMapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    hoverDistance: 30,
    options: {
      minZoom: 3,
      maxZoom: 14,
      mapTypeControl: true,
      animatedZoom: true
    },
    onClickHandler: () => {}
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
    'selectedWellItem',
    'setSelectedWellItem',
    {}
  ),
  withState(
    'hoveredMarkerId',
    'setHoveredMarkerId',
    -1
  ),
  withState(
    'mapProps',
    'setMapProps',
    props => ({
      center: props.selectedFromWellList.lat ? props.selectedFromWellList : { lat: props.markersData[0] ? props.markersData[0].lat : 36.256251, lng: props.markersData[0] ? props.markersData[0].lng : -99.56321 },
      zoom: 10
    })
  ),
  // describe events
  withHandlers({
    onChange: ({ setMapProps }) => ({ center, zoom, bounds }) => {
      setMapProps({ center, zoom, bounds });
    },
    onChildClick: ({ setSelectedWellItem, onClickHandler, markers, mapProps, setMapProps }) => (clusterId) => {
      const id = clusterId.split('_').pop();
      markers.map(marker => {
        if (marker.id === parseInt(id, 10)) {
          setSelectedWellItem({ lat: marker.lat, lng: marker.lng });
          setMapProps({ ...mapProps, center: { lat: marker.lat, lng: marker.lng } });
          onClickHandler(marker.id);
        }
      });
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
  withPropsOnChange(
    ['selectedFromWellList'],
    ({ setSelectedWellItem, selectedFromWellList, mapProps, setMapProps }) => {
      setSelectedWellItem(selectedFromWellList);
      setMapProps({ ...mapProps, center: selectedFromWellList });
    }
  ),
  // get clusters specific for current bounds and zoom
  withPropsOnChange(
    ['mapProps', 'getCluster'],
    ({ mapProps, getCluster }) => {
      return ({
        clusters: mapProps.bounds
          ? getCluster(mapProps)
            .map(({ wx, wy, numPoints, points }) => ({
              lat: wy,
              lng: wx,
              text: '' + points[0].id,
              numPoints,
              id: `${numPoints}_${points[0].id}`,
            }))
          : [],
      });
    }
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
