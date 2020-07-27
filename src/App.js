import React from 'react'
import UploadApp from './UploadApp';
import DownloadApp from './DownloadApp';
import './App.css'


class App extends React.Component {
  constructor() {
    super()
    var jobid = new URLSearchParams(window.location.search).get('jobid')
    this.state = {jobid: jobid}
  }

  render() {
    if(this.state.jobid){
      return <DownloadApp jobid={this.state.jobid}/>
    }else{
      return <UploadApp/>
    }
  }
}

export default App;
