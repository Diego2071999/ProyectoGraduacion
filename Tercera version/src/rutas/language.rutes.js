import {Router} from "express";
import { methods as languageControler } from "../controler/language.controler";

const router=Router();

router.get("/", languageControler.getLanguages);
/*router.get("/:id", languageControler.getLanguage);// para buscar un solo dato en especifico*/
router.post("/", languageControler.addLanguage);
/*router.put("/:id", languageControler.updatelanguage);
router.delete("/:id", languageControler.deleteLanguage);*/

export function getDataFromDatabase(username, password) {
    // Make a database query to retrieve the data
    // Return a promise that resolves with the data
    return fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'usuario=' + encodeURIComponent(username) + '&contraseña=' + encodeURIComponent(password)
    })
    .then(response => response.json());
}

export default router;

export const methods = {
    getDataFromDatabase
};
