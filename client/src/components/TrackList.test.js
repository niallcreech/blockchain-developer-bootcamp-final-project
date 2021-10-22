// Track.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import TrackList from "./TrackList";

let container = null;
let tracks = null;
let trackVotes = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  tracks = [
    {trackId: 1, name: "First track", desc: "This is the first track"},
    {trackId: 2, name: "Second track", desc: "This is the second track"},
    {trackId: 3, name: "Third track", desc: "This is the third track"},
  ];
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with a name and description", () => {
  act(() => {
    render(
      <Router>
        <Switch>
        <Route exact path="/">
          <TrackList tracks={tracks} trackVotes={trackVotes}/>
        </Route>
       </Switch>
       </Router>
     , container);
  });
  const _component = container.querySelector('.TrackListTable');
  // TrackList is the amount of tracks plus the default help track
  expect(_component.children.length === tracks.length+1);
});