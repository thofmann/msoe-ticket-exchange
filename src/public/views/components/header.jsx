import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Dispatcher } from 'consus-core/flux';
import { history } from '../app.jsx';

export default class Footer extends React.Component {

    logOut(e) {
        e.preventDefault();
        Cookies.remove('studentEmail');
        Cookies.remove('authTokenA');
        Cookies.remove('authTokenB');
        Dispatcher.handleAction('LOGOUT');
        history.push('/');
    }

    renderRight() {
        if (this.props.authenticated) {
            return (
                <div className='right pure-u-1-2'>
                    <Link to='/dashboard'>Dashboard</Link>
                    <a href='/' onClick={e => this.logOut(e)}>Log Out</a>
                </div>
            );
        }
        return (
            <div className='right pure-u-1-2'>
                <Link to='/register'>Register</Link>
                <Link to='/login'>Log In</Link>
            </div>
        );
    }

    render() {
        return (
            <div className='header'>
                <div className='top pure-g'>
                    <div className='left pure-u-1-2'>
                        <Link to='/'>MSOE Ticket Exchange</Link>
                    </div>
                    {this.renderRight()}
                </div>
                <div className='title'>{this.props.title}</div>
            </div>
        );
    }

}
