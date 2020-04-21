import React, { Component, createRef } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();
    this.textref = createRef();
  }

  componentDidMount() {
    const pc_config = null;
    this.pc = new RTCPeerConnection(pc_config);
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(JSON.stringify(event.candidate));
      }
    };

    this.pc.oniceconnectionstatechange = (event) => {
      console.log(event);
    };

    this.pc.onaddstream = (event) => {
      this.remoteVideoRef.current.srcObject = event.stream;
    };

    const constraints = { video: true };

    const success = (stream) => {
      window.localStream = stream;
      this.localVideoRef.current.srcObject = stream;
      this.pc.addStream(stream);
    };

    const failure = (error) => {
      console.log('getUserMedia Error: ', error);
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }

  createOffer = () => {
    console.log('Offer');
    this.pc.createOffer({ offerToReceiveVideo: 1 }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        this.pc.setLocalDescription(sdp);
      },
      (e) => {
        console.log(e);
      }
    );
  };

  setRemoteDescription = () => {
    const desc = JSON.parse(this.textref.value);
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  createAnswer = () => {
    console.log('Answer');
    this.pc.createAnswer({ offerToReceiveVideo: 1 }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        this.pc.setLocalDescription(sdp);
      },
      (e) => {
        console.log(e);
      }
    );
  };

  addCandidate = () => {
    const candidate = JSON.parse(this.textref.value);
    console.log('Adding candidate: ', candidate);

    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  render() {
    return (
      <div>
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: 'black',
          }}
          ref={this.localVideoRef}
          autoPlay
        ></video>

        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: 'black',
          }}
          ref={this.remoteVideoRef}
          autoPlay
        ></video>

        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnswer}>Answer</button>
        <br />
        <textarea
          ref={(ref) => {
            this.textref = ref;
          }}
        />
        <br />
        <button onClick={this.setRemoteDescription}>Set Remote Desc</button>
        <button onClick={this.addCandidate}>Add Candidate</button>
      </div>
    );
  }
}

export default App;
