import React from 'react';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

export default class Terms extends React.Component {

    render() {
        return (
            <div id='terms'>
                <Header title='Terms' />
                <div className='terms'>
                    <p>1. TODO</p>
                    <p>2. TODO</p>
                    <p>3. TODO</p>
                </div>
                <Footer />
            </div>
        );
    }

}
