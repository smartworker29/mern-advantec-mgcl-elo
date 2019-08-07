import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import Grid from '@material-ui/core/Grid';
import * as _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

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
    }

    componentDidMount() {
        const countyOptions = _.flatMap(counties);
        console.log('p------------- countyOptions:', countyOptions);
        this.setState({ countyOptions });
    }

    onStateChange = (e) => {
        console.log('======= e state change', e.target.value);
        const selectedState = e.target.value;
        const countyOptions = counties[selectedState];
        this.setState({ selectedState, countyOptions });
    }

    onFilterChange = (e) => {
        console.log('---------- filter change:', e.target.value);
    }

    render() {
        const { documentDetails, filters, docsList, countyOptions, selectedState } = this.state;
        
        return (
            <div className="homepage-container">
                <div className="header">
                    <span className="logo">Logo</span>
                </div>
                <Grid container id="search-filter-section" style={{ height: 650 }}>
                    <Grid item xs={2}>
                        <h2>Search & Filter</h2>
                        <Grid container>
                            <Grid item xs={6}><span>State</span></Grid>
                            <Grid item xs={6}>
                                <select name="state" value={selectedState} onChange={this.onStateChange}>
                                    {stateOptions.map(option =>
                                        <option key={option.abbreviation} value={option.abbreviation}>{option.name}</option>
                                    )}
                                </select>
                            </Grid>
                            <Grid item xs={6}><span>County</span></Grid>
                            <Grid item xs={6}>
                                <select name="county" value={filters.county} onChange={this.onFilterChange}>
                                    {countyOptions.map((option, index) =>
                                        <option key={index} value={option}>{option}</option>
                                    )}
                                </select>
                            </Grid>
                            <Grid item xs={6}><span>Meridian</span></Grid>
                            <Grid item xs={6}>
                                <select name="meridian" value={filters.meridian} onChange={this.onFilterChange}>
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
                            <Grid item xs={6}><span>Keyword</span></Grid>
                            <Grid item xs={12}><input name="keyword" value={filters.keyword} onChange={this.onFilterChange} /></Grid>
                        </Grid>
                        <table>
                            <thead>
                                <tr>
                                    <th>API</th>
                                    <th>OPERATOR</th>
                                    <th>SPOT</th>
                                    <th>ID</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>API</td>
                                    <td>OPERATOR</td>
                                    <td>SPOT</td>
                                    <td>ID</td>
                                    <td>Location</td>
                                </tr>
                            </tbody>
                        </table>
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
                    <Grid item xs={8}>
                        <ReactTable
                            data={docsList}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                            columns={[
                                {
                                    columns: [
                                        {
                                            Header: 'First Name',
                                            accessor: 'firstName',
                                            filterMethod: (filter, row) =>
                                                row[filter.id].startsWith(filter.value) &&
                                                row[filter.id].endsWith(filter.value)
                                            },
                                        {
                                            Header: 'Last Name',
                                            id: 'lastName',
                                            accessor: d => d.lastName,
                                            filterAll: true
                                        }
                                    ]
                                }
                            ]}
                            defaultPageSize={20}
                            className="-striped -highlight"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        checkoutlist
                    </Grid>
                </Grid>
            </div>
        );
    }

}

export default DashboardContainer;