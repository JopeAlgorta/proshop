import axios from 'axios';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import {
	ORDER_CREATE_FAILED,
	ORDER_CREATE_REQUEST,
	ORDER_CREATE_SUCCESS,
	ORDER_DETAILS_FAILED,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_PAY_FAILED,
	ORDER_PAY_REQUEST,
	ORDER_PAY_SUCCESS
} from '../constants/orderConstants';

export const createOrder = order => async (dispatch, getState) => {
	try {
		dispatch({ type: ORDER_CREATE_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios.post('/api/orders/', order, {
			headers: { ContentType: 'application/json', Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
		dispatch({ type: CART_CLEAR_ITEMS });

		localStorage.removeItem('cartItems');
	} catch (e) {
		dispatch({
			type: ORDER_CREATE_FAILED,
			payload: e.response && e.response.data.detail ? e.response.data.detail : e.message
		});
	}
};

export const getOrderDetails = id => async (dispatch, getState) => {
	try {
		dispatch({ type: ORDER_DETAILS_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios(`/api/orders/${id}/`, {
			headers: { Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
	} catch (e) {
		dispatch({
			type: ORDER_DETAILS_FAILED,
			payload: e.response && e.response.data.detail ? e.response.data.detail : e.message
		});
	}
};

export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
	try {
		dispatch({ type: ORDER_PAY_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios.put(`/api/orders/${id}/pay/`, paymentResult, {
			headers: { Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
	} catch (e) {
		dispatch({
			type: ORDER_PAY_FAILED,
			payload: e.response && e.response.data.detail ? e.response.data.detail : e.message
		});
	}
};
