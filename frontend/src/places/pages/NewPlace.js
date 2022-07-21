import React, {useContext} from 'react';
import { useNavigate  } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import useForm from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';


const NewPlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
	const [formState,inputHandler] = useForm({
		title: {
			value: '',
			isValid: false
		},
		description: {
			value: '',
			isValid: false
		},
		address: {
			value: '',
			isValid: false
		}
	},false);

    const navigate  = useNavigate();

	const placeSubmitHanlder = async event => {
		event.preventDefault();
		try{
            const postData = {
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
                address: formState.inputs.address.value,
                creator: auth.userId
            };
            await sendRequest(
                "http://localhost:5000/api/places", 
                "POST",
                JSON.stringify(postData),
                {
                    "Content-type": "application/json"
                }
            );
            // Redirect user to differnet page.
            navigate('/home');
        } catch (err) {} 
	}

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            
            <form className="place-form" onSubmit={placeSubmitHanlder}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <Input id="title"
                    element="input" 
                    type="text" 
                    label="Title" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a valid title"
                    onInput={inputHandler}/>
                
                <Input id="description"
                    element="textarea" 
                    label="Description" 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText="Please Enter valid description (at least 5 characters)"
                    onInput={inputHandler}/>

                <Input id="address"
                    element="input" 
                    label="Address" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a valid address"
                    onInput={inputHandler}/>

                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
