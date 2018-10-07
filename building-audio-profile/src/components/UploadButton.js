import React from 'react';
import styled from 'styled-components'

const UploadButtonWrapper = styled.div`
  padding-left: 10%;
  padding-right: 10%;
  margin: 0 auto;
  height: 50px;
  margin-bottom: 5%;
  display: block;
`
var results = {}

function rect(props) {
  const {ctx, x, y, width, height} = props;
  ctx.fillRect(x, y, width, height);
}

class UploadButton extends React.Component{
  constructor(props){
    super(props)
    this.updateCanvas = this.updateCanvas.bind(this)
  }

  componentDidMount(){
    this.updateCanvas();
  }

  componentDidUpdate(){
    let e = this.props.data
    this.updateCanvas(results);
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0,10,50)
    this.dataToHex(results)

    ctx.fillStyle = this.dataToHex(results) //gradientstyle
    rect({ctx, x: 10, y: 10, width: 500, height: 500});
  }

  render(){
    var style = {width: '80%', margin: '0 auto',
                paddingLeft: '10%', paddingRight: '10%',
                height: '100%'};

    return (
      <UploadButtonWrapper>
      <canvas ref="canvas"
      style={style}
      />
      </UploadButtonWrapper>
    );
  }
}

export default UploadButton;
