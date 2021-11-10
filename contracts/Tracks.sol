// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";



/**
   * @title The Tracks contract enables the storage of collections of 
   * text information with voting enabled on each memeber of the collection
   * through emitting events.
   */
contract Tracks is Ownable, Pausable{
  mapping(address => uint) public donations;
  uint public minDonation;
  uint public maxTrackCount; // Precent out of gas looping by restricting the amount of tracks to iterate
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
  bool public trackCreationCooldownEnabled;
  bool public votingCooldownEnabled;
  bool public entryCreationCooldownEnabled;
  
  
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
      bool visible;
      bool pinned;
  }

  event TrackOpened(uint trackId);
  event TrackClosed(uint trackId);
  event TrackBlocked(uint trackId);
  event TrackUnblocked(uint trackId);
  event TrackCreated(uint indexed trackId, string name, string desc);
  event EntryCreated(uint indexed trackId, uint indexed entryId, string name, string desc, string location);
  event EntryVotedFor(uint indexed trackId, uint indexed entryId);
  event DonationToTrackOwner(uint indexed _trackId, address indexed _owner, uint _value);
  event DonationToContractOwner(address indexed _owner, uint _value);
  event CollectedDonations(address indexed _owner, uint _value);


  /**
   * @dev Check if the track is in the 'open' state.
   * @param _trackId The id of the track
   */
	modifier checkTrackOpen(uint _trackId) {
		require(tracks[_trackId].state == State.Open);
		require(allTracksState == State.Open, "All tracks have been closed by admin");
    _;
  }
  
	/**
   * @dev Check if the track is in the 'closed' state.
   * @param _trackId The id of the track
   */
	modifier checkTrackClosed(uint _trackId) {
		require(tracks[_trackId].state == State.Closed, "Track is not closed");
    _;
  }
  
  /**
   * @dev Check if the track is in the 'blocked' state.
   * @param _trackId The id of the track
   */
	modifier checkTrackBlocked(uint _trackId) {
		require(tracks[_trackId].state == State.Blocked, "Track is not blocked");
    _;
  }
  
  /**
   * @dev Check if the track has been 'blocked' by the admin.
   */
	modifier checkTracksNotBlockedByAdmin() {
		require(allTracksState != State.Blocked, "All tracks have been blocked by admin");
    _;
  }
  
  
  /**
   * @dev Check if voting has been 'blocked' by the admin.
   */
	modifier checkVotingNotBlockedByAdmin() {
		require(allVotesState != State.Blocked, "All voting has been blocked by admin");
    _;
  }
  
  
  /**
   * @dev Check if the track is not 'blocked'.
   * @param _trackId The id of the track
   */
	modifier checkTrackUnblocked(uint _trackId) {
		require(tracks[_trackId].state != State.Blocked, "Track is blocked.");
    _;
  }
  
  /**
   * @dev Check if the track exists.
   * @param _trackId The id of the track
   */
	modifier checkTrackExists(uint _trackId) {
			require(tracks[_trackId].exists == true, "Track does not exist");
	    _;
	  }

  /**
   * @dev Check if the supplied user address has been banned.
   * @param addr The address of the user to check.
   */
	modifier checkIfUserIsBanned(address addr){
			require(
			    addr != owner()
			    || bannedUsers[addr] != true,
			    "User has been banned by admin"
			);
	    _;
	}

  /**
   * @dev Check if the supplied user address has voted for the given entry.
   * @param addr The address of the user to check.
   * @param _entryId The id of the entry to check.
   */
	modifier hasNotVotedForEntry(address addr, uint _entryId){
	    require(
	        addr == owner()
	        || votesByAddress[addr][_entryId] == false,
	        "Users cannot vote for the same entry multiple times."
	    );
	    _;
	}
	
	/**
   * @dev Check if the supplied user is in the voting cooldown period for the
   *  given track.
   * @param addr The address of the user to check.
   * @param trackId The id of the track.
   */
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

  /**
   * @dev Check if the supplied user is in the track creation cooldown period.
   * @param addr The address of the user to check.
   */
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
	
	/**
   * @dev Check if the supplied user is in the entry creation cooldown period.
   * @param addr The address of the user to check.
   */
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
   * @dev Create the new contract.
   *  The default is to have tracks open with cooldowns enabled.
   */
  constructor () {
      voteCooldownPeriod = 1 minutes;
      entryEventCooldownPeriod = 1 minutes;
      trackEventCooldownPeriod = 1 minutes;
      allTracksState = State.Open;
      allVotesState = State.Open;
      enableCooldowns(true);
      createHelpTrack();
			setMaxTrackCount(1000); // Set max tracks to 1 million by default
      setMinDonation(0.00001 ether);
  }

  /**
   * @dev Create the default help documentation links.
   */
  function createHelpTrack() internal {
    uint trackId = addTrack("Help", "This is a good place to start to get help");
    addEntry(trackId, "Homepage", "Where to read more and get the code.", "https://github.com/niallcreech/blockchain-developer-bootcamp-final-project");
  	tracks[trackId].pinned = true;
  	blockTrack(trackId);
  }
	/**
   * @dev Get all tracks.
   * 	There is a hard cap on the amount of tracks that we will return
   * @return array of all tracks by object
   */
  function getTracks() public view returns ( Track[] memory) {
      uint _cappedTrackCount = (trackCount <= maxTrackCount) ? trackCount : maxTrackCount;
      uint _startIndex = (trackCount - _cappedTrackCount);
      Track[] memory _tracks = new Track[](_cappedTrackCount);
      for (uint i=_startIndex; i<_tracks.length; i++) {
          _tracks[i] = tracks[i];
      }
      return _tracks;
  }

  /**
   * @dev Get a specific tracks object
   * @param _trackId The id of the track
   * @return the relevant Track object
   */
  function getTrack(uint _trackId) public view checkTrackUnblocked(_trackId) returns (Track memory) {
      return tracks[_trackId];
  }
	

  /**
   * @dev Get all the entries attached to a specific track
   * @param _trackId The id of the track
   * @return all the Entry ids attached to the track 
   */
  function getEntriesForTrack(uint _trackId) public view returns (uint[] memory){
      return trackEntries[_trackId];
  }

	/**
   * @dev Set a specific track to the 'Open' state.
   * @param _trackId The id of the track
   */
  function openTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackClosed(_trackId) checkIfUserIsBanned(msg.sender) {
      tracks[_trackId].state = State.Open;
      tracks[_trackId].visible = true;
      emit TrackOpened(_trackId);
  }

	/**
   * @dev Set a specific track to the 'Closed' state.
   * @param _trackId The id of the track
   */
	function closeTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackOpen(_trackId) checkIfUserIsBanned(msg.sender){
      tracks[_trackId].state = State.Closed;
      tracks[_trackId].visible = false;
      emit TrackClosed(_trackId);
  }

	/**
   * @dev Set a specific track to the 'Blocked' state.
   * @param _trackId The id of the track
   */
	function blockTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackUnblocked(_trackId) checkIfUserIsBanned(msg.sender){
      tracks[_trackId].state = State.Blocked;
      emit TrackBlocked(_trackId);
  }

  /**
   * @dev Unblock a specific track by settings to the 'Closed' state.
   * @param _trackId The id of the track
   */
  function unblockTrack(uint _trackId) public checkTrackExists(_trackId) checkTrackBlocked(_trackId) checkIfUserIsBanned(msg.sender) {
      tracks[_trackId].state = State.Closed;
      emit TrackUnblocked(_trackId);
  }

	/**
   * @dev Get the state of a track as a string key.
   * @param _trackId The id of the track
   */
  function getTrackState(uint _trackId) public view returns (string memory){
      string memory status;
      if (tracks[_trackId].exists == false){
          status = "null";
      } else if (tracks[_trackId].state == State.Open){
          status = "open";
      } else if (tracks[_trackId].state == State.Closed){
          status = "closed";
      } else if (tracks[_trackId].state == State.Blocked){
          status = "blocked";
      } else {
          status = "null";
      }
      return status;
  }

	/**
   * @dev Check a specific track is in the 'Open' state.
   * @param _trackId The id of the track
   */
  function isTrackOpen(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.Open);
  }

  /**
   * @dev Check a specific track is in the 'Open' state.
   * @param _trackId The id of the track
   */
  function isTrackClosed(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.Closed);
  }
  
  /**
   * @dev Check a specific track is in the 'Blocked' state.
   * @param _trackId The id of the track
   */
  function isTrackBlocked(uint _trackId) public view checkTrackExists(_trackId) returns (bool){
      return (tracks[_trackId].state == State.Blocked);
  }

	/**
   * @dev Vote for an entry. 
   *  Voting emits an event. It also sets a number of variables to follow
   *  users voting patterns so that multiple voting and cooldowns can be 
   *  monitored.
   * @param _entryId The id of the entry
   */
  function vote(uint _entryId) public checkTrackOpen(entriesTrack[_entryId]) hasNotVotedForEntry(msg.sender, _entryId) checkVotingNotBlockedByAdmin checkIfUserIsBanned(msg.sender) isNotInVotingCooldown(msg.sender, entriesTrack[_entryId]) {
    uint _trackId = entriesTrack[_entryId];
    votesByAddress[msg.sender][_entryId] = true;
    lastVoteTime[msg.sender][_trackId] = block.timestamp;
    votesByTrack[_trackId]++;
    emit EntryVotedFor(_trackId, _entryId);
  }

  /**
   * @dev Add an entry to a specific track.
   *  The entry is attached to a track as stored data on-chain. However, the
   *  actual data belonging to the entry is emitted as an event.
   * @param _trackId The id of the track
   * @return the id of the new entry.
   */
  function addEntry(uint _trackId, string memory _name, string memory _desc, string memory _location) public checkTracksNotBlockedByAdmin checkIfUserIsBanned(msg.sender) isNotInEntryCreationCooldown(msg.sender)  checkTrackOpen(_trackId) returns (uint) {
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
   * @dev Add a track. The track is stored as data on-chain.
   * @param _name the name of the track.
   * @param _desc a brief description of what the track is about.
   * @return the trackId of the new track.
   */
  function addTrack(string memory _name, string memory _desc)
    public
      checkTracksNotBlockedByAdmin
      isNotInTrackCreationCooldown(msg.sender)
      checkIfUserIsBanned(msg.sender)
    returns (uint) {
    uint trackId = nextTrackId;
    tracks[trackId] = Track({
      trackId: trackId,
      name: _name,
      desc: _desc,
      state: State.Open,
      exists: true,
      visible: true,
      pinned: false
    });
    trackEventsByUser[msg.sender] = TrackEvent(block.timestamp, trackId);
    trackOwners[trackId] = msg.sender;
    nextTrackId++;
    trackCount++;
    emit TrackCreated(trackId, _name, _desc);
    return trackId;
  }
   
  /**
  * @dev Set all existing tracks to the 'Blocked' state.
  * @param enable true to block, false to unblock.
  */
  function disableAllTracks(bool enable) public onlyOwner {
    if (enable) {
      allTracksState = State.Blocked;   
    } else {
      allTracksState = State.Open;   
    }
  }
  
  /**
   * @dev Set all voting to the 'Blocked' state.
   * @param enable, true to block, false to unblock.
   */ 
  function disableAllVoting(bool enable) public onlyOwner {
       if (enable) {
           allVotesState = State.Blocked;   
       } else {
           allVotesState = State.Open;   
       }
	}

  /**
   * @dev Ban a user from participation. 
   *  This function is only availble to the contract owner.
   * @param addr, address of the user to block
   * @param banned, true to ban, false to unban.
   */ 
  function banUser(address addr, bool banned) public onlyOwner {
 		bannedUsers[addr] = banned;   
	}
	
	/**
   * @dev CHeck if a user is bannedfrom participation. 
   * @param addr, address of the user to block
   * @return true if banned, false otherwise.
   */ 
  function isUserBanned(address addr) public view returns (bool) {
 		return bannedUsers[addr];   
	}

  /**
   * @dev Check if a user is in a cooldown period for track creation.
   *  Cooldown allows automation blocking to balance throughput.
   * @return true if user is in cooldown, false otherwise.
   */ 
  function isSenderInTrackCreationCooldown() public view returns (bool) {
      if (trackCreationCooldownEnabled
          	&& trackEventsByUser[msg.sender].time > 0
	        	&& (trackEventsByUser[msg.sender].time + trackEventCooldownPeriod) > block.timestamp
	      	){
	            return true;
	   	}
	   	return false;
	}
	
	/**
   * @dev Check if a user is in a cooldown period for entry creation.
   *  Cooldown allows automation blocking to balance throughput.
   * @return true if user is in cooldown, false otherwise.
   */ 
	function isSenderInEntryCreationCooldown() public view returns (bool) {
	   	if (entryCreationCooldownEnabled
          	&& entryEventsByUser[msg.sender].time > 0
	        	&& (entryEventsByUser[msg.sender].time + entryEventCooldownPeriod) > block.timestamp
	      	){
	            return true;
	   	}
	   	return false;
	}
	
	/**
   * @dev Check if a user is in a cooldown period for voting.
   *  Cooldown allows automation blocking to balance throughput.
   * @return true if user is in cooldown, false otherwise.
   */ 
	function isSenderInVotingCooldown(uint trackId) public view returns (bool) {
	   	if (votingCooldownEnabled
          	&& lastVoteTime[msg.sender][trackId] > 0
	        	&& (lastVoteTime[msg.sender][trackId] + voteCooldownPeriod) > block.timestamp
	      	){
	            return true;
	   	}
	   	return false;
	}
	
	/**
   * @dev Enable or disable the use of cooldowns.
   *  Cooldown allows automation blocking to balance throughput.
   * @param enable A bool set to true to enable cooldowns, false to disable.
   */ 
  function enableCooldowns(bool enable) public onlyOwner {
    trackCreationCooldownEnabled = enable;
    votingCooldownEnabled = enable;
    entryCreationCooldownEnabled = enable;
  }
  
  /**
   * @dev set the maximum amount of tracks to iterate through
   * @param _maxCount the maximum length of tracks
   */
   function setMaxTrackCount(uint _maxCount) public onlyOwner{
       maxTrackCount = _maxCount;
   }
  /**
   * @dev Set the minimum donation price.
   * @param _minDonation min donation
   */ 
  function setMinDonation(uint _minDonation) public onlyOwner {
    require(_minDonation > 0 && _minDonation < 0.001 ether); // Force min donation to not be excessive as a sanity check
    minDonation = _minDonation;
  }
  
  /**
   * @dev Set the percentage of transaction fees to add to donations.
   * 	Donations are restricted to (0, 1] ether.
   */ 
  function donateToContractOwner() public payable whenNotPaused {
    require(msg.value > minDonation && msg.value < 1 ether);
    donations[owner()] += msg.value;
    emit DonationToContractOwner(owner(), msg.value);
  }
  
  /**
   * @dev Set the percentage of transaction fees to add to donations.
   * 	Donations are restricted to (0, 1] ether.
   * @param _trackId id of the track to donate to
   */ 
  function donateToTrackOwner(uint _trackId) external  payable whenNotPaused {
    require(msg.value > (2 * minDonation), "the value of the donation is too small");
    require(msg.value < 1 ether, "the value of the donation is too large, maximum is 1 Ether");
    require(trackOwners[_trackId] != address(0), "the specified track owner doesnt exist");
    address _trackOwner = trackOwners[_trackId];
    uint _trackOwnerDonation = (msg.value - minDonation);
    uint _contractOwnerDonation = minDonation;
    donations[_trackOwner] += _trackOwnerDonation;
    donations[owner()] += _contractOwnerDonation;
    emit DonationToTrackOwner(_trackId, _trackOwner, _trackOwnerDonation);
		emit DonationToContractOwner(owner(), msg.value);
  }

  /**
   * @dev Withdraw the donations to the senders address (if allowed)
   * 	Donations are restricted to (0, 1] ether.
   */ 
  function collectDonations() public whenNotPaused returns (uint){
    require(msg.sender > address(0)
        && donations[msg.sender] > 0,
        "the track author has no donations."
    );
    address payable _author = payable(msg.sender);
    uint _val = donations[_author];
  	donations[_author] = 0;
    (bool _success, ) = _author.call{value: _val}(""); //bytes memory _data
  	require(_success, "failed to transfer donations to author");
    emit CollectedDonations(_author, _val);
   	return _val;
  }
}


	