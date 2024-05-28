import express from 'express';
import bodyParser from 'body-parser';
import { USERS } from './db.js';
import { OrdersRouter } from './routers/index.js';
import { UserRouter } from './routers/user.routes.js';

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Register routers
app.use(OrdersRouter);
app.use(UserRouter);

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */

// Start the server
app.listen(8080, () => {
  console.log('Server started on port 8080');
});
