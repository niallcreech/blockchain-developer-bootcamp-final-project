// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracks {
  mapping (uint  => Track) public tracks;
  mapping (uint  => uint[]) public trackEntries; //trackId => entryId[]
  mapping (uint  => uint) public entriesTrack; //entryId => trackId
  mapping (address  => mapping (uint => bool)) public votesByAddress; //address => (trackId => bool)
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
	modifier isTrackOpen(uint _trackId) {
		require(tracks[_trackId].state == State.TrackOpen);
    _;
  }
  
	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier isTrackClosed(uint _trackId) {
		require(tracks[_trackId].state == State.TrackClosed);
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier isTrackBlocked(uint _trackId) {
		require(tracks[_trackId].state == State.TrackBlocked);
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier isTrackUnblocked(uint _trackId) {
		require(tracks[_trackId].state != State.TrackBlocked);
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier trackExists(uint _trackId) {
			require(tracks[_trackId].exists == true);
	    _;
	  }

	modifier hasNotVotedForTrack(address _addr, uint _entryId){
	    require(!votesByAddress[msg.sender][entriesTrack[_entryId]]);
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
  function getTrack(uint _trackId) public view isTrackUnblocked(_trackId) returns (Track memory) {
      return tracks[_trackId];
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
  function open(uint _trackId) public trackExists(_trackId) isTrackClosed(_trackId) {
      tracks[_trackId].state = State.TrackOpen;
      emit TrackOpened(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	function close(uint _trackId) public trackExists(_trackId) isTrackOpen(_trackId) {
      tracks[_trackId].state = State.TrackClosed;
      emit TrackClosed(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	function block(uint _trackId) public trackExists(_trackId) isTrackUnblocked(_trackId) {
      tracks[_trackId].state = State.TrackBlocked;
      emit TrackBlocked(_trackId);
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function unblock(uint _trackId) public trackExists(_trackId) isTrackBlocked(_trackId) {
      tracks[_trackId].state = State.TrackClosed;
      emit TrackUnblocked(_trackId);
  }

	/**
   * @dev XXX
   * @param _entryId The id of the entry
   */
  function vote(uint _entryId) public isTrackOpen(entriesTrack[_entryId]) hasNotVotedForTrack(msg.sender,entriesTrack[_entryId]){
    votesByAddress[msg.sender][entriesTrack[_entryId]] = true;
    votes[_entryId]++;
 		emit EntryVotedFor(entriesTrack[_entryId], _entryId);
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function addEntry(uint _trackId, string memory _name, string memory _desc, string memory _location) public isTrackOpen(_trackId) returns (uint) {
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


