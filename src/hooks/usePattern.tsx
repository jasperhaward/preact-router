export type PatternMatcher = [matcher: RegExp, paramNames: string[]];

export function usePattern(pattern: string): PatternMatcher {
    let paramNames: string[] = [];
    let regexpSource =
        "^" +
        pattern
            .replace(/\/*\*?$/, "")
            .replace(/^\/*/, "/") // Make sure it has a leading /
            .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
            .replace(/:(\w+)/g, (_: string, paramName: string) => {
                paramNames.push(paramName);
                return "([^\\/]+)";
            });

    regexpSource += "\\/*$"; // Ignore trailing slashes;

    let matcher = new RegExp(regexpSource);

    return [matcher, paramNames];
}
