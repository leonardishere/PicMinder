import React, {useCallback, useState} from 'react'
import Dropzone from 'react-dropzone'
const JSZip = require('jszip')
const axios = require('axios')

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png']

class MyFile {
  constructor(file, onload) {
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
        console.log('file loaded')
        const binaryStr = reader.result
        this.binaryStr = binaryStr
        this.status = 'loaded'
        onload()
      }
      reader.readAsArrayBuffer(file)
    }else{
      this.status = 'invalid'
    }
  }
}

function FileList(props) {
  return (
    <div className="filelist">
      { props.files.map((file,i) => FileListItem(file, i)) }
    </div>
  )
}

function FileListItem(file, i) {
  var s = file.file.name + ': ' + file.status
  return <p key={i}>{s}</p>
}

class UploadApp extends React.Component {
  constructor() {
    super()
    this.state = {
      files: [],
      jobid: null,
      uploadProcess: 'waiting'
    }
    this.uploadFiles = this.uploadFiles.bind(this)
    this.addFiles = this.addFiles.bind(this)
    this.onload = this.onload.bind(this)
  }

  uploadFiles() {
    this.setState({uploadProcess: 'processing'})
    // zip files
    var zip = new JSZip()
    console.log('files:')
    this.state.files.forEach(file => {
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
        this.setState({jobid: get_res_['data']['key']})
      }else{
        console.error('Upload Error')
        console.error(put_res)
      }
    })
    .catch(err => {
      console.error(err)
    })
  }

  addFiles(files) {
    files = files.map(file => new MyFile(file, this.onload))
    files = this.state.files.concat(files)
    this.setState({files: files})
  }

  onload() {
    this.setState({files: this.state.files}) // just reloads state
  }

  render() {
    var url = "https://picminder.aleonard.dev/?jobid="+this.state.jobid

    return (
      <div className="App">
        <div className="button_bar">
          <button>
            <Dropzone onDrop={this.addFiles}>
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  Select Files
                </div>
              )}
            </Dropzone>
          </button>
          <button onClick={this.uploadFiles}>Upload Files</button>
        </div>
        <div className="status">
          {
            this.state.uploadProcess === 'waiting' || this.state.uploadProcess === 'uploaded' ? null :
            <div>
              <p>{this.state.uploadProcess}</p>
              <hr/>
            </div>
          }
          {
            this.state.jobid
            ? <div>
                <p>Go here on your computer to retreive your processed files</p>
                <a href={url}>{url}</a>
                <hr/>
              </div>
            : null
          }
          <FileList files={this.state.files} />
        </div>
      </div>
    )
  }
}

export default UploadApp;
