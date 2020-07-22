import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import './App.css'
const JSZip = require('jszip')
const axios = require('axios')

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
        const binaryStr = reader.result
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
      { files.files.map((file,i) => FileListItem(file, i)) }
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
  }, [files, setFiles])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const uploadFiles = () => {
    // zip files
    var zip = new JSZip()
    files.forEach(file => {
      if(file.status === 'loaded'){
        zip.file(file.file.name, file.binaryStr)
      }
    })
    var zipfile_, get_res_;
    zip.generateAsync({type:'blob'})
    .then(zipfile => {
      zipfile_ = zipfile
      // get an upload url
      return axios.get('https://picminder-api.aleonard.dev/get_upload_url/')
    })
    .then(get_res => {
      console.log(get_res)
      get_res_ = get_res
      var put_url = get_res['data']['put_url']
      // upload zip file
      return axios.put(put_url, zipfile_, {'headers': {'Content-Type':''} })
    })
    .then(put_res => {
      if(put_res['status'] === 200){
        console.log('Successfully uploaded as ' + get_res_['data']['key'])
      }else{
        console.error('Upload Error')
        console.error(put_res)
      }
    })
    .catch(err => {
      console.error(err)
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
