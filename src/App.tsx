import React from 'react';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Usernotes from './pages/notes';
import Users from './pages/users';
import Home from './pages';
function App() {
return (
	<Router>
	<Routes>
	    <Route path='/' element={<Home />} />
		<Route path='/notes' element={<Usernotes/>} />
		<Route path="/users" element={<Users/>}/>
	</Routes>
	</Router>
);
}

export default App;
