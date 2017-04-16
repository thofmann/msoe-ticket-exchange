import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class Register extends ListenerComponent {

    getStores() {
        return [];
    }

    getState() {
        return {};
    }

    submit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div id='register'>
                <Notice />
                <Header title='Register' />
                <form>
                    Student email address:
                    <input type='email' required />
                    Backup email address:
                    <input type='email' required />
                    Password:
                    <input type='password' required />
                    Confirm password:
                    <input type='password' required />
                    <input type='submit' onClick={this.submit.bind(this)} />
                </form>
                <Footer />
            </div>
        );
    }

}
