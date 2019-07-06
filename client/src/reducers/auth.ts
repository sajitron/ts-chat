import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const defaultState = {
	authenticated: '',
	errorMessage: ''
};

export default function(state = defaultState, action: any) {
	switch (action.type) {
		case AUTH_USER:
			return { ...state, authenticated: action.payload };
		case AUTH_ERROR:
			return { ...state, errorMessage: action.payload };
		default:
			return state;
	}
}
