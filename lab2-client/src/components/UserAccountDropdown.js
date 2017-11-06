import React, { Component } from 'react'
var EVENTNAME = "dropdown-close";

// Trigger dropdown event once if background is clicked
document.addEventListener('click', (e)=>
{
	window.dispatchEvent(new CustomEvent(EVENTNAME, { detail: e.srcElement }));
});

export default class UserAccountDropdown extends Component {

	    state = {
        open:false
    };
  
	render()
	{
  	let menu = null;
    if (this.state.open) { 
    	menu = this.props.children;
    }
		return <div className="dropdown">
			<a className="dropdown-toggle" ref="toggle" onClick={this.toggleMenu}>Dropdown</a>
			{menu}
		</div>
	},

	toggleMenu(e)
	{
    this.setState({open: !this.state.open});
	},

	closeMenu(e)
	{
  	if (e.detail !== this.refs.toggle)
		{
			this.setState({open: false});
		}
	},

	componentWillMount()
	{
		var that = this;
		window.addEventListener(EVENTNAME, this.closeMenu);
	},

	componentWillUnmount()
	{
		var that = this;
		window.removeEventListener(EVENTNAME, this.closeMenu);
	}
};