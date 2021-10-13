


# Functions:
- [`constructor()`](#Tracks-constructor--)
- [`getTracks()`](#Tracks-getTracks--)
- [`getTrack(uint256 _trackId)`](#Tracks-getTrack-uint256-)
- [`getEntriesForTrack(uint256 _trackId)`](#Tracks-getEntriesForTrack-uint256-)
- [`openTrack(uint256 _trackId)`](#Tracks-openTrack-uint256-)
- [`closeTrack(uint256 _trackId)`](#Tracks-closeTrack-uint256-)
- [`blockTrack(uint256 _trackId)`](#Tracks-blockTrack-uint256-)
- [`unblockTrack(uint256 _trackId)`](#Tracks-unblockTrack-uint256-)
- [`isTrackOpen(uint256 _trackId)`](#Tracks-isTrackOpen-uint256-)
- [`isTrackClosed(uint256 _trackId)`](#Tracks-isTrackClosed-uint256-)
- [`isTrackBlocked(uint256 _trackId)`](#Tracks-isTrackBlocked-uint256-)
- [`vote(uint256 _entryId)`](#Tracks-vote-uint256-)
- [`addEntry(uint256 _trackId, string _name, string _desc, string _location)`](#Tracks-addEntry-uint256-string-string-string-)
- [`addTrack(string _name, string _desc)`](#Tracks-addTrack-string-string-)
- [`disableAllTracks(bool enable)`](#Tracks-disableAllTracks-bool-)
- [`disableAllVoting(bool enable)`](#Tracks-disableAllVoting-bool-)
- [`banUser(address addr, bool banned)`](#Tracks-banUser-address-bool-)
- [`isSenderInTrackCreationCooldown()`](#Tracks-isSenderInTrackCreationCooldown--)
- [`isSenderInEntryCreationCooldown()`](#Tracks-isSenderInEntryCreationCooldown--)
- [`isSenderInVotingCooldown(uint256 trackId)`](#Tracks-isSenderInVotingCooldown-uint256-)
- [`enableCooldowns(bool enable)`](#Tracks-enableCooldowns-bool-)

# Events:
- [`TrackOpened(uint256 trackId)`](#Tracks-TrackOpened-uint256-)
- [`TrackClosed(uint256 trackId)`](#Tracks-TrackClosed-uint256-)
- [`TrackBlocked(uint256 trackId)`](#Tracks-TrackBlocked-uint256-)
- [`TrackUnblocked(uint256 trackId)`](#Tracks-TrackUnblocked-uint256-)
- [`TrackCreated(uint256 trackId, string name, string desc)`](#Tracks-TrackCreated-uint256-string-string-)
- [`EntryCreated(uint256 trackId, uint256 entryId, string name, string desc, string location)`](#Tracks-EntryCreated-uint256-uint256-string-string-string-)
- [`EntryVotedFor(uint256 trackId, uint256 entryId)`](#Tracks-EntryVotedFor-uint256-uint256-)

# Function `constructor()` {#Tracks-constructor--}
Create the new contract.
 The default is to have tracks open with cooldowns enabled.
# Function `getTracks() → struct Tracks.Track[]` {#Tracks-getTracks--}
Get all tracks

## Return Values:
- array of all tracks by object
# Function `getTrack(uint256 _trackId) → struct Tracks.Track` {#Tracks-getTrack-uint256-}
Get a specific tracks object

## Parameters:
- `_trackId`: The id of the track

## Return Values:
- the relevant Track object
# Function `getEntriesForTrack(uint256 _trackId) → uint256[]` {#Tracks-getEntriesForTrack-uint256-}
Get all the entries attached to a specific track

## Parameters:
- `_trackId`: The id of the track

## Return Values:
- all the Entry ids attached to the track
# Function `openTrack(uint256 _trackId)` {#Tracks-openTrack-uint256-}
Set a specific track to the 'Open' state.

## Parameters:
- `_trackId`: The id of the track
# Function `closeTrack(uint256 _trackId)` {#Tracks-closeTrack-uint256-}
Set a specific track to the 'Closed' state.

## Parameters:
- `_trackId`: The id of the track
# Function `blockTrack(uint256 _trackId)` {#Tracks-blockTrack-uint256-}
Set a specific track to the 'Blocked' state.

## Parameters:
- `_trackId`: The id of the track
# Function `unblockTrack(uint256 _trackId)` {#Tracks-unblockTrack-uint256-}
Unblock a specific track by settings to the 'Closed' state.

## Parameters:
- `_trackId`: The id of the track
# Function `isTrackOpen(uint256 _trackId) → bool` {#Tracks-isTrackOpen-uint256-}
Check a specific track is in the 'Open' state.

## Parameters:
- `_trackId`: The id of the track
# Function `isTrackClosed(uint256 _trackId) → bool` {#Tracks-isTrackClosed-uint256-}
Check a specific track is in the 'Open' state.

## Parameters:
- `_trackId`: The id of the track
# Function `isTrackBlocked(uint256 _trackId) → bool` {#Tracks-isTrackBlocked-uint256-}
Check a specific track is in the 'Blocked' state.

## Parameters:
- `_trackId`: The id of the track
# Function `vote(uint256 _entryId)` {#Tracks-vote-uint256-}
Vote for an entry. 
 Voting emits an event. It also sets a number of variables to follow
 users voting patterns so that multiple voting and cooldowns can be 
 monitored.

## Parameters:
- `_entryId`: The id of the entry
# Function `addEntry(uint256 _trackId, string _name, string _desc, string _location) → uint256` {#Tracks-addEntry-uint256-string-string-string-}
Add an entry to a specific track.
 The entry is attached to a track as stored data on-chain. However, the
 actual data belonging to the entry is emitted as an event.

## Parameters:
- `_trackId`: The id of the track

## Return Values:
- the id of the new entry.
# Function `addTrack(string _name, string _desc) → uint256` {#Tracks-addTrack-string-string-}
Add a track. The track is stored as data on-chain.

## Parameters:
- `_name`: the name of the track.

- `_desc`: a brief description of what the track is about.

## Return Values:
- the trackId of the new track.
# Function `disableAllTracks(bool enable)` {#Tracks-disableAllTracks-bool-}
Set all existing tracks to the 'Blocked' state.

## Parameters:
- `enable`: true to block, false to unblock.
# Function `disableAllVoting(bool enable)` {#Tracks-disableAllVoting-bool-}
Set all voting to the 'Blocked' state.

## Parameters:
- `true`: to block, false to unblock.
# Function `banUser(address addr, bool banned)` {#Tracks-banUser-address-bool-}
Ban a user from participation. 
 This function is only availble to the contract owner.

## Parameters:
- `address`: of the user to block

- `true`: to ban, false to unban.
# Function `isSenderInTrackCreationCooldown() → bool` {#Tracks-isSenderInTrackCreationCooldown--}
Check if a user is in a cooldown period for track creation.
 Cooldown allows automation blocking to balance throughput.

## Return Values:
- true if user is in cooldown, false otherwise.
# Function `isSenderInEntryCreationCooldown() → bool` {#Tracks-isSenderInEntryCreationCooldown--}
Check if a user is in a cooldown period for entry creation.
 Cooldown allows automation blocking to balance throughput.

## Return Values:
- true if user is in cooldown, false otherwise.
# Function `isSenderInVotingCooldown(uint256 trackId) → bool` {#Tracks-isSenderInVotingCooldown-uint256-}
Check if a user is in a cooldown period for voting.
 Cooldown allows automation blocking to balance throughput.

## Return Values:
- true if user is in cooldown, false otherwise.
# Function `enableCooldowns(bool enable)` {#Tracks-enableCooldowns-bool-}
Enable or disable the use of cooldowns.
 Cooldown allows automation blocking to balance throughput.

## Parameters:
- `enable`: A bool set to true to enable cooldowns, false to disable.

# Event `TrackOpened(uint256 trackId)` {#Tracks-TrackOpened-uint256-}
No description
# Event `TrackClosed(uint256 trackId)` {#Tracks-TrackClosed-uint256-}
No description
# Event `TrackBlocked(uint256 trackId)` {#Tracks-TrackBlocked-uint256-}
No description
# Event `TrackUnblocked(uint256 trackId)` {#Tracks-TrackUnblocked-uint256-}
No description
# Event `TrackCreated(uint256 trackId, string name, string desc)` {#Tracks-TrackCreated-uint256-string-string-}
No description
# Event `EntryCreated(uint256 trackId, uint256 entryId, string name, string desc, string location)` {#Tracks-EntryCreated-uint256-uint256-string-string-string-}
No description
# Event `EntryVotedFor(uint256 trackId, uint256 entryId)` {#Tracks-EntryVotedFor-uint256-uint256-}
No description

