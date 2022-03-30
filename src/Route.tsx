import { FunctionComponent } from "preact";
import { useContext } from "preact/hooks";
import { NavContext } from "./NavContext";

export interface RouteComponentProps {
    history: {
        path: string;
        push: History["push"];
    };
}

export interface RouteProps {
    route: string;
    component: FunctionComponent<RouteComponentProps>;
}

export function Route({ route, component: Component }: RouteProps) {
    const { path } = useContext(NavContext);

    return (
        path === route && (
            <Component
                history={{
                    path,
                    push: history.push,
                }}
            />
        )
    );
}
