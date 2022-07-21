import React from 'react';
import  { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElement/Card';
import Avatar from '../../shared/components/UIElement/Avatar';

import './UserItem.css';

const UserItem = props => {
    let content;
    if(props.placeCount === 0) {
        content = (
            <div className='no-link'>
                <div className="user-item__image">
                    <Avatar image={props.image} alt={props.name} />
                </div>
                <div className="user-item__info">
                    <h2>{props.name}</h2>
                    <h3>
                        {props.placeCount} Place
                    </h3>
                </div>
            </div>
        )
    } else {
        content = (
            <Link to={`/${props.id}/places`}>
                <div className="user-item__image">
                    <Avatar image={props.image} alt={props.name} />
                </div>
                <div className="user-item__info">
                    <h2>{props.name}</h2>
                    <h3>
                        {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
                    </h3>
                </div>
            </Link>
        )
    }


    return (
        <li className="user-item">
            <Card className="user-item__content">
                {content}
            </Card>
        </li>
    );
};

export default UserItem;
