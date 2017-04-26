import React from 'react';
import { post } from '../../lib/api';

export default class GiveTickets extends React.Component {

    constructor() {
        super();
        this.state = {
            recipientStudentEmail: '',
            quantity: '',
            error: undefined,
            status: 'editing'
        };
    }

    updateRecipientStudentEmail(e) {
        this.setState({
            recipientStudentEmail: e.target.value,
            error: undefined
        });
    }

    updateQuantity(e) {
        this.setState({
            quantity: e.target.value,
            error: undefined
        });
    }

    submit(e) {
        e.preventDefault();
        let recipientStudentEmail = this.state.recipientStudentEmail;
        let quantity = this.state.quantity;
        if (quantity === '') {
            return this.setState({
                error: 'Please enter a quantity.'
            });
        }
        if (recipientStudentEmail === '') {
            return this.setState({
                error: 'Please enter a student email.'
            });
        }
        quantity = parseInt(quantity);
        if (!Number.isInteger(quantity)) {
            return this.setState({
                error: 'Please enter a numeric quantity.'
            });
        }
        if (quantity < 1) {
            return this.setState({
                error: 'Please enter a quantity of at least 1.'
            });
        }
        this.setState({
            status: 'confirming',
            quantity: quantity.toString(),
        });
    }

    confirm() {
        this.setState({
            status: 'submitting'
        });
        let recipientStudentEmail = this.state.recipientStudentEmail;
        let quantity = this.state.quantity;
        quantity = parseInt(quantity);
        post('ticket/give', {
            studentEmail: this.props.studentEmail,
            authTokenA: this.props.authTokenA,
            authTokenB: this.props.authTokenB,
            recipientStudentEmail,
            quantity
        }).then(() => {
            this.setState({
                status: 'editing'
            });
        }).catch(e => {
            this.setState({
                status: 'editing',
                error: e.message
            });
        });
    }

    cancel() {
        this.setState({
            status: 'editing'
        });
    }

    renderConfirmation() {
        if (this.state.status === 'editing') {
            return false;
        }
        if (this.state.status === 'confirming') {
            return (
                <div className='overlay'>
                    <div className='modal-container'>
                        <div className='modal'>
                            <p>Are you sure that you would like to <b>give {this.state.quantity} tickets to {this.state.recipientStudentEmail}</b>?</p>
                            <input type='button' value='Give Tickets' onClick={() => this.confirm()} />
                            <input type='button' className='cancel' value='Cancel' onClick={() => this.cancel()} />
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.status === 'submitting') {
            return (
                <div className='overlay'>
                    <div className='modal-container'>
                        <div className='modal'>
                            <p>Attempting to <b>give {this.state.quantity} tickets to {this.state.recipientStudentEmail}</b>...</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className='give-tickets-container'>
                {this.renderConfirmation()}
                <div className='give-tickets'>
                    <form onSubmit={e => this.submit(e)}>
                        Student Email:
                        <input type='email' value={this.state.recipientStudentEmail} onChange={e => this.updateRecipientStudentEmail(e)} />
                        Quantity:
                        <input type='number' value={this.state.quantity} min='1' max='1000' step='1' onChange={e => this.updateQuantity(e)} />
                        <input type='submit' value='Give Tickets' />
                        {this.state.error === undefined ? false : <div className='error'>{this.state.error}</div>}
                    </form>
                </div>
            </div>
        );
    }

}
