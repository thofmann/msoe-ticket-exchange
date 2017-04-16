import React from 'react';

export default class Stat extends React.Component {

    render() {
        return (
            <div className='stat pure-u-1 pure-u-md-1-3'>
                <div className='number'>
                    {this.props.number === undefined ? '-' : this.props.number}
                </div>
                <div className='name'>
                    {this.props.name}
                </div>
            </div>
        );
    }

}
