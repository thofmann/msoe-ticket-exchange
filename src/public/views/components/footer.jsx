import React from 'react';

export default class Footer extends React.Component {

    render() {
        return (
            <div className='footer'>
                <a href='mailto:hofmannt@msoe.edu?subject=MSOE%20Ticket%20Exchange'>
                    Contact
                </a>
                •
                <a href='https://github.com/thofmann/msoe-ticket-exchange'>
                    View Source
                </a>
            </div>
        );
    }

}
