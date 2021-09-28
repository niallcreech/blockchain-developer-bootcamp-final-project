// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracks {
    mapping (uint  => Track) public tracks;
    mapping (uint  => uint[]) public trackEntries;
    mapping (uint  => uint) public entriesTrack;

    uint public nextTrackId;
    uint public trackCount;
    uint public nextEntryId;

    enum State {
        TrackNominating,
        TrackSealed
    }
		struct Entry {
        uint entryId;
        bool exists;
    }
    struct Track {
        uint  trackId;
        string  name;
        string  desc;
        State state;
    }

    event EntryNominated(string trackid, string entryid, string location);
    event EntryLeader(string trackid, string entryid, string location);
    event TrackSealed();
    event TrackClosed();
    event TrackOpened(string trackId, string trackDesc);
    event TrackListed();
    event TrackCreated(uint indexed trackId, string name, string desc);
    event EntryCreated(uint indexed trackId, uint indexed entryId, string name, string desc, string location);

    /**
     * @dev Check if the address is the owner of the entry
     * @param _entryid The id of the entry to check
     * @param _addr The address to check against the owner
     */
    modifier isEntryOwner(string  memory _entryid, address _addr) {
        _;
    }

    modifier isEntryVoter(string  memory _entryid, address _addr) {
        _;
    }

    modifier isTrackOwner(string  memory _trackid, address _addr) {
        _;
    }

		constructor () {
        uint trackId = addTrack("first_track", "This is the first track");
        addEntry(trackId, "name", "description", "location");
    }

		function getTracks() public view returns ( Track[] memory) {
		    Track[] memory _tracks = new Track[](trackCount);
		    for (uint i=0; i<trackCount; i++) {
		        _tracks[i] = tracks[i];
		    }
		    return _tracks;
		}
		
		function getTrack(uint _id) public view returns (Track memory) {
		    return tracks[_id];
		}

		function getEntriesForTrack(uint trackId) public view returns (uint[] memory){
        return trackEntries[trackId];
    }

    function close() public {
    }

    function vote() public {
    }
    
    function addEntry(uint trackId, string memory _name, string memory _desc, string memory _location) public returns (uint) {
      uint entryId = nextEntryId;
      require(entriesTrack[entryId] == 0);
	    trackEntries[trackId].push(entryId);
	    entriesTrack[entryId] = trackId;
	    nextEntryId++;
     	emit EntryCreated(trackId, entryId, _name, _desc, _location);
     	return entryId;
   }

    function addTrack(string memory _name, string memory _desc) public returns (uint) {
      uint trackId = nextTrackId;
	    tracks[trackId] = Track({
	        		trackId: trackId,
	        		name: _name,
	            desc: _desc,
	            state: State.TrackNominating
	       });
	    nextTrackId++;
	    trackCount++;
     	emit TrackCreated(trackId, _name, _desc);
     	return trackId;

   }
}


