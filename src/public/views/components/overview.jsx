import React from 'react';
import { md5 } from '../../lib/crypto';

export default class Overview extends React.Component {

    render() {
        let src = `https://s.gravatar.com/avatar/${md5(this.props.backupEmail)}?s=150`;
        src = `https://s.gravatar.com/avatar/${md5(this.props.studentEmail)}?s=150&d=${encodeURIComponent(src)}`;
        return (
            <div className='overview pure-u-1-1 pure-u-md-1-2'>
                <img src={src} />
            </div>
        );
    }

}
