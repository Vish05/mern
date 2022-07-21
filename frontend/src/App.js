import React, {useState, useCallback} from 'react';
import { BrowserRouter, Route, Navigate, Routes} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import NewPlace from './places/pages/NewPlace';
import Users from './users/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { Redirect } from 'react-router-dom';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState();

	const login = useCallback((uid) => {
		setIsLoggedIn(true);
		setUserId(uid);
	}, []) 

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;
	if(isLoggedIn) {
		routes = (
			<Routes>
				<Route path='/' exact element={<Users/>} />
				<Route path='/:userId/places' exact element={<UserPlaces/>} />
				<Route path='/places/new' exact element={<NewPlace/>} />
				<Route path='/places/:placeId' exact element={<UpdatePlace/>} />
				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		);
	} else {
		routes = (
			<Routes>
				<Route path='/' exact element={<Users/>} />
				<Route path='/:userId/places' exact element={<UserPlaces/>} />
				<Route path='/auth' exact element={<Auth/>} />
				<Route path="*" element={<Navigate replace to="/"  />} />
			</Routes>
		);
	}

  	return (
		<AuthContext.Provider value={{
			isLoggedIn: isLoggedIn, userId: userId, login:login, logOut:logout 	
		}}>
			<BrowserRouter>
				<MainNavigation />
				<main>
					{routes}
				</main>
			</BrowserRouter>
		</AuthContext.Provider>
  	);
}

export default App;
