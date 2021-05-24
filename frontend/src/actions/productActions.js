import axios from 'axios';
import {
	PRODUCT_LIST_FAILED,
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_DETAILS_FAILED,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DELETE_REQUEST,
	PRODUCT_DELETE_FAILED,
	PRODUCT_DELETE_SUCCESS,
	PRODUCT_CREATE_OR_UPDATE_REQUEST,
	PRODUCT_CREATE_OR_UPDATE_SUCCESS,
	PRODUCT_CREATE_OR_UPDATE_FAILED,
	PRODUCT_CREATE_OR_UPDATE_RESET,
	PRODUCT_CREATE_REVIEW_REQUEST,
	PRODUCT_CREATE_REVIEW_SUCCESS,
	PRODUCT_CREATE_REVIEW_FAILED
} from '../constants/productConstants';

export const listProducts =
	(keyword = '') =>
	async dispatch => {
		try {
			dispatch({ type: PRODUCT_LIST_REQUEST });

			const { data } = await axios(`/api/products/${keyword}`);

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
		const { data } = await axios(`/api/products/${id}/`);
		dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const deleteProduct = id => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_DELETE_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		await axios.delete(`/api/products/${id}/`, {
			headers: { Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: PRODUCT_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: PRODUCT_DELETE_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const createOrUpdateProduct = product => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_CREATE_OR_UPDATE_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = product.id
			? await axios.put(`/api/products/${product.id}/`, product, {
					headers: { Authorization: `Bearer ${userInfo.token}` }
			  })
			: await axios.post('/api/products/', product, {
					headers: { Authorization: `Bearer ${userInfo.token}` }
			  });

		dispatch({ type: PRODUCT_CREATE_OR_UPDATE_SUCCESS, payload: data });
		dispatch({ type: PRODUCT_CREATE_OR_UPDATE_RESET });
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_OR_UPDATE_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};

export const createProductReview = (productId, review) => async (dispatch, getState) => {
	try {
		dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });

		const {
			userLogin: { userInfo }
		} = getState();

		const { data } = await axios.post(`/api/products/${productId}/reviews/`, review, {
			headers: { Authorization: `Bearer ${userInfo.token}` }
		});

		dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_REVIEW_FAILED,
			payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
		});
	}
};
