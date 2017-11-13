import { checkHttpStatus, parseJSON } from '../utils';
import history from '../history';

export const api = process.env.REACT_APP_DROPBOX || 'http://localhost:3001';
export const LOGIN_USER_SUCCESS='LOGIN_USER_SUCCESS';
export const SIGNUP_USER_SUCCESS='SIGNUP_USER_SUCCESS';
export const LOGIN_USER_FAILURE='LOGIN_USER_FAILURE';
export const LOGIN_USER_REQUEST='LOGIN_USER_REQUEST';
export const LOGOUT_USER='LOGOUT_USER';
export const FETCH_PROTECTED_DATA_REQUEST='FETCH_PROTECTED_DATA_REQUEST';
export const RECEIVE_PROTECTED_DATA='RECEIVE_PROTECTED_DATA';
export const UPLOAD_SUCCESS='UPLOAD_SUCCESS';
export const UPLOAD_FAILURE='UPLOAD_FAILURE';
export const UPLOAD_REQUEST='UPLOAD_REQUEST';
export const ADD_FOLDER_SPACE='ADD_FOLDER_SPACE';
export const CONTENT_SELECTED='CONTENT_SELECTED';
export const QUERY_SUCCESS='QUERY_SUCCESS';

export function loginUserSuccess(data) {
  var tree = buildtree(data.response.user),log=[],star=[]; 
  console.log("tree in action",tree); 
  return {
    type: LOGIN_USER_SUCCESS,
    tree:tree,
    user:data.response.user,
    log,
    star
  }
}

export function signUpSuccess(data) {
  return {
    type: SIGNUP_USER_SUCCESS,
    statusText:data.response.statusText
  }
}

export function loginUserFailure(error) {
  return {
    type: LOGIN_USER_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  }
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function uploadSuccess(data) {
var tree = buildtree(data.response.result),log=[],star=[]; 
console.log("tree in action",tree);     
  return {
    type: UPLOAD_SUCCESS,
    result:data.response.result,
    tree:tree,
    log,
    star
  }
}

export function querySuccess(data) {
  return {
    type: QUERY_SUCCESS,
    accounts:data.response.accounts,
  }
}

export function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  }
}

export function uploadRequest() {
  return {
    type: UPLOAD_REQUEST
  }
}


export function logOut(data) {
    return {
        type: LOGOUT_USER,
        statusText:data.response.statusText

    }
}

export function logoutAndRedirect() {
    return dispatch =>{ 
        return fetch(`${api}/user/logout`, {
            credentials:'include',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(logOut({response:{
                                status: response.status,
                                statusText: response.statusText

                    }}));
                    history.push('/');                 
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Error occured while processing response in logout'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })   
    }
}
export function loginRefresh(){

    return dispatch =>{ 
        dispatch(loginUserRequest());        
        return fetch(`${api}/user/loginRefresh`, {
            credentials:'include',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess({response:{
                                user:response.user,
                                // status: response.status,
                                statusText: response.statusText

                    }}));  
                    history.push('/log');                 
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Error occured while processing response in login refresh'
                        }
                    }));
                }
            })
            .catch(error => {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Please login to continue!'
                        }
                    }));
            })   
        } 
}
export const loginUser = (user,signIn) => {
	return dispatch =>{	
        dispatch(loginUserRequest());
        if (signIn){        
        return fetch(`${api}/user/doLogin`, {
            method: 'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({email: user.email, password: user.password})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(loginUserSuccess({response:{
                                user:response.user,
                                statusText:response.statusText
                    }}));
                    history.push('/home');                    
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Error occured while processing response in user login'
                        }
                    }));
                }
            })
            .catch(error => {
                    dispatch(loginUserFailure(error));
            })
		}
		else
		{
        return fetch(`${api}/user/signUp`, {
            method: 'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify({firstname:user.firstname,lastname:user.lastname,email: user.email, password: user.password})
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(signUpSuccess({response:{
                        statusText:response.statusText
                    }}));
                    history.push('/');
                } catch (e) {
                    dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Error occured while processing response in signUp'
                        }
                    }));
                }
            })
            .catch(error => {
                    dispatch(loginUserFailure(error));
            })			
		}
	}
}

export const uploadFile = (file) =>{
    console.log("file received in action",file);
  return dispatch => {
    dispatch(uploadRequest());
       return fetch(`${api}/uploadData/uploadFile`, {
            method: 'POST',  
            credentials:'include',                  
            body: file
            })
            .then(checkHttpStatus)
            .then(parseJSON)     
            .then(response => {
                try {
                    dispatch(loginUserSuccess({response:{
                                user:response.user,
                                statusText:response.statusText
                    }}));            
                } catch (e) {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'File creation failed'
                        }
                    }));
                   }
            })
            .catch(error => {
                dispatch(uploadFailure(error));
            })
        }
  }

export const createFolder = (path,userFolder) =>{
    console.log("folder path received in action",path);
    console.log("userFolder received in action",userFolder);
  return dispatch => {
    dispatch(uploadRequest());
       return fetch(`${api}/uploadData/createFolder`, {
            method: 'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },               
            body: JSON.stringify({"folderPath":path,"userFolder":userFolder})
            })
            .then(checkHttpStatus)
            .then(parseJSON)       
            .then(response => {
                try {
                    dispatch(loginUserSuccess({response:{
                                user:response.user,
                                statusText:response.statusText
                    }}));           
                } catch (e) {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'Folder creation failed'
                        }
                    }));
                }
            })
            .catch(error => {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'Folder creation failed'
                        }
                    }));
            })
        }
  }

export const deleteContent = (path,user_folder) =>{
    console.log("Path received in action",path);
  return dispatch => {
    dispatch(uploadRequest());
       return fetch(`${api}/uploadData/deleteContent`, {
            method: 'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },               
            body: JSON.stringify({"path":path,"user_folder":user_folder})
            })
            .then(checkHttpStatus)
            .then(parseJSON)       
            .then(response => {
                try {
                    dispatch(loginUserSuccess({response:{
                                user:response.user,
                                statusText:response.statusText
                    }}));           
                } catch (e) {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'File deletion failed'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(uploadFailure(error));
            })
        }
  }  

export const starContent = (path) =>{
    console.log("folder path received in action",path);
  return dispatch => {
    dispatch(uploadRequest());
       return fetch(`${api}/uploadData/markStar`, {
            method: 'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },               
            body: JSON.stringify({"content_path":path})
            })
            .then(checkHttpStatus)
            .then(parseJSON)       
            .then(response => {
                try {
                    dispatch(uploadSuccess({response:{
                                result:response.result,
                                contentMetaData:response.contentMetaData
                    }}));            
                } catch (e) {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'Folder creation failed'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(uploadFailure(error));
            })
        }
  }
export const shareContent = (email,accounts,name,path,absolute_path,user) =>{
var id,i;
if(path===null){
path=user+'/'
}
else{
path = path.replace('/'+name,'');
}
if(email.indexOf('@')>-1)
    {
    for( i = 0; i < accounts.length; i++)
        {
        if(accounts[i].email === email)
            {
            id=accounts[i].id
            }
        }
    }
else
    {
    for( i = 0; i < accounts.length; i++)
    {   var fullname = accounts[i].firstname+" "+accounts[i].lastname;
    if(fullname === email)
        {
            id=accounts[i].id
        }
    }
    }
  return dispatch => {
    dispatch(uploadRequest());
       return fetch(`${api}/uploadData/shareContent`, {
            method: 'post',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },               
            body: JSON.stringify({"sharedto":id,"name":name,"path":path})
            })
            .then(checkHttpStatus)
            .then(parseJSON)       
            .then(response => {
                try {
                    dispatch(uploadSuccess({response:{
                                result:response.result,
                                contentMetaData:response.contentMetaData
                    }}));            
                } catch (e) {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'Sharing failed'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(uploadFailure(error));
            })
        }
  } 
export const getAccounts = () =>{
  return dispatch => {
    dispatch(uploadRequest());
       return fetch(`${api}/user/getUsers`, {
            method: 'get',
            credentials:'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }             
            })
            .then(checkHttpStatus)
            .then(parseJSON)       
            .then(response => {
                try {
                    dispatch(querySuccess({response:{
                                    accounts:response.accounts
                    }}));            
                } catch (e) {
                    dispatch(uploadFailure({
                        response: {
                            status: 403,
                            statusText: 'Account fetch failed'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(uploadFailure(error));
            })
        }
  }   

function buildtree(result)
{
var tree = {
    root: {
    absolute_path: '',
    files: [],
    star:false,
    created_on:null,
    members:null,
    created_by:null,
    content_path:null,
    user_folder:result.id
  }
};

function buildTree(parts,content) {
  var lastDir = 'root';
  var abs_path = '';
  var currContentName = parts[parts.length-1];

  parts.map((name) =>{
      if (tree[lastDir].files.indexOf(name)===-1)
      {
      tree[lastDir].files.push(name);    
    }
    // It's a directory
    if (name.indexOf('.') === -1) {

      lastDir = name;
      abs_path += lastDir + '/';
    }
      if (!tree[name]) {
        tree[name] = {
          absolute_path: abs_path,
          files: [],
          star:false,
          created_on:null,
          members:null,
          created_by:null,
          content_path:null         
        };
      }
  });
  tree[currContentName].created_on = content.created_on;
  tree[currContentName].created_by = content.created_by;
  tree[currContentName].star = content.star;
  tree[currContentName].user_folder = content.user_folder;
}
if(result.contents){
result.contents.map((content)=> {
  content.content_name = content.content_name.replace(result.id+'/','');  
  content.content_name = content.content_name.replace(result.id,'');  
  if(content.content_name)
  buildTree(content.content_name.split('/'),content);
});}

return tree;    
}