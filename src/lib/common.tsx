import Expire from "../components/expire"; 
import axios from "axios"; 
export function getvar(v:string): string  { 
    const query = window.location.search.substring(1); 
    const vars = query.split("&"); 
    for (const i of vars) { 
      const pair = i.split("="); 
      if (pair[0] === v) { 
        return pair[1]; 
      } 
    } 
    return ''; 
  } 
export function alertmessage(c:string, text:string) { 
    localStorage.alerted = true; 
    return ( 
      <Expire delay="5000"><div 
        id="alert" 
        className={'alertmessage ' + c} 
        role="alert" 
      >{text}</div></Expire> 
    ) 
} 
export async function testserver() { 
  async function test(link:string) { 
    let r = false; 
    await axios 
      .get(`${link}/testconnection`) 
      .then((res) => { 
        r = true; 
      }) 
      .catch(() => {}); 
    return r; 
  } 
  const urllist = [ 
    "https://api-notes.wcyat.me", 
    "https://notes-server.wcyat.me", 
    "https://api.notes.wcyat.me", 
  ]; 
  for (const i of urllist) { 
    if (await test(i)) { 
      return i; 
    } 
  } 
  return "no server available"; 
} 
