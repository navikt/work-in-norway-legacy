import { Request, Response } from 'express';
import Cache from 'node-cache';

type FetchResponse = globalThis.Response;

const siteUrl = process.env.CMS_SITE_URL;

const cache = new Cache({ stdTTL: 600 });

const validateHtmlResponse = (response: FetchResponse) =>
    response.ok &&
    response.headers.get('content-type')?.startsWith('text/html');

const processHtmlResponse = async (
    response: FetchResponse
): Promise<string | null> =>
    response
        .text()
        // Rewrite absolute urls to relative
        .then((html) => html.replaceAll(siteUrl, ''))
        .catch((e) => {
            console.error(`Error processing html-response - ${e}`);
            return null;
        });

export const handleProxyRequest = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { path } = req;

    console.log(`Incoming request for ${path}`);

    const cachedHtml = cache.get(path);
    if (cachedHtml) {
        console.log(`Serving request for ${path} from cache`);
        return res.status(200).send(cachedHtml);
    }

    const url = `${siteUrl}${path}`;

    const response = await fetch(url).catch((e) => {
        console.error(`Fetch error for ${path}: ${e}`);
        return null;
    });

    if (!response) {
        return res.status(500).send('Server error');
    }

    if (!validateHtmlResponse(response)) {
        console.log(
            `Invalid response for ${path}: ${response.status} - ${response.statusText}`
        );

        return res.status(404).send('Not found');
    }

    const html = await processHtmlResponse(response);
    if (!html) {
        return res.status(500).send('Server error');
    }

    cache.set(path, html);

    return res.status(200).send(html);
};
