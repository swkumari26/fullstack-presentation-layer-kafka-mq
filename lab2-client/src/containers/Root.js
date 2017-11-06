import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../store/configureStore'
import Login from './Login'
import {loginRefresh} from '../actions/index';
import Home from './Home'
import Log from './Log'
import Account from './Account'
import { Route } from 'react-router-dom'

const store = configureStore()

export default class Root extends Component {	
  componentDidMount(){
      store.dispatch(loginRefresh());
  }
  render() { 	
    return (
      <Provider store={store}>
		<div>
		<Route exact path="/" component={Login} />
		<Route exact path="/home" component={Home } />
		<Route exact path="/home/:folder" component={Home } />
		<Route exact path="/account" component={Account } />
    <Route exact path="/log" component={Log } />
	    </div>      
	  </Provider>
    )
  }
}