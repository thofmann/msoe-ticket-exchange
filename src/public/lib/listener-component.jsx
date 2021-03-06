import React from 'react';

export default class ListenerComponent extends React.Component {

    constructor() {
        super();
        this.state = this.getState();
    }

    // Override this method with an array of Stores to listen to
    getStores() {
        return [];
    }

    // Override this method with state retrieved from stores
    getState() {
        return {};
    }

    onChange() {
        this.setState(this.getState());
    }

    componentDidMount() {
        this.getStores().forEach(store => {
            store.addChangeListener(() => this.onChange());
        });
    }

    componentWillUnmount() {
        this.getStores().forEach(store => {
            store.removeChangeListener(() => this.onChange());
        });
    }

}
