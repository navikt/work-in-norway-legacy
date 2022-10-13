import express from 'express';

const app = express();
const appPort = 4090;

const staticPath = `${process.cwd()}/static`;

app.get('/internal/isAlive', (req, res) => {
    return res.status(200).send('I am alive!');
});

app.get('/internal/isReady', (req, res) => {
    return res.status(200).send('I am ready!');
});

app.use('/', express.static(staticPath));

app.get('*', async (req, res) => {
    const response = await fetch(`${process.env.CMS_SITE_URL}${req.url}`);

    if (!response.ok) {
        return res.status(404).send('404!');
    }

    const finalText = await response
        .text()
        .then((text) => text.replaceAll(process.env.CMS_SITE_URL, ''));

    console.log(`Requested ${req.url} from ${process.env.CMS_SITE_URL}`);

    res.status(200).send(finalText);
});

const server = app.listen(appPort, () => {
    console.log(`Server starting on port ${appPort}`);
    console.log(staticPath);
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
