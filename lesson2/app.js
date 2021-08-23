const express = require("express");
const expressHbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const util = require("util");

const writeFilePromisify = util.promisify(fs.writeFile);
const readFilePromisify = util.promisify(fs.readFile);

const { PORT } = require("./config/config.js");
const users = require("./database/users.json");
const staticPath = path.join(__dirname, "static");
const databasePath = path.join(__dirname, "database", "users.json");

const app = express();

app.set("view engine", ".hbs");
app.engine(".hbs", expressHbs({ defaultLayout: false }));
app.set("views", staticPath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));

const getAllUsers = async () => {
  const users = await readFilePromisify(databasePath);
  return JSON.parse(users);
};

const addUser = async (user) => {
  let users = await getAllUsers();
  users = [...users, user];
  await writeFilePromisify(databasePath, JSON.stringify(users));
};

const getUser = async (email) => {
  const users = await getAllUsers();
  const userByEmail = await users.find((user) => user.email === email);
  return userByEmail;
};

app.get("/", (req, res) => {
  return res.render("mainPage");
});

//login endpoints
app.get("/login", (req, res) => {
  return res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email);

  if (user && user.password === password) {
    res.redirect("/users");
    return;
  } else {
    res.redirect("/registration");
  }
});

//registration endpoints

app.get("/registration", (req, res) => {
  return res.render("registration");
});

app.post("/registration", async (req, res) => {
  const { email, password } = req.body;
  const existsUser = await getUser(email);

  if (existsUser) {
    return res.redirect("/users");
  }

  await addUser({ email, password });

  return res.redirect("/login");
});

//allUsers endpoint

app.get("/users", async (req, res) => {
  const users = await getAllUsers();

  return res.render("users", { users });
});

//user endpoint

app.get("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const users = await getAllUsers();
  const user = users.find((user) => user.email === user_id);

  if (!user) {
    return;
  }

  return res.render("user", { user });
});

app.listen(PORT, () => {});
