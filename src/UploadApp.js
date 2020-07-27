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
  console.log(file, i)
  var s = file.file.name + ': ' + file.status
  return <p key={i}>{s}</p>
}

/*
function App() {
  console.log(this)
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
*/

class UploadApp extends React.Component {
  constructor() {
    super()
    this.state = {files: [], jobid: null}
    this.uploadFiles = this.uploadFiles.bind(this)
    this.addFiles = this.addFiles.bind(this)
    this.onload = this.onload.bind(this)
  }

  uploadFiles() {
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
    return (
      <div className="App">
        <button onClick={this.uploadFiles}>Upload files</button>
        <div className="dropzone">
          <Dropzone onDrop={this.addFiles}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        <FileList files={this.state.files} />
        {
          this.state.jobid
          ? <div>
              <p>Go here on your computer to retreive your processed files</p>
              <a href={"https://picminder.aleonard.dev/?jobid="+this.state.jobid}>{"https://picminder.aleonard.dev/?jobid="+this.state.jobid}</a>
            </div>
          : null
        }
      </div>
    )
  }
}

export default UploadApp;
