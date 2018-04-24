import React from 'react';
import style from './index.css';

class Timeline extends React.Component {

    render() {
        const ticks = [];
        for (var i = 0; i < this.props.length; i++) {
            if (i === this.props.position)
                ticks.push(<div key={i} className="timelineTickActive" style={style}/>);
            else
                ticks.push(<div key={i} className="timelineTickInactive" style={style}/>);
        }
        return (
            <div>
                {ticks}
            </div>
        )
    }
}

export default Timeline;