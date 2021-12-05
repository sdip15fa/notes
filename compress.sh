npm install -g uglify-js
uglifyjs assets/js/index.js -o assets/js/index.min.js --source-map "root='https://notes.wcyat.me/',url='index.min.js.map'"
uglifyjs assets/js/users.js -o assets/js/users.min.js --source-map "root='https://notes.wcyat.me/',url='users.min.js.map'"