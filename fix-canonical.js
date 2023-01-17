const fs = require('fs');
const path = require('path');

let files = [];

const getFilesRecursively = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else if (absolute.endsWith('.html')) {
            files.push(absolute.split(path.sep).join(path.posix.sep));
        }
    }
};

const siteDir = `${process.cwd()}/static/site`
    .split(path.sep)
    .join(path.posix.sep);
const siteOrigin = 'https://www.workinnorway.no';

getFilesRecursively(siteDir);

files.forEach((file) => {
    const url = file.replace('.html', '').replace(siteDir, siteOrigin);

    const fileContent = fs.readFileSync(file).toString();
    const withCanonicalTag = fileContent
        .replace(
            /<link\s+rel="canonical"([^/])+(\/>)/,
            `<link rel="canonical" href="${url}" />`
        )
        .replace(
            /<meta\s+property="og:url"([^/])+(\/>)/,
            `<meta property="og:url" content="${url}" />`
        );

    fs.writeFileSync(file, withCanonicalTag);
});
