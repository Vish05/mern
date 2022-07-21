import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElement/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import useForm from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
            ...formState.inputs,
            name: {
                value: '',
                isValid: false
            },
            image: {
                value:null,
                isValid:false
            }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

	const authSubmitHandler = async event => {
		event.preventDefault();
        console.log(formState.inputs);
		if (isLoginMode) { 
			try{
				const postData = {
					email: formState.inputs.email.value,
					password: formState.inputs.password.value,
				};
				const responseData = await sendRequest(
					"http://localhost:5000/api/users/login", 
					"POST", 
					JSON.stringify(postData),
					{
						"Content-type": "application/json"
					}
				);
				auth.login(responseData.user.id);
			} catch (err) {} 

		} else {
            const formData = new FormData();
            formData.append('name', formState.inputs.name.value);
            formData.append('email', formState.inputs.email.value);
            formData.append('password', formState.inputs.password.value);
            formData.append('image', formState.inputs.image.value)
			try {
				const responseData = await sendRequest(
					"http://localhost:5000/api/users/signup", 
					"POST",
					formData
				);
				auth.login(responseData.user.id);
			} catch(error) {}
		}
	};

	return (
		<React.Fragment>
		<ErrorModal error={error} onClear={clearError}/>
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay/>}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
				{!isLoginMode && (
					<Input
					element="input"
					id="name"
					type="text"
					label="Your Name"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Please enter a name."
					onInput={inputHandler}
					/>
				)}
                {!isLoginMode &&  <ImageUpload errorText="Please provide an image" center id="image" onInput={inputHandler}/> }
				<Input
					element="input"
					id="email"
					type="email"
					label="E-Mail"
					validators={[VALIDATOR_EMAIL()]}
					errorText="Please enter a valid email address."
					onInput={inputHandler}
				/>
				<Input
					element="input"
					id="password"
					type="password"
					label="Password"
					validators={[VALIDATOR_MINLENGTH(6)]}
					errorText="Please enter a valid password, at least 6 characters."
					onInput={inputHandler}
				/>
				<Button type="submit" disabled={!formState.isValid}>
					{isLoginMode ? 'LOGIN' : 'SIGNUP'}
				</Button>
				</form>
				<Button inverse onClick={switchModeHandler}>
				SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
