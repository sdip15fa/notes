if (localStorage.key && localStorage.username) {
  window.location.replace('../?signedin=true')
}

function signup () {
  if (
    !document.getElementById('username').value ||
    !document.getElementById('password').value
  ) {
    document.getElementById('warning').innerHTML =
      'Username / password cannot be empty.'
    return
  }
  axios
    .post('https://notes-server.wcyat.me/users/signup', {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
    .then(async function (res) {
      localStorage.username = document.getElementById('username').value
      localStorage.key = await res.data
      window.location.replace('../?signup=successful')
    })
    .catch(function (error) {
      document.getElementById('warning').innerHTML = error.response.data
    })
}

function signin () {
  axios
    .post('https://notes-server.wcyat.me/users/signin', {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
    .then(async function (res) {
      localStorage.k = await res.data
      localStorage.username = document.getElementById('username').value
      window.location.replace('../?signin=successful')
    })
    .catch(function (error) {
      document.getElementById('warning').innerHTML = error.response.data
    })
}

function check (id) {
  if (!document.getElementById(id).value) {
    document.getElementById('warning').innerHTML =
      'Username / password cannot be empty.'
  } else {
    document.getElementById('warning').innerHTML = ''
  }
}
