import React from 'react';
import Notice from '../components/notice.jsx';

export default class NotFound extends React.Component {

    render() {
        return (
            <div id='not-found'>
                <Notice />
                <h1>404: Not Found</h1>
            </div>
        );
    }

}
