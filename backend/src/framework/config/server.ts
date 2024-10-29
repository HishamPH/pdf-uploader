import express, { Request, Response, NextFunction, Application } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import session from "express-session";
import { EventEmitter } from "events";

import userRouter from "../routes/userRouter";

const app: Application = express();

const createServer = async () => {
  try {
    //cors setup

    const corsOptions = {
      origin: process.env.ORIGIN || "*",
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
      optionSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
    //size limit for server files
    app.use(express.json({ limit: "12mb" }));
    app.use(express.urlencoded({ limit: "12mb", extended: true }));

    //static files
    app.use(express.static(path.join(__dirname, "../../../public")));
    app.use(cookieParser());
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    //session setup

    app.use(
      session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
      })
    );

    EventEmitter.defaultMaxListeners = 20;

    //routers

    app.use("/user", userRouter);

    //error middlware

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      res.status(500).send("Internal server error! from backend side");
    });
    return app;
  } catch (err) {
    console.log(err);
  }
};

export default createServer;
