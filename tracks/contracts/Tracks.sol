// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracks {
    mapping (string  => Track) public tracks;
    mapping (string  => uint) public votes;

    enum State {
        TrackNominating,
        TrackSealed
    }

    struct Track {
        string  name;
        string  description;
        string  id;
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
    }

    function getEntryVotes(string memory  _id) public view returns (uint){
        return votes[_id];
    }

    function close() public {
    }

    function vote() public {
    }
}


