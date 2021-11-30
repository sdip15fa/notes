let id = localStorage.id;

function link() {
  let link = document.createElement('p');
  link.id = "link";
  link.innerHTML = `Share this note by url: <a href="${window.location.href.split('?')[0]}?id=${id}">${window.location.href.split('?')[0]}?id=${id}</a>`
  document.getElementById('root').appendChild(link);
}

function newnote (text) {
  let div = document.createElement('div');
  div.innerHTML = `<div class="form-group">
  <textarea class="form-control" rows="5" name="note">${text}</textarea>
</div>`;
  document.getElementById('root').appendChild(div);
}

function getvar(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (const i of vars) {
    const pair = i.split("=");
    if (pair[0] === variable) {
    return pair[1];
  }
}
  return false;
}

function alertmessage (c, text) {
  document.getElementById('alert').innerHTML = text;
  document.getElementById('alert').className = c;
}

async function init () {
  if (await getvar('id')) {
    id = await getvar('id');
    localStorage.id = id;
  }
  if (id === undefined) {
    axios.get('https://notes.wcyat.me/idgenerator').then(function (res) {
      id = res.data;
      localStorage.id = id;
    })
    return;
  }
  link();
  await axios.get(`https://notes-server.wcyat.me/get/${id}`).then(function (res) {
    document.getElementById('note').value = res.data.text;
  })
}

function createnote(text) {
  const data = {
    id: id,
    text: text
  }
  axios.post('https://notes-server.wcyat.me/create', data)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  if (document.getElementById('link') === null) {
    link();    
  }
}
if (getvar("signedin") === "true") {
  alertmessage("alert alert-warning", `You are already signed in as ${localStorage.username}.`);
}
else if (getvar("signup") === "successful") {
  alertmessage("alert alert-success", `Successfully signed up as ${localStorage.username}.`);
}
else if (getvar("signin") === "successful") {
  alertmessage("alert alert-success", `Successfully signed in as ${localStorage.username}.`);
}
if (localStorage.username && localStorage.key) {
  axios.get(`https://notes-server.wcyat.me/notes/users/${localStorage.key}`)
    .then(function (res) {
      for (i in res.data) {
        newnote(res.data[i]);
      }
    })
}
else {
  init();
}