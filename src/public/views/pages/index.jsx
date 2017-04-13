import React from 'react';
import ListenerComponent from '../../../lib/listener-component.jsx';

export default class Index extends ListenerComponent {

    getStores() {
        return [];
    }

    getState() {
        return {};
    }

    render() {
        return (
            <div id='index'>
                <h1>MSOE Ticket Exchange</h1>
            </div>
        );
    }

}
