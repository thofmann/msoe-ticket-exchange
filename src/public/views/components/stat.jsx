import React from 'react';

export default class Stat extends React.Component {

    render() {
        return (
            <div className='stat'>
                <div className='number'>{this.props.number}</div>
                <div className='name'>{this.props.name}</div>
            </div>
        );
    }

}
