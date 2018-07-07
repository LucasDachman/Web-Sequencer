import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _ from "lodash";
import Tone from "tone";
import WebMidi from "webmidi";
import styles from './index.css';
import ControlBar from './ControlBar';
import Timeline from "./Timeline";

class Sequencer extends React.Component {

    constructor(props) {
        super(props);

        this.path = "./Fav_Drums/";

        this.handleStop = this.handleStop.bind(this);
        this.handlePlay = this.handlePlay.bind(this);

        this.state = {
            position: 0,
            matrix: Array(this.props.rows * this.props.cols).fill(false),
            players: new Tone.Players(null).toMaster(),
            fileNames: [],
            bpm: 120,
            volumes: Array(this.props.rows).fill(-6),
        };
    }

    componentDidMount() {
        Tone.Transport.bpm.value = this.state.bpm;
        const loop = new Tone.Loop((time) => {
            this.stepChange();
            this.playActive(time);
        }, "4n").start(0);
        loop.humanize = .025;

        // sample players
        const path = "./Fav_Drums/"
        const samples = ["P - Shaker.wav", "Snare Drum Delayed_2.wav", "808 vybes.wav" ];
        const players = this.state.players;
        const rows = this.props.rows;
        for( let i = 0; i < rows; i++) {
            players.add(i, path + samples[i]);
            players.get(i).volume.value = this.state.volumes[i];
        }

        // webmidi
        WebMidi.enable((err) => {
            if (err) {
                console.log("WebMidi could not be enabled.", err);
            } else {
                console.log("WebMidi enabled!");
                // get first input device
                const device = WebMidi.inputs[0];
                console.log(WebMidi.inputs);
                if (!_.isNil(device)) {
                    console.log("Current device: ", device.name);
                    this.setState({device: device});

                    device.addListener('noteon', 'all', (e) => {
                        this.enableStep(e.note.number);
                    });

                    device.addListener('noteoff', 'all', (e) => {
                        this.disableStep(e.note.number);
                    });
               }
                else {
                    console.log("No midi device");
                }
            }
        });
        this.setState({
            players: players,
            loop: loop,
        });
 

    }

    shouldComponentUpdate(nextProps, nextState) {
        const didChange = !(
            nextState.position === this.state.position &&
            _.isEqual(nextState.matrix, this.state.matrix)
        );
        if (nextState.device !== this.state.device) {
            console.log("Device Change: ", nextState.device);
        }
        return true;
    }

    enableStep(midiNote) {
        const totalCols = this.props.cols;
        const area = 16;
        const row = Math.trunc(midiNote / area);
		const col = midiNote % area;
        const i = row * totalCols + col;

        const matrix = this.state.matrix.slice();
        matrix[i] = true;

        this.setState({matrix: matrix});
    }

    disableStep(midiNote) {
        const totalCols = this.props.cols;
        const area = 16;
        const row = Math.trunc(midiNote / area);
        const col = midiNote % area;
        const i = row * totalCols + col;

        const matrix = this.state.matrix.slice();
        matrix[i] = false;

        this.setState({ matrix: matrix });
    }

    stepChange() {
        let position = this.state.position;
        position++;
        position %= this.props.cols;
        this.setState({ position: position });
    }

    playActive(time) {
        const position = this.state.position;
        const rows = this.props.rows;
        const cols = this.props.cols;
        for (let i = 0; i < rows; i++) {
            const step = i * cols + position;
            if (this.state.matrix[step]) {
                //let vol = this.state.players.get(i).volume.value;
                //this.state.players.get(i).volume.value = this.getRandomVolume(vol);
                this.state.players.get(i).restart(time);
                //this.state.players.get(i).volume.value = vol;
                console.log("current player: ", i);
                
            }
        }
    }

    getRandomVolume(vol) {
        let max = 12;
        let min = 0;
        return vol - (Math.random() * (max - min) + min);
    }

    handleClick(i) {
        var matrix = this.state.matrix.slice();
        matrix[i] = !matrix[i];
        this.setState({ matrix: matrix });
    }

    handleStop() {
        this.setState({position: 0});
    }

    handlePlay() {
        this.setState({position: -1});
        //this.stepChange();
//        this.playActive()
    }

    handleFiles(files, i) {
        console.log(files);
        this.state.fileNames[i] = files.name;
        this.state.players.get(i).load(this.path + files[0].name);
    }

    handleBpm(e) {
        this.setState({bpm: e.target.value});
        Tone.Transport.bpm.value = e.target.value;
    }

    handleVol(e,i) {
        this.state.players.get(i).volume.value = e.target.value
        var volumes = this.state.volumes;
        volumes[i] = e.target.value;
        this.setState({volumes: volumes});
    }

    renderSquare(i) { var content;
        if (this.state.matrix[i]) {
            content = <button className="step" style={{backgroundColor: "#FFFF50"}} key={i} onClick={() => this.handleClick(i)} />    
        }
        else {
            content = <button className="step" style={{backgroundColor: "#FFFFFF"}} key={i} onClick={() => this.handleClick(i)} />    
        }
        return content;
    }


    render() {
        var count = 0;
        let grid = [];
        for (let i = 0; i < this.props.rows; i++) {
            let row = []; 
            for (let j = 0; j < this.props.cols; j++) {
                row.push(this.renderSquare(count++));
            }
            grid.push(<div className="step-row" key={i}> {row} </div>);
        }

                    //{this.state.currentFiles[i]}
        let filebtns = [];
        for (let i = 0; i < this.props.rows; i++) {
            filebtns.push(
                <div className="file-picker">
                <input type="file"  onChange={ (e) => this.handleFiles(e.target.files, i) } key={"file"+i}/>
                <input type="range" 
                    value={this.state.volumes[i]} 
                    max={0} min={-24} 
                    onChange={ (e) => this.handleVol(e,i)} 
                    key={"range"+i}/>
                </div>
            );
        }

        return (
            <div className="flex-container" >
                <div className="file-pickers" >
                    {filebtns}
                </div>
                <div>
                    <div className="step-row">
                        <ControlBar onPlay={this.handlePlay} onStop={this.handleStop} />
                        <input value={this.state.bpm} type="number" onChange={ (e) => this.handleBpm(e)} />
                    </div>
                    {grid}
                    <Timeline length={this.props.cols} position={this.state.position} />
                </div>
            </div>
        );
    }
}
/* =================== */
ReactDOM.render(
    <div style={{ background: "#454545"}} className="container">
        <Sequencer rows={3} cols={4}/>
    </div>,
    document.getElementById('root')
  );
