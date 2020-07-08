import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './App.css'
var JSZip = require("jszip");

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png']

class MyFile {
  constructor(file) {
    this.file = file
    if(ACCEPTED_FILE_TYPES.includes(this.file.type)){
      this.status = 'loading'
      const reader = new FileReader()
      reader.onabort = () => {
        console.log('file reading was aborted')
        this.status = 'failed'
      }
      reader.onerror = () => {
        console.log('file reading has failed')
        this.status = 'failed'
      }
      reader.onload = () => {
        console.log('received buffer')
        const binaryStr = reader.result
        console.log(binaryStr)
        this.binaryStr = binaryStr
        this.status = 'loaded'
      }
      reader.readAsArrayBuffer(file)
    }else{
      this.status = 'invalid'
    }
  }
}

function FileList(files) {
  return (
    <div className="filelist">
      {
        files.files.map((file,i) => FileListItem(file, i))
      }
    </div>
  )
}

function FileListItem(file, i) {
  var s = file.file.name + ': ' + file.status
  return <p key={i}>{s}</p>
}

function App() {
  const [files, setFiles] = useState([])
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles = acceptedFiles.map(file => new MyFile(file))
    setFiles(files.concat(acceptedFiles))
    acceptedFiles.forEach((file) => {
      console.log(file)
    })
  }, [files, setFiles])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const uploadFiles = () => {
    console.log(files)
    var zip = new JSZip()
    files.forEach(file => {
      if(file.status === 'loaded'){
        zip.file(file.file.name, file.binaryStr)
      }
    })
    zip.generateAsync({type:'blob'})
    .then(content => {
      console.log(content)
    })
  }

  return (
    <div className="App">
      <button onClick={uploadFiles}>Upload files</button>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <FileList files={files} />
    </div>
  )
}

export default App;
