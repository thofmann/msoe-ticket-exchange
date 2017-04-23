import React from 'react';
import CredentialsStore from '../../stores/credentials-store';
import OrderBookStore from '../../stores/order-book-store';
import { history } from '../app.jsx';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import OrderBook from '../components/order-book.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class Dashboard extends ListenerComponent {

    componentDidMount() {
        if (!CredentialsStore.isAuthenticated()) {
            history.push('/login');
        }
    }

    getStores() {
        return [
            OrderBookStore
        ];
    }

    getState() {
        return {
            bids: OrderBookStore.getBids(),
            asks: OrderBookStore.getAsks()
        };
    }

    render() {
        return (
            <div id='dashboard'>
                <Notice />
                <Header title='Dashboard' authenticated={true} />
                <OrderBook bids={this.state.bids} asks={this.state.asks} />
                <Footer />
            </div>
        );
    }

}
