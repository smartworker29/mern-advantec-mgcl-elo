/* eslint-disable camelcase */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import * as _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Select from 'react-select';

import GMap from '../../components/GMap/GMap';
import { WELLS, DOCS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import stateOptions from '../../utils/us-states';
import counties from '../../utils/counties.json';
import './dashboard.css';

const customStyles = {
    option: (provided) => ({
        ...provided,
        fontSize: 12,
        padding: '2px 10px',
        minHeight: 24,
    }),
    control: (provided) => ({
        ...provided,
        minHeight: 30,
        height: 30,
        borderRadius: 0,
        width: '100%',
        marginLeft: -10
    }),
    input: (provided) => ({
        ...provided,
        margin: 0,
        padding: '0 10px'
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        display: 'none'
    }),
    container: (provided) => ({
        ...provided,
        margin: '5px 0',
        fontSize: 12,
        fontFamily: 'sans-serif'
    }),
    menu: (provided) => ({
        ...provided,
        marginLeft: -10,
        marginTop: 3
    }),
};

class DashboardContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            documentDetails: '',
            filters: {
                state: 'OK',
                county: undefined,
                meridian: undefined,
                section: undefined,
                township: undefined,
                range: undefined,
                keyword: undefined
            },
            selectedState: 'OK',
            docsList: [],
            countyOptions: [],
            selectedTableRow: false,
            selectedFromWellList: {},
            mapInitialized: false,
            pageNum: 0,
            selectedMarkerId: undefined,
            filterChanged: false,
            filterMapClicked: true,
            markersData: []
        };

        this.listWells();
    }

    componentDidMount() {
        const countyOptions = counties[this.state.filters.state];
        this.setState({ countyOptions });
    }

   UNSAFE_componentWillUpdate(newProps, newState) {
        if (this.props.wells && (newProps.wells.length !== this.props.wells.length)) {
            this.listDocs(newProps, newState);
        } else {
            if (newState.filterChanged) {
                this.listDocs(newProps, newState);
            }
        }
    }

    listDocs(newProps, newState) {
        if (_.some(newState.filters, (value) => value !== undefined)) {
            const wellList = _.compact(newProps.wells.map(well => well.ID));
            if (wellList.length > 1) {
                newProps.actions.fetchAll(DOCS, { ...newState.filters });
            } else {
                newProps.actions.fetchAll(DOCS, { wells: wellList.length > 0 ? wellList : [-1] });
            }
        } else {
            newProps.actions.fetchAll(DOCS);
        }
        this.setState({ filterChanged: false });
    }

    onStateChange = (e) => {
        const selectedState = e.value;
        const { filters } = this.state;
        filters['state'] = selectedState;
        filters['county'] = undefined;
        const countyOptions = counties[selectedState] || [];
        this.setState({ selectedState, countyOptions, filters, filterChanged: true, pageNum: 0 });
        this.listWells();
    }

    onChangeValue = (e) => {
        const { filters } = this.state;
        filters[e.target.name] = e.target.value;
        this.setState({ filters, filterChanged: true, pageNum: 0 });
        this.listWells();
    }

    onFilterChange = (e, prop) => {
        const { filters } = this.state;
        filters[prop] = e.target ? e.target.value : e.value;
        this.setState({ filters, filterChanged: true, pageNum: 0 });
        this.listWells();
    }

    resetFilter = () => {
        const filters = {
            state: 'OK',
            county: undefined,
            meridian: undefined,
            section: undefined,
            township: undefined,
            range: undefined,
            keyword: undefined
        };
        this.setState({
            filters,
            filterChanged: true
        });
        this.listWells(filters);
    }

    listWells = (value) => {
        const { filters } = this.state;
        if (!value) {
            value = filters;
        }
        this.props.actions.fetchAll(WELLS, value);
    }

    getMarkersData = () => {
        const markersData = this.props.wells.map(well => ({
            id: well.ID,
            lat: parseFloat(well.Lat, 10),
            lng: parseFloat(well.Long, 10)
        }));
        _.remove(markersData, function (e) {
            return isNaN(e.lat) || isNaN(e.lng);
        });
        this.setState({ markersData, filterMapClicked: false });
    }

    onMapMarkerClickHandler = (markerId) => {
        this.calcWellsPageNum(markerId);
        this.props.actions.fetchAll(DOCS, { wells: [ markerId ] });
    }

    calcWellsPageNum = (markerId) => {
        const wellList = this.props.wells.map(well => well.ID);
        const pageNum = Math.floor(wellList.indexOf(markerId) / 20);
        this.setState({ pageNum, selectedMarkerId: markerId, selectedTableRow: wellList.indexOf(markerId) });
    }

    onPageChange = (pageNum) => {
        this.setState({ pageNum });
    }

    filterMapClick = () => {
        this.setState({ filterMapClicked: true });
    }

    render() {
        const { documentDetails, filters, countyOptions, selectedFromWellList, filterMapClicked, markersData } = this.state;
        const { loadingwells } = this.props;
        if (!_.isUndefined(loadingwells) && (filterMapClicked && !loadingwells)) {
            this.getMarkersData();
        }

        const stateOpts = stateOptions.map(option => ({ value: option.abbreviation, label: option.abbreviation }));
        stateOpts.unshift({ value: undefined, label: ' ' });
        const countyOpts = countyOptions.map(option => ({ value: option, label: option }));
        countyOpts.unshift({ value: undefined, label: ' ' });
        
        const meridianOpts = [
            { value: undefined, label: '' },
            { value: 'Indian', label: 'Indian' },
            { value: 'Cimarron', label: 'Cimarron' }
        ];

        return (
            <div className="homepage-container">
                <div className="header">
                    <span className="logo">Logo</span>
                </div>
                <Grid container id="search-filter-section">
                    <Grid item xs={2}>
                        <h2>Search & Filter</h2>
                        <Grid container className="filters">
                            <Grid item xs={12} style={{ textAlign: 'right' }} ><button className="reset" onClick={this.resetFilter}>Reset Filter</button></Grid>
                            <Grid item xs={6}><span>State</span></Grid>
                            <Grid item xs={6}>
                                <Select
                                    options={stateOpts}
                                    styles={customStyles}
                                    placeholder=''
                                    value={stateOpts.find(option => option.value === filters.state)}
                                    onChange={this.onStateChange}
                                />
                            </Grid>
                            <Grid item xs={6}><span>County</span></Grid>
                            <Grid item xs={6}>
                                <Select
                                    name="county" 
                                    options={countyOpts}
                                    placeholder=''
                                    styles={customStyles}
                                    value={countyOpts.find(option => option.value === filters.county)}
                                    onChange={(e) => this.onFilterChange(e, 'county')}
                                />
                            </Grid>
                            <Grid item xs={6}><span>Meridian</span></Grid>
                            <Grid item xs={6}>
                                <Select
                                    name="meridian" 
                                    options={meridianOpts}
                                    placeholder=''
                                    styles={customStyles}
                                    value={meridianOpts.find(option => option.value === filters.meridian)}
                                    onChange={(e) => this.onFilterChange(e, 'meridian')}
                                />
                            </Grid>
                            <Grid item xs={6}><span>Section</span></Grid>
                            <Grid item xs={6}><input name="section" value={filters.section || ''} onChange={this.onChangeValue} /></Grid>
                            <Grid item xs={6}><span>Township</span></Grid>
                            <Grid item xs={6}><input name="township" value={filters.township || ''} onChange={this.onChangeValue} /></Grid>
                            <Grid item xs={6}><span>Range</span></Grid>
                            <Grid item xs={6}><input name="range" value={filters.range || ''} onChange={this.onChangeValue} /></Grid>
                            <Grid item xs={6}><span style={{ margin: '5px 0' }}>Keyword</span></Grid>
                            <Grid item xs={8}><input name="keyword" className="keyword" value={filters.keyword || ''}  onChange={this.onChangeValue} /></Grid>
                            <Grid item xs={4}><button className="filter-map" onClick={this.filterMapClick} disabled={this.loadingwells}>Filter Map</button></Grid>
                        </Grid>
                        <ReactTable
                            data={this.props.wells}
                            previousText={'<<'}
                            nextText={'>>'}
                            columns={[
                                {
                                    columns: [
                                        {
                                            Header: 'API',
                                            accessor: 'API'
                                        },
                                        {
                                            Header: 'OPERATOR',
                                            accessor: 'Operator'
                                        },
                                        {
                                            Header: 'Lease',
                                            accessor: 'Lease'
                                        },
                                        {
                                            Header: 'S',
                                            accessor: 'Section',
                                            width: 30
                                        },
                                        {
                                            Header: 'T',
                                            accessor: 'Township',
                                            width: 35
                                        },
                                        {
                                            Header: 'R',
                                            accessor: 'Range',
                                            width: 35
                                        }
                                    ]
                                }
                            ]}
                            defaultPageSize={20}
                            pageSizeOptions={[20]}
                            page={this.state.pageNum}
                            onPageChange={this.onPageChange}
                            className="-striped -highlight"
                            getTrProps={(state, rowInfo) => {
                                if (rowInfo && rowInfo.row) {
                                    if (rowInfo.index === this.state.selectedTableRow) {
                                        return {
                                            onClick: () => {
                                                this.setState({
                                                    selectedTableRow: rowInfo.index,
                                                    selectedFromWellList: {
                                                        lat: parseFloat(rowInfo.original.Lat, 10),
                                                        lng: parseFloat(rowInfo.original.Long, 10)
                                                    }
                                                });
                                                this.props.actions.fetchAll(DOCS, { wells: [rowInfo.original.ID] });
                                            },
                                            style: {
                                                background: '#00afec',
                                                color: 'white',
                                                cursor: 'pointer'
                                            }
                                        };
                                    }
                                    return {
                                        onClick: () => {
                                            this.setState({
                                                selectedTableRow: rowInfo.index,
                                                selectedFromWellList: {
                                                    lat: parseFloat(rowInfo.original.Lat, 10),
                                                    lng: parseFloat(rowInfo.original.Long, 10)
                                                }
                                            });
                                            this.props.actions.fetchAll(DOCS, { wells: [rowInfo.original.ID] });
                                        },
                                        style: {
                                            background: rowInfo.index === this.state.selectedTableRow ? '#00afec' : 'white',
                                            color: rowInfo.index === this.state.selectedTableRow ? 'white' : 'black',
                                            cursor: 'pointer'
                                        }
                                    };
                                }else{
                                    return {};
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <div className="map-container">
                            <div className="loading-container">
                                <img src="/img/circle-loading-gif.gif" />
                            </div>
                            <GMap
                                markersData={markersData}
                                selectedFromWellList={selectedFromWellList}
                                onClickHandler={this.onMapMarkerClickHandler}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <div id="document-details">
                            { documentDetails }
                        </div>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={8} className="docs-list">
                        <ReactTable
                            data={this.props.docs}
                            key={this.props.docs.length}
                            style={{ margin : 10 }}
                            filterable
                            columns={[
                                        {
                                            id: 'checkbox',
                                            accessor: '',
                                            filterable: false,
                                            Cell: ( rowInfo ) => {
                                                return (
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox"
                                                        checked={rowInfo.checked}
                                                        onChange={() => {}}
                                                    />
                                                );
                                            },
                                            Header: () => {
                                                return (
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox"
                                                        checked={this.state.selectAll === 1}
                                                        ref={input => {
                                                            if (input) {
                                                                input.indeterminate = this.state.selectAll === 2;
                                                            }
                                                        }}
                                                        onChange={() => this.toggleSelectAll()}
                                                    />
                                                );
                                            },
                                            sortable: false,
                                            width: 30
                                        },
                                        {
                                            Header: 'ID',
                                            id: 'ID',
                                            accessor: d => d.ID,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id].toString().indexOf(filter.value) > -1;
                                            }
                                        },
                                        {
                                            Header: 'File Name',
                                            id: 'FileName',
                                            accessor: d => d.FileName,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                                            }
                                        },
                                        {
                                            Header: 'Doc Type',
                                            id: 'DocType',
                                            accessor: d => d.DocType,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                                            }
                                        },
                                        {
                                            Header: 'Run Date',
                                            id: 'RunDate',
                                            accessor: d => d.RunDate,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id] && row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                                            }
                                        },
                                        {
                                            Header: 'Logger',
                                            id: 'Logger',
                                            accessor: d => d.Logger,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                                            }
                                        },
                                        {
                                            Header: 'Well ID',
                                            id: 'Well_ID',
                                            accessor: d => d.Well_ID,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id].toString().indexOf(filter.value.toLowerCase()) > -1;
                                            }
                                        },
                                        {
                                            Header: 'AddedDate',
                                            id: 'AddedDate',
                                            accessor: d => d.AddedDate,
                                            filterMethod: (filter, row) => {
                                                return row[filter.id] && row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) > -1;
                                            }
                                        }
                                    ]
                                }
                            defaultPageSize={10}
                            previousText={'<<'}
                            nextText={'>>'}
                            className="-striped -highlight"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <div id="checkoutlist">
                            {/* checkout */}
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

DashboardContainer.propTypes = {
    actions: PropTypes.object,
    wells: PropTypes.array,
    loadingwells: PropTypes.bool,
    loadingdocs: PropTypes.bool,
    docs: PropTypes.array
};

DashboardContainer.defaultProps = {
    actions: {},
    wells: [],
    docs: [],
    loadingwells: undefined,
    loadingdocs: undefined
};


const mapStateToProps = state => ({
    wells: state.crud.wells,
    docs: state.crud.docs,
    loadingwells: state.crud.loadingwells,
    loadingdocs: state.crud.loadingdocs,
});

/**
 * Map the actions to props.
 */
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
