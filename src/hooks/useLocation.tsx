import { useContext } from "preact/hooks";
import LocationContext from "../LocationContext";

export interface Location {
    pathname: string;
}

export function useLocation(): Location {
    return useContext(LocationContext);
}
