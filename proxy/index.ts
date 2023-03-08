import * as http from 'http';
import * as httpProxy from 'http-proxy';

interface Options {
    [key: string]: string,
}

const defaultOptions: Options = {
    orca: 'http://localhost:8000',
    web: 'http://localhost:1313',
    port: '3000',
};

console.error('Supported flags:');
for (const key in defaultOptions) {
    console.error(`--${key}=${defaultOptions[key]}`);
}
console.log('\n');

function getOptions() {
    const opts: Options = {};

    process.argv.slice(2).forEach(arg => {
        const parts: string[] = arg.split("=");
        const key = parts[0] && parts[0].replace(/--/g, '');
        if (key) {
            opts[key] = parts[1];
        } else {
            throw new Error('Cannot decode cli arguments');
        }

    });

    return opts;
}

const options: Options = Object.assign({}, defaultOptions, getOptions());

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req: any, res: any) => {
    // if path starts with `/api` it should be proxied to the api
    const regexp = new RegExp('^\/api');
    if (req.url.match(regexp)) {
        // rewrite url and proxy
        req.url = req.url.substr(4);
        proxy.web(req, res, {
            target: options.orca
        });
    } else {
        // everything else is proxied to the web:
        proxy.web(req, res, {
            target: options.web
        });
    }
});

const port: number = parseInt(options.port);
console.log(`listening on port ${port}`);
server.listen(port);
