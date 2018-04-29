import React from 'react';
import Tone from "tone";
import styles from './ControlBar.css'

class ControlBar extends React.Component {

    constructor(props) {
        super(props);
        this.onClickPlay = this.onClickPlay.bind(this);
        this.onClickStop = this.onClickStop.bind(this);
        this.state = {
            playing: false,
        }
    }

    onClickPlay() {
        console.log("onClickPlay");
        this.setState({playing: true});
        Tone.Transport.start();
        this.props.onPlay();
    }

    onClickStop() {
        console.log("onClickStop");
        this.setState({playing: false});
        Tone.Transport.stop();
        this.props.onStop();
    }

    render() {
        let playClassName = this.state.playing ? "disabled" : "";
        let stopClassName = this.state.playing ? "" : "disabled";
        return (
            <div className={styles}>
                <button className={playClassName} onClick={this.onClickPlay}>Play</button>
                <button className={stopClassName} onClick={this.onClickStop}>Stop</button>
            </div>
        )
    }
}

export default ControlBar;
