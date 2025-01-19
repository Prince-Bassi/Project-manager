const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const mysql = require("mysql");
const { spawn } = require('child_process');

const app = express();
const compiler = webpack(webpackConfig);
const PORT = +process.argv[2];

const db = mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.PROJECT_MANAGER_DB,
       // connectionLimit: process.env.DB_POOL_LIMIT,
});

// db.query("ALTER TABLE projects ADD COLUMN port INT NOT NULL;", (err, results) => {
//        if (err) throw err;

//        console.log(results);
// })

const servers = {};

app.use(express.static(path.join(__dirname, "ProjectFiles")));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(
       webpackDevMiddleware(compiler, {
              publicPath: webpackConfig.output.publicPath,
              stats: { colors: true },
       })
);

app.use(webpackHotMiddleware(compiler));

app.get("/getProjects", (req, res, next) => {
       db.query("SELECT * FROM projects;", (err, results) => {
              if (err) next(err);

              res.status(200).json(results);
       });
});

app.post("/addProject", (req, res, next) => {
       const {name, path, port} = req.body;

       if (!(name && path && port)) {
              next(new Error("Insufficient data provided"));
              return;
       }

       db.query("INSERT INTO projects (name, path, port) VALUES (?, ?, ?);", [name, path, port], (err, results) => {
              if (err) next(err);

              res.status(200).json({message: "Project Added", id: results.insertId});
       });
});

app.delete("/deleteProject", (req, res, next) => {
       const id = req.body.id;

       if (!id) next(new Error("No ID Provided"));

       db.query("DELETE FROM projects WHERE id = ?", [id], (err, results) => {
              if (err) next(err);

              res.status(200).send("Project Deleted");
       });
});

app.patch("/updateProject/:id", (req, res, next) => {
       const {id} = req.params;

       const keys = Object.keys(req.body);
       const values = Object.values(req.body);

       if (!(keys.length && id)) {
              next(new Error("Insufficient data provided"));
              return;
       }

       const set = keys.map(key => `${key} = ?`).join(", ");
       db.query(`UPDATE projects SET ${set} WHERE id = ?;`, [...values, id], (err, results) => {
              if (err) next(err);

              res.status(200).send("Project updated");
       });
});

app.post("/runProject", (req, res, next) => {
       const withConsole = req.body.withConsole;
       const {id, name, path, port} = req.body.projectInfo;

       if (!(id && name && path && port)) {
              res.status(400).send("Insufficient data provided");
              return;
       }
       else if (servers[id]) {
              res.status(400).send("Server already running");
              return;
       }

       let proc;
       if (withConsole) {
              proc = spawn("cmd", ["/c", "node server.js", port], {
                     cwd: path,
                     detached: true
              });
       }
       else proc = spawn("node",  ["server.js", port], {cwd: path});

       proc.on("error", (err) => {
              console.error(`Failed to start process: ${err.message}`);
       });

       proc.on("exit", (code) => {
              console.log(`Server "${name}" stopped with code ${code}.`);
              delete servers[id];
       });

       if (!withConsole) servers[id] = proc;
       console.log(`Server ${name} started...`);
       res.status(200).send(`Server ${name} starting on ${port}`);
});

app.post("/stopProject", (req, res, next) => {
       const id = req.body.id;

       if (!id) {
              res.status(400).send("No ID Provided");
              return;
       }
       else if (!servers[id]) {
              res.status(400).send("Server not running");
              return;
       }

       servers[id].kill("SIGTERM");
       delete servers[id];

       res.status(200).send(`Project ${id} stopped`);
});

app.get("*", (req, res) => {
       res.sendFile(path.join(__dirname, "ProjectFiles", "index.html"));
});

app.use((err, req, res, next) => {
       console.error(err);
       res.status(err.statusCode || 500).send(err.message || "Something unexpected happened");
});

app.listen(PORT, () => {
       console.log("Server running on PORT:", PORT);
});
