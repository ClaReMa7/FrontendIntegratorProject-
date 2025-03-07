import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_USER,
  UPDATE_USER,
  CLEAR_USER,
  AUTH_LOADING,
  AUTH_ERROR,
  CLEAR_ERRORS
} from './authActions';

/**
 * Authentication Reducer
 * 
 * Pure function that handles auth state transitions based on dispatched actions
 */
export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: false
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };

    case SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
      
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };

    case LOGIN_FAIL:
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };

    case LOGOUT:
    case CLEAR_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};