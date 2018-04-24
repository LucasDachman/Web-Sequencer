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

        this.handleStop = this.handleStop.bind(this);
        const matrix = Array(this.props.rows * this.props.cols).fill(false);

        this.state = {
            position: 0,
            matrix: matrix
        };
    }

    componentDidMount() {
        const loop = new Tone.Loop((time) => {
            this.stepChange(time);
        }, "4n").start(0);

        var sampler = new Tone.Sampler({ 
            "C3": "../Tabla.wav",
        }).toMaster();

        this.setState({
            loop: loop,
            sampler: sampler
        });
    }

    stepChange(time) {
        let position = this.state.position;
        position++;
        position %= this.props.cols;
        this.setState({ position: position });

        const pos = this.state.position;
        if (this.state.matrix[pos]) {
            this.state.sampler.triggerAttack("C3");
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
