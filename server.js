const express = require('express');
const next = require('next');
const sanityClient = require('@sanity/client')
const Router = require('./routes').Router;
const { rssHandler, jsonHandler } = require('./routeHandlers')
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const client = sanityClient({
  projectId: 'zx5z31i3',
  dataset: 'production',
  useCdn: true
})

function getShow({res, from = 0, to = 100}) {
  return client.fetch(`*[_type == "episode"][${from}..${to}]`).then(shows => res.json(shows)).catch(err => res.json({ err }));
}

app.prepare().then(() => {
  const server = express();

  // API endpoints
  server.get('/api/shows', (req, res) => {
    return getShow({res})
  });

  server.get('/api/shows/:number', async ({params: { number = 0 } = {}}, res) => {
    const show = await getShow({res, from: number, to: number });
    if (show) {
      res.json(show);
      return;
    }
    res.status(404).json({ message: 'Sorry not found' });
  });

  server.get('/feed/rss', rssHandler)
  server.get('/feed/json', jsonHandler)

  // Custom Next.js URLs
  Router.forEachPattern((page, pattern, defaultParams) => {
    server.get(pattern, (req, res) => {
      app.render(req, res, `/${page}`, Object.assign({}, defaultParams, req.query, req.params));
    });
  });

  // everything else
  server.get('*', (req, res) => handle(req, res));
  server.listen(port, () => `Listening on ${port}`);
});
