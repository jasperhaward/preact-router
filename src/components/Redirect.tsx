import type { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useHistory } from "..";

export interface RedirectProps {
    to: string;
}

export function Redirect({ to }: RedirectProps): JSX.Element {
    const history = useHistory();

    useEffect(() => {
        history.push(to);
    }, []);

    return;
}
