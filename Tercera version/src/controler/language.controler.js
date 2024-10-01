import {getConnection} from "./../database/database";
// getlanguages para ver todos
const getLanguages = async (req,res) => {
    try{
        const connection = await getConnection();
        const result = await connection.query("SELECT id, Nombre, Apellido, Correo, telefono, Rol_id1, contraseña, nombre_usuario FROM usuario");
        console.log(result);
        res.json(result);
    }catch(error){
        res.status(500);
        res.send(error.message);
    }
    
};
/*// getlanguage para ver uno
const getLanguage = async (req,res) => {
    try{
        const {id} = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id, name, programers FROM language WHERE id = ?", id);
        res.json(result);
    }catch(error){
        restart.status(500);
        res.send(error.message);
    }
    
};*/
// addlanguages para añadir uno
const addLanguage=async (req,res) => {
    try{
        const {name,programers}= req.body;

        if(name === undefined || programers === undefined){
            restart.status(400).json({message: "Bad Request. Por favor llene todos los archivos."});
        }

        const language={name,programers};
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO language SET ?", language);
        res.json({message: "Mensaje añadido"});
    }catch(error){
        restart.status(500);
        res.send(error.message);
    }
};
/*// updatelanguage para editar o actualizar uno
const updatelanguage = async (req,res) => {
    try{
        const {id} = req.params;
        const {name,programers}= req.body;

        if(id === undefined || name === undefined || programers === undefined){
            res.status(400).json({message: "Bad Request. Por favor llene todos los archivos."});
        }

        const language = {name, programers};
        const connection = await getConnection();
        const result = await connection.query("UPDATE language SET ? WHERE id = ?", [language, id]);
        res.json(result);
    }catch(error){
        restart.status(500);
        res.send(error.message);
    }
    
};
// deletelanguage para eliminar uno
const deleteLanguage = async (req,res) => {
    try{
        const {id} = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM language WHERE id = ?", id);
        res.json(result);
    }catch(error){
        restart.status(500);
        res.send(error.message);
    }
    
};*/


export const methods = {
    getLanguages,
    /*getLanguage,*/
    addLanguage
    /*updatelanguage,
    deleteLanguage*/
};