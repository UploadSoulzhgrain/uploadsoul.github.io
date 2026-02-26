import express from 'express';
const app = express();
const PORT = 3001;

app.get('/test', (req, res) => {
    console.log('Test request received');
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Minimal server on ${PORT}`);
});
