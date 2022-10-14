import { Request, Response } from 'express';
import Cache from 'node-cache';

type FetchResponse = globalThis.Response;

const siteUrl = process.env.CMS_SITE_URL;

const cache = new Cache({ stdTTL: 600 });

const validateHtmlResponse = (response: FetchResponse) =>
    response.ok &&
    response.headers.get('content-type')?.startsWith('text/html');

const processHtmlResponse = async (response: FetchResponse) =>
    await response.text().then((html) => html.replaceAll(siteUrl, '')); // Rewrite absolute urls to relative

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

    const absoluteUrl = `${siteUrl}${path}`;

    const response = await fetch(absoluteUrl).catch((e) => {
        console.error(`Fetch error for ${path}: ${e}`);
        return null;
    });

    if (!response) {
        return res.status(500);
    }

    if (!validateHtmlResponse(response)) {
        console.log(
            `Invalid response for ${path}: ${response.status} - ${response.statusText}`
        );

        return res.status(404).send('404!');
    }

    const html = await processHtmlResponse(response);

    cache.set(path, html);

    return res.status(200).send(html);
};
