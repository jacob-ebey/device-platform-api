import mongoose from 'mongoose';
import http from 'http';
import util from 'util';
import url from 'url';
import ws from 'ws';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

import websockets from './server/websockets';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// Configure websockets
const server = http.createServer(app);
const wss = new ws.Server({ server });
wss.on('connection', (socket, req) => {
  const location = url.parse(req.url, true);

  if (location.query.token) {
    socket.on('message', websockets.handleMessage(location.query.token, socket));
  } else {
    socket.close();
  }
});

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  server.listen(process.env.PORT || config.port, () => {
     // eslint-disable-next-line no-console
    console.info(`server started on port ${process.env.PORT || config.port} (${config.env})`);
  });
}

export default app;
