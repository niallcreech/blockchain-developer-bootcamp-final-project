// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";


contract Tracks is Ownable {
  mapping (uint => Track) public tracks;
  mapping (uint => uint[]) public trackEntries; //trackId => entryId[]
  mapping (uint => uint) public entriesTrack; //entryId => trackId
  mapping (uint => address) public trackOwners; //trackId => address
  mapping (address => mapping (uint => bool)) public votesByAddress; //address => (entryId => bool)
  mapping (address => TrackEvent) public trackEventsByUser; //address => TrackEvent
  mapping (address => EntryEvent) public entryEventsByUser; //address => EntryEvent
  mapping (uint => uint) public votesByTrack; //trackId => vote count
  mapping (address => mapping(uint => uint)) public lastVoteTime; //address => trackId => time(s)
  mapping(address => bool) public bannedUsers;

  uint public nextTrackId;
  uint public trackCount;
  uint public nextEntryId;
  uint public voteCooldownPeriod;
  uint public entryEventCooldownPeriod;
  uint public trackEventCooldownPeriod;
  State public allTracksState;
  State public allVotesState;
  bool trackCreationCooldownEnabled;
  bool votingCooldownEnabled;
  bool entryCreationCooldownEnabled;
  
  
	struct EntryEvent {
	    uint time;
	    uint eventId;
	}
	
	struct TrackEvent {
	    uint time;
	    uint trackId;
	}
	
  enum State {
      Open,
      Closed,
      Blocked
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
		require(tracks[_trackId].state == State.Open);
		require(allTracksState == State.Open, "All tracks have been closed by admin");
    _;
  }
  
	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackClosed(uint _trackId) {
		require(tracks[_trackId].state == State.Closed, "Track is not closed");
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackBlocked(uint _trackId) {
		require(tracks[_trackId].state == State.Blocked, "Track is not blocked");
    _;
  }
  
  /**
   * @dev XXX
   */
	modifier checkTracksNotBlockedByAdmin() {
		require(allTracksState != State.Blocked, "All tracks have been blocked by admin");
    _;
  }
  
  
  /**
   * @dev XXX
   */
	modifier checkVotingNotBlockedByAdmin() {
		require(allVotesState != State.Blocked, "All voting has been blocked by admin");
    _;
  }
  
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackUnblocked(uint _trackId) {
		require(tracks[_trackId].state != State.Blocked, "Track is blocked.");
    _;
  }
  
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
	modifier checkTrackExists(uint _trackId) {
			require(tracks[_trackId].exists == true, "Track does not exist");
	    _;
	  }

	modifier isUserBanned(address addr){
			require(
			    addr != owner()
			    || bannedUsers[addr] != true,
			    "User has been banned by admin"
			);
	    _;
	}

	modifier hasNotVotedForEntry(address addr, uint _entryId){
	    require(
	        addr == owner()
	        || votesByAddress[addr][_entryId] == false,
	        "Users cannot vote for the same entry multiple times."
	    );
	    _;
	}
	
	modifier isNotInVotingCooldown(address addr, uint trackId){
	    require(
	        !votingCooldownEnabled
          || addr == owner()
	        || lastVoteTime[addr][trackId] == 0 
	        || lastVoteTime[addr][trackId] + voteCooldownPeriod > block.timestamp,
	        "User is currently in voting cooldown period for track."
	    );
	    _;
	}

	modifier isNotInTrackCreationCooldown(address addr){
	    require(
	        !trackCreationCooldownEnabled
          || addr == owner()
	        || trackEventsByUser[addr].time == 0
          || (trackEventsByUser[addr].time + trackEventCooldownPeriod) > block.timestamp,
	       "User is currently in track cooldown."
	     );
	    _;
	}
	
	modifier isNotInEntryCreationCooldown(address addr){
	    require(
	        !entryCreationCooldownEnabled
	        || addr == owner()
	        || entryEventsByUser[addr].time == 0
	        || (entryEventsByUser[addr].time + entryEventCooldownPeriod) > block.timestamp,
	        "User is currently in entry cooldown."
	    );
	    _;
	}
	
	/**
   * @dev XXX
   */
  constructor () {
      voteCooldownPeriod = 1 minutes;
      entryEventCooldownPeriod = 1 minutes;
      trackEventCooldownPeriod = 1 minutes;
      allTracksState = State.Open;
      allVotesState = State.Open;
      uint trackId = addTrack("first_track", "This is the first track");
      addEntry(trackId, "name", "description", "location");
      enableCooldowns(true);
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
   * @param _trackId The id of the track
   */
  function getEntriesForTrack(uint _trackId) public view returns (uint[] memory){
      return trackEntries[_trackId];
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function openTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackClosed(_trackId) isUserBanned(msg.sender){
      tracks[_trackId].state = State.Open;
      emit TrackOpened(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	function closeTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackOpen(_trackId) isUserBanned(msg.sender){
      tracks[_trackId].state = State.Closed;
      emit TrackClosed(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
	function blockTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackUnblocked(_trackId) isUserBanned(msg.sender){
      tracks[_trackId].state = State.Blocked;
      emit TrackBlocked(_trackId);
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function unblockTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackBlocked(_trackId) isUserBanned(msg.sender) {
      tracks[_trackId].state = State.Closed;
      emit TrackUnblocked(_trackId);
  }

	/**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function isTrackOpen(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.Open);
  }
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function isTrackClosed(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.Closed);
  }
  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function isTrackBlocked(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.Blocked);
  }

	/**
   * @dev XXX
   * @param _entryId The id of the entry
   */
  function vote(uint _entryId) public checkTrackOpen(entriesTrack[_entryId]) hasNotVotedForEntry(msg.sender, _entryId) checkVotingNotBlockedByAdmin isUserBanned(msg.sender) isNotInVotingCooldown(msg.sender, entriesTrack[_entryId]) {
    uint _trackId = entriesTrack[_entryId];
    votesByAddress[msg.sender][_entryId] = true;
    lastVoteTime[msg.sender][_trackId] = block.timestamp;
    votesByTrack[_trackId]++;
    emit EntryVotedFor(_trackId, _entryId);
  }

  /**
   * @dev XXX
   * @param _trackId The id of the track
   */
  function addEntry(uint _trackId, string memory _name, string memory _desc, string memory _location) public checkTracksNotBlockedByAdmin isUserBanned(msg.sender) isNotInEntryCreationCooldown(msg.sender)  checkTrackOpen(_trackId) returns (uint) {
    uint entryId = nextEntryId;
    require(entriesTrack[entryId] == 0);
    trackEntries[_trackId].push(entryId);
    entriesTrack[entryId] = _trackId;
    entryEventsByUser[msg.sender] = EntryEvent(block.timestamp, entryId);
    nextEntryId++;
    emit EntryCreated(_trackId, entryId, _name, _desc, _location);
    return entryId;
  }

	/**
   * @dev XXX
   * @param _name XXX
   * @param _desc XXX
   */
  function addTrack(string memory _name, string memory _desc) public checkTracksNotBlockedByAdmin isNotInTrackCreationCooldown(msg.sender) isUserBanned(msg.sender) returns (uint) {
    uint trackId = nextTrackId;
    tracks[trackId] = Track({
      trackId: trackId,
      name: _name,
      desc: _desc,
      state: State.Open,
      exists: true
    });
    trackEventsByUser[msg.sender] = TrackEvent(block.timestamp, trackId);
    trackOwners[trackId] = msg.sender;
    nextTrackId++;
    trackCount++;
    emit TrackCreated(trackId, _name, _desc);
    return trackId;
   }
   
   function disableAllTracks(bool enable) public onlyOwner {
       if (enable) {
           allTracksState = State.Blocked;   
       } else {
           allTracksState = State.Open;   
       }
	}
   
   function disableAllVoting(bool enable) public onlyOwner {
       if (enable) {
           allVotesState = State.Blocked;   
       } else {
           allVotesState = State.Open;   
       }
	}
   
   function banUser(address addr, bool banned) public onlyOwner {
	 		bannedUsers[addr] = banned;   
		}
   
   function enableCooldowns(bool enable) public onlyOwner {
    trackCreationCooldownEnabled = enable;
    votingCooldownEnabled = enable;
    entryCreationCooldownEnabled = enable;
  }
}


	