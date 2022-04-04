import { mount } from "enzyme";
import { Router, Route } from "../../src";

describe("Router", () => {
    it("Should render Router", () => {
        history.pushState(null, null, "/about/dynamic");

        const wrapper = mount(
            <Router>
                <div>
                    <Route path="/home" component={() => <div />} />
                </div>
                <Route path="/about" component={() => <div />} />
                <Route path="/about/:id/" component={() => <div />} />
            </Router>
        );
    });
});
