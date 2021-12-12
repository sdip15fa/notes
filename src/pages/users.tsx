import React from "react"; 
import axios from "axios"; 
import hash from "hash.js"; 
import { testserver } from "../lib/common"; 
import './users.css'; 
let url = "https://api-notes.wcyat.me"; 
class Main extends React.Component { 
    username = ''; 
    password = ''; 
    state = { 
        warning : '' 
    } 
    sign (inup:string) { 
        if (!(this.username && this.password)) { 
            this.setState({warning : "Username / password cannot be empty."}); 
        } 
        else { 
          axios.post(`${url}/users/sign${inup}`, {username : this.username, password : hash.sha256().update(this.password).digest('hex')}) 
            .then(res => { 
                localStorage.k = res.data; 
                localStorage.username = this.username; 
                localStorage.password = hash.sha512().update(this.password).digest('hex'); 
                if (localStorage.alerted) { 
                    delete localStorage.alerted; 
                } 
                if (inup === "up") { 
                    axios.post(`${url}/notes/users/${localStorage.k}`, {key : localStorage.k, 1 : ''}) 
                       .then (() => { 
                           window.location.replace(`/notes/?signup=successful`); 
                       }) 
                } 
                else { 
                    window.location.replace(`/notes/?sign${inup}=successful`); 
                } 
            }) 
            .catch(error => { 
                this.setState({warning : error.response.data}) 
            }); 
        } 
    } 
    render () { 
        return ( 
            <div className="content-body"> 
      <div className="form-wrapper"> 
        <h1 className="heading text-center">Signin / Signup</h1> 
        <h3 className="sub-heading text-center">Notes</h3> 
        <br /> 
        <div className="field"> 
          <input 
            type="text" 
            onChange={(evt) => {this.username = evt.target.value}} 
            id="username" 
            name="username" 
            className="input" 
            placeholder=" " 
          /> 
          <label htmlFor="username" className="label">username</label> 
        </div> 
        <br /> 
        <div className="field"> 
          <input 
            type="password" 
            onChange={(evt) => {this.password = evt.target.value}} 
            id="password" 
            name="password" 
            className="input" 
            placeholder=" " 
          /> 
          <label htmlFor="password" className="label">password</label> 
        </div> 
        <p className="description-text"> 
          <span style={{color : "red"}} id="warning">{this.state.warning}</span> 
        </p> 
        <div className="form-action"> 
          <button onClick={() => {this.sign("up")}} id="signup" className="btn users-btn primary"> 
            Sign up 
          </button> 
          <button onClick={() => {this.sign("in")}} id="signin" className="btn users-btn primary"> 
            Sign in 
          </button> 
        </div> 
      </div> 
    </div> 
        ) 
    } 
} 
async function init () { 
    url = await testserver(); 
} 
const Users = () => { 
    if (localStorage.username && localStorage.k) { 
      if (localStorage.alerted) { 
        delete localStorage.alerted; 
      } 
      window.location.replace('/notes?signedin=true'); 
    } 
    init(); 
    return ( 
        <div> 
            <Main/> 
        </div> 
    ) 
} 
export default Users;