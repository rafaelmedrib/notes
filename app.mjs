import express from "express";
import hbs from "hbs";
import * as path from "path";
// import * as favicon from 'serve-favicon';
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as http from "http";
import * as rfs from "rotating-file-stream";
import DBG from "debug";
import { approotdir } from "./approotdir.mjs";
import {
    handle404,
    basicErrorHandler,
    normalizePort,
    onError,
    onListening,
} from "./appsupport.mjs";
import { router } from "./routes/index.mjs";
import { notesRouter } from "./routes/notes.mjs";
import { useModel as useNotesModel } from "./models/notes-store.mjs";
useNotesModel(process.env.NOTES_MODEL || "memory")
.then(() => {})
.catch(err => {
    onError({
        code: "ENOTESSTORE",
        err
    })
});
    

const app = express();
const __dirname = approotdir;
export const debug = DBG("notes:debug");
export const dbgerror = DBG("notes:error");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "partials"));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(process.env.REQUEST_LOG_FORMAT || "dev", {
    stream: process.env.REQUEST_LOG_FILE ?
        rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size: "10M",
            interval: "1d",
            compress: "gzip",
        }) :
        process.stdout,        
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));  

// app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

app.use('/assets/vendor/bootstrap', express.static(path.join(__dirname, 'theme', 'dist')));

// app.use('/assets/vendor/bootstrap/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
// app.use('/assets/vendor/bootstrap/css', express.static(path.join(__dirname, 'theme', 'minty')));

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

server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request ${req.method} ${req.url}`);
})