//import tinymce from "tinymce";
//import axios from "axios";
let r:boolean = false;
let id:string = localStorage.id;
let usernotes:any, edittimeout:any;
let url:string = "https://api-notes.wcyat.me";
const alerthtml = document.getElementById("alert");
function sleep(ms:number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function link() {
  const link = document.createElement("p");
  link.id = "link";
  link.innerHTML = `Share this note by url: <a href="${
    window.location.href.split("?")[0]
  }?id=${id}">${window.location.href.split("?")[0]}?id=${id}</a>`;
  document.getElementById("root").appendChild(link);
}

async function alertmessage(c:string, text:string) {
  const a = alerthtml;
  a.innerHTML = text;
  a.className = c;
  document.body.insertBefore(a, document.querySelector("h1").nextSibling);
  await sleep(5000);
  document.getElementById("alert").remove();
  localStorage.alerted = true;
}

async function newnote(text:string) {
  let i = 1;
  for (i; true; i++) {
    // @ts-ignore
    if (tinymce.get(`${i}`) === null) {
      break;
    }
  }
  const div = document.createElement("div");
  div.innerHTML = `<br><textarea id="${i}" rows="10" name="note">${text}</textarea>
</div>`;
  document
    .getElementById("root")
    .insertBefore(div, document.getElementById("btn"));
    // @ts-ignore
  tinymce.init({
    selector: "textarea",
    init_instance_callback: function (editor) {
      editor.on("Paste Change input Undo Redo", () => {
        clearTimeout(edittimeout);
        edittimeout = setTimeout(() => {
          usercreate(editor.id);
        }, 500);
      });
    },
  });
}

function logout() {
  delete localStorage.k;
  delete localStorage.username;
  if (localStorage.alerted) {
    delete localStorage.alerted;
  }
  window.location.replace(
    `${window.location.href.split("?")[0]}?logout=successful`
  );
}

function getvar(variable:string) {
  const query:string = window.location.search.substring(1);
  const vars:Array<string> = query.split("&");
  for (const i of vars) {
    const pair:Array<string> = i.split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return "";
}

function usercreate(id:string) {
  if (!usernotes) {
    usernotes = {
      key: localStorage.k,
    };
  }
  // @ts-ignore
  usernotes[id] = tinymce.get(id).getContent();
  // @ts-ignore
  axios
    .post(`${url}/notes/users/${localStorage.k}`, usernotes)
    .then(function (res) {
      console.log(res.data);
    })
    .catch(function () {
      alertmessage("alert alert-danger","404 not found");
    });
}

async function anon() {
  if (await getvar("id")) {
    id = await getvar("id");
    localStorage.id = id;
  }
  if (id === undefined) {
    // @ts-ignore
    await axios.get("https://notes.wcyat.me/idgenerator").then(function (res) {
      id = res.data;
      localStorage.id = id;
    });
  } else {
    // @ts-ignore
    await axios.get(`${url}/get/${id}`).then(function (res) {
      // @ts-ignore
      tinymce.get("note").setContent(res.data.text);
    });
    link();
  }
  r = true;
}

function createnote(text:string) {
  interface data {
    id: string;
    text: string;
  };
  const data = {
    id: id,
    text: text,
  };
  // @ts-ignore
  axios
    .post(`${url}/create`, data)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  if (document.getElementById("link") === null) {
    link();
  }
}
async function testserver(link:string) {
  let r:boolean = false;
  // @ts-ignore
  await axios
    .get(`${link}/testconnection`)
    .then(() => {
      r = true;
    })
    .catch(() => {});
  return r;
}
async function init() {
  const urllist:Array<string> = [
    "https://api-notes.wcyat.me",
    "https://notes-server.wcyat.me",
    "https://api.notes.wcyat.me",
  ];
  for (const i of urllist) {
    if (await testserver(i)) {
      url = i;
      break;
    }
  }
  if (
    getvar("signedin") ||
    getvar("signup") ||
    getvar("signin") ||
    getvar("logout")
  ) {
    if (localStorage.alerted) {
      window.location.replace(window.location.href.split("?")[0]);
    } else {
      alertmessage(
        getvar("signedin") ? "alert alert-warning" : "alert alert-success",
        getvar("signedin")
          ? `You are already signed in as ${localStorage.username}.`
          : getvar("logout")
          ? "Successfully logged out."
          : `Successfully signed ${getvar("signup") ? "up" : "in"} as ${
              localStorage.username
            }.`
      );
    }
  }
  if (localStorage.username && localStorage.k) {
    document.getElementById("header").innerHTML = `<button
    style="margin-top: 10px; margin-right: 10px"
    class="btn btn-secondary float-end"
    onclick="logout()"
  >
    Log out
  </button>`;
    document.getElementById("note").remove();
    // @ts-ignore
    tinymce.EditorManager.execCommand("mceRemoveEditor", true, "note");
    const btn:any = document.createElement("div");
    btn["className"] = "delta";
    btn["id"] = "btn";
    btn["innerHTML"] =
      "<button class=\"btn btn-primary\" onclick=newnote('')>Create</button>";
    document.getElementById("root").appendChild(btn);
    // @ts-ignore
    axios.get(`${url}/notes/users/${localStorage.k}`).then(function (res) {
      for (const i in res.data) {
        newnote(res.data[i]);
      }
      usernotes = res.data;
      usernotes["key"] = localStorage.k;
    });
  } else {
    anon();
  }
}
init();
