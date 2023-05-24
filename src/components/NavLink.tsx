import type { JSX } from "preact";
import { useHistory, useLocation, useMatch } from "..";

export interface NavLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
    activeClassName?: string;
}

export function NavLink(props: NavLinkProps) {
    const history = useHistory();
    const location = useLocation();

    function onClick(event: MouseEvent) {
        event.preventDefault();

        onNavigate(props.href);
        // Call onClick prop if defined
        if (props.onClick) props.onClick.apply(undefined, [event]);
    }

    function onNavigate(url: string) {
        history.push(url);
        window.dispatchEvent(new Event("popstate"));
    }

    const isActive =
        props.href && useMatch(props.href, location.pathname) !== null;

    return (
        <a
            {...props}
            // Apply activeClassName when current url matches route
            className={[
                props.className && props.className,
                isActive && props.activeClassName,
            ]
                .filter((e) => !!e)
                .join(" ")}
            onClick={onClick}
        />
    );
}
