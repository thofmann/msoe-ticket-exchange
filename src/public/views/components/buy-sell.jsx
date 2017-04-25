import React from 'react';
import { post } from '../../lib/api';

export default class BuySell extends React.Component {

    constructor() {
        super();
        this.state = {
            side: 'bid',
            quantity: '',
            price: '',
            error: undefined,
            status: 'editing'
        };
    }

    buySide() {
        this.setState({
            side: 'bid'
        });
    }

    sellSide() {
        this.setState({
            side: 'ask'
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
        let quantity = this.state.quantity;
        let price = this.state.price;
        if (quantity === '') {
            return this.setState({
                error: 'Please enter a quantity.'
            });
        }
        if (price === '') {
            return this.setState({
                error: 'Please enter a quantity.'
            });
        }
        quantity = parseInt(quantity);
        if (!Number.isInteger(quantity)) {
            return this.setState({
                error: 'Please enter a numeric quantity.'
            });
        }
        if (quantity < 1) {
            return this.setState({
                error: 'Please enter a quantity of at least 1.'
            });
        }
        if (quantity > 1000000) {
            return this.setState({
                error: 'Please enter a quantity no greater than 1,000,000.'
            });
        }
        price = parseFloat(parseFloat(price).toFixed(1));
        if (price < 0.1) {
            return this.setState({
                error: 'Please enter a price of at least 0.1.'
            });
        }
        if (price > 10000) {
            return this.setState({
                error: 'Please enter a price no greater than 10,000.'
            });
        }
        this.setState({
            status: 'confirming',
            quantity: quantity.toString(),
            price: price.toFixed(1)
        });
    }

    confirmOrder() {
        this.setState({
            status: 'submitting'
        });
        let quantity = this.state.quantity;
        let price = this.state.price;
        quantity = parseInt(quantity);
        price = parseFloat(price) * 100 * 1000;
        post(this.state.side, {
            studentEmail: this.props.studentEmail,
            authTokenA: this.props.authTokenA,
            authTokenB: this.props.authTokenB,
            quantity,
            price
        }).then(() => {
            this.setState({
                status: 'editing'
            });
        }).catch(e => {
            this.setState({
                status: 'editing',
                error: e.message
            });
        });
    }

    cancelOrder() {
        this.setState({
            status: 'editing'
        });
    }

    renderConfirmation() {
        if (this.state.status === 'editing') {
            return false;
        }
        let action = this.state.side === 'bid' ? 'buy' : 'sell';
        if (this.state.status === 'confirming') {
            return (
                <div className='overlay'>
                    <div className='modal-container'>
                        <div className='modal'>
                            <p>Are you sure that you would like to <b>{action} {this.state.quantity} tickets</b> for a price of <b>{this.state.price} mBTC each</b>?</p>
                            <input type='button' value='Place Order' onClick={() => this.confirmOrder()} />
                            <input type='button' className='cancel' value='Cancel' onClick={() => this.cancelOrder()} />
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.status === 'submitting') {
            let action = this.state.side === 'bid' ? 'buy' : 'sell';
            return (
                <div className='overlay'>
                    <div className='modal-container'>
                        <div className='modal'>
                            <p>Attempting to <b>{action} {this.state.quantity} tickets</b> for a price of <b>{this.state.price} mBTC each</b>...</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        let buyClass = this.state.side === 'bid' ? 'buy active' : 'buy';
        let sellClass = this.state.side === 'ask' ? 'sell active' : 'sell';
        return (
            <div className='buy-sell-container pure-u-1-1 pure-u-sm-1-2 pure-u-md-1-3 pure-u-lg-1-4'>
                {this.renderConfirmation()}
                <div className='buy-sell'>
                    <span className={buyClass} onClick={() => this.buySide()}>Buy</span>
                    <span className={sellClass} onClick={() => this.sellSide()}>Sell</span>
                    <form onSubmit={e => this.placeOrder(e)}>
                        Quantity (tickets):
                        <input type='number' value={this.state.quantity} min='1' max='1000000' step='1' onChange={e => this.updateQuantity(e)} />
                        Price each (mBTC):
                        <input type='number' value={this.state.price} min='0.1' max='10000' step='0.1' onChange={e => this.updatePrice(e)} />
                        <input type='submit' value='Place order' />
                        {this.state.error === undefined ? false : <div className='error'>{this.state.error}</div>}
                    </form>
                </div>
            </div>
        );
    }

}
