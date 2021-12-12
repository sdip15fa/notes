import React from 'react';
import axios from 'axios';
import { serverurl, testserver, getvar, alertmessage } from '../lib/common';
import Note from '../components/note';
let changetimeout:any;
let usernotes:any;
let url = serverurl;
function Alert() {
  if (
    getvar("signedin") ||
    getvar("signup") ||
    getvar("signin")
  ) {
    if (localStorage.alerted) {
      window.location.replace(window.location.href.split("?")[0]);
      return <div />
    } else {
      return (
        alertmessage(
          getvar("signedin") ? "alert alert-warning" : "alert alert-success",
          getvar("signedin")
            ? `You are already signed in as ${localStorage.username}.`
            : `Successfully signed ${getvar("signup") ? "up" : "in"} as ${
                localStorage.username
              }.`)  
      )
  }
}
else {
  return <div />
}
}

function changehandler(newvalue:any, e:any) {
  if (!changetimeout) {
    changetimeout = setTimeout(() => {
      usernotes[e.id] = e.getContent();
      changetimeout = undefined;
      axios.post(`${url}/notes/users/${localStorage.k}`, Object.assign({key : localStorage.k},usernotes))
           .then(res => {
             console.log(res)
           })
           .catch(err => {
             console.log(err)
           })
    }, 400);
  }
}

class Notes extends React.Component {
  constructor(props:any) {
    super(props);
    this.createhandler = this.createhandler.bind(this);
  }
  o:JSX.Element[] = [];
  state:any = {
    i : {}
  }
  autodelete (j:any) {
    for (let k = Object.keys(j).length; k > 1; k--) {
      if (j[k] === '') {
        delete j[k];
      }
      else {
        break;
      }
    }
  }
  componentDidMount() {
    axios.get(`${url}/notes/users/${localStorage.k}`).then(res => {
      const i = res.data;
      this.autodelete(i);
      usernotes = Object.assign({}, i);
      this.setState({i});
    })
  }
  createhandler() {
    const i:any = Object.assign({},this.state.i);
    i[Object.keys(i).length + 1] = '';
    usernotes = Object.assign({}, i);
    this.setState({i});
  }
  render() {
    if (Object.keys(this.state.i).length) {
      this.o = [];
      for (const j in this.state.i) {
        this.o.push(<div><Note id={j} text={this.state.i[j]} changehandler={changehandler}/><br/></div>)
      }
      return (
        <div id="notes">
          {this.o}
          <div className='createbtn delta'>
            <button className="btn btn-primary" onClick={this.createhandler}>Create</button>
          </div>
        </div>
      );
    }
    return <p>Please wait...</p>
  }
}
function Logout() {
  return (
    <button className='userbtn btn btn-secondary float-end' onClick={() => {delete localStorage.k; delete localStorage.username; delete localStorage.password; if (localStorage.alerted) {
    delete localStorage.alerted;
  }
;window.location.replace('/?logout=successful')}}>Log out</button>
  )
}
const Usernotes = () => {
  const server = async () => {
    url = await testserver();
  }
  server();
  if (!(localStorage.username && localStorage.k)) {
    window.location.replace('/users');
  }
  return (
  <React.Fragment>
  <Logout/>
  <br/><br/><br/>
  <strong><h1 style={{textAlign: 'center'}}>Notes</h1></strong>
  <Alert/>
  <br/>
  <Notes/>
  </React.Fragment>);
}
export default Usernotes;
