import React from 'react';
import { post } from '../../lib/api';

export default class MySide extends React.Component {

    cancel(e, id) {
        e.preventDefault();
        post(`${this.props.side.toLowerCase()}/cancel`, {
            studentEmail: this.props.studentEmail,
            authTokenA: this.props.authTokenA,
            authTokenB: this.props.authTokenB,
            id
        });
    }

    renderList() {
        if (this.props.orders.length === 0) {
            return (
                <div className={`${this.props.side.toLowerCase()} pure-u-1 pure-u-md-1-2`}>
                    <div className='none'>You currently have no {this.props.side.toLowerCase()}s to display.</div>
                </div>
            );
        }
        return (
            <table className='list'>
                <tbody>
                    <tr>
                        <th>Quantity</th>
                        <th>Price each (mBTC)</th>
                        <th></th>
                    </tr>
                    {this.props.orders.slice(0, 10).map(order => (
                        <tr key={order.id}>
                            <td>{order.quantity}</td>
                            <td>{(order.price / 100000).toFixed(1)}</td>
                            <td><a href='/' onClick={e => this.cancel(e, order.id)}>Cancel</a></td>
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
                        My {this.props.side}s
                    </span>
                </div>
                {this.renderList()}
            </div>
        );
    }

}
