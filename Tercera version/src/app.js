import express from "express";
import morgan from "morgan";
//routers
import languageRouters from "./rutas/language.rutes";

const app=express();

//settings
app.set("port", 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routers
app.use("/api/languages", languageRouters);

export default app;
