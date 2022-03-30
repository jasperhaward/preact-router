import { useEffect } from "preact/hooks";

export interface RedirectProps {
    to: string;
}

export function Redirect({ to }: RedirectProps) {
    useEffect(() => {
        history.push(to);
    }, []);

    return <></>;
}
