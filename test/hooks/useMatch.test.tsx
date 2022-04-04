import { expect, assert } from "chai";
import { useMatch } from "../../src";

describe("useMatch", () => {
    it("Match should match route without parameters", () => {
        const match = useMatch("/pattern", "/pattern");

        expect(match).to.not.equal(null);
    });

    it("Match should not match incorrect path", () => {
        const match1 = useMatch("/pattern", "/pattern/wrong");
        const match2 = useMatch("/pattern/:param", "/pattern/param/wrong");

        expect(match1).to.equal(null);
        expect(match2).to.equal(null);
    });

    it("Match should contain route parameters", () => {
        const match = useMatch("/pattern/:param", "/pattern/test");

        assert.deepEqual(match.params, { param: "test" });
    });
});
