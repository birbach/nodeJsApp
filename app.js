const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');


app.use(bodyParser.json());

//DATABSE CONNECTION
// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'nodejsmodule'
// });

conn = null;
tableName = null;
dataBaseData = null;

/**
 * API TO CONNECT TO YOUR DATABASE
 * */
app.post('/', (req, res) => {
    dataBaseData = {
        host: req.body.host,
        user: req.body.user,
        password: req.body.password,
        database: req.body.database
    };

    conn = mysql.createConnection(dataBaseData);
    if (conn) {
        res.send('Connection initalized !');
    }
    else {
        res.send('Connection filed please make sure your data base information is correct !');
    }
});

/**
 * YOUR TABLE NAME 
 */
listOfcolumns = [];
app.post('/api/tableName', (req, res) => {
    let data = { tableName: req.body.tableName };
    tableName = data.tableName;

    let sqlQery = "SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' and TABLE_SCHEMA='" + dataBaseData.database + "' and TABLE_NAME='" + tableName + "'";

    conn.query(sqlQery, data, (err, results) => {
        if (results.length === 0) {
            res.send("TABLE WITH NAME " + tableName + " NOT EXIST IN YOUR DATA BASE " + dataBaseData.database);
        }
        else {
            res.send(" YOUR TABLE IS  " + tableName);
            let query = "select COLUMN_NAME from information_schema.columns where table_name = '" + tableName + "'";
            let resultQuery = conn.query(query, (err, results) => {

                listOfcolumns = results;
                console.log("=========>", listOfcolumns[0]);
            })
        }
    });
});

/**
 * get all Employees 
 */

app.get('/api/getData', (req, res) => {
    let sqlQery = "SELECT * FROM " + tableName;

    let query = conn.query(sqlQery, (err, results) => {
        if (err)
            res.send("PLEASE MAKE SURE TO CREATE A TABLE WITH NAME (" + tableName + ") IN YOUR MYSQL DATA BASE");
        else res.send(apiResponse(results));
    })
});

/**
 * get  Employee by id
 */
app.get('/api/getDataById/:id', (req, res) => {
    let sqlQery = "SELECT * FROM " + tableName + " WHERE ID =" + req.params.id;

    let query = conn.query(sqlQery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    })
});

/**
 * add  Employee 
 */
app.post('/api/addData', (req, res) => {
    // let data = { id: req.body.id, nom: req.body.nom, prenom: req.body.prenom, age: req.body.age };

    let sqlQery = "insert into " + tableName + " set ?";

    let query = conn.query(sqlQery, req.body, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * update  Employee 
 */
app.put('/api/updateData/:id', (req, res) => {

    let sqlQery = "UPDATE " + tableName + " SET NOM='" + req.body.nom + "',PRENOM='" + req.body.prenom + "',AGE=" + req.body.age + " WHERE ID=" + req.params.id;

    let query = conn.query(sqlQery, (err, results) => {
        if (err) throw err;
        res.send(apiResponse(results));
    });
});

/**
 * DELETEF  Employee 
 */
app.delete('/api/deleteData/:id', (req, res) => {

    let sqlQery = "DELETE FROM " + tableName + " WHERE ID=" + req.params.id;

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

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});

