import express from "express";
import hbs from "hbs";
import * as path from "path";
// import * as favicon from 'serve-favicon';
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as http from "http";
import { approotdir } from "./approotdir.mjs";
import {
    handle404,
    basicErrorHandler,
    normalizePort,
    onError,
    onListening,
} from "./appsupport.mjs";
import { InMemoryNotesStore } from "./models/notes-memory.mjs";
import { router } from "./routes/index.mjs";
import { notesRouter } from "./routes/notes.mjs";


const app = express();
const __dirname = approotdir;
export const NotesStore = new InMemoryNotesStore();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "partials"));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));  

// app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

// app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'theme', 'dist')));

app.use('/assets/vendor/bootstrap/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/assets/vendor/bootstrap/css', express.static(path.join(__dirname, 'theme', 'minty')));

app.use('/assets/vendor/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/assets/vendor/popper.js', express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd'))); 
app.use('/assets/vendor/feather-icons', express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist')));

// Router functions list
app.use("/", router);
app.use('/notes', notesRouter);

// error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);

export default app;

export const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
