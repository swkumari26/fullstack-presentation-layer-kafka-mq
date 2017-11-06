import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import {Link}  from 'react-router-dom'

class Login extends Component {
	    state = {
        signInPage:true
    };
render(){
  const{signInPage} =this.state;
  const{user,loginUser} = this.props;
  return (
  	<div>
  	{
  	signInPage?
  	(<div>
  	  <h4>Sign in</h4>
  	  <h7 className="float-right">or <Link to="" onClick={() => {this.setState({signInPage:false});}}>create an account</Link></h7>
  	</div>):
  	(<div>
  	  <h4>Create an account</h4>
  	  <h7 className="float-right">or <Link to="" onClick={() => {this.setState({signInPage:true});}}>log in</Link></h7>  	  
  	</div>)
  	}	
    <form onSubmit={(e) => {e.preventDefault(); this.setState({signInPage:true});loginUser(user,signInPage);}}>
    {  	signInPage?null:
        (<div><div className="form-group">
          <Field name="firstname" className="form-control" component="input" size="40" type="text" placeholder="First Name"/>
        </div>
        <div className="form-group">
          <Field name="lastname" className="form-control" component="input" size="40" type="text" placeholder="Last Name"/>
        </div></div>)
    }
		<div className="form-group">
          <Field name="email" className="form-control" component="input" size="40" type="email" placeholder="Email"/>
        </div>
		<div className="form-group">
          <Field name="password" className="form-control" component="input" size="40" type="password" placeholder="Password"/>
        </div>        
      <div>
      	<Field name="dropboxTerms" id="dropboxTerms" component="input" type="checkbox"/>
      	{
      	signInPage? "Remember me":
      	<label htmlFor="dropboxTerms"> I agree to <a href="/" target="_blank">Dropbox terms</a></label>
      	}
      	<div className="float-right">
      	{
        signInPage?(<button type="submit" className="btn btn-primary">Sign in</button>):
        	(<button type="submit" className="btn btn-primary">Create an account</button>)
        }
        </div>
       </div>
    </form>
    </div>
  	);
	}
}

Login = reduxForm({
	form:'authentication'
})(Login);

function mapStateToProps(state) {
	const selector = formValueSelector('authentication') // <-- same as form name
	console.log(state)
	const {firstname,lastname,email,password} = selector(state, 'firstname', 'lastname','email','password')  	
    return { 
    	user:{firstname,lastname,email,password}
    }
  }

export default connect(mapStateToProps, null)(Login);    // Learn 'Currying' in functional programming