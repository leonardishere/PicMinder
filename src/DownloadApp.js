import React from 'react'
const axios = require('axios')

class DownloadApp extends React.Component {
  constructor(props) {
    super()
    this.state = {jobid: props.jobid}
  }

  componentDidMount() {
    axios.get('https://picminder-api.aleonard.dev/get_download_url/', {params:{jobid:this.state.jobid}})
    .then(get_res => {
      this.setState({'get_url': get_res['data']})
    })
  }

  render() {
    return (
      <div className="App">
        <p>Downloading jobid={this.state.jobid}</p>
        {
          this.state.get_url
          ? <a href={this.state.get_url}>Click me to download your pictures</a>
          : null
        }
      </div>
    )
  }
}

export default DownloadApp;
