import React from 'react';
import ListenerComponent from '../../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class Login extends ListenerComponent {

    getStores() {
        return [];
    }

    getState() {
        return {};
    }

    render() {
        return (
            <div id='login'>
                <Notice />
                <Header title='Log in' />
                <form>
                    Student email address:
                    <input type='email' pattern='.*@msoe\.edu$' required />
                    Password:
                    <input type='password' />
                    <input type='submit' />
                </form>
                <Footer />
            </div>
        );
    }

}
