import type { JSX, FunctionComponent } from "preact";
import { History, useHistory, useLocation, Match, useMatch } from "..";

export interface RouteComponentProps<Pattern extends string> {
    history: History;
    location: Match<Pattern>;
}

export interface RouteProps<Pattern extends string> {
    exact?: boolean;
    path: Pattern;
    component: FunctionComponent<RouteComponentProps<Pattern>>;
}

export function Route<Pattern extends string>({
    exact,
    path,
    component: Component,
}: RouteProps<Pattern>): JSX.Element {
    const history = useHistory();
    const location = useLocation();
    const match = useMatch(path, location.pathname);

    if ((exact && location.pathname !== path) || !match) {
        return null;
    }

    return <Component history={history} location={match} />;
}
