import React from 'react';
import { FilePicker } from 'react-file-picker';

class FilePickers extends React.Component {
    render() {
        return (
        <div>
            <FilePicker
                onChange={FileObject => (this.setFile(FileObject))}
                onError={errMsg => (console.log("error getting file: ", errMsg))}
                >
                    <button>
                        Choose File...
                    </button>
            </FilePicker >
        </div>
        );
    }
}

export default FilePickers;