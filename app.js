const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');


app.use(bodyParser.json());

//DATABSE CONNECTION
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejsmodule'
});



/**
 * get all Employees 
 */

app.get('/api/getEmployees', (req, res) => {
    let sqlQery = "SELECT * FROM EMPLOYEES";

    let query = conn.query(sqlQery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    })
});

/**
 * get  Employee by id
 */
app.get('/api/getEmployee/:id', (req, res) => {
    let sqlQery = "SELECT * FROM EMPLOYEES WHERE ID =" + req.params.id;

    let query = conn.query(sqlQery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    })
});

/**
 * add  Employee 
 */
app.post('/api/addEmployee', (req, res) => {
    let data = { id: req.body.id, nom: req.body.nom, prenom: req.body.prenom, age: req.body.age };

    let sqlQery = "insert into employees set ?";

    let query = conn.query(sqlQery, data, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * update  Employee 
 */
app.put('/api/updateEmployee/:id', (req, res) => {

    let sqlQery = "UPDATE EMPLOYEES SET NOM='" + req.body.nom + "',PRENOM='" + req.body.prenom + "',AGE=" + req.body.age + " WHERE ID=" + req.params.id;

    let query = conn.query(sqlQery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * DELETEF  Employee 
 */
app.delete('/api/deleteEmployee/:id', (req, res) => {

    let sqlQery = "DELETE FROM EMPLOYEES WHERE ID=" + req.params.id;

    let query = conn.query(sqlQery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * API RESPONSE 
 */
function apiResponse(results) {
    return JSON.stringify({ "status": 200, "error": null, "response": results });
}

