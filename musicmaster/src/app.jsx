import React, { Component } from 'react';
import './app.css'
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap'
import Gallery from './gallery'
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: "", // my query
      artist: null,  // my response.
      tracks: []
    }
  }

  search() {
    console.log('this.state', this.state);
    const BASE_URL = 'https://api.spotify.com/v1/search?';
    let FETCH_URL = BASE_URL + 'q=' + this.state.query + '&type=artist&limit=1';
    const ALBUM_URL = 'https://api.spotify.com/v1/artists/'
    // {id}/top-tracks'
    var accessToken = 'BQCJaAuqlGwFfOIreyYZR06-YnZ6mgspjsb62gGjh7Bt8cuAvr7piHYZUTsx0em-eC67-Cmx7FWuxYY_8ih-kMysfRxaJQm6HhhtIFXvQn9epf44YjzsG25oqO0KnN2Dfp2_0maqBsDtoxAIjFoHYzu5nKPofpVDVe02rwodtKtp_cz1jPk&refresh_token=AQDcI6Zk_VML7ouTm_6wJfEivAGz-AgbeMJIvr2n5o6mrNTfdxgx4Q_Sk8sU2KoqG8fIjjy6E8Pbx12bIrvwPwkuige103L98vR_rHV438B-eVfmK4fx3fV8ggu2H-ha7CI'

    var myOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      // mode: 'cors',
      // cache: 'default'
    };
console.log('fetchurl', FETCH_URL, myOptions)
    fetch(FETCH_URL, myOptions)
      .then(response => response.json())
      .then(json => {
        console.log(json.artists.items[0])
        const artist = json.artists.items[0];
        this.setState({ artist });
        FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`
        console.log(FETCH_URL, myOptions)
        fetch(FETCH_URL, myOptions)
        .then(response => response.json())
        .then(json => {
          console.log('artist top tracks', json);
          const {tracks} = json;
          this.setState({tracks});
        })
      })

  }

  render() {

    let artist = {
      name: '',
      followers: {
        total: ''
      },
      images:[{
        url:''
      }],
      genres:[]
    };
    if (this.state.artist !== null) {
      artist = this.state.artist;
    }

    return (
      // return JSX
      <div className="App">
        <div className="App-title">Music Master</div>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                onChange={event => { this.setState({ query: event.target.value }) }}
                onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search()
                }
              }}
            />
              <InputGroup.Addon
              onClick={()=> this.search()} >
              <Glyphicon glyph='search'></Glyphicon>
            </InputGroup.Addon>
             </InputGroup>
          </FormGroup>{
            this.state.artist !== null ?
            <div>
        <div className="profile">
          <img
            alt='Profile'
            className='profile-img'
            src={artist.images[0].url}
          />
          <div className="profile-info">

              <div className="profile-name"> {artist.name}   </div>
              <div className='profile-followers'> {artist.followers.total} followers </div>
              <div className="profile-genres">
                {
                  artist.genres.map((genre, k) =>{
                    genre = genre !== artist.genres[artist.genres.length-1] ? ` ${genre},` : `& ${genre}`
                    return(
                      <span key={k}>{genre}</span>
                    )
                  })

                }
              </div>

            </div>

          </div>
          <Gallery
            tracks={this.state.tracks}
          />
        </div>
          : <div></div>
        }
        </div>
    )
  }
}
export default App;
