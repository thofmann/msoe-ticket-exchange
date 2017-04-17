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
        if (password !== confirmPassword) {
            this.setState({
                error: 'Your password does not match your confirmation password.'
            });
            return;
        }
        post('student/register', {
            studentEmail,
            backupEmail,
            password
        }).then(() => {
            // TODO
        }).catch(e => {
            this.setState({
                error: e.message
            });
        });
    }

    render() {
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
                </form>
                <Footer />
            </div>
        );
    }

}
