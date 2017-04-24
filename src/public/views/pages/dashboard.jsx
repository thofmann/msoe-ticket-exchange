import React from 'react';
import CredentialsStore from '../../stores/credentials-store';
import OrderBookStore from '../../stores/order-book-store';
import { history } from '../app.jsx';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import OrderBook from '../components/order-book.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';
import Overview from '../components/overview.jsx';
import BuySell from '../components/buy-sell.jsx';

export default class Dashboard extends ListenerComponent {

    componentDidMount() {
        if (!CredentialsStore.isAuthenticated()) {
            history.push('/login');
        }
    }

    getStores() {
        return [
            OrderBookStore,
            CredentialsStore
        ];
    }

    getState() {
        return {
            studentEmail: CredentialsStore.getStudentEmail(),
            backupEmail: CredentialsStore.getBackupEmail(),
            bids: OrderBookStore.getBids(),
            asks: OrderBookStore.getAsks()
        };
    }

    render() {
        return (
            <div id='dashboard'>
                <Notice />
                <Header title='Dashboard' authenticated={true} />
                <div className='pure-g'>
                    <Overview studentEmail={this.state.studentEmail} backupEmail={this.state.backupEmail} />
                    <BuySell />
                </div>
                <OrderBook bids={this.state.bids} asks={this.state.asks} />
                <Footer />
            </div>
        );
    }

}
