import React from 'react';
import GoogleMap from 'google-map-react';

import './dashboard.css';

const Dashboard = () => {
	return (
		<div>
            <div className="map-container" >
                <GoogleMap
                    bootstrapURLKeys={{key: 'AIzaSyDYJ8d9-x2HXzamwTMBbqftgQnKPgM44Vs' }}
                    center={[ 36.256250999999999, -99.563209999999998 ]}
                    zoom={5}
                />
            </div>
		</div>
	);
};

export default Dashboard;