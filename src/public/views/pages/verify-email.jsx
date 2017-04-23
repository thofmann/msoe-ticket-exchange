import React from 'react';
import qs from 'qs';
import { post } from '../../lib/api';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class VerifyEmail extends React.Component {

    constructor() {
        super();
        var params = qs.parse(window.location.search.slice(1));
        let accept;
        if (params.accept === 'true') {
            accept = true;
        } else if (params.accept === 'false') {
            accept = false;
        }
        let token = params.token;
        if (typeof accept !== 'boolean' || typeof token !== 'string') {
            this.state = {
                status: 'failed',
                message: 'URL parameters were invalid. Please check the link in your inbox again.'
            };
            return;
        }
        this.state = {
            status: 'pending',
            accept
        };
        post('student/verify', {
            accept,
            token
        }).then(() => {
            this.setState({
                status: 'completed'
            });
        }).catch(e => {
            this.setState({
                status: 'failed',
                message: e.message
            });
        });
    }

    render() {
        let message;
        if (this.state.status === 'pending') {
            message = 'Verifying your email address...';
        } else if (this.state.status === 'failed') {
            message = this.state.message;
        } else if (this.state.accept) {
            message = 'This email address was successfully verified!';
        } else {
            message = 'This email address was successfully rejected. The pending account has been discarded.';
        }
        return (
            <div id='verify-email'>
                <Notice />
                <Header title='Verify Email' authenticated={false} />
                <div className='message'>
                    {message}
                </div>
                <Footer />
            </div>
        );
    }

}
