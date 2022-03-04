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
    
# Production Deployment
1. Clone the project locally
2. Checkout to the staging branch
2. Open the .github/workflow/test-build-deployment.yaml file and on rows 33, 34 replace both urls with Antier API and ReMeCore API
3. Go to Firebase https://console.firebase.google.com/u/0/project/reme-wallet-test/overview
    1. Open Firestore Database
    2. Drop distributions table
    3. Drop users table
4. Go to the setting of the repo https://github.com/ReMe-life/ReMe-Wallet-API/settings/secrets/actions
    1. Update the admin email
    2. Update the admin password
    3. Update the admin private key
    4. Update the blockchain network
    5. Update the distribution contract
    6. Update the signup reward 
    7. Update the encryption secret for the Antier JWT tokens
5. Push the code changes made in test-build-deployment.yaml
6. Check out the deployment - https://github.com/ReMe-life/ReMe-Wallet-API/actions


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
