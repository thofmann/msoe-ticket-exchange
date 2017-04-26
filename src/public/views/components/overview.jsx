import React from 'react';
import { Link } from 'react-router-dom';
import { md5 } from '../../lib/crypto';

export default class Overview extends React.Component {

    render() {
        if (this.props.studentEmail === undefined) {
            return false;
        }
        let src = `https://s.gravatar.com/avatar/${md5(this.props.backupEmail)}?s=100`;
        src = `https://s.gravatar.com/avatar/${md5(this.props.studentEmail)}?s=100&d=${encodeURIComponent(src)}`;
        let tickets = this.props.tickets === undefined ? '-' : this.props.tickets;
        let mBTC = this.props.satoshis === undefined ? '-' : this.props.satoshis / 100000;
        return (
            <div className='overview-container pure-u-1-1 pure-u-sm-1-2 pure-u-md-2-3 pure-u-lg-3-4'>
                <div className='overview'>
                    <img src={src} />
                    <div className='details'>
                        <span>Student email address: {this.props.studentEmail}</span>
                        <span>Backup email address: {this.props.backupEmail}</span>
                        <span>Tickets: {tickets} <Link to='/deposit-tickets'>(deposit)</Link> <Link to='/withdraw-tickets'>(withdraw)</Link></span>
                        <span>mBTC: {mBTC} <Link to='/deposit-bitcoins'>(deposit)</Link> <Link to='/withdraw-bitcoins'>(withdraw)</Link></span>
                    </div>
                </div>
            </div>
        );
    }

}
