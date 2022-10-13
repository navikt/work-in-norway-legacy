import express from 'express';

const app = express();
const appPort = 4090;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    return res.status(200).send('I am ready!');
});

app.get('*', async (req, res) => {
    const response = await fetch(`${process.env.CMS_SITE_URL}${req.url}`);

    const finalText = await response
        .text()
        .then((text) => text.replaceAll(process.env.CMS_SITE_URL, ''));

    const contentType = response.headers.get('content-type') || '';
    res.setHeader('content-type', contentType);

    console.log(`Requested ${req.url} from ${process.env.CMS_SITE_URL}`);

    res.status(200).send(finalText);
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
