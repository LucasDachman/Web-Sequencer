import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _ from "lodash";
import Tone from "tone"
import styles from './index.css';

class Sequencer extends React.Component {

    constructor(props) {
        super(props);
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
        Tone.Transport.start();
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

    renderSquare(i) { var content;
        if (i === this.state.position) {
            content = <button style={{border: "#000"}} onClick={() => this.handleClick()} />    
        }
        else {
            content = <button onClick={() => this.handleClick()} />    
        }
        return content;
    }

    render() {
        var squareComps = [];
        console.log("squares: ", this.state.squares);
        var that = this;
        _.forEach(this.state.squares, function(element, elementi) {
            squareComps.push(
            <div className="row" key={elementi}>
                {_.map(element, function(sq, sqi) {
                    return (<div className="col-sm-2" key={elementi + "," +sqi}>
                                {that.renderSquare(sqi)}
                            </div>)
                })}
            </div>)
        });
        return (
           <div>{squareComps}</div>
        );
    }
}
/* =================== */
ReactDOM.render(
    <div style={{width: 800, height: 800}} className="container">
        <Sequencer className={styles} rows={3} cols={4}/>
    </div>,
    document.getElementById('root')
  );