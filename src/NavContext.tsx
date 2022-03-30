import { createContext } from "preact";

export interface TNavContext {
    path: string;
}

export const NavContext = createContext<TNavContext>(null);
