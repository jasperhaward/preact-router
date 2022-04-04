import { assert } from "chai";
import { useHistory } from "../../src";

// Note: history.back and history.forward methods do not work in JSDOM, and hence cannot be tested.
// See: https://github.com/jsdom/jsdom/issues/1565

describe("useHistory", () => {
    const historyHook = useHistory();

    it("history.length should equal window.history.length", () => {
        assert(historyHook.length === history.length);

        history.pushState(null, null, "/goto/1");

        // Check length is updated after history.push
        assert(historyHook.length === history.length);
    });

    it("history.push should update location and increment window.history.length", () => {
        const url = "/goto/2";
        const prevLength = history.length;

        historyHook.push(url);

        assert(location.pathname === url);
        assert(history.length === prevLength + 1);
    });

    it("history.replace should replace location and not increment window.history.length", () => {
        const url = "/goto/3";
        const prevLength = history.length;

        historyHook.replace(url);

        assert(location.pathname === url);
        assert(history.length === prevLength);
    });
});
