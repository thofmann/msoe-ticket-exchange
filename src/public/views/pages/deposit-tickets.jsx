import React from 'react';
import { history } from '../app.jsx';
import CredentialsStore from '../../stores/credentials-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class DepositTickets extends ListenerComponent {

    componentDidMount() {
        super.componentDidMount();
        if (!CredentialsStore.isAuthenticated()) {
            history.push('/');
        }
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
        return (
            <div id='deposit-withdraw'>
                <Header title='Deposit Tickets' authenticated={this.state.authenticated} />
                <div className='deposit-withdraw'>
                    <p>To add tickets to your account, you must physically give them to me (Trevin Hofmann) and provide your student email address. I will then credit your account with the tickets so that you may sell them.</p>
                </div>
                <Footer />
            </div>
        );
    }

}
