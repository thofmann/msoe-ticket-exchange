import React from 'react';

export default class Side extends React.Component {

    renderList() {
        if (this.props.orders.length === 0) {
            return (
                <div className={`${this.props.side.toLowerCase()} pure-u-1 pure-u-md-1-2`}>
                    <div className='none'>There are currently no {this.props.side.toLowerCase()}s available.</div>
                </div>
            );
        }
        return (
            <div className='list'>
                <tr>
                    <th>Quantity</th>
                    <th>Price (mBTC)</th>
                </tr>
                {this.props.orders.slice(0, 10).map(order => (
                    <tr>
                        <td>{bid.quantity}</td>
                        <td>{bid.price}</td>
                    </tr>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className={`${this.props.side.toLowerCase()} pure-u-1 pure-u-md-1-2`}>
                <div className='top'>
                    <span className='title'>
                        {this.props.side}s
                    </span>
                </div>
                {this.renderList()}
            </div>
        );
    }

}
