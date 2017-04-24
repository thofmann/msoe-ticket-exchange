import React from 'react';

export default class BuySell extends React.Component {

    constructor() {
        super();
        this.state = {
            side: 'buy'
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

    render() {
        let buyClass = this.state.side === 'buy' ? 'buy active' : 'buy';
        let sellClass = this.state.side === 'sell' ? 'sell active' : 'sell';
        return (
            <div className='buy-sell-container pure-u-1-1 pure-u-sm-1-2 pure-u-md-1-3 pure-u-lg-1-4'>
                <div className='buy-sell'>
                    <span className={buyClass} onClick={() => this.buySide()}>Buy</span>
                    <span className={sellClass} onClick={() => this.sellSide()}>Sell</span>
                    <form>
                        Quantity (tickets):
                        <input type='number' />
                        Price each (mBTC):
                        <input type='number' />
                        <input type='submit' value='Place order' />
                    </form>
                </div>
            </div>
        );
    }

}
