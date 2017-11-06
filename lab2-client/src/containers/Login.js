import React, { Component } from 'react'
import { connect } from 'react-redux'
import {loginUser} from '../actions/index';
import LoginComponent from '../components/Login'
import { bindActionCreators } from 'redux';

class Login extends Component {
  render() {
    const {loginUser,statusText } = this.props
    return (
      <div className="container-fluid">
        <div className="row justify-content-md-center">
          <h4>{statusText}</h4>
        </div>       
        <div className="row justify-content-md-center">
          <img src="https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico" alt="dropbox logo"></img><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><h2><strong>Cmpe273 Lab2-Dropbox</strong></h2>
        </div>
        <hr/>
        <br/>
        <br/>
        <div className="col-lg-3 col-md-3 col-sm-3">
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3">
          <img src="https://cfl.dropboxstatic.com/static/images/empty_states/sign-in-vflchypbO.png" alt="dropbox"/>
        </div>   
        <div className="col-lg-3 col-md-3 col-sm-3">
          <LoginComponent loginUser={loginUser}/>
        </div>
        <br/>
        <br/>       
      </div>
    )
  }
}
  function mapStateToProps(state) {
    return{
        statusText:state.login.statusText
      }
    }
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({loginUser},dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(Login);