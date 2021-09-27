// Track.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import * as helpers from "./TrackHelpers";

it("renders with a name and description", () => {
  const _name = "test";
  const _desc = "this is an example of a track";
  act(() => {
    render(<Track name={_name} desc={_desc}/>, container);
  });
  const _component = container.querySelector('div');
  expect(_component.textContent).toBe(_desc);
  expect(_component.className).toBe(_name);
});