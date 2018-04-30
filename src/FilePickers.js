import React from 'react';
import { FilePicker } from 'react-file-picker';
import _ from "lodash";

class FilePickers extends React.Component {
    render() {
        var pickers = [];
        for(let i = 0; i < this.props.length; i++) {
            pickers.push(
            <FilePicker
                onChange={FileObject => (this.props.setFile(FileObject, i))}
                onError={errMsg => (console.log("[", i, "]", "error getting file: ", errMsg))}
            >
                <button>
                    Choose File...
                </button>
            </FilePicker >
            );
        }

        console.log("pickers: ", pickers);
        return (
            <div className="file-pickers" >{pickers}</div>
        );
    }
}

export default FilePickers;