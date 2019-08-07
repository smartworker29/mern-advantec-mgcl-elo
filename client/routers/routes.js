import React, {Fragment} from 'react';

// Import routing components
import {Route, Switch} from 'react-router-dom';

// Import custom components
import NotFound from '../components/error/NotFound';
// import LoginForm from '../containers/auth/LoginContainer';
// import SignUpForm from '../containers/auth/SignUpContainer';
import Dashboard from '../containers/dashboard/DashboardContainer';
// import Authentication from './Authentication';

const Router = () => (
    <Fragment>
        <Switch>
            {/* <Route exact path="/dashboard" component={LoginForm}/> */}
            {/* <Route path="/signup" component={SignUpForm}/> */}
            <Switch>
                {/* <Authentication path="/" component={Dashboard}/> */}
                <Route exact path="/" component={Dashboard}/>
            </Switch>

            <Route component={NotFound}/>
        </Switch>
    </Fragment>
);

export default Router;
