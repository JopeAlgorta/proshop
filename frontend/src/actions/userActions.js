import axios from 'axios';
import { ORDER_LIST_RESET } from '../constants/orderConstants';
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
	USER_DETAILS_RESET,
	USER_LIST_REQUEST,
	USER_LIST_SUCCESS,
	USER_LIST_FAILED,
	USER_LIST_RESET,
	USER_DELETE_REQUEST,
	USER_DELETE_SUCCESS,
	USER_DELETE_FAILED,
	ADMIN_USER_UPDATE_REQUEST,
	ADMIN_USER_UPDATE_SUCCESS,
	ADMIN_USER_UPDATE_FAILED,
	ADMIN_USER_UPDATE_RESET
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

export const getUserDetails =
	(id = null) =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: USER_DETAILS_REQUEST });

			const {
				userLogin: { userInfo }
			} = getState();

			const { data } = id
				? await axios(`/api/users/${id}/`, {
						headers: {
							ContentType: 'application/json',
							Authorization: `Bearer ${userInfo.token}`
						}
				  })
				: await axios(`/api/users/profile/`, {
						headers: {
							ContentType: 'application/json',
							Authorization: `Bearer ${userInfo.token}`
						}
				  });

			dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: USER_DETAILS_FAILED,
				payload:
					error.response && error.response.data.detail ? error.response.data.detail : error.message
			});
		}
	};

export const logout = () => async dispatch => {
	dispatch({ type: USER_LOGOUT });
	dispatch({ type: USER_DETAILS_RESET });
	dispatch({ type: ORDER_LIST_RESET });
	dispatch({ type: USER_LIST_RESET });

	localStorage.clear();
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

export const getUsers = () => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_LIST_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios(`/api/users/`, {
			headers: { ContentType: 'application/json', Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: USER_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: USER_LIST_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const deleteUser = id => async (dispatch, getState) => {
	try {
		dispatch({ type: USER_DELETE_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		await axios.delete(`/api/users/${id}/`, {
			headers: { Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: USER_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: USER_DELETE_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const adminUpdateUser = user => async (dispatch, getState) => {
	try {
		dispatch({ type: ADMIN_USER_UPDATE_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios.put(`/api/users/${user.id}/`, user, {
			headers: { ContentType: 'application/json', Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: ADMIN_USER_UPDATE_SUCCESS, payload: data });
		dispatch({ type: ADMIN_USER_UPDATE_RESET });
		dispatch({ type: USER_DETAILS_RESET });
	} catch (error) {
		dispatch({
			type: ADMIN_USER_UPDATE_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};
