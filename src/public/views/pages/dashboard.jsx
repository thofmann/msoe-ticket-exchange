import React from 'react';
import OrderBookStore from '../../stores/order-book-store';
import ListenerComponent from '../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import OrderBook from '../components/order-book.jsx';
import Footer from '../components/footer.jsx';
import Notice from '../components/notice.jsx';

export default class Dashboard extends ListenerComponent {

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
                <Header title='Dashboard' />
                <OrderBook bids={this.state.bids} asks={this.state.asks} />
                <Footer />
            </div>
        );
    }

}
