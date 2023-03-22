# Development Proxy

This module implements [Node.js](https://nodejs.org/) base proxy server for purposes of working on integration between
static web and api which is used to support certain functionality (like membership application).

## Using Proxy

First make sure yo install all dependecies:

```
# within project root
npm install
```

Then you can simply start proxy

```shell
# within project root
npm start
```

or build proxy (TypeScript to JavaScript):

```shell
# within project root
npm run build
```

You can also optionaly supply command line options to override defaults like:

```shell
# within project root
npm start -- --web=https://ictunion.cz --port=8080
```

List of avaiable options is supported options is print during the startup of the server:

```shell
# within project root
npm start

> ictunion@1.0.0 start
> npm run build && node proxy/index.js


> ictunion@1.0.0 build
> npx tsc proxy/index.ts --strict

Supported flags:
--orca=http://localhost:8000
--web=http://localhost:1313
--port=3000


listening on port 3000
```

## Configuring Hugo

You will also need to run hugo with special parameters so that it doesn't redirect to the wrong URL.

For instance if you're using just default options to run the proxy you can run hugo using:

```
# within project root
hugo server --watch -D -b "http://localhost:3000" --appendPort=False
```
