const express = require('express');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS implemented so that we don't get errors when trying to access the server from a different server location
app.use(cors());

// GET: Fetch all movies from the database
app.get('/user', (req, res) => {
    db.select('*')
        .from('user')
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/user/:email', (req, res) => {
    const email = req.params.email;
    db.select('*')
        .from('user')
        .where('email', '=', email)
        .then((data) => {
            console.log('Get user');
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/user', (req, res) => {
    const { email, password, name, surname, phone } = req.body;
    db('user')
        .insert({
            email: email,
            password: password,
            name: name,
            surname: surname,
            phone: phone
        }, 'user_id')
        .then((response) => {
            console.log('User Added');
            return res.json({ user_id: response[0].user_id });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/campaign', (req, res) => {
    db.select('*')
        .from('campaign')
        .then((data) => {
            console.log('Get campaigns');
            console.log(data);
            return res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/campaign', (req, res) => {
    const { address, owner } = req.body;
    db('campaign')
        .insert({
            address: address,
            owner: owner,
        }, 'campaign_id')
        .then((response) => {
            console.log('Campaign Added');
            return res.json({ campaign_id: response[0].campaign_id });
        })
        .catch((err) => {
            console.log(err);
        });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));