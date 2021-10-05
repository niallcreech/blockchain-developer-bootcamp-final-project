// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracks {
  mapping (uint  => Track) public tracks;
  mapping (uint  => uint[]) public trackEntries; //trackId => entryId[]
  mapping (uint  => uint) public entriesTrack; //entryId => trackId
  mapping (address  => mapping (uint => bool)) public votesByAddress; //address => (entryId => bool)
  mapping (uint  => uint) public votes; //entryId => Vote

  uint public nextTrackId;
  uint public trackCount;
  uint public nextEntryId;

  enum State {
      TrackOpen,
      TrackClosed,
      TrackBlocked
  }
  struct Track {
      uint  trackId;
      string  name;
      string  desc;
      State state;
      bool exists;
  }

  event TrackOpened(uint trackId);
  event TrackClosed(uint trackId);
  event TrackBlocked(uint trackId);
  event TrackUnblocked(uint trackId);
  event TrackCreated(uint indexed trackId, string name, string desc);
  event EntryCreated(uint indexed trackId, uint indexed entryId, string name, string desc, string location);
  event EntryVotedFor(uint indexed trackId, uint indexed entryId);

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackOpen(uint _trackId) {
		require(tracks[_trackId].state == State.TrackOpen);
    _;
  }
  
	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackClosed(uint _trackId) {
		require(tracks[_trackId].state == State.TrackClosed);
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackBlocked(uint _trackId) {
		require(tracks[_trackId].state == State.TrackBlocked);
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackUnblocked(uint _trackId) {
		require(tracks[_trackId].state != State.TrackBlocked);
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackExists(uint _trackId) {
			require(tracks[_trackId].exists == true);
	    _;
	  }

	modifier hasNotVotedForEntry(address _addr, uint _entryId){
	    require(!votesByAddress[msg.sender][_entryId]);
	    _;
	}
	/**
   * @dev XXX
   */
  constructor () {
      uint trackId = addTrack("first_track", "This is the first track");
      addEntry(trackId, "name", "description", "location");
  }

	/**
   * @dev XXX
   */
  function getTracks() public view returns ( Track[] memory) {
      Track[] memory _tracks = new Track[](trackCount);
      for (uint i=0; i<trackCount; i++) {
          _tracks[i] = tracks[i];
      }
      return _tracks;
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function getTrack(uint _trackId) public view checkTrackUnblocked(_trackId) returns (Track memory) {
      return tracks[_trackId];
  }
	
	/**
   * @dev XXX
   * @param _entryId The id of the entry
   */
  function getVotesForEntry(uint _entryId) public view checkTrackUnblocked(entriesTrack[_entryId]) returns (uint) {
      return votes[_entryId];
  }
  

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function getEntriesForTrack(uint _trackId) public view returns (uint[] memory){
      return trackEntries[_trackId];
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function openTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackClosed(_trackId) {
      tracks[_trackId].state = State.TrackOpen;
      emit TrackOpened(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	function closeTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackOpen(_trackId) {
      tracks[_trackId].state = State.TrackClosed;
      emit TrackClosed(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	function blockTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackUnblocked(_trackId) {
      tracks[_trackId].state = State.TrackBlocked;
      emit TrackBlocked(_trackId);
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function unblockTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackBlocked(_trackId) {
      tracks[_trackId].state = State.TrackClosed;
      emit TrackUnblocked(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function isTrackOpen(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.TrackOpen);
  }
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function isTrackClosed(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.TrackClosed);
  }
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function isTrackBlocked(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.TrackBlocked);
  }

	/**
   * @dev XXX
   * @param _entryId The id of the entry
   */
  function vote(uint _entryId) public checkTrackOpen(entriesTrack[_entryId]) hasNotVotedForEntry(msg.sender, _entryId){
    votesByAddress[msg.sender][_entryId] = true;
    emit EntryVotedFor(entriesTrack[_entryId], _entryId);
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function addEntry(uint _trackId, string memory _name, string memory _desc, string memory _location) public checkTrackOpen(_trackId) returns (uint) {
    uint entryId = nextEntryId;
    require(entriesTrack[entryId] == 0);
    trackEntries[_trackId].push(entryId);
    entriesTrack[entryId] = _trackId;
    nextEntryId++;
    emit EntryCreated(_trackId, entryId, _name, _desc, _location);
    return entryId;
  }

	/**
   * @dev XXX
   * @param _name XXX
   * @param _desc XXX
   */
  function addTrack(string memory _name, string memory _desc) public returns (uint) {
    uint trackId = nextTrackId;
    tracks[trackId] = Track({
      trackId: trackId,
      name: _name,
      desc: _desc,
      state: State.TrackOpen,
      exists: true
    });
    nextTrackId++;
    trackCount++;
    emit TrackCreated(trackId, _name, _desc);
    return trackId;
   }
}


