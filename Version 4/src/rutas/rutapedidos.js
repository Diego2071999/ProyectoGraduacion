import {Router} from "express";
import { methods as pedidosControler } from "../controler/recetacontroler.js";
import { methods as relaciones } from "../controler/relacionescontroler.js";

const router=Router();
router.get("/paci", pedidosControler.getAllPacientes);
router.get("/paci/:id", pedidosControler.getPaciente),
router.post("/paci", pedidosControler.createPaciente);
router.put("/paci/:id", pedidosControler.updatePaciente);
router.delete("/paci/:id", pedidosControler.deletePaciente);

router.get("/doc", pedidosControler.getAllDoctores);
router.get("/doc/:id", pedidosControler.getDoctor);
router.post("/doc", pedidosControler.createDoctor);
router.put("/doc/:id", pedidosControler.updateDoctor);
router.delete("/doc/:id", pedidosControler.deleteDoctor);

router.get("/receta", pedidosControler.getAllDetalleRecetas);
router.get("/receta/:id", pedidosControler.getDetalleReceta);
router.post("/receta", pedidosControler.createDoctor);
router.put("/recet/:id", pedidosControler.updateDetalleReceta);
router.delete("/receta/:id", pedidosControler.deleteDetalleReceta);

router.get("/docpaci", relaciones.getAllDoctorPacientes);
router.get("/docpaci/:id", relaciones.getDoctorPaciente);
router.post("/docpaci", relaciones.createDoctorPaciente);
router.put("/docpaci/:id", relaciones.updateDoctorPaciente);
router.delete("/docpaci/:id", relaciones.deleteDoctorPaciente);

export default router;