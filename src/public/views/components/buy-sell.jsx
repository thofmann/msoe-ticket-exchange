import React from 'react';

export default class BuySell extends React.Component {

    constructor() {
        super();
        this.state = {
            side: 'buy'
        };
    }

    render() {
        return (
            <div className='buy-sell-container pure-u-1-1 pure-u-md-1-2'>
                <div className='buy-sell'>
                    <span className='buy active'>Buy</span>
                    <span className='sell'>Sell</span>
                    <form>
                        <input type='number' />
                        <input type='number' />
                        <input type='submit' />
                    </form>
                </div>
            </div>
        );
    }

}
