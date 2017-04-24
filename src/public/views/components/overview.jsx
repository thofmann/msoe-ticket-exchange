import React from 'react';
import { md5 } from '../../lib/crypto';

export default class Overview extends React.Component {

    render() {
        let src = `https://s.gravatar.com/avatar/${md5(this.props.backupEmail)}?s=100`;
        src = `https://s.gravatar.com/avatar/${md5(this.props.studentEmail)}?s=100&d=${encodeURIComponent(src)}`;
        return (
            <div className='overview-container pure-u-1-1 pure-u-md-1-2'>
                <div className='overview'>
                    <img src={src} />
                    <div className='details'>
                        <span>Student email address: {this.props.studentEmail}</span>
                        <span>Backup email address: {this.props.backupEmail}</span>
                    </div>
                </div>
            </div>
        );
    }

}
