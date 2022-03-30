import type { ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";
import { NavContext } from "./NavContext";

export interface RouterProps {
    children: ComponentChildren;
}

export function Router({ children }: RouterProps) {
    const [path, setPath] = useState(location.pathname);

    useEffect(() => {
        window.addEventListener("popstate", onPopStateChange);

        return () => window.removeEventListener("popstate", onPopStateChange);
    }, [path]);

    function onPopStateChange(event: PopStateEvent) {
        const { location } = event.currentTarget as Window;

        if (location.pathname !== path) {
            setPath(location.pathname);
        }
    }

    if (!history.push) {
        history.push = (path) => {
            history.pushState(null, null, path);
        };
    }

    return (
        <NavContext.Provider value={{ path }}>{children}</NavContext.Provider>
    );
}
