import { ComponentChildren } from "preact";
import { useState, useEffect } from "preact/hooks";
import LocationContext from "../LocationContext";

export interface RouterProps {
    children: ComponentChildren;
}

export function Router({ children }: RouterProps) {
    const [pathname, setPathname] = useState(location.pathname);

    useEffect(() => {
        // Attach history event handler
        window.addEventListener("popstate", onPopStateChange);

        return () => window.removeEventListener("popstate", onPopStateChange);
    }, [pathname]);

    function onPopStateChange(event: PopStateEvent) {
        const { location } = event.currentTarget as Window;

        if (location.pathname !== pathname) {
            setPathname(location.pathname);
        }
    }

    return (
        <LocationContext.Provider children={children} value={{ pathname }} />
    );
}
