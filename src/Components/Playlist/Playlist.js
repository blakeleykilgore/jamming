import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends React.Component {

  constructor(props) {
      super(props);
      this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
      this.props.onNameChange(event.target.value);
    }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={this.props.name}  onChange={this.handleNameChange} />
        <TrackList tracks={this.props.playlistTrack} onRemove={this.removeTrack} isRemoval={true} />
        <a className="Playlist-save">SAVE TO SPOTIFY onClick={this.props.onSave}></a>
      </div>
    )
  }
}

export default Playlist;
