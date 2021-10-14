// Track.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import EntriesList from "./EntriesList";

let container = null;
let items = null;
let itemVotes = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  items = [
    {entryId: 1, name: "First entry", desc: "This is the first entry", location: "https:/example.com"},
    {entryId: 2, name: "Second entry", desc: "This is the second entry", location: "https:/example.com"},
    {entryId: 3, name: "Third entry", desc: "This is the third entry", location: "https:/example.com"},
  ];
  itemVotes = {
    1: 3,
    2: 2,
    3: 1,
  };
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with a name and description", () => {
  act(() => {
    render(<EntriesList entries={items} votes={itemVotes}/>, container);
  });
  const _component = container.querySelector('.EntriesListTable');
  expect(_component.children.length === items.length);
});