import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import GoogleMap from 'google-map-react';
import Grid from '@material-ui/core/Grid';
import * as _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Select from 'react-select';

import GMap from '../../components/GMap';
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
                state: undefined,
                county: undefined,
                meridian: undefined,
                section: undefined,
                township: undefined,
                range: undefined,
                keyword: undefined
            },
            selectedState: undefined,
            docsList: [],
            countyOptions: []
        };

        props.actions.fetchAll(WELLS);
        props.actions.fetchAll(DOCS);
    }

    componentDidMount() {
        const countyOptions = _.flatMap(counties);
        this.setState({ countyOptions });
    }

    onStateChange = (e) => {
        const selectedState = e.value;
        const countyOptions = counties[selectedState];
        this.setState({ selectedState, countyOptions });
    }

    onFilterChange = (e, prop) => {
        // eslint-disable-next-line no-console
        // console.log('---------- filter change:', e.target.value);
        const { filters } = this.state;
        filters[prop] = e.target ? e.target.value : e.value;
        this.setState({ filters });
    }

    getMarkersData = () => {
        // const susolvkaCoords = { lat: 36.5, lng: -99.5 };

        return this.props.wells.map((well, index) => ({
            id: index,
            lat: parseFloat(well.Lat, 10),
            lng: parseFloat(well.Long, 10)
        }));
    }

    render() {
        const { documentDetails, filters, countyOptions } = this.state;
        const markersData = this.getMarkersData();
        _.remove(markersData, function (e) {
            return isNaN(e.lat) || isNaN(e.lng);
        });

        const stateOpts = stateOptions.map(option => ({ value: option.abbreviation, label: option.abbreviation }));
        const countyOpts = countyOptions.map(option => ({ value: option, label: option }));

        return (
            <div className="homepage-container">
                <div className="header">
                    <span className="logo">Logo</span>
                </div>
                <Grid container id="search-filter-section">
                    <Grid item xs={2}>
                        <h2>Search & Filter</h2>
                        <Grid container className="filters">
                            <Grid item xs={6}><span>State</span></Grid>
                            <Grid item xs={6}>
                                <Select
                                    defaultValue={undefined}
                                    options={stateOpts}
                                    styles={customStyles}
                                    placeholder=''
                                    onChange={this.onStateChange}
                                />
                            </Grid>
                            <Grid item xs={6}><span>County</span></Grid>
                            <Grid item xs={6}>
                                <Select
                                    name="county" 
                                    defaultValue={undefined}
                                    options={countyOpts}
                                    placeholder=''
                                    styles={customStyles}
                                    onChange={(e) => this.onFilterChange(e, 'county')}
                                />
                            </Grid>
                            <Grid item xs={6}><span>Meridian</span></Grid>
                            <Grid item xs={6}>
                                <Select
                                    name="meridian" 
                                    defaultValue={undefined}
                                    options={[
                                        { value: 'Indian', label: 'Indian' },
                                        { value: 'Cimarron', label: 'Cimarron' }
                                    ]}
                                    placeholder=''
                                    styles={customStyles}
                                    onChange={(e) => this.onFilterChange(e, 'meridian')}
                                />
                            </Grid>
                            <Grid item xs={6}><span>Section</span></Grid>
                            <Grid item xs={6}><input name="section" onChange={(e) => this.onFilterChange(e, 'section')} /></Grid>
                            <Grid item xs={6}><span>Township</span></Grid>
                            <Grid item xs={6}><input name="township" onChange={(e) => this.onFilterChange(e, 'township')} /></Grid>
                            <Grid item xs={6}><span>Range</span></Grid>
                            <Grid item xs={6}><input name="range" onChange={(e) => this.onFilterChange(e, 'range')} /></Grid>
                            <Grid item xs={6}><span style={{ margin: '5px 0' }}>Keyword</span></Grid>
                            <Grid item xs={12}><input name="keyword" className="keyword" onChange={(e) => this.onFilterChange(e, 'keyword')} /></Grid>
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
                                            Header: 'SPOT',
                                            accessor: 'Lease'
                                        },
                                        {
                                            Header: 'ID',
                                            accessor: 'ID'
                                        },
                                        {
                                            Header: 'Location',
                                            id: 'location',
                                            accessor: d => `${d.Section}-${d.Township}-${d.Range}`
                                        }
                                    ]
                                }
                            ]}
                            defaultPageSize={20}
                            className="-striped -highlight"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        {markersData.length > 0 &&
                            <GMap key={markersData.length} markersData={markersData} />
                        }
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
                            style={{ margin : 10 }}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
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
                                            accessor: 'ID',
                                            filterMethod: (filter, row) =>
                                                row[filter.id].startsWith(filter.value) &&
                                                row[filter.id].endsWith(filter.value)
                                            },
                                        {
                                            Header: 'File Name',
                                            id: 'FileName',
                                            accessor: d => d.FileName,
                                            filterAll: true
                                        },
                                        {
                                            Header: 'Doc Type',
                                            id: 'DocType',
                                            accessor: d => d.DocType,
                                            filterAll: true
                                        },
                                        {
                                            Header: 'Run Date',
                                            id: 'RunDate',
                                            accessor: d => d.RunDate,
                                            filterAll: true
                                        },
                                        {
                                            Header: 'Logger',
                                            id: 'Logger',
                                            accessor: d => d.Logger,
                                            filterAll: true
                                        },
                                        {
                                            Header: 'Well ID',
                                            id: 'Well_ID',
                                            accessor: d => d.Well_ID,
                                            filterAll: true
                                        },
                                        {
                                            Header: 'AddedDate',
                                            id: 'AddedDate',
                                            accessor: d => d.AddedDate,
                                            filterAll: true
                                        }
                                    ]
                                }
                            defaultPageSize={20}
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
    docs: PropTypes.array
};


const mapStateToProps = state => ({
    wells: state.crud.wells,
    docs: state.crud.docs
});

/**
 * Map the actions to props.
 */
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
