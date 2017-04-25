import React from 'react';
import Side from './side.jsx';

export default class OrderBook extends React.Component {

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        return (
            <div className='orderbook pure-g'>
                <Side side='Bid' orders={this.props.bids} />
                <Side side='Ask' orders={this.props.asks} />
            </div>
        );
    }

}
