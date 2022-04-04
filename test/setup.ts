// This `<reference ...>` directive is necessary to include the adapter's
// extensions to types in the "preact" and "enzyme" packages.
/// <reference types="enzyme-adapter-preact-pure"/>

import { JSDOM } from "jsdom";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-preact-pure";

// Setup JSDOM
const dom = new JSDOM("", {
    // Enable `requestAnimationFrame` which Preact uses internally.
    pretendToBeVisual: true,
    url: "http://localhost:3001/initial",
});

// @ts-ignore
global.Event = dom.window.Event;
// @ts-ignore
global.Node = dom.window.Node;
// @ts-ignore
global.window = dom.window;
global.history = dom.window.history;
global.location = dom.window.location;
// @ts-ignore
global.document = dom.window.document;

// Setup Enzyme
configure({ adapter: new Adapter() });
