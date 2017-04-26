import React from 'react';
import CredentialsStore from '../../stores/credentials-store';
import WalletStore from '../../stores/wallet-store';
import OrderBookStore from '../../stores/order-book-store';
import TransactionStore from '../../stores/transaction-store';
import { history } from '../app.jsx';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import MyOrders from '../components/my-orders.jsx';
import OrderBook from '../components/order-book.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';
import Overview from '../components/overview.jsx';
import BuySell from '../components/buy-sell.jsx';
import Transactions from '../components/transactions.jsx';

export default class Dashboard extends ListenerComponent {

    componentDidMount() {
        super.componentDidMount();
        if (!CredentialsStore.isAuthenticated()) {
            history.push('/login');
        }
    }

    getStores() {
        return [
            OrderBookStore,
            WalletStore,
            CredentialsStore,
            TransactionStore
        ];
    }

    getState() {
        return {
            studentEmail: CredentialsStore.getStudentEmail(),
            backupEmail: CredentialsStore.getBackupEmail(),
            authTokenA: CredentialsStore.getAuthTokenA(),
            authTokenB: CredentialsStore.getAuthTokenB(),
            tickets: WalletStore.getTickets(),
            satoshis: WalletStore.getSatoshis(),
            bids: OrderBookStore.getBids(),
            asks: OrderBookStore.getAsks(),
            myBids: OrderBookStore.getMyBids(),
            myAsks: OrderBookStore.getMyAsks(),
            transactions: TransactionStore.getMyTransactions()
        };
    }

    render() {
        return (
            <div id='dashboard'>
                <Notice />
                <Header title='Dashboard' authenticated={true} />
                <div className='pure-g'>
                    <Overview
                        studentEmail={this.state.studentEmail}
                        backupEmail={this.state.backupEmail}
                        tickets={this.state.tickets}
                        satoshis={this.state.satoshis}
                    />
                    <BuySell studentEmail={this.state.studentEmail} authTokenA={this.state.authTokenA} authTokenB={this.state.authTokenB} />
                </div>
                <MyOrders
                    studentEmail={this.state.studentEmail}
                    authTokenA={this.state.authTokenA}
                    authTokenB={this.state.authTokenB}
                    bids={this.state.myBids}
                    asks={this.state.myAsks}
                />
                <OrderBook bids={this.state.bids} asks={this.state.asks} />
                <Transactions transactions={this.state.transactions} />
                <Footer />
            </div>
        );
    }

}
