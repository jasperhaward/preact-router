import type { JSX } from "preact";
import { useHistory, useLocation, useMatch } from "..";

export interface NavLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {}

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

    // Apply type="active" when current url matches route
    if (props.href && useMatch(props.href, location.pathname) !== null) {
        if (props.type) props.type += " ";

        props.type += "active";
    }

    return <a {...props} onClick={onClick} />;
}
