import React from 'react';
import CredentialsStore from '../../stores/credentials-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class Fees extends ListenerComponent {

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
            <div id='fees'>
                <Header title='Fees' authenticated={this.state.authenticated} />
                <div className='fees'>
                    <p>1. There are no fees for depositing and withdrawing tickets.</p>
                    <p>2. You are responsible for paying the Bitcoin transaction fee to deposit bitcoins.</p>
                    <p>3. The Bitcoin transaction fee will be subtracted from bitcoin withdrawals.</p>
                    <p>4. A 5% fee will be subtracted from the bitcoins received when selling tickets. For example, you will receive 9.5 mBTC if you sell two tickets for a price of 5 mBTC each.</p>
                    <p>5. There are no fees for buying tickets.</p>
                </div>
                <Footer />
            </div>
        );
    }

}
