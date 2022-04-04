import { assert } from "chai";
import { mount } from "enzyme";
import { Router, Route } from "../../src";

describe("Route", () => {
    it("Should render only matching Routes", () => {
        history.pushState(null, null, "/about/dynamic");

        const Div = () => <div />;

        const wrapper = mount(
            <Router>
                <Route path="/home" component={Div} />
                <Route path="/about" component={Div} />
                <Route path="/about/:id/" component={Div} />
            </Router>
        );

        assert(wrapper.find("div").length === 1);

        history.pushState(null, null, "/about");

        assert(wrapper.find("div").length === 1);
    });
});
