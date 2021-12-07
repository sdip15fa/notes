let s:string = "https://api-notes.wcyat.me";
if (localStorage.k && localStorage.username) {
  if (localStorage.alerted) {
    delete localStorage.alerted;
  }
  window.location.replace("../?signedin=true");
}
async function test(link:string) {
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
function signup() {
  if (
    !document.getElementById("username")["value"] ||
    !document.getElementById("password")["value"]
  ) {
    document.getElementById("warning").innerHTML =
      "Username / password cannot be empty.";
    return;
  }
  // @ts-ignore
  axios
    .post(`${s}/users/signup`, {
      username: document.getElementById("username")["value"],
      password: document.getElementById("password")["value"],
    })
    .then(async function (res) {
      localStorage.username = document.getElementById("username")["value"];
      localStorage.k = await res.data;
      if (localStorage.alerted) {
        delete localStorage.alerted;
      }
      window.location.replace("../?signup=successful");
    })
    .catch(function (error) {
      document.getElementById("warning").innerHTML = error.response.data;
    });
}

function signin() {
  // @ts-ignore
  axios
    .post(`${s}/users/signin`, {
      username: document.getElementById("username")["value"],
      password: document.getElementById("password")["value"],
    })
    .then(async function (res) {
      localStorage.k = await res.data;
      localStorage.username = document.getElementById("username")["value"];
      if (localStorage.alerted) {
        delete localStorage.alerted;
      }
      window.location.replace("../?signin=successful");
    })
    .catch(function (error) {
      document.getElementById("warning").innerHTML = error.response.data;
    });
}

function check(id:string) {
  if (!document.getElementById(id)["value"]) {
    document.getElementById("warning").innerHTML =
      "Username / password cannot be empty.";
  } else {
    document.getElementById("warning").innerHTML = "";
  }
}
async function ini() {
  const urllist:Array<string> = [
    "https://api-notes.wcyat.me",
    "https://notes-server.wcyat.me",
    "https://api.notes.wcyat.me",
  ];
  for (const i of urllist) {
    if (await test(i)) {
      s = i;
      break;
    }
  }
}
ini();
