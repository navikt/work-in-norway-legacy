import express from 'express';

const app = express();
const appPort = 4090;

let isReady = false;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    if (!isReady) {
        return res.status(503).send('I am not ready...');
    }

    return res.status(200).send('I am ready!');
});

app.get('*', async (req, res) => {
    console.log('test');
    res.status(200).send(req.url);
});

const server = app.listen(appPort, () => {
    console.log(`Server starting on port ${appPort}`);
});

const shutdown = () => {
    console.log('Server shutting down');

    server.close(() => {
        console.log('Shutdown complete!');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
