import React from "react"; 
import axios from "axios"; 
import Note from "../components/note"; 
import {serverurl, getvar, testserver, alertmessage} from '../lib/common'; 
let id:string; 
if (getvar("id")) { 
    id = getvar("id"); 
    localStorage.id = id; 
} 
else { 
    id = localStorage.id; 
} 
let url = serverurl; 
let changetimeout:any; 
function User() { 
    return ( 
        <button className='userbtn btn btn-secondary float-end' onClick={() => {window.location.replace('/users/')}}>Sign in / Sign up</button> 
    ) 
} 
 
class Anonnote extends React.Component { 
    constructor(props:any) { 
        super(props); 
        this.Link = this.Link.bind(this); 
    } 
    state = { i : { 
        id : '', 
        text: '' 
    }, 
    link : ''} 
    Link () { 
        if (this.state.link) { 
          return ( 
            <p className="link">Share this note by url: <a href={this.state.link}>{this.state.link}</a></p> 
          ) 
        } 
        else { 
            return <div /> 
        } 
    } 
    changehandler (newvalue:any, e:any) { 
        if (!changetimeout) { 
            changetimeout = setTimeout(() => { 
              changetimeout = undefined; 
              const note = { 
                id : id, 
                text : e.getContent()  
              } 
            axios.post(`${url}/create`, note) 
                .then(res => { 
                   console.log(res) 
                }) 
                .catch(err => { 
                    console.log(err) 
                }) 
            }, 400); 
        } 
    } 
    componentDidMount() { 
        const content = setInterval( () => { 
        if (id) { 
        axios.get(`${url}/get/${id}`).then(res => { 
            const i = res.data; 
            delete i._id; 
            this.setState({i}); 
        }) 
        .catch(() => { 
            const i = { 
                id : id, 
                text : '' 
            } 
            this.setState({i}); 
        }) 
        this.setState({link : `${window.location.origin}/?id=${id}`}); 
        clearInterval(content); 
    }}, 100) 
    } 
    render() {
        if (this.state.i.text) {
          return (
            <div> 
              <Note id="note" text={this.state.i.text} changehandler={this.changehandler}/> 
              <this.Link/> 
            </div> 
          )
        }
        return <p>Please wait...</p>
    } 
} 
 
function Alert () { 
    if (getvar("logout")) { 
        if (localStorage.alerted) { 
            window.location.replace(window.location.href.split("?")[0]); 
            return <div /> 
        } 
        else { 
            localStorage.alerted = true; 
            return ( 
                alertmessage("alert alert-success", "Successfully logged out.") 
            ) 
        }  
    } 
    return <div /> 
} 
 
async function init() { 
    url = await testserver(); 
    if (!id) { 
        await axios.get('https://notes.wcyat.me/idgenerator').then(res => { 
            id = res.data; 
        }) 
    } 
    localStorage.id = id; 
} 
 
const Home = () => { 
    if (localStorage.username  && localStorage.k) { 
        window.location.replace('/notes'); 
    } 
    else { 
        init();     
    } 
    return ( 
        <div> 
            <User/> 
            <br/><br/><br/> 
            <strong><h1 style={{textAlign: 'center'}}>Notes</h1></strong> 
            <Alert/> 
            <br/> 
            <Anonnote/> 
        </div> 
    ) 
} 
export default Home;