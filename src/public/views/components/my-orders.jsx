import React from 'react';
import MySide from './my-side.jsx';

export default class MyOrders extends React.Component {

    shouldComponentUpdate(nextProps) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props);
    }

    render() {
        return (
            <div className='orderbook pure-g'>
                <MySide
                    studentEmail={this.props.studentEmail}
                    authTokenA={this.props.authTokenA}
                    authTokenB={this.props.authTokenB}
                    side='Bid'
                    orders={this.props.bids}
                />
                <MySide
                    studentEmail={this.props.studentEmail}
                    authTokenA={this.props.authTokenA}
                    authTokenB={this.props.authTokenB}
                    side='Ask'
                    orders={this.props.asks}
                />
            </div>
        );
    }

}
