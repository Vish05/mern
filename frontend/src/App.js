import React from 'react';
import { BrowserRouter, Route, Navigate, Routes} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import NewPlace from './places/pages/NewPlace';
import Users from './users/pages/Users';
import UserPlaces from './places/pages/UserPlaces';

function App() {
  	return (
		<BrowserRouter>
			<MainNavigation />
			<main>
				<Routes>
					<Route path='/' exact element={<Users/>} />
					<Route path='/:userId/places' exact element={<UserPlaces/>} />
					<Route path='/places/new' exact element={<NewPlace/>} />
				</Routes>
			</main>
		</BrowserRouter>
  	);
}

export default App;
