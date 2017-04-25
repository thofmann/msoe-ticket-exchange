import React from 'react';
import { post } from '../../lib/api';

export default class BuySell extends React.Component {

    constructor() {
        super();
        this.state = {
            side: 'buy',
            quantity: '',
            price: '',
            error: undefined
        };
    }

    buySide() {
        this.setState({
            side: 'buy'
        });
    }

    sellSide() {
        this.setState({
            side: 'sell'
        });
    }

    updateQuantity(e) {
        this.setState({
            quantity: e.target.value,
            error: undefined
        });
    }

    updatePrice(e) {
        this.setState({
            price: e.target.value,
            error: undefined
        });
    }

    placeOrder(e) {
        e.preventDefault();
        if (this.state.side === 'buy') {
            post('bid', {
                studentEmail: this.state.studentEmail,
                authTokenA: this.props.authTokenA,
                authTokenB: this.props.authTokenB,
                quantity: this.state.quantity,
                price: this.state.price
            });
        }
    }

    render() {
        let buyClass = this.state.side === 'buy' ? 'buy active' : 'buy';
        let sellClass = this.state.side === 'sell' ? 'sell active' : 'sell';
        return (
            <div className='buy-sell-container pure-u-1-1 pure-u-sm-1-2 pure-u-md-1-3 pure-u-lg-1-4'>
                <div className='buy-sell'>
                    <span className={buyClass} onClick={() => this.buySide()}>Buy</span>
                    <span className={sellClass} onClick={() => this.sellSide()}>Sell</span>
                    <form onSubmit={e => this.placeOrder(e)}>
                        Quantity (tickets):
                        <input type='number' value={this.state.quantity} min='1' max='1000000' step='1' onChange={e => this.updateQuantity(e)} />
                        Price each (mBTC):
                        <input type='number' value={this.state.price} min='0.1' max='10000' step='0.1' onChange={e => this.updatePrice(e)} />
                        <input type='submit' value='Place order' />
                    </form>
                </div>
            </div>
        );
    }

}
