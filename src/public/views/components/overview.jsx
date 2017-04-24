import React from 'react';
import { md5 } from '../../lib/crypto';

export default class Overview extends React.Component {

    render() {
        let src = `https://s.gravatar.com/avatar/${md5(this.props.backupEmail)}?s=100`;
        src = `https://s.gravatar.com/avatar/${md5(this.props.studentEmail)}?s=100&d=${encodeURIComponent(src)}`;
        return (
            <div className='overview-container pure-u-1-1 pure-u-sm-1-2 pure-u-md-2-3 pure-u-lg-3-4'>
                <div className='overview'>
                    <img src={src} />
                    <div className='details'>
                        <span>Student email address: {this.props.studentEmail}</span>
                        <span>Backup email address: {this.props.backupEmail}</span>
                        <span>Total tickets: {this.props.tickets}</span>
                        <span>Total mBTC: {this.props.satoshis / 100000}</span>
                        <span>Available tickets: {this.props.availableTickets}</span>
                        <span>Available mBTC: {this.props.availableSatoshis / 100000}</span>
                    </div>
                </div>
            </div>
        );
    }

}
