export interface History {
    length: number;
    back(): void;
    forward(): void;
    push: (path: string) => void;
    replace: (path: string) => void;
}

export function useHistory(): History {
    return {
        get length() {
            return history.length;
        },
        back: () => history.back(),
        forward: () => history.forward(),
        push: (path) => history.pushState(null, null, path),
        replace: (path) => history.replaceState(null, null, path),
    };
}
