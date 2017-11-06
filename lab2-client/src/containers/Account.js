import React, { Component } from 'react'
import { connect } from 'react-redux'
import history from '../history';
import Header from '../components/Header'
import {Link}  from 'react-router-dom';
import PieChart from 'react-minimal-pie-chart';
class Account extends Component {
        componentWillMount () {
            this.checkAuth(this.props.isAuthenticated);
        }

        componentWillReceiveProps (nextProps) {
            this.checkAuth(nextProps.isAuthenticated);
        }

        checkAuth (isAuthenticated) {
            if (!isAuthenticated) {
             history.push('/');
            }
        }  
  render() {
  const{user,statusText} = this.props; 
let username;
if(user){username= user.lastname+','+user.firstname;}  
  return(
  <div className="row-fluid">
      <div className="col-lg-2">
        <div className="navbar navbar-fixed-left">
          <ul className="nav navbar-nav pull-left">
    <li><a href="#home"><i className="fa fa-home"></i><span> <img src="https://cfl.dropboxstatic.com/static/images/favicon-vflk5FiAC.ico" alt="dropbox logo"></img> </span></a></li>
   <li><Link to="" onClick={(e) => {e.preventDefault(); history.push('/home'); }}><h4>Home </h4></Link></li>
   <li><Link to="" onClick={(e) => {e.preventDefault(); history.push('/log'); }}><h4>Activity Log </h4></Link></li>
   <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          </ul>
      </div>
      </div>
  <div className="col-lg-10">
          <div className="row justify-content-md-center">
          <h4>{statusText}</h4>
        </div> 
  <Header pageName="Account" userName={username}/>
  <div className = "row">
  <div className="col-lg-9 col-md-9 col-sm-9">
    {
    (!user)?"":
    (<div>
    <div className="jumbotron">About</div>
      <div>
          <table className="table">
            <tr>
              <td className="col-lg-6 col-md-6 col-sm-6">
              Name
              </td>
              <td className="col-lg-6 col-md-6 col-sm-6 float-right">
              {user.firstname+' '+user.lastname}
              </td> 
            </tr>             
        </table>
        <table className="table">
            <tr>
              <td className="col-lg-6 col-md-6 col-sm-6">
              Email
              </td>
              <td className="col-lg-6 col-md-6 col-sm-6 float-right">
              {user.email}
              </td> 
            </tr>             
        </table>        
      </div>
    <div className="col-lg-6 col-md-6 col-sm-6">
      <div className="jumbotron">Life events</div>
      <h5>Number of content created {user.no_content_created} </h5>
      <h5>Number of content deleted {user.no_content_deleted} </h5>
      <h5>Number of content shared {user.no_content_shared} </h5>
      <PieChart radius='25'
      data={[
      { value: user.no_content_created, key: 1, color: '#E38627' },
      { value: user.no_content_deleted, key: 2, color: '#C13C37' },
      { value: user.no_content_shared, key: 3, color: '#6A2135' },
      ]}
      />    
    </div> 
    <div className="col-lg-6 col-md-6 col-sm-6">
      <div className="jumbotron">Interests</div>
      <div>
        <table className="table">
            <tr>
              <td className="col-lg-6 col-md-6 col-sm-6">
              Music
              </td>
              <td className="col-lg-6 col-md-6 col-sm-6 float-right">
              
              </td> 
            </tr> 
        </table>   
        <table className="table">
            <tr>
              <td className="col-lg-6 col-md-6 col-sm-6">
              Show
              </td>
              <td className="col-lg-6 col-md-6 col-sm-6 float-right">
              
              </td> 
            </tr> 
        </table> 
        <table className="table">
            <tr>
              <td className="col-lg-6 col-md-6 col-sm-6">
              Sports
              </td>
              <td className="col-lg-6 col-md-6 col-sm-6 float-right">
              
              </td> 
            </tr> 
        </table>                      
      </div>    
    </div> 
    </div>)
    }  
    </div>
    <div className="col-lg-3">
      <div className="float-right"></div>
    </div>
    </div>
  </div> 
  </div>
      )
  }
}
  function mapStateToProps(state) {
    return{
        user:state.login.user,
        isAuthenticated: state.login.isAuthenticated,
        tree:state.login.tree,
        statusText:state.login.statusText
    }
    }
export default connect(mapStateToProps, null)(Account); 