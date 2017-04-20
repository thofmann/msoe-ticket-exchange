import React from 'react';
import Cookies from 'js-cookie';
import qs from 'qs';
import { post } from '../../lib/api';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class CompleteLogin extends ListenerComponent {

    constructor() {
        super();
        var params = qs.parse(window.location.search.slice(1));
        let authTokenA = Cookies.get('authTokenA');
        let authTokenB = params.token;
        if (typeof authTokenA !== 'string' || typeof authTokenB !== 'string') {
            this.state = {
                status: 'failed'
            };
            return;
        }
        this.state = {
            status: 'pending'
        };
        post('student/complete-login', {
            authTokenA,
            authTokenB
        }).then(() => {
            Cookies.set('authTokenB', authTokenB, {
                expires: 7 // expires in 7 days; TODO: allow user to choose how long the tokens are valid
                // TODO: use 'secure' flag
            });
            this.setState({
                status: 'completed'
            });
            // TODO: create a Credentials/Authentication store
            // TODO: Initialize auth tokens in store with the cookie values
            // TODO: create an action to update the auth tokens with the new authTokenA and authTokenB
            // TODO: Redirect to the dashboard after a couple of seconds
        }).catch(() => {
            this.setState({
                status: 'failed'
            });
        });
    }

    getStores() {
        return [];
    }

    getState() {
        return {};
    }

    render() {
        let message;
        if (this.state.status === 'pending') {
            message = 'Attempting to complete your login attempt...';
        } else if (this.state.status === 'failed') {
            message = 'There was an errror with your login attempt. Please try again.';
        } else {
            message = 'You have logged in successfully! You will now be redirected to your dashboard.';
        }
        return (
            <div id='complete-login'>
                <Notice />
                <Header title='Complete login' />
                <div className='message'>
                    {message}
                </div>
                <Footer />
            </div>
        );
    }

}
