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

app.get('/user/user_id=:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('user')
        .where('user_id', '=', id)
        .then((data) => {
            console.log('Get user');
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
    db.select('address')
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

app.get('/campaign/address=:address', (req, res) => {
    const { address } = req.params;
    db.select('*')
        .from('campaign')
        .where('address', '=', address)
        .join('user', 'user.user_id', 'campaign.owner')
        .then((data) => {
            console.log('Get campaign');
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/campaign', (req, res) => {
    const { address, owner, description } = req.body;
    console.log(req.body);
    db('campaign')
        .insert({
            address: address,
            owner: owner,
            description: description
        }, 'campaign_id')
        .then((response) => {
            console.log('Campaign Added');
            return res.json({ campaign_id: response[0].campaign_id });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/contribution', (req, res) => {
    db.select('*')
        .from('contribution')
        .then((data) => {
            console.log('Get contributions');
            console.log(data);
            return res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/contribution/campaign=:campaign', (req, res) => {
    const { campaign } = req.params;
    db.select('*')
        .from('contribution')
        .where('campaign', '=', campaign)
        .then((data) => {
            console.log('Get contribution');
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/contribution/contributor=:contributor&campaign=:campaign', (req, res) => {
    const { contributor, campaign } = req.params;
    db.select('*')
        .from('contribution')
        .where('contributor', '=', contributor)
        .where('campaign', '=', campaign)
        .then((data) => {
            console.log('Get contribution');
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/contribution', (req, res) => {
    const { contributor, campaign, hash } = req.body;
    db('contribution')
        .insert({
            hash: hash,
            contributor: contributor,
            campaign: campaign
        }, 'contribution_id')
        .then((response) => {
            console.log('Contribution Added');
            return res.json({ contribution_id: response[0].contribution_id });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.delete('/contribution/contribution_id=:contribution_id', (req, res) => {
    const { contribution_id } = req.params;
    db('contribution')
        .where('contribution_id', '=', contribution_id)
        .del()
        .then((response) => {
            console.log(response)
            console.log('Contribution Deleted');
            return res.json({ "deleted": true });
        })
        .catch((err) => {
            console.log(err);
        });
});

// const Web3 = require("web3");
// const CrowdfundingCampaign = require("../src/contracts/CrowdfundingCampaign.json");
//
// const network = process.env.ETHEREUM_NETWORK;
// const infuraProjectId = process.env.INFURA_PROJECT_ID
// const web3 = new Web3(
//     new Web3.providers.HttpProvider(
//         `https://${network}.infura.io/v3/${infuraProjectId}`
//     )
// );
// app.post('/deploy', async (req, res) => {
//     const {name, account, goal} = req.body;
//
//     const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);
//     web3.eth.accounts.wallet.add(signer);
//
//     console.log(name, account, goal)
//     let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, account);
//     let deployTx = await web3Contract.deploy({
//         data: CrowdfundingCampaign.bytecode,
//         arguments: [name, goal, account]
//     });
//     const deployedContract = await deployTx
//         .send({
//             from: account,
//             gas: await deployTx.estimateGas(),
//         })
//         .on('error', function (error) {
//             console.log(error)
//         })
//         .on("transactionHash", (txhash) => {
//             console.log(`Mining deployment transaction ...`);
//             console.log(`https://${network}.etherscan.io/tx/${txhash}`);
//         });
//     console.log(deployedContract.options.address)
//     return res.json({ contract_address: deployedContract.options.address }); // instance with the new contract address
// });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));