import React from 'react';
import { Link } from 'react-router-dom';

export default class Footer extends React.Component {

    render() {
        return (
            <div className='header'>
                <div className='top pure-g'>
                    <div className='left pure-u-1-2'>
                        <Link to='/'>MSOE Ticket Exchange</Link>
                    </div>
                    <div className='right pure-u-1-2'>
                        <Link to='/register'>Register</Link>
                        <Link to='/login'>Log In</Link>
                    </div>
                </div>
                <div className='title'>{this.props.title}</div>
            </div>
        );
    }

}
