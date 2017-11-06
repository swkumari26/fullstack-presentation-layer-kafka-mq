import React, { Component } from 'react'
import ContentItem from './ContentItem'

export default class Content extends Component {
render(){
  const{files,user,tree} = this.props;
  console.log("files in content:",files);
  return(
    <div>
    {
      files.files.map((contentItem)=>{
        return(
          <div>
          {
            <ContentItem name={contentItem} parentpath={files} files={tree[contentItem]} user={user}/>
          }
          </div>
          );
      }
    )
    }
    </div>
  	);	
}
}