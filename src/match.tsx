// See https://github.com/remix-run/react-router/blob/43ef25a4b12a13b5920480cebda8a46c45c933ec/packages/react-router/index.tsx

type ParamParseFailed = { failed: true };

type ParamParseSegment<Segment extends string> =
    // Check here if there exists a forward slash in the string.
    Segment extends `${infer LeftSegment}/${infer RightSegment}`
        ? // If there is a forward slash, then attempt to parse each side of the
          // forward slash.
          ParamParseSegment<LeftSegment> extends infer LeftResult
            ? ParamParseSegment<RightSegment> extends infer RightResult
                ? LeftResult extends string
                    ? // If the left side is successfully parsed as a param, then check if
                      // the right side can be successfully parsed as well. If both sides
                      // can be parsed, then the result is a union of the two sides
                      // (read: "foo" | "bar").
                      RightResult extends string
                        ? LeftResult | RightResult
                        : LeftResult
                    : // If the left side is not successfully parsed as a param, then check
                    // if only the right side can be successfully parse as a param. If it
                    // can, then the result is just right, else it's a failure.
                    RightResult extends string
                    ? RightResult
                    : ParamParseFailed
                : ParamParseFailed
            : // If the left side didn't parse into a param, then just check the right
            // side.
            ParamParseSegment<RightSegment> extends infer RightResult
            ? RightResult extends string
                ? RightResult
                : ParamParseFailed
            : ParamParseFailed
        : // If there's no forward slash, then check if this segment starts with a
        // colon. If it does, then this is a dynamic segment, so the result is
        // just the remainder of the string. Otherwise, it's a failure.
        Segment extends `:${infer Remaining}`
        ? Remaining
        : ParamParseFailed;

// Attempt to parse the given string segment. If it fails, then just return the
// plain string type as a default fallback. Otherwise return the union of the
// parsed string literals that were referenced as dynamic segments in the route.
type ParamParseKey<Segment extends string> =
    ParamParseSegment<Segment> extends string
        ? ParamParseSegment<Segment>
        : string;

export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export interface PathMatch<
    Pattern extends string,
    ParamKey extends ParamParseKey<Pattern> = ParamParseKey<Pattern>
> {
    pathname: string;
    pattern: Pattern;
    params: Params<ParamKey>;
}

/**
 * Check if pathname matches pattern
 * @param pattern URL matching pattern
 * @param pathname Current pathname to be matched against pattern
 * @returns Null if pathname does not match
 * @returns Or the parameters, pathname, and pattern portion of the pathname
 */
export function matchPath<Pattern extends string>(
    pattern: Pattern,
    pathname: string
): PathMatch<Pattern> | null {
    let [matcher, paramNames] = compilePattern(pattern);

    let match = pathname.match(matcher);

    if (!match) return null;

    let matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    let captureGroups = match.slice(1);

    let params: Params = paramNames.reduce<Mutable<Params>>(
        (memo, paramName, index) => {
            // We need to compute the pathnameBase here using the raw splat value
            // instead of using params["*"] later because it will be decoded then
            if (paramName === "*") {
                let splatValue = captureGroups[index] || "";
                pathnameBase = matchedPathname
                    .slice(0, matchedPathname.length - splatValue.length)
                    .replace(/(.)\/+$/, "$1");
            }

            memo[paramName] = decodeURIComponent(captureGroups[index] || "");
            return memo;
        },
        {}
    );

    return { params, pattern, pathname: matchedPathname };
}

/**
 * Create Regex to match a pattern
 * @param pattern URL matching pattern
 * @returns Regex to match pattern, parameter names (if any) of pattern
 */
function compilePattern(pattern: string): [RegExp, string[]] {
    let paramNames: string[] = [];
    let regexpSource =
        "^" +
        pattern
            .replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
            .replace(/^\/*/, "/") // Make sure it has a leading /
            .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
            .replace(/:(\w+)/g, (_: string, paramName: string) => {
                paramNames.push(paramName);
                return "([^\\/]+)";
            });

    if (pattern.endsWith("*")) {
        paramNames.push("*");
        regexpSource +=
            pattern === "*" || pattern === "/*"
                ? "(.*)$" // Already matched the initial /, just match the rest
                : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
    } else {
        regexpSource += "\\/*$"; // Ignore trailing slashes;
    }

    let matcher = new RegExp(regexpSource);

    return [matcher, paramNames];
}
