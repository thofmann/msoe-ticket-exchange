import React from 'react';
import { post } from '../../lib/api';

export default class MakeAnnouncement extends React.Component {

    constructor() {
        super();
        this.state = {
            title: '',
            text: '',
            error: undefined,
            status: 'editing'
        };
    }

    updateTitle(e) {
        this.setState({
            title: e.target.value,
            error: undefined
        });
    }

    updateText(e) {
        this.setState({
            text: e.target.value,
            error: undefined
        });
    }

    submit(e) {
        e.preventDefault();
        let title = this.state.title;
        let text = this.state.text;
        if (title === '') {
            return this.setState({
                error: 'Please enter a title.'
            });
        }
        if (text === '') {
            return this.setState({
                error: 'Please enter text.'
            });
        }
        this.setState({
            status: 'confirming'
        });
    }

    confirm() {
        this.setState({
            status: 'submitting'
        });
        let title = this.state.title;
        let text = this.state.text;
        post('announcement', {
            studentEmail: this.props.studentEmail,
            authTokenA: this.props.authTokenA,
            authTokenB: this.props.authTokenB,
            title,
            text
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
                            <p>Are you sure that you would like to make this announcement?</p>
                            <p>Title: {this.state.title}</p>
                            <p>Text: {this.state.text}</p>
                            <input type='button' value='Make Announcement' onClick={() => this.confirm()} />
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
                            <p>Attempting to post announcement...</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className='simple-form-container pure-u-1-1 pure-u-md-1-2'>
                {this.renderConfirmation()}
                <div className='simple-form'>
                    <form onSubmit={e => this.submit(e)}>
                        Title:
                        <input type='text' value={this.state.title} onChange={e => this.updateTitle(e)} />
                        Text:
                        <input type='text' value={this.state.text} onChange={e => this.updateText(e)} />
                        <input type='submit' value='Make Announcement' />
                        {this.state.error === undefined ? false : <div className='error'>{this.state.error}</div>}
                    </form>
                </div>
            </div>
        );
    }

}
