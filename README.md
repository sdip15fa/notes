# Notes

A simple React web app enabling notes sharing (not signed in) and saving (signed in).
Hosted at [notes.wcyat.me](https://notes.wcyat.me).
If signed in, your notes are end-to-end encrypted, which means only you can read your notes, not even me, who owns the api server.

## Deploy

```
yarn install //install packages
```

```
yarn run build //build the react web app
```

```
yarn run start //start the api server at localhost:4000
```

```
yarn run react-start //start the react web app at localhost:3000
```
## How it works
### Anonymous (not signed in)
When you first visit the site, you send a GET request to https://notes.wcyat.me/idgenerator to get a unique id.
If you make any changes, you send a POST request to https://notes.wcyat.me/create that includes your note's id and your note.
After that, if you revisit the site, or any other client visits https://notes.wcyat.me/?id=<your note's id>, you send a GET request to the api server:
```
GET https://api-notes.wcyat.me/get/<your note's id>
```
then you get a json response, in which there is your note.
The tinymce editor's content is then set to your note's text content.
### Signed in
When you create an account at https://notes.wcyat.me/users, you send a POST request to https://api-notes.wcyat.me/users/signup, with your username and password hashed in sha256. The api server then send you your key, which is generated on the server side, and you also receive it every time you sign in.

At https://notes.wcyat.me/notes, every one if your notes created and edited are sent to the api server, after being encrypted with your password hashed in sha512.
Then each time you revisit, you retrieve notes from the api server, decrypt them with your hashed password, and set tinymce editor contents as them.
## Reminders

idgenerator is hosted by cloudflare workers.
Don't forget to change api urls in src/ typescript files (it's fine if you use my api servers).
