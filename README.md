A simple notes sharing system built with mongodb, express.js, and cloudflare workers.<br>
[https://notes.wcyat.me](https://notes.wcyat.me)

# Deploy
```
npm install
npm run start
```
the server will start at localhost:4000 (you need to set two environmental variables, mongocred: username:password, mongourl for mongodb)

Then you should host your static content elsewhere, remember to change the links.

# Notes
idgenerator is hosted by cloudflare workers.
