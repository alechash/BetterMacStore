<p align="center">
    <img src="/public/img/logo/transparent.svg" width="200px">

<h1 align="center">BetterMacStore</h1>
</p>

This is a Mac App Store on the web, created because I don't like the real one.

# Features

* developer organizations
* release apps for organizations and personal accounts
* upload .app, .zip, and .dmg files
* upload .gif, .png, and .jpg files as app icons and screenshots
* for our electron developers, upload upto 500 megabytes

<img src="/public/img/divider.png" height="20px" width="100%">

# Running Locally
These instructions will be for macOS/Linux systems. Other instructions might be available in the wiki. If they aren't feel free to contribute to the wiki.

## Prerequisites
You will need `MongoDB`, available [here](https://mongodb.com) (you can install through Brew and Apt-Get). <br>
You will need `Node.JS`, available [here](https://nodejs.org). 

## Git Steps
### First, Clone the Repo
`git clone https://github.com/bruggg/BetterMacStore`

### CD to The Dir
`cd BetterMacStore`

## NPM Steps
### Install Packages
`npm install`

## ENV Steps
### Renaming ENV
Find the file named `.env.example`, then rename that file to `.env`

### Filling in the Data
Because you are running the website locally, you can leave the `MONGO` entry alone<br>
`ENV` will need to be changed to `d` because we are in the development mode, if you were to actually deploy the website, you'd want this to be `p`<br>
`NAME` is what will show up on the website, this can be whatever you want<br>
`SECRET` is the encryption key for sessions, this can be whatever you want<br>
`ANALYTICS` is a boolean (true, or false) of whether to load Google Analytics onto the site<br>
if `ANALYTICS` was set to true, you need to provide a GA tracking code (available from analytics.google.com)<br>


### Filling in the Wasabi Data
Wasabi is the provider who stores the files (dmg, app, zip, png, jpg, and gif files)<br>
You'll need to signup at https://wasabi.com<br>
When you create an account, you'll need to create access keys<br>

`WASABI_API_KEY`, you can press "Access Keys" from the dashboard and generate a new API Key<br>
`WASABI_SECRET_KEY`, you will also get a "Secret Key", copy that and input it into the entry<br>
`WASABI_BUCKET_NAME`, is up to you, it is basically what folder your data will be stored in

## More NPM Steps
Now you can run `npm start` in your terminal, now navigate to http://localhost:3000 in your browser<br>

## Making a User Admin
Once you create an account, you can access the database using a tool like [Robo 3T](https://robomongo.org) to access the database and find that account. Then you can right-click and edit entry then change `"admin": false` to `"admin": true`

<img src="/public/img/divider.png" height="20px" width="100%">

# Contributors
You can view all contributors [here](https://github.com/bruggg/BetterMacStore/graphs/contributors).

# Contribute
Pull requests and issues are welcome :)

<img src="/public/img/divider.png" height="20px" width="100%">

# File Structure
All the files are structured in an easy to use manner.

### Routes
All routes are available in the `./routes` folder

### Config
Config files are files with exports, like passport and functions

All config files are available in the `./config` folder

### Modals
Misspelled from `modal` on day one, too late to rename the folder

All modal files are available in the `./moels` folder