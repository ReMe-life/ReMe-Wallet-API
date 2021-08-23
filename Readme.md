<h2 align="center">ReMe Wallet API</h2>

<p align="center"><i>The purpose of the API is to integrate ReMe Wallet platform with RRP system and Merkle distribution API to distribute tokens to the ReMe Wallet users</i><p>

# Prerequisites
* Create **.env** file
* Required configuration variables are in **.env.example**
* Copy the configuration variables from **.env.example** and paste them in **.env** file
* Set the configuration variables


```
# Staging .env

PORT=5050
NODE_ENV=DEV

SIGN_UP_REWARD=200

RRP_ENDPOINT=https://ws-remelife.s6.staging-host.com
REME_CORE_ENDPOINT=https://reme.onlinedemo.space:8492

DB_CONNECTION=''

ADMIN_EMAIL='admin@reme.com'
ADMIN_PASSWORD=''
ADMIN_PRIVATE_KEY=''

BLOCKCHAIN_NETWORK=''
DISTRIBUTION_CONTRACT=''
```

**NOTE!** To set `DB_CONNECTION` variable one needs to
* Open FireBase console 
* Project Overview -> Settings Icon -> Project settings
* Open Service accounts tab
* Copy `databaseURL`
* Click "Generate new private key" button
* Group the databaseUrl and the private key file as follow
    ``` 
    {
        "url": "<databaseUrl here>",
        "serviceAccount": {
            "projectId": "<project_id here>",
            "privateKey": "<private_key here>",
            "clientEmail": "<client_email here>"
        }
    }
    ```
* Stringify the JSON


# Build & Start Project

* Build and start project

    ```
    npm install
    npm run build
    npm run start
    ```

* Start with live changes reloading
    ```
    npm install
    npm run build
    npm run watch
    ```

# Distribution instructions

Request - http://localhost:5050/api/distribution or \<your domain\>/api/distribution   
Authorization - ADMIN_EMAIL & ADMIN_PASSWORD from **.env** file

The distribution works as follow:   
* Retrieve all users from FireBase DB
* For each user
    * Retrieve up-to-date referral balance
    * Calculate new balance to be added
    * Add the new balance to the distribution tree
* Update the root distribution hash

* Updated the .env
  echo REME_CORE_ENDPOINT=https://reme.onlinedemo.space:8492 >> .env
