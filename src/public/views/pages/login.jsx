import React from 'react';
import { post } from '../../lib/api';
import { hash } from '../../lib/crypto';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class Login extends ListenerComponent {

    constructor() {
        super();
        Object.assign(this.state, {
            studentEmail: '',
            password: '',
            emailSent: false,
            error: undefined
        });
    }

    getStores() {
        return [];
    }

    getState() {
        return {};
    }

    updateStudentEmail(e) {
        this.setState({
            studentEmail: e.target.value,
            error: undefined
        });
    }

    updatePassword(e) {
        this.setState({
            password: e.target.value,
            error: undefined
        });
    }

    submit(e) {
        e.preventDefault();
        let studentEmail = this.state.studentEmail;
        let password = this.state.password;
        if (studentEmail === '') {
            this.setState({
                error: 'Please enter your student email address.'
            });
            return;
        }
        if (password === '') {
            this.setState({
                error: 'Please enter your password.'
            });
            return;
        }
        // TODO: overlay while submitting?
        post('student/login', {
            studentEmail,
            password: hash(password)
        }).then(() => {
            this.setState({
                completed: true
            });
        }).catch(e => {
            this.setState({
                error: e.message
            });
        });
    }

    render() {
        if (this.state.emailSent) {
            return (
                <div id='login'>
                    <Notice />
                    <Header title='Log in' />
                    <div className='message'>
                        Please check your inbox (<b>{this.state.email}</b>) for your login link.
                    </div>
                    <Footer />
                </div>
            );
        }
        return (
            <div id='login'>
                <Notice />
                <Header title='Log in' />
                <form>
                    Student email address:
                    <input type='email' value={this.state.studentEmail} onChange={e => this.updateStudentEmail(e)} required />
                    Password:
                    <input type='password' value={this.state.password} onChange={e => this.updatePassword(e)} required />
                    <input type='submit' onClick={this.submit.bind(this)} />
                    {this.state.error === undefined ? false : <div className='error'>{this.state.error}</div>}
                </form>
                <Footer />
            </div>
        );
    }

}
