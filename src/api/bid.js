import express from 'express';
import ExchangeStore from '../stores/exchange-store';

let app = express();

app.get('/all', (req, res) => {
    res.successJson({
        bids: ExchangeStore.getBids()
    });
});

export default app;
