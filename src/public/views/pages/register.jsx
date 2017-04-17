import React from 'react';
import { post } from '../../lib/api';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class Register extends ListenerComponent {

    constructor() {
        super();
        Object.assign(this.state, {
            studentEmail: '',
            backupEmail: '',
            password: '',
            confirmPassword: '',
            error: undefined,
            completed: false
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

    updateBackupEmail(e) {
        this.setState({
            backupEmail: e.target.value,
            error: undefined
        });
    }

    updatePassword(e) {
        this.setState({
            password: e.target.value,
            error: undefined
        });
    }

    updateConfirmPassword(e) {
        this.setState({
            confirmPassword: e.target.value,
            error: undefined
        });
    }

    submit(e) {
        e.preventDefault();
        let studentEmail = this.state.studentEmail;
        let backupEmail = this.state.backupEmail;
        let password = this.state.password;
        let confirmPassword = this.state.confirmPassword;
        if (studentEmail === '') {
            this.setState({
                error: 'Please enter your student email address.'
            });
            return;
        }
        if (backupEmail === '') {
            this.setState({
                error: 'Please enter a backup email address.'
            });
            return;
        }
        if (password === '') {
            this.setState({
                error: 'Please enter a password.'
            });
            return;
        }
        if (confirmPassword === '') {
            this.setState({
                error: 'Please confirm your password.'
            });
            return;
        }
        if (password !== confirmPassword) {
            this.setState({
                error: 'Your password does not match your confirmation password. Please reconfirm your password.'
            });
            return;
        }
        // TODO: overlay while submitting
        post('student/register', {
            studentEmail,
            backupEmail,
            password
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
        if (this.state.completed) {
            return (
                <div id='register'>
                    <Notice />
                    <Header title='Register' />
                    <div className='success'>
                        You are almost finished!
                        Please check your inboxes ({this.state.studentEmail} and {this.state.backupEmail}) to verify your email addresses.
                    </div>
                    <Footer />
                </div>
            );
        }
        return (
            <div id='register'>
                <Notice />
                <Header title='Register' />
                <form>
                    Student email address:
                    <input type='email' value={this.state.studentEmail} onChange={e => this.updateStudentEmail(e)} required />
                    Backup email address:
                    <input type='email' value={this.state.backupEmail} onChange={e => this.updateBackupEmail(e)} required />
                    Password:
                    <input type='password' value={this.state.password} onChange={e => this.updatePassword(e)} required />
                    Confirm password:
                    <input type='password' value={this.state.confirmPassword} onChange={e => this.updateConfirmPassword(e)} required />
                    <input type='submit' onClick={this.submit.bind(this)} />
                    {this.state.error === undefined ? false : <div className='error'>{this.state.error}</div>}
                </form>
                <Footer />
            </div>
        );
    }

}
