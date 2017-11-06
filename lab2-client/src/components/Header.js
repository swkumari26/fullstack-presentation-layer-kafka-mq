import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';
import {logoutAndRedirect,loginRefresh} from '../actions/index';
import { bindActionCreators } from 'redux';
import history from '../history';
class Header extends Component {
render(){
  const{pageName,userName,logoutAndRedirect} = this.props;
  return (
    <div className="container-fluid">
    <div className="row">
    <div className="col-lg-6 col-md-6 col-sm-6">
    <h3>{pageName}</h3>
    </div>
    <div className="col-lg-6 col-md-6 col-sm-6">
    <div className="float-right">
      <DropdownMenu userName={userName} position="left" triggerType='icon' trigger='glyphicon glyphicon-user'>
        <MenuItem text='Settings' onClick={(e) => {e.preventDefault(); loginRefresh();history.push('/account'); }}/>
        <MenuItem type='separator' />
        <MenuItem text='Logout' onClick={(e) => {e.preventDefault(); logoutAndRedirect();}} />
      </DropdownMenu>    
    </div>
    </div>    
    </div>
    </div>
  	);
	}
}
function mapStateToProps(state) {
  const selector = formValueSelector('authentication') // <-- same as form name
  console.log(state)
  const {firstname,lastname,email,password} = selector(state, 'firstname', 'lastname','email','password')   
  const signInPage=state.login.signInPage
    return { 
      user:{firstname,lastname,email,password},
      signInPage: signInPage
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({logoutAndRedirect,loginRefresh},dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);    // Learn 'Currying' in functional programming