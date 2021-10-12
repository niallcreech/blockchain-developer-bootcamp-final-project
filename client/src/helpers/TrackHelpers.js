import React from "react";
import Web3 from "web3";
import Track from "../components/Track";

export function getTrack(trackId){
	return null;
}

export function getAllTracks(){
	const tracks = [
		{"id": "first_track", "desc": "This is the first track", "votes": 100},
		{"id": "second_track", "desc": "This is the second track", "votes": 321},
	]
	return tracks;
}

export function getAllSealedTracks(){
	return null;
}

export function getNominatedTracks(trackId){
	return null;
}

export function getAllNominatedTracks(){
	return null;
}

export function getEntryForTrack(trackId){
	return null;
}

export function getAllEntriesForTrack(){
	return null;
}
