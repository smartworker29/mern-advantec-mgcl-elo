import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import Grid from '@material-ui/core/Grid';
import * as _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { WELLS, DOCS } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import stateOptions from '../../utils/us-states';
import counties from '../../utils/counties.json';
import './dashboard.css';
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
        const selectedState = e.target.value;
        const countyOptions = counties[selectedState];
        this.setState({ selectedState, countyOptions });
    }

    onFilterChange = (e) => {
        // eslint-disable-next-line no-console
        console.log('---------- filter change:', e.target.value);
    }

    render() {
        const { documentDetails, filters, countyOptions, selectedState } = this.state;

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
                                <select name="state" value={selectedState} onChange={this.onStateChange}>
                                    <option value={undefined}>&nbsp;</option>
                                    {stateOptions.map(option =>
                                        <option key={option.abbreviation} value={option.abbreviation}>{option.name}</option>
                                    )}
                                </select>
                            </Grid>
                            <Grid item xs={6}><span>County</span></Grid>
                            <Grid item xs={6}>
                                <select name="county" value={filters.county} onChange={this.onFilterChange}>
                                    <option value={undefined}>&nbsp;</option>
                                    {countyOptions.map((option, index) =>
                                        <option key={index} value={option}>{option}</option>
                                    )}
                                </select>
                            </Grid>
                            <Grid item xs={6}><span>Meridian</span></Grid>
                            <Grid item xs={6}>
                                <select name="meridian" value={filters.meridian} onChange={this.onFilterChange}>
                                    <option value={undefined}>&nbsp;</option>
                                    <option value={'Indian'}>Indian</option>
                                    <option value={'Cimarron'}>Cimarron</option>
                                </select>
                            </Grid>
                            <Grid item xs={6}><span>Section</span></Grid>
                            <Grid item xs={6}><input name="section" value={filters.section} onChange={this.onFilterChange} /></Grid>
                            <Grid item xs={6}><span>Township</span></Grid>
                            <Grid item xs={6}><input name="township" value={filters.township} onChange={this.onFilterChange} /></Grid>
                            <Grid item xs={6}><span>Range</span></Grid>
                            <Grid item xs={6}><input name="range" value={filters.range} onChange={this.onFilterChange} /></Grid>
                            <Grid item xs={6}><span style={{ margin: '5px 0' }}>Keyword</span></Grid>
                            <Grid item xs={12}><input name="keyword" value={filters.keyword} onChange={this.onFilterChange} /></Grid>
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
                        <GoogleMap
                            bootstrapURLKeys={{key: 'AIzaSyDYJ8d9-x2HXzamwTMBbqftgQnKPgM44Vs' }}
                            center={[ 36.256250999999999, -99.563209999999998 ]}
                            zoom={5}
                        />
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
