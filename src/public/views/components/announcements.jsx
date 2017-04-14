import React from 'react';
import Announcement from './announcement.jsx';

export default class Announcements extends React.Component {

    render() {
        if (this.props.announcements.length === 0) {
            return (
                <div className='announcements'>
                    <div className='title'>Announcements</div>
                    <div className='none'>There are currently no announcements to display.</div>
                </div>
            );
        }
        return (
            <div className='announcements'>
                <div className='title'>Announcements</div>
                {this.props.announcements.map((announcement, i) => <Announcement key={i} announcement={announcement} />)}
            </div>
        );
    }

}
