import axios from 'axios';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import { ORDER_CREATE_FAILED, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS } from '../constants/orderConstants';

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
