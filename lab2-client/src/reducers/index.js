import {SIGNUP_USER_SUCCESS,QUERY_SUCCESS,LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER,UPLOAD_SUCCESS} from '../actions/index';
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
const initialState = {
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null,
    user:null,
    tree:null,
    contentSelected:{name:null,path:null},
    accounts:[{id:'user10',firstname:'user10fn',lastname:'user10ln',email:'user10@gmail.com'},{id:'user2',firstname:'user2fn',lastname:'user2ln',email:'user2@gmail.com'}],
    log:['folder1','folder2','Hello.txt'],
    star:['Hello.txt']
};

const login = (state = initialState, action) => {

    switch (action.type) {         
        case LOGIN_USER_REQUEST:
        return{
            ...state,
            'isAuthenticating': true,
            'statusText': null
        };
        case LOGIN_USER_SUCCESS:        
        return{
            ...state,
            'isAuthenticated': true,
            'isAuthenticating': false,
            'statusText': 'You have been successfully logged in.',
            'user':[action.user][0],
            'tree':[action.tree][0],
            // 'log':[action.log][0],
            // 'star':[action.star][0]
        };
        case SIGNUP_USER_SUCCESS:        
        return{
            ...state,
            'statusText': [action.statusText]
        };        
        case LOGIN_USER_FAILURE:
        return{
            ...state,
            'isAuthenticating': false,
            'isAuthenticated': false,
            'statusText': [action.statusText],
            'tree':null
        };     
        case LOGOUT_USER:
        return{
            ...state,
            'isAuthenticated': false,
            'statusText': 'You have been successfully logged out,please log in to continue..',
            'tree':null
        };     
        case UPLOAD_SUCCESS:        
        return{
            ...state,
            'user':[action.user][0],
            'tree':[action.tree][0],
            'log':[action.log][0],
            'star':[action.star][0]
        }; 
        case QUERY_SUCCESS:        
        return{
            ...state,
            'accounts':[action.accounts][0]
        };                            
        default :
            return state;            
    }
};

const reducers = {
  login,
  form: formReducer     // <---- Mounted at 'form'
}
const reducer = combineReducers(reducers)
export default reducer;
