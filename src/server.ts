import express, { ErrorRequestHandler } from 'express';

const app = express();
const port = 4090;

const staticPath = `${process.cwd()}/static`;
const clientErrorHtml = `${staticPath}/404.html`;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    return res.status(200).send('I am ready!');
});

app.use(
    '/',
    express.static(staticPath, { maxAge: '1d', extensions: ['html'] })
);

app.get('*', (req, res) => {
    console.log(`Not found: ${req.url}`);
    return res.status(404).sendFile(clientErrorHtml);
});

app.use(((err, req, res, _) => {
    const { path } = req;
    const { status, stack } = err;
    const msg = stack?.split('\n')[0];

    console.log(`Express error on path ${path}: ${status} ${msg}`);

    const statusCode = status || 500;

    res.status(statusCode);

    if (statusCode < 500) {
        return res.sendFile(clientErrorHtml);
    }

    return res.send(`Server-feil - Feilkode ${status}`);
}) as ErrorRequestHandler);

const server = app.listen(port, () => {
    console.log(`Server starting on port ${port}`);
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
