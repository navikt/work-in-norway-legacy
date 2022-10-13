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
    const html = await fetch(`${process.env.CMS_SITE_URL}${req.url}`)
        .then((res) => {
            if (res.ok) {
                return res.text();
            }
            console.log(`Error:`, res);

            throw new Error(res.statusText);
        })
        .catch((e) => {
            return e;
        });

    console.log(
        `Requested ${req.url} from ${process.env.CMS_SITE_URL} - ${html}`
    );

    res.status(200).send(html);
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
