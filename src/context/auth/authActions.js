/**
 * Authentication Action Types
 * 
 * Defines constants for all possible authentication state transitions
 */

// User login actions
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";

// User data actions
export const SET_USER = "SET_USER";
export const UPDATE_USER = "UPDATE_USER";
export const CLEAR_USER = "CLEAR_USER";

// Authentication state actions
export const AUTH_LOADING = "AUTH_LOADING";
export const AUTH_ERROR = "AUTH_ERROR";
export const CLEAR_ERRORS = "CLEAR_ERRORS";