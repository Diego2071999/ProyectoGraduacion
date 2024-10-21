import {Router} from "express";
import { methods as factmethods} from "../controler/factcontroler.js";

const factruta = Router();

factruta.get("/fact", factmethods.getAllFacWithRelations);
factruta.post("/fact", factmethods.createFactura);

export default  factruta;
