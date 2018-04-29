import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _ from "lodash";
import Tone from "tone";
import styles from './index.css';
import ControlBar from './ControlBar';
import Timeline from "./Timeline";

class Sequencer extends React.Component {

    constructor(props) {
        super(props);

        let tempo = 120;
        this.handleStop = this.handleStop.bind(this);
        const matrix = Array(this.props.rows * this.props.cols).fill(false);
        const players = Array(this.props.rows).fill(new Tone.Player(null).toMaster());

        this.state = {
            position: 0,
            matrix: matrix,
            players: players,
            tempo: tempo
        };
    }

    componentDidMount() {
        const loop = new Tone.Loop((time) => {
            this.stepChange(time);
        }, "4n").start(0);

        const path = "./Fav_Drums/"
        const samples = ["P - Snap 2.wav", "P - Toms.wav", "S - Cool.wav", "Tabla.wav"];
        const players = this.state.players;
        _.forEach(players, (player, index) => {
            console.log(samples[ index ]);
            player.load(path + samples[index]);
        })

        this.setState({
            loop: loop,
            players: players
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        const didChange = !(
            nextState.position === this.state.position &&
            _.isEqual(nextState.matrix, this.state.matrix)
        );
        return true;
    }
    stepChange(time) {
        let position = this.state.position;
        position++;
        position %= this.props.cols;
        this.setState({ position: position });

        const rows = this.props.rows;
        const cols = this.props.cols;
        for (let i = 0; i < rows; i++) {
            const step = i * cols + position;
            if (this.state.matrix[step]) {
                this.state.players[i].restart(time);
            }
        }
    }

    handleClick(i) {
        var matrix = this.state.matrix;
        matrix[i] = !matrix[i];
        this.setState({ matrix: matrix });
    }

    handleStop() {
        this.setState({position: 0});
    }

    renderSquare(i) { var content;
        if (this.state.matrix[i]) {
            content = <button className={styles} key={i} style={{backgroundColor: "#4CAF50"}} onClick={() => this.handleClick(i)} />    
        }
        else {
            content = <button className={styles} key={i} onClick={() => this.handleClick(i)} />    
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
            grid.push(<div key={i}> {row} </div>);
        }
        return (
            <div>
                {<ControlBar onStop={this.handleStop} />}
                {grid}
                {<Timeline length={this.props.cols} position={this.state.position} />}
            </div>
        );
    }
}
/* =================== */
ReactDOM.render(
    <div style={{width: 800, height: 800}} className="container">
        <Sequencer rows={3} cols={4}/>
    </div>,
    document.getElementById('root')
  );
