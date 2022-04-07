import { usePattern } from "..";

// TypeScript params parsing see:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts#L99

interface ParamsDictionary {
    [key: string]: string;
}

type RemoveTail<
    S extends string,
    Tail extends string
> = S extends `${infer P}${Tail}` ? P : S;

// prettier-ignore
type GetPatternParameter<S extends string> = RemoveTail<
    RemoveTail<
        RemoveTail<S, `/${string}`>, 
        `-${string}`
    >,
    `.${string}`
>;

// prettier-ignore
export type PatternParameters<Pattern extends string> = string extends Pattern
    ? ParamsDictionary
    : Pattern extends `${string}:${infer Rest}`
        ? (
            GetPatternParameter<Rest> extends never
                ? ParamsDictionary
                : GetPatternParameter<Rest> extends `${infer ParamName}?`
                    ? { [P in ParamName]?: string }
                    : { [P in GetPatternParameter<Rest>]: string }
            ) & (
                Rest extends `${GetPatternParameter<Rest>}${infer Next}`
                    ? PatternParameters<Next>
                    : unknown
            )
        : {};

export interface Match<Pattern extends string> {
    pattern: Pattern;
    pathname: string;
    params: PatternParameters<Pattern>;
}

export function useMatch<Pattern extends string>(
    pattern: Pattern,
    pathname: string
): Match<Pattern> {
    let [matcher, paramNames] = usePattern(pattern);

    let match = pathname.match(matcher);

    if (!match) return null;

    let matchedPathname = match[0];
    let captureGroups = match.slice(1);

    let params: PatternParameters<string> = paramNames.reduce<
        PatternParameters<string>
    >((params, paramName, index) => {
        params[paramName] = decodeURIComponent(captureGroups[index] || "");
        return params;
    }, {});

    return {
        params: params as PatternParameters<Pattern>,
        pattern,
        pathname: matchedPathname,
    };
}
