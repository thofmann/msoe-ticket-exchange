import React from 'react';

export default class HowStep extends React.Component {

    render() {
        return (
            <div className='step-container pure-u-1 pure-u-md-1-2 pure-u-lg-1-4'>
                <div className='step'>
                    <div className='title'>{this.props.title}</div>
                    <div className='text'>{this.props.text}</div>
                </div>
            </div>
        );
    }

}
