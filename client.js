let id = localStorage.id;

function link() {
    let link = document.createElement('p');
    link.id = "link";
    link.innerHTML = `Share this note by url: <a href="${window.location.href.split('?')[0]}?id=${id}">${window.location.href.split('?')[0]}?id=${id}</a>`
    document.getElementById('root').appendChild(link);
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

function changeid (data) {
    id = data;
    localStorage.id = id;
}

function changenote (data) {
    document.getElementById('note').value = data.text;
}

async function init () {
    if (await getvar('id')) {
        id = await getvar('id');
        localStorage.id = id;
    }
    if (id === undefined) {
        axios.get('https://notes.wcyat.me/idgenerator').then(function (res) {
           changeid(res.data);
        })
        return;
    }
    link();
    axios.get(`https://notes-server.wcyat.me/get/${id}`).then(function (res) {
        changenote(res.data);
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
init();
