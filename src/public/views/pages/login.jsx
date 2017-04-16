import React from 'react';
import ListenerComponent from '../../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

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
                <Header title='Log in' />
                <form>
                    <input type='email' required />
                    <input type='password' />
                    <input type='submit' />
                </form>
                <Footer />
            </div>
        );
    }

}
