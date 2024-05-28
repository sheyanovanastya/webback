import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { USERS, ORDERS } from "./db.js";
import { authorizationMiddleware } from "./middlewares.js";

const app = express();
app.use(bodyParser.json());

app.post("/users", (req, res) => {
  const { login } = req.body;

  if (USERS.some(el => el.login === login)) {
    return res.status(400).json({ message: `User with login ${login} already exists` });
  }

  USERS.push(req.body);
  res.status(200).json({ message: "User was created" });
});

app.get("/users", (req, res) => {
  const users = USERS.map(({ password, ...rest }) => rest);
  res.status(200).json(users);
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  const user = USERS.find(el => el.login === login && el.password === password);

  if (!user) {
    return res.status(400).json({ message: "User was not found" });
  }

  const token = crypto.randomUUID();
  user.token = token;
  USERS.save(login, { token });

  res.status(200).json({ token, message: "User was logged in" });
});

app.post("/orders", authorizationMiddleware, (req, res) => {
  const { body, user } = req;
  const price = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

  const order = { ...body, login: user.login, price };
  ORDERS.push(order);

  res.status(200).json({ message: "Order was created", order });
});

app.get("/orders", authorizationMiddleware, (req, res) => {
  const { user } = req;
  const orders = ORDERS.filter(el => el.login === user.login);
  res.status(200).json(orders);
});

const getLastUniqueAddresses = (orders, field, count) => {
  const uniqueAddresses = Array.from(new Set(orders.map(order => order[field])));
  return uniqueAddresses.slice(-count);
};

app.get("/address/from/last-5", authorizationMiddleware, (req, res) => {
  try {
    const { user } = req;
    const orders = ORDERS.filter(order => order.login === user.login);
    res.status(200).json(getLastUniqueAddresses(orders, 'from', 5));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/address/to/last-5", authorizationMiddleware, (req, res) => {
  try {
    const { user } = req;
    const orders = ORDERS.filter(order => order.login === user.login);
    res.status(200).json(getLastUniqueAddresses(orders, 'to', 5));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getOrderWithExtremePrice = (orders, comparator) => {
  return orders.reduce((extremeOrder, currentOrder) =>
    comparator(currentOrder.price, extremeOrder.price) ? currentOrder : extremeOrder
  );
};

app.get("/orders/lowest", authorizationMiddleware, (req, res) => {
  try {
    const { user } = req;
    const orders = ORDERS.filter(order => order.login === user.login);

    if (!orders.length) {
      return res.status(404).json({ message: "User do not have orders yet" });
    }

    const lowestOrder = getOrderWithExtremePrice(orders, (a, b) => a < b);
    res.status(200).json(lowestOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/orders/biggest", authorizationMiddleware, (req, res) => {
  try {
    const { user } = req;
    const orders = ORDERS.filter(order => order.login === user.login);

    if (!orders.length) {
      return res.status(404).json({ message: "User do not have orders yet" });
    }

    const biggestOrder = getOrderWithExtremePrice(orders, (a, b) => a > b);
    res.status(200).json(biggestOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(8080, () => console.log("Server was started"));
