import express, { ErrorRequestHandler } from 'express';

const app = express();
const port = 4090;

const contentBasePath = `${process.cwd()}/static`;
const clientErrorPage = `${process.cwd()}/src/errorClient.html`;
const serverErrorPage = `${process.cwd()}/src/errorServer.html`;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    return res.status(200).send('I am ready!');
});

app.use(
    '/',
    express.static(contentBasePath, { maxAge: '1d', extensions: ['html'] })
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
