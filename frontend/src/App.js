import React from 'react';
import { BrowserRouter, Route, Navigate, Routes} from 'react-router-dom' 
import NewPlace from './places/pages/NewPlace';
import Users from './users/pages/Users';

function App() {
  	return (
		<React.Fragment>
			<BrowserRouter>
				<Routes>
					<Route path='/' exact element={<Users/>} />
					<Route path='/places/new' exact element={<NewPlace/>} />
				</Routes>
			</BrowserRouter>
		</React.Fragment>
  	);
}

export default App;
