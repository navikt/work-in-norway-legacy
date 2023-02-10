import express, { ErrorRequestHandler } from 'express';
import compression from 'compression';

const app = express();
const port = 4090;

const staticBasePath = `${process.cwd()}/static`;
const siteBasePath = `${staticBasePath}/site`;
const clientErrorPage = `${staticBasePath}/errorClient.html`;
const serverErrorPage = `${staticBasePath}/errorServer.html`;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    return res.status(200).send('I am ready!');
});

app.get('/en', (req, res) => {
    return res.redirect(301, '/en/Home');
});

app.get('/no', (req, res) => {
    return res.redirect(301, '/no/Forside');
});

app.use(
    '/',
    compression(),
    express.static(siteBasePath, { maxAge: '1h', extensions: ['html'] })
);

app.get('*', (req, res) => {
    console.log(`Not found: ${req.url}`);
    return res.status(404).sendFile(clientErrorPage);
});

app.use(((err, req, res, _) => {
    const { path } = req;
    const { status, stack } = err;
    const msg = stack?.split('\n')[0];

    console.log(`Express error on path ${path}: ${status} ${msg}`);

    const statusCode = status || 500;

    res.status(statusCode);

    if (statusCode < 500) {
        return res.sendFile(clientErrorPage);
    }

    return res.sendFile(serverErrorPage);
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
