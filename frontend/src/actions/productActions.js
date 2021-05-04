import axios from 'axios';
import {
	PRODUCT_LIST_FAILED,
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_DETAILS_FAILED,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS
} from '../constants/actionTypes';

export const listProducts = () => async dispatch => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST });
		const { data } = await axios('/api/products/');
		dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAILED,
			payload:
				error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const showProduct = id => async dispatch => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST });
		const { data } = await axios(`/api/products/${id}`);
		dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAILED,
			payload:
				error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};
