import React from 'react';
import moment from 'moment';

export default class Transactions extends React.Component {

    renderList() {
        if (this.props.transactions.length === 0) {
            return (
                <div className='transactions'>
                    <div className='none'>You do not have any transactions yet.</div>
                </div>
            );
        }
        return (
            <table className='list'>
                <tbody>
                    <tr>
                        <th>Timestamp</th>
                        <th>Amount</th>
                        <th>Description</th>
                    </tr>
                    {this.props.transactions.map(tx => {
                        let amount = tx.amount;
                        let currency = tx.currency;
                        if (currency === 'satoshis') {
                            amount /= 100 * 1000;
                            amount = amount.toFixed(1);
                            currency = 'mBTC';
                        }
                        return (
                            <tr key={`${tx.currency} ${tx.amount} ${tx.description} ${tx.timestamp}`}>
                                <td>{moment(tx.timestamp, 'X').format('MMMM Do YYYY, h:mm:ss a')}</td>
                                <td>{`${amount} ${currency}`}</td>
                                <td>{tx.description}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div className='transactions'>
                <div className='top'>
                    <span className='title'>
                        My Transaction History
                    </span>
                </div>
                {this.renderList()}
            </div>
        );
    }

}
