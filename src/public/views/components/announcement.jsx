import React from 'react';
import moment from 'moment';

export default class Announcement extends React.Component {

    render() {
        return (
            <div className='announcement'>
                <h3 className='title'>{this.props.announcement.title}</h3>
                <div className='timestamp'>{moment(this.props.announcement.timestamp, 'X').format('MMMM Do YYYY, h:mm:ss a')}</div>
                <p className='text'>{this.props.announcement.text}</p>
            </div>
        );
    }

}
