import { BrowserRouter, Route, Navigate, Routes} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import NewPlace from './places/pages/NewPlace';
import Users from './users/pages/Users';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';


function App() {
    const { token, login, logout, userId} = useAuth();
	let routes;
	if(token) {
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
			isLoggedIn: !!token, userId: userId, token:token,  login:login, logOut:logout 	
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
