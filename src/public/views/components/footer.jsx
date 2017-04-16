import React from 'react';
import { Link } from 'react-router-dom';

export default class Footer extends React.Component {

    render() {
        return (
            <div className='footer'>
                <a href='mailto:hofmannt@msoe.edu?subject=MSOE%20Ticket%20Exchange'>
                    Contact
                </a>
                •
                <Link to='/terms'>
                    Terms
                </Link>
                •
                <a href='https://github.com/thofmann/msoe-ticket-exchange'>
                    View Source
                </a>
            </div>
        );
    }

}
