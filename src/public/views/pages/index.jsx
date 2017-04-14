import React from 'react';
import { Link } from 'react-router-dom';
import ListenerComponent from '../../../lib/listener-component.jsx';
import Stat from '../components/stat.jsx';

export default class Index extends ListenerComponent {

    getStores() {
        return [];
    }

    getState() {
        return {
            bids: [
                {
                    quantity: 2,
                    price: 28.0
                },
                {
                    quantity: 1,
                    price: 27.9
                },
                {
                    quantity: 5,
                    price: 27.8
                },
                {
                    quantity: 1,
                    price: 27.5
                },
                {
                    quantity: 1,
                    price: 27.0
                },
                {
                    quantity: 3,
                    price: 25
                }
            ],
            asks: [
                {
                    quantity: 1,
                    price: 28.3
                },
                {
                    quantity: 2,
                    price: 28.5
                },
                {
                    quantity: 1,
                    price: 28.8
                },
                {
                    quantity: 2,
                    price: 29.0
                },
                {
                    quantity: 4,
                    price: 29.2
                },
                {
                    quantity: 3,
                    price: 29.5
                }
            ]
        };
    }

    render() {
        return (
            <div id='index'>
                <div className='header'>
                    <div className='top pure-g'>
                        <div className='left pure-u-1-2'>
                            MSOE Ticket Exchange
                        </div>
                        <div className='right pure-u-1-2'>
                            <Link to='/register'>Register</Link>
                            <Link to='/login'>Log In</Link>
                        </div>
                    </div>
                    <div className='title'>Buy and sell MSOE graduation tickets</div>
                </div>
                <div className='stats pure-g'>
                    <Stat number={'84'} name='Students registered' />
                    <Stat number={'194'} name='Tickets exchanged' />
                    <Stat number={'$20.12'} name='Latest ticket price' />
                </div>
                <div className='orderbook pure-g'>
                    <div className='bids pure-u-1 pure-u-md-1-2'>
                        <div className='top'>
                            <span className='title'>
                                Bids
                            </span>
                        </div>
                        <div className='list'>
                            <tr>
                                <th>Quantity</th>
                                <th>Price (mBTC)</th>
                            </tr>
                            {this.state.bids.map(bid => (
                                <tr>
                                    <td>{bid.quantity}</td>
                                    <td>{bid.price}</td>
                                </tr>
                            ))}
                        </div>
                    </div>
                    <div className='asks pure-u-1 pure-u-md-1-2'>
                        <div className='top'>
                            <span className='title'>
                                Asks
                            </span>
                        </div>
                        <table className='list'>
                            <tr>
                                <th>Quantity</th>
                                <th>Price (mBTC)</th>
                            </tr>
                            {this.state.asks.map(ask => (
                                <tr>
                                    <td>{ask.quantity}</td>
                                    <td>{ask.price}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
                <div className='announcements'>
                    Announcements go here.
                </div>
                <div className='how'>
                    How it works!
                </div>
            </div>
        );
    }

}
