import type { JSX } from "preact";
import { useContext } from "preact/hooks";
import { NavContext } from "./NavContext";

export interface NavLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {}

export function NavLink({ href, type, ...props }: NavLinkProps) {
    const { path } = useContext(NavContext);

    function onClick(event: MouseEvent) {
        event.preventDefault();

        onNavigate(href);

        // Call onClick prop if defined
        if (props.onClick) {
            props.onClick.apply(undefined, [event]);
        }
    }

    function onNavigate(url: string) {
        history.push(url);
        window.dispatchEvent(new Event("popstate"));
    }

    // Apply type="active" when URL path = href
    if (path === href) {
        if (type) {
            type += " active";
        } else {
            type = "active";
        }
    }

    return <a {...props} href={href} type={type} onClick={onClick} />;
}
