// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracks {
    mapping (uint  => Track) public tracks;
    mapping (uint  => uint) public votes;
    uint public trackCount;

    enum State {
        TrackNominating,
        TrackSealed
    }

    struct Track {
        string  name;
        string  desc;
        State state;
    }

    struct Entry {
        string  location;
        string  id;
        string  track_id;
        string  previous_id;
        address owner;
        uint votes;
    }

    event EntryNominated(string trackid, string entryid, string location);
    event EntryLeader(string trackid, string entryid, string location);
    event TrackSealed();
    event TrackClosed();
    event TrackOpened(string trackId, string trackDesc);
    event TrackListed();
    event TrackCreated(uint indexed trackId);

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
        addTrack("first_track", "This is the first track");
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

    function getEntryVotes(uint  _id) public view returns (uint){
        return votes[_id];
    }

    function close() public {
    }

    function vote() public {
    }
    
    function addTrack(string memory _name, string memory _desc) public {
	    tracks[trackCount] = Track({
	        		name: _name,
	            desc: _desc,
	            state: State.TrackNominating
	       });
	    trackCount++;
     	emit TrackCreated(trackCount-1);

   }
}


