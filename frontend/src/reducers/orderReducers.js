import {
	ORDER_ADMIN_LIST_FAILED,
	ORDER_ADMIN_LIST_REQUEST,
	ORDER_ADMIN_LIST_SUCCESS,
	ORDER_CREATE_FAILED,
	ORDER_CREATE_REQUEST,
	ORDER_CREATE_RESET,
	ORDER_CREATE_SUCCESS,
	ORDER_DELIVER_FAILED,
	ORDER_DELIVER_REQUEST,
	ORDER_DELIVER_RESET,
	ORDER_DELIVER_SUCCESS,
	ORDER_DETAILS_FAILED,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_LIST_FAILED,
	ORDER_LIST_REQUEST,
	ORDER_LIST_RESET,
	ORDER_LIST_SUCCESS,
	ORDER_PAY_FAILED,
	ORDER_PAY_REQUEST,
	ORDER_PAY_RESET,
	ORDER_PAY_SUCCESS
} from '../constants/orderConstants';

export const orderCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case ORDER_CREATE_REQUEST:
			return { loading: true };
		case ORDER_CREATE_SUCCESS:
			return { loading: false, success: true, order: action.payload };
		case ORDER_CREATE_FAILED:
			return { ...state, success: false, loading: false, error: action.payload };
		case ORDER_CREATE_RESET:
			return {};
		default:
			return state;
	}
};

export const orderDetailsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case ORDER_DETAILS_REQUEST:
			return { ...state, loading: true };
		case ORDER_DETAILS_SUCCESS:
			return { ...state, loading: false, order: action.payload };
		case ORDER_DETAILS_FAILED:
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

export const orderPayReducer = (state = {}, action) => {
	switch (action.type) {
		case ORDER_PAY_REQUEST:
			return { loading: true };
		case ORDER_PAY_SUCCESS:
			return { loading: false, success: true };
		case ORDER_PAY_FAILED:
			return { loading: false, error: action.payload };
		case ORDER_PAY_RESET:
			return {};
		default:
			return state;
	}
};

export const orderListReducer = (state = { orders: [] }, action) => {
	switch (action.type) {
		case ORDER_LIST_REQUEST:
			return { loading: true };
		case ORDER_LIST_SUCCESS:
			return { loading: false, orders: action.payload };
		case ORDER_LIST_FAILED:
			return { loading: false, error: action.payload };
		case ORDER_LIST_RESET:
			return { orders: [] };
		default:
			return state;
	}
};

export const orderListAdminReducer = (state = { orders: [] }, action) => {
	switch (action.type) {
		case ORDER_ADMIN_LIST_REQUEST:
			return { loading: true };
		case ORDER_ADMIN_LIST_SUCCESS:
			return { loading: false, ...action.payload };
		case ORDER_ADMIN_LIST_FAILED:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const orderDeliverReducer = (state = {}, action) => {
	switch (action.type) {
		case ORDER_DELIVER_REQUEST:
			return { loading: true };
		case ORDER_DELIVER_SUCCESS:
			return { loading: false, success: true };
		case ORDER_DELIVER_FAILED:
			return { loading: false, error: action.payload };
		case ORDER_DELIVER_RESET:
			return {};
		default:
			return state;
	}
};
