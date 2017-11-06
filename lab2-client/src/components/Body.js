import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import NewFolder from 'react-icons/lib/md/folder-open';
import Content from './Content'
import {uploadFile} from '../actions/index';

class Body extends Component { 
   handleFileUpload = (event) => {
      var content_path,absolute_path;
        const file = new FormData();
        if (this.props.files.content_path){
         content_path = this.props.files.content_path+'/';
      }
      else{
         content_path = this.props.user.id+'/'+this.props.files.absolute_path;
      }
        absolute_path = this.props.files.absolute_path;
        file.append('path', content_path);
        file.append('absolutepath', absolute_path);
        file.append('myfile', event.target.files[0]);
        this.props.uploadFile(file);
    };
render(){
  const{uploadFile,files,user,tree} = this.props; 
    console.log("files in body",files); 
  return(
    <div className="row">
    <div className="col-lg-9">
    {
    (Object.keys(files).length===0)?" ":     
      (<Content files={files} tree={tree} user={user}/>)
    }
    </div>
  <div className="col-lg-3">
  <div className="float-right">
   <div className="navbar">
   <div>
      <ul className="nav navbar-nav">
        <div className="upload-wrap">
          <input type="file" name="fileUpload" className="upload-btn" onChange={this.handleFileUpload}/>
          <button type="submit" className="btn btn-primary btn-block btn-lg">Upload files</button> 
        </div>  
        <br/> 
      <li><button className="buttonlink" onClick={() => {(Object.keys(files).length===0)?" ":(this.setState({files:files.files.push("")}));}}><NewFolder size={30}/><span> New folder </span></button></li>
      </ul>
    </div>
    </div>
    </div>
    </div>
  </div>
    )
  }
}
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators({uploadFile},dispatch)
    };
}
export default connect(null,mapDispatchToProps)(Body);