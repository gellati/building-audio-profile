import React from 'react';

class Image extends React.Component{
  constructor(props){
    super()
    this.state = {
      data: {}
    }
  }

  // send to material.js
  materialData(params){
    this.setState({
      data: params
    })
  }

  render(){
    var props = {}
    props.data = this.state.data

    var imageStyle = {
      width: '80%', margin: '0 auto',
      paddingLeft: '10%', paddingRight: '10%'
    }

    return (
      <div>
      <div style={imageStyle}>
      </div>
      </div>
      );
  }
}

export default Image;
