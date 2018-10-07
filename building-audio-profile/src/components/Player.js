import React from 'react';
//import Image from './Image'
import { Button } from 'react-player-controls'
import { TiMediaPlay, TiMediaPause, TiUpload } from 'react-icons/ti'

import StartAudioContext from 'startaudiocontext';
import Tone from 'tone';
//const synth = new Tone.PolySynth(16, Tone.Synth);
const volume = new Tone.Volume(-16);
volume.mute = false;

/*
  const notes = state.grid.map((row, y) => {
          const key = state.musicBox.keys[state.musicBox.currentKey];
          return {
            active: row[state.currentColumn],
            note: key[y % key.length],
          };
        }).filter(blip => blip.active)
  .map(blip => blip.note);
*/

  const synth = new Tone.PolySynth(6, Tone.Synth, {
    "oscillator" : {
      "partials": [0, 2, 3, 4],
    }
  }).toMaster();

  synth.chain(volume, Tone.Master);

  StartAudioContext(synth.context, '#root')
    .then(() => console.log('INITIALIZED WEB AUDIO API'))
    .catch(() => console.log('FAILED TO INITIALIZE WEB AUDIO API'));

class Player extends React.Component{
  constructor(props){
    super()
    this.state = {
      data: {},
      isPlaying: false,
      imageUploaded: true,
      imageFile: '',
      imageFileUrl: '',
      imageWidth: 360,
      imageHeight: 200,
      playerPosition: 0,
      isPaused: false,
    }
  }

  onPlaybackChange(isPlaying){
    this.setState({
      isPlaying : isPlaying,
      isPaused: !isPlaying,
    })
    if(this.state.imageUploaded && this.state.isPlaying){
      this.drawLine();
    }
  }

  drawLine(){
    var canvas = document.getElementById('image'), /// canvas element
    ctx = canvas.getContext('2d'),            /// context
    line = new Line(ctx),                     /// our custom line object
    img = new Image;                          /// the image for bg
    ctx.strokeStyle = '#000';                     /// black line for demo

    /// start image loading, when done draw and setup
    img.onload = start(this.state.isPlaying, this.state.imageWidth, this.state.imageHeight);
    img.src = this.state.imageFileUrl;
    var offset = 0;
    var xpos = offset;

    function start(isPlaying, imageWidth, imageHeight) {
      /// initial draw of image
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight);

      if(isPlaying){
        setInterval(updateLine, 50); //(img, xpos, offset), 50);
      }
    }
    function updateLine(){ //xpos, offset) {

//      if(!isPaused) {
//        var milisec = offset + (new Date()).getTime() - time.getTime();
//        output.text(parseInt(milisec / 1000) + "s " + (milisec % 1000));
//      }

      (xpos < canvas.width-5) ? xpos += 5 : xpos = 0;
      offset = xpos;

      /// draw background image to clear previous line
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      /// update line object and draw it
      line.x1 = xpos;
      line.y1 = 0;
      line.x2 = xpos;
      line.y2 = canvas.height;
      line.draw();

      let column = ctx.getImageData(xpos, 0, 1, canvas.height).data
      let sum = column.reduce((a, b) => a + b, 0);
      let avg = sum / column.length;

      let counts = {};

      for (let i = 0; i < column.length; i++) {
        let num = column[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }


      let distribution = {},
          max = 0,
          result = [];

      column.forEach(function (a) {
      distribution[a] = (distribution[a] || 0) + 1;
      if (distribution[a] > max) {
          max = distribution[a];
          result = [a];
          return;
      }
      if (distribution[a] === max) {
          result.push(a);
      }
  });


      console.log("counts", counts);
      console.log("av ", avg)
      console.log("max", max)

      synth.triggerAttackRelease(max, 32);

      for (const key of Object.keys(counts)) {
//        synth.triggerAttackRelease(key, 0.2);
          console.log(key, counts[key]);
      }

    }

    function Line(ctx) {

      var me = this;

      this.x1 = 0;
      this.x2 = 0;
      this.y1 = 0;
      this.y2 = 0;

      /// call this method to update line
      this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(me.x1, me.y1);
        ctx.lineTo(me.x2, me.y2);
        ctx.stroke();
      }
    }
  }

  handleUpload(){
    console.log("onUpload")
  }

  handleSubmit(){
    console.log("handleSubmit")
  }

  handleInput = e => {
    e.preventDefault();
    console.log("handleInput")
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      console.log("reader.result:", reader.result)
      this.setState({
        imageFile: file,
        imageFileUrl: reader.result,
        imageUploaded: true,
      })
    }
    reader.readAsDataURL(file)
  }

  // send to material.js
  materialData(params){
    this.setState({
      data: params
    })
  }

  render(){
    let {imageFileUrl} = this.state;
    let $imageView = null;

    const headerStyle = {
      width: '80%', margin: '0 auto', paddingLeft: '10%', paddingRight: '10%'
    }

    const imageStyle = {
      width: '360px', margin: '0 auto', paddingLeft: '10%', paddingRight: '10%'
    }


    if (this.state.imageUploaded) {
      //      $imageView = (<img id="image" alt="soudn image" style={imageStyle} src={imageFileUrl} />);
      $imageView = (<canvas ref="canvas" id="image" alt="soudn image" width={this.state.width} height={this.state.height} />);
    } else {
      $imageView = (<div className="previewText">Please select an image</div>);
    }


    return (
      <div>
        <div style={headerStyle}>
          <h1>Building-a-tron</h1>
          <p>Upload a drawing</p>
        </div>
        <div>
        <div style={imageStyle} className="image" alt="sound">
          {$imageView}
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="file" onChange={this.handleInput} />
        </form>
        <Button onClick={() => this.onPlaybackChange(!this.state.isPlaying)} >
          {this.state.isPlaying ? <TiMediaPlay /> : <TiMediaPause />}
        </Button>
      </div>
      </div>
    );
  }
}

//<Button type="file"
//        onClick={(e) => this.handleUpload()} >
//      </Button>
// <TiUpload type="file" />



export default Player;
