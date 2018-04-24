import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _ from "lodash";
import Tone from "tone";
import styles from './index.css';
import ControlBar from './ControlBar';

class Sequencer extends React.Component {

    constructor(props) {
        super(props);

        this.handleStop = this.handleStop.bind(this);

        var squares = Array(this.props.rows).fill(new Array(this.props.cols));
        this.state = {
            squares: squares,
            sine: new Tone.Oscillator(440, "sine").toMaster(),
            position: 0,
        };
    }

    componentDidMount() {
        const loop = new Tone.Loop((time) => {
            this.stepChange(time);
        }, "4n").start(0);
        this.setState({loop: loop});
    }

    stepChange(time) {
        Tone.Draw.schedule(() => {
            console.log("change pos: ", this.state.position);
            let position = this.state.position;
            position++;
            position %= this.props.cols;
            this.setState({ position: position });
        }, time)
    }

    handleClick() {
        var now = Tone.now();
        this.state.sine.start(now);
        this.state.sine.stop(now + 2);
    }

    handleStop() {
        this.setState({position: 0});
    }

    renderSquare(i) { var content;
        if (i === this.state.position) {
            content = <button className={styles} key={i} style={{backgroundColor: "#4CAF50"}} onClick={() => this.handleClick()} />    
        }
        else {
            content = <button className={styles} key={i} onClick={() => this.handleClick()} />    
        }
        return content;
    }

    render() {
        let grid = [];
        for (let i = 0; i < this.props.rows; i++) {
            let row = []; 
            for (let j = 0; j < this.props.cols; j++) {
                row.push(this.renderSquare(j));
            }
            grid.push(<div key={i}> {row} </div>);
        }
        return (
            <div>
                {<ControlBar onStop={this.handleStop} />}
                {grid}
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
