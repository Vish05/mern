import React from 'react';

import Card from '../../shared/components/UIElement/Card';
import UsersItem from './UserItem';
import "./UsersList.css";

const UsersList =  (props) => {
    if(props.items.length === 0) {
        return (
            <div className='center'>
                <Card/>
            </div>
        )
    }

    return  (
        <ul className='users-list'>
            {props.items.map(user => (
                <UsersItem key={user.id}  
                    id={user.id} 
                    image={user.image} 
                    name={user.name} 
                    placeCount={user.places.length}/>
            ))}
        </ul>
    )
    
}

export default UsersList;