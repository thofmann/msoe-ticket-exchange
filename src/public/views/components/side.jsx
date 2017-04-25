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
            <table className='list'>
                <tbody>
                    <tr>
                        <th>Quantity</th>
                        <th>Price each (mBTC)</th>
                    </tr>
                    {this.props.orders.slice(0, 10).map(order => (
                        <tr key={`${order.quantity} ${order.price}`}>
                            <td>{order.quantity}</td>
                            <td>{(order.price / 100000).toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
