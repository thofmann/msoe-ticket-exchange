import React from 'react';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class Terms extends React.Component {

    render() {
        return (
            <div id='terms'>
                <Header title='Terms' />
                <div className='terms'>
                    <p>1. By using this website, you agree that you are currently a student at the Milwaukee School of Engineering.</p>
                    <p>2. The funds and tickets credited to a student on the website are in my custodial possession, but they remain the property of that student.</p>
                    <p>3. I will make a reasonable effort to return all tickets to their owners before May 27, 2017. Any remaining tickets will be assumed abandoned and forfeit by the student.</p>
                    <p>4. I will make a reasonable effort to return all funds to their owners before June 27, 2017. Any remaining funds will be assumed abandoned and forfeit by the student.</p>
                    <p>5. I reserve the right to buy and sell tickets on this website, but I may only trade with my own funds and tickets.</p>
                </div>
                <Footer />
            </div>
        );
    }

}
