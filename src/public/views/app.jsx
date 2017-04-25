import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';

import Index from './pages/index.jsx';
import Register from './pages/register.jsx';
import VerifyEmail from './pages/verify-email.jsx';
import Login from './pages/login.jsx';
import CompleteLogin from './pages/complete-login.jsx';
import Terms from './pages/terms.jsx';
import Fees from './pages/fees.jsx';
import Dashboard from './pages/dashboard.jsx';
import NotFound from './pages/not-found.jsx';

export const history = createBrowserHistory();

export default class App extends React.Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path='/' exact component={Index} />
                    <Route path='/register' component={Register} />
                    <Route path='/verify-email' component={VerifyEmail} />
                    <Route path='/login' component={Login} />
                    <Route path='/complete-login' component={CompleteLogin} />
                    <Route path='/terms' component={Terms} />
                    <Route path='/fees' component={Fees} />
                    <Route path='/dashboard' component={Dashboard} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }

}
