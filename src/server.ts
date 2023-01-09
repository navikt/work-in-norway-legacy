import express from 'express';

const app = express();
const appPort = 4090;

const staticPath = `${process.cwd()}/static`;
const errorFile = `${staticPath}/404.html`;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    return res.status(200).send('I am ready!');
});

app.use('/', express.static(staticPath, { maxAge: 300 }));

app.get('*', (req, res) => {
    console.log(`Not found: ${req.url}`);
    return res.status(404).sendFile(errorFile);
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
