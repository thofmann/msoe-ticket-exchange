import React from 'react';
import { history } from '../app.jsx';
import CredentialsStore from '../../stores/credentials-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class DepositBitcoins extends ListenerComponent {

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
            authenticated: CredentialsStore.isAuthenticated(),
            bitcoinDepositAddress: CredentialsStore.getBitcoinDepositAddress()
        };
    }

    render() {
        let address = this.state.bitcoinDepositAddress;
        return (
            <div id='deposit-withdraw'>
                <Header title='Deposit Bitcoins' authenticated={this.state.authenticated} />
                <div className='deposit-withdraw'>
                    <p>You can deposit bitcoins into your account by sending payments to the following address. Your deposit will be credited after 6 block confirmations.</p>
                    <div className='bitcoin-address'>
                        <img src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${address}`} />
                        <p><a href={`https://insight.bitpay.com/address/${address}`}>{address}</a></p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}
