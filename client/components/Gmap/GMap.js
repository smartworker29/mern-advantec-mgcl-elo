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
import blmTownshipJSON from './blm_twnshp.json';


function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '10px 5px 22px';
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
    countiesVisible = !countiesVisible;
    if (countiesVisible) {
      featuresCounties.map(item => {
        item.setProperty('visible', true);
        map.data.overrideStyle(item, {
          visible: true
        });
      });
    } else {
      featuresCounties.map(item => {
        item.setProperty('visible', false);
        map.data.overrideStyle(item, {
          visible: false
        });
      });
    }
  });
}


function strController(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '10px 5px 22px';
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
  controlText.innerHTML = 'STR';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    strVisible = !strVisible;
    if (strVisible) {
      featuresSTR.map(item => {
        item.setProperty('visible', true);
        map.data.overrideStyle(item, {
          visible: true,
          strokeColor: 'red'
        });
      });
    } else {
      featuresSTR.map(item => {
        item.setProperty('visible', false);
        map.data.overrideStyle(item, {
          visible: false
        });
      });
    }
  });
}

let featuresSTR = [];
let featuresCounties = [];
let strVisible = false;
let countiesVisible = false;

const apiIsLoaded = (map, maps) => {
  featuresCounties = map.data.addGeoJson(geoJSON);
  featuresSTR = map.data.addGeoJson(blmTownshipJSON);
  featuresCounties.map(item => {
    item.setProperty('visible', false);
    map.data.overrideStyle(item, {
      visible: false
    });
  });
  featuresSTR.map(item => {
    item.setProperty('visible', false);
    map.data.overrideStyle(item, {
      visible: false
    });
  });
  map.data.setStyle({
    strokeWeight: 1,
    strokeColor: 'green',
    visible: true
  });
  const centerControlDiv1 = document.createElement('div');
  new CenterControl(centerControlDiv1, map);
  centerControlDiv1.index = 1;
  const centerControlDiv2 = document.createElement('div');
  new strController(centerControlDiv2, map);
  centerControlDiv2.index = 1;
  map.controls[maps.ControlPosition.TOP_CENTER].push(centerControlDiv1);
  map.controls[maps.ControlPosition.TOP_CENTER].push(centerControlDiv2);
};

export const gMap = ({
  hoverDistance,
  options,
  mapProps: { center, zoom },
  onChange,
  clusters,
  onChildMouseEnter,
  onChildClick,
  selectedMarker,
  selectedWellItem,
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
      maxZoom: 15,
      mapTypeControl: true,
      animatedZoom: true
    },
    onClickHandler: () => {}
  }),
  // withState so you could change markers if you want
  withState(
    'markers',
    'setMarkers',
    props => {
      return props.markersData;
    }
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
          maxZoom: maxZoom - 2,
          radius: clusterRadius,
          // extent: 256
        }
      ),
    })
  ),
  withPropsOnChange(
    ['selectedFromWellList'],
    ({ setSelectedWellItem, selectedFromWellList, mapProps, setMapProps }) => {
      setSelectedWellItem(selectedFromWellList);
      setMapProps({ ...mapProps, center: selectedFromWellList, zoom: 14 });
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
  withPropsOnChange(
    ['markersData'],
    ({ setMarkers, markersData }) => {
      setMarkers(markersData);
    }
  ),
);

export default gMapHOC(gMap);
