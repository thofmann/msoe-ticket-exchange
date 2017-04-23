import React from 'react';
import Cookies from 'js-cookie';
import qs from 'qs';
import { Dispatcher } from 'consus-core/flux';
import { post } from '../../lib/api';
import { history } from '../app.jsx';
import CredentialsStore from '../../stores/credentials-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class CompleteLogin extends ListenerComponent {

    constructor() {
        super();
        var params = qs.parse(window.location.search.slice(1));
        let studentEmail = CredentialsStore.getStudentEmail();
        let authTokenA = CredentialsStore.getAuthTokenA();
        let authTokenB = params.token;
        if (typeof typeof authTokenA !== 'string' || typeof authTokenB !== 'string') {
            this.state = {
                status: 'failed'
            };
            return;
        }
        this.state = {
            status: 'pending'
        };
        post('student/verify-credentials', {
            studentEmail,
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
            Dispatcher.handleAction('UPDATE_AUTH_TOKEN_B', {
                authTokenB
            });
            history.push('/dashboard');
        }).catch(() => {
            this.setState({
                status: 'failed'
            });
        });
    }

    getStores() {
        return [
            CredentialsStore
        ];
    }

    getState() {
        return {
            authenticated: CredentialsStore.isAuthenticated()
        };
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
                <Header title='Complete login' authenticated={this.state.authenticated} />
                <div className='message'>
                    {message}
                </div>
                <Footer />
            </div>
        );
    }

}
