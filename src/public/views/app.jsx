import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';

import Index from './pages/index.jsx';
import Terms from './pages/terms.jsx';
import NotFound from './pages/not-found.jsx';

const history = createBrowserHistory();

export default class App extends React.Component {

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path='/' exact component={Index} />
                    <Route path='/terms' component={Terms} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        );
    }

}
