import React from 'react';
import OrderBookStore from '../../stores/order-book-store';
import AnnouncementStore from '../../stores/announcement-store';
import ListenerComponent from '../../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import OrderBook from '../components/order-book.jsx';
import Stat from '../components/stat.jsx';
import Announcements from '../components/announcements.jsx';
import Footer from '../components/footer.jsx';

export default class Index extends ListenerComponent {

    getStores() {
        return [
            OrderBookStore,
            AnnouncementStore
        ];
    }

    getState() {
        return {
            bids: OrderBookStore.getBids(),
            asks: OrderBookStore.getAsks(),
            announcements: AnnouncementStore.getAnnouncements()
        };
    }

    render() {
        return (
            <div id='index'>
                <Header title='Buy and sell MSOE graduation tickets' />
                <div className='stats pure-g'>
                    <Stat number={'84'} name='Students registered' />
                    <Stat number={'194'} name='Tickets exchanged' />
                    <Stat number={'$20.12'} name='Latest ticket price' />
                </div>
                <OrderBook bids={this.state.bids} asks={this.state.asks} />
                <Announcements announcements={this.state.announcements} />
                <div className='how'>
                    How it works!
                </div>
                <Footer />
            </div>
        );
    }

}
