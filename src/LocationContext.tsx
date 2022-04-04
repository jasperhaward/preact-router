import { createContext } from "preact";
import { Location } from "./hooks/useLocation";

const LocationContext = createContext<Location>(null);

export default LocationContext;
