import {
	PRODUCT_LIST_FAILED,
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_DETAILS_FAILED,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_DELETE_REQUEST,
	PRODUCT_DELETE_SUCCESS,
	PRODUCT_DELETE_FAILED,
	PRODUCT_CREATE_OR_UPDATE_REQUEST,
	PRODUCT_CREATE_OR_UPDATE_SUCCESS,
	PRODUCT_CREATE_OR_UPDATE_FAILED,
	PRODUCT_CREATE_OR_UPDATE_RESET,
	PRODUCT_CREATE_REVIEW_REQUEST,
	PRODUCT_CREATE_REVIEW_SUCCESS,
	PRODUCT_CREATE_REVIEW_FAILED,
	PRODUCT_CREATE_REVIEW_RESET,
	PRODUCT_TOP_REQUEST,
	PRODUCT_TOP_SUCCESS,
	PRODUCT_TOP_FAILED
} from '../constants/productConstants';

export const productListReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case PRODUCT_LIST_REQUEST:
			return { loading: true, products: [] };
		case PRODUCT_LIST_SUCCESS:
			return { loading: false, ...action.payload };
		case PRODUCT_LIST_FAILED:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const productDetailsReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case PRODUCT_DETAILS_REQUEST:
			return { ...state, loading: true };
		case PRODUCT_DETAILS_SUCCESS:
			return { loading: false, product: action.payload };
		case PRODUCT_DETAILS_FAILED:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const productDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case PRODUCT_DELETE_REQUEST:
			return { loading: true };
		case PRODUCT_DELETE_SUCCESS:
			return { loading: false, success: true };
		case PRODUCT_DELETE_FAILED:
			return { loading: false, success: false, error: action.payload };
		default:
			return state;
	}
};

export const productCreateOrUpdateReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case PRODUCT_CREATE_OR_UPDATE_REQUEST:
			return { ...state, loading: true };
		case PRODUCT_CREATE_OR_UPDATE_SUCCESS:
			return { ...state, success: true, loading: false, product: action.payload };
		case PRODUCT_CREATE_OR_UPDATE_FAILED:
			return { ...state, success: false, loading: false, error: action.payload };
		case PRODUCT_CREATE_OR_UPDATE_RESET:
			return {};
		default:
			return state;
	}
};

export const productReviewCreateReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case PRODUCT_CREATE_REVIEW_REQUEST:
			return { ...state, loading: true };
		case PRODUCT_CREATE_REVIEW_SUCCESS:
			return { ...state, success: true, loading: false, product: action.payload };
		case PRODUCT_CREATE_REVIEW_FAILED:
			return { ...state, success: false, loading: false, error: action.payload };
		case PRODUCT_CREATE_REVIEW_RESET:
			return {};
		default:
			return state;
	}
};

export const productTopRatedReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case PRODUCT_TOP_REQUEST:
			return { ...state, loading: true };
		case PRODUCT_TOP_SUCCESS:
			return { ...state, loading: false, products: action.payload };
		case PRODUCT_TOP_FAILED:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};
