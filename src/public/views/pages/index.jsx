import React from 'react';
import { Link } from 'react-router-dom';
import ListenerComponent from '../../../lib/listener-component.jsx';
import Stat from '../components/stat.jsx';

export default class Index extends ListenerComponent {

    getStores() {
        return [];
    }

    getState() {
        return {};
    }

    render() {
        return (
            <div id='index'>
                <div className='header'>
                    <div className='name'>MSOE Ticket Exchange</div>
                    <Link to='/login' className='login'>Log In</Link>
                    <div className='clear'></div>
                    <div className='title'>Buy and sell MSOE graduation tickets</div>
                </div>
                <div className='stats pure-g'>
                    <Stat number={'84'} name='Students registered' />
                    <Stat number={'194'} name='Tickets exchanged' />
                    <Stat number={'$20.12'} name='Latest ticket price' />
                </div>
            </div>
        );
    }

}
