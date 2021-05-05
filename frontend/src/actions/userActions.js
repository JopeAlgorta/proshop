import axios from 'axios';
import {
	USER_LOGIN_FAILED,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_SIGNUP_REQUEST,
	USER_SIGNUP_SUCCESS,
	USER_SIGNUP_FAILED,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_DETAILS_FAILED,
	USER_UPDATE_REQUEST,
	USER_UPDATE_SUCCESS,
	USER_UPDATE_FAILED,
	USER_DETAILS_RESET
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

export const getUserDetails = () => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_DETAILS_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios(`/api/users/profile/`, {
			headers: { ContentType: 'application/json', Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: USER_DETAILS_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const logout = () => async dispatch => {
	dispatch({ type: USER_LOGOUT });
	dispatch({ type: USER_DETAILS_RESET });
	localStorage.removeItem('userInfo');
};

export const updateUser = user => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_UPDATE_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios.put(`/api/users/profile/`, user, {
			headers: { ContentType: 'application/json', Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
		dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (error) {
		dispatch({
			type: USER_UPDATE_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};
