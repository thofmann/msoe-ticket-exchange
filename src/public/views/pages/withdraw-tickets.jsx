import React from 'react';
import { history } from '../app.jsx';
import CredentialsStore from '../../stores/credentials-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class WithdrawTickets extends ListenerComponent {

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
                <Header title='Withdraw Tickets' authenticated={this.state.authenticated} />
                <div className='deposit-withdraw'>
                    <p>Coming soon...</p>
                </div>
                <Footer />
            </div>
        );
    }

}
