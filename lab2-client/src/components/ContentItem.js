import React, { Component } from 'react';
import FolderIcon from 'react-icons/lib/md/folder';
import FileIcon from 'react-icons/lib/go/file-text';
import PdfIcon from 'react-icons/lib/fa/file-pdf-o';
import StarIcon from 'react-icons/lib/fa/star';
import {Link}  from 'react-router-dom'
import history from '../history';
import { bindActionCreators } from 'redux';
import {createFolder,deleteContent,starContent,shareContent,getAccounts} from '../actions/index';
import { connect } from 'react-redux'
import Modal from 'react-modal'
import {api} from '../actions/index'

class ContentItem extends Component { 
state = {modalIsOpen:false}
   handleKeyPress = (event) => {
      var folderPath;
        if(event.key === "Enter")
        { console.log("enter pressed");

        if ((this.props.parentpath.content_path)&&(this.props.parentpath.absolute_path)){
          folderPath = this.props.parentpath.content_path+'/'+event.target.value ;
        }
        else{
          folderPath = this.props.user.id+'/'+this.props.parentpath.absolute_path+event.target.value ;
        }
          var absolutePath = this.props.parentpath.absolute_path+event.target.value+'/'
          this.props.createFolder(folderPath,event.target.value,absolutePath);
        }
      }               
render(){  
  const{user,name,parentpath,files,deleteContent,shareContent,starContent,accounts,getAccounts} = this.props;
  const{modalIsOpen} = this.state;
  let displayIcon,buttonOptions
  let link = '/home/'+name;
  let pathWithName;
  if(files)
  {
  pathWithName = files.content_path 
  }
    if (name)
    {
  	if (name.indexOf('.') > -1)
  		{	

      if(files.star)
          {        
        if(name.indexOf('pdf') > -1)
        {
        displayIcon = (
          <Link to=""><PdfIcon size={50}/><span>{name}&nbsp;&nbsp;</span><StarIcon size={20}/></Link>
          )
        }
        else
        {
        displayIcon = (
          <Link to=""><FileIcon size={50}/><span>{name}&nbsp;&nbsp;</span><StarIcon size={20}/></Link>
          )  
        }
      }
      else
      {
        if(name.indexOf('pdf') > -1)
        {        
        displayIcon = (
          <Link to=""><PdfIcon size={50}/><span>{name}     </span></Link>
          )
        }
        else
        {
        displayIcon = (
          <Link to=""><FileIcon size={50}/><span>{name}     </span></Link>
          )  
        }
      }
        buttonOptions = (<div>
          <button className="btn btn-default btn-sm" onClick={(e) => {e.preventDefault();getAccounts();this.setState({modalIsOpen:true});}}>Share</button>
          {
          (files.created_by===user.id)?
          (<button className="btn btn-default btn-sm" onClick={(e) => {e.preventDefault(); deleteContent(pathWithName); }}>Delete</button>):""
          }
          <a className="btn btn-default btn-sm" href={`{api}/dropbox/`+pathWithName} download>Download</a>
          <button className="btn btn-default btn-sm" onClick={(e) => {e.preventDefault(); starContent(pathWithName); }}>Star</button>
          </div>
          )               
    		}
    	else{
        if(files.star)
        {
  			displayIcon = (
        <Link to="" onClick={(e) => {e.preventDefault(); history.push(link); }}><FolderIcon size={50}/><span>{name}    </span><StarIcon size={20}/></Link>
        )
      }
      else{
        displayIcon = (
        <Link to="" onClick={(e) => {e.preventDefault(); history.push(link); }}><FolderIcon size={50}/><span>{name}    </span></Link>
        )        
      }
        buttonOptions = (<div>
          <button className="btn btn-default btn-sm" onClick={(e) => {e.preventDefault();getAccounts();this.setState({modalIsOpen:true});}}>Share</button>
          {
          (files.created_by===user.id)?
          (<button className="btn btn-default btn-sm" onClick={(e) => {e.preventDefault(); deleteContent(pathWithName); }}>Delete</button>):""
          }          
          <button className="btn btn-default btn-sm" onClick={(e) => {e.preventDefault(); starContent(pathWithName); }}>Star</button>
          </div>
          )        
      }
    }
    else
    {
        displayIcon = (
        <a><FolderIcon size={50}/><input type="text" onKeyPress={this.handleKeyPress}/></a>
        )       
    }
  return(
  <div>
  <table className="table">
  <tr>
    <td className="col-lg-4 col-md-4 col-sm-4">
    {displayIcon}
  	</td>
    <td className="col-lg-4 col-md-4 col-sm-4">
    {(files)?(files.created_on):""}
    </td>   
    <td className="col-lg-4 col-md-4 col-sm-4">
    <div className="float:right">
      {buttonOptions}        
    </div>
    </td>
    </tr> 
    </table> 
    <Modal 
      isOpen={modalIsOpen} 
      contentLabel='Modal'
      style={{overlay:{},content:{bottom:"50%",left:"30%",right:"30%",border:"2px solid #ccc"}}}       
      >
    <div className="modal-text">
    {displayIcon}<button className="close" onClick={(e) => {e.preventDefault();this.setState({modalIsOpen:false});}}><span aria-hidden={true}>&times;</span></button>
    <hr/>
    To: <input id="userID" list="accounts" placeholder="Email or name" className="inputmodal" ref={(input) => this.input = input}></input>
    <datalist id="accounts">
    {
      accounts.map((account)=>{
        return (<div><option data-id={account.id} value={account.email}></option>
                <option data-value={account.id} value={account.firstname+' '+account.lastname}></option></div>)
      })
    }
    </datalist>
    <hr/>
    <Link to="">Create link to share</Link>
    <hr/>
    <button className="btn btn-primary" onClick={(e) => {e.preventDefault();shareContent(this.input.value,accounts,name,files.content_path,files.absolute_path,user.id);this.setState({modalIsOpen:false});}}>Share</button>
    </div>
    </Modal>
    </div>   
     );	
}
}

  function mapStateToProps(state) {
    return{
      accounts:state.login.accounts
    }
    }

function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({createFolder,deleteContent,starContent,shareContent,getAccounts},dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ContentItem);