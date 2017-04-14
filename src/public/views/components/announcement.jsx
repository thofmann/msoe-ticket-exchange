import React from 'react';

export default class Announcement extends React.Component {

    render() {
        return (
            <div className='announcement'>
                <h3 className='title'>{this.props.announcement.title}</h3>
                <div className='timestamp'>{this.props.announcement.timestamp}</div>
                <p className='text'>{this.props.announcement.text}</p>
            </div>
        );
    }

}
