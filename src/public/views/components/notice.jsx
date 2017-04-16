import React from 'react';

export default class Notice extends React.Component {

    constructor() {
        super();
        this.state = {
            accepted: localStorage.getItem('accepted-terms') === 'accepted'
        };
    }

    accept() {
        localStorage.setItem('accepted-terms', 'accepted');
        this.setState({
            accepted: true
        });
    }

    render() {
        if (this.state.accepted) {
            return false;
        }
        return (
            <div className='overlay'>
                <div className='modal-container'>
                    <div className='modal notice'>
                        <p>Welcome!</p>
                        <p>
                            Please note that the MSOE Ticket Exchange is in no way affiliated with the Milwaukee School of Engineering.
                            This website is <a href='https://github.com/thofmann/msoe-ticket-exchange'>developed</a>, owned, and operated by <a href='http://trevinhofmann.com'>Trevin Hofmann</a>.
                        </p>
                        <p>
                            By using this website, you agree to its <a href='/terms' target='_blank'>terms</a>.
                        </p>
                        <input type='button' value='I accept' onClick={this.accept.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }

}
