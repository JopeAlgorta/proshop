import axios from 'axios';
import {
	USER_LOGIN_FAILED,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_SIGNUP_REQUEST,
	USER_SIGNUP_SUCCESS,
	USER_SIGNUP_FAILED
} from '../constants/userConstants';

export const login = (email, password) => async dispatch => {
	try {
		dispatch({ type: USER_LOGIN_REQUEST });

		const { data } = await axios.post(
			'/api/users/login/',
			{ username: email, password },
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		localStorage.setItem('userInfo', JSON.stringify(data));

		dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const signup = (name, email, password) => async dispatch => {
	try {
		dispatch({ type: USER_SIGNUP_REQUEST });

		const { data } = await axios.post(
			'/api/users/signup/',
			{ name, email, password },
			{ headers: { ContentType: 'application/json' } }
		);

		localStorage.setItem('userInfo', JSON.stringify(data));

		dispatch({ type: USER_SIGNUP_SUCCESS, payload: data });
		dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: USER_SIGNUP_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const logout = () => async dispatch => {
	dispatch({ type: USER_LOGOUT });
	localStorage.removeItem('userInfo');
};
