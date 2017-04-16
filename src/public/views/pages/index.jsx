import React from 'react';
import OrderBookStore from '../../stores/order-book-store';
import StatsStore from '../../stores/stats-store';
import AnnouncementStore from '../../stores/announcement-store';
import ListenerComponent from '../../../lib/listener-component.jsx';
import Header from '../components/header.jsx';
import OrderBook from '../components/order-book.jsx';
import Stat from '../components/stat.jsx';
import Announcements from '../components/announcements.jsx';
import Footer from '../components/footer.jsx';
import HowStep from '../components/how-step.jsx';

export default class Index extends ListenerComponent {

    getStores() {
        return [
            StatsStore,
            OrderBookStore,
            AnnouncementStore
        ];
    }

    getState() {
        return {
            bids: OrderBookStore.getBids(),
            asks: OrderBookStore.getAsks(),
            announcements: AnnouncementStore.getAnnouncements(),
            studentsRegistered: StatsStore.getStudentsRegistered(),
            ticketsExchanged: StatsStore.getTicketsExchanged(),
            lastPrice: StatsStore.getLastPrice()
        };
    }

    render() {
        return (
            <div id='index'>
                <Header title='Buy and sell MSOE graduation tickets' />
                <div className='stats pure-g'>
                    <Stat number={this.state.studentsRegistered} name='Students registered' />
                    <Stat number={this.state.ticketsExchanged} name='Tickets exchanged' />
                    <Stat number={this.state.lastPrice} name='Latest ticket price' />
                </div>
                <OrderBook bids={this.state.bids} asks={this.state.asks} />
                <Announcements announcements={this.state.announcements} />
                <div className='how pure-g'>
                    <div className='title pure-u-1'>How it works</div>
                    <HowStep title='1. Register' text='Sign up with your msoe.edu student email address.' />
                    <HowStep title='2. Deposit' text='Deposit your tickets (in-person) or funds (online) for trading.' />
                    <HowStep title='3. Trade' text='Buy tickets with your deposited funds, or sell your deposited tickets.' />
                    <HowStep title='4. Withdraw' text='Withdraw your tickets (in-person) or funds (online).' />
                </div>
                <Footer />
            </div>
        );
    }

}
