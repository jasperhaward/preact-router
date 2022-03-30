declare global {
    interface History {
        push: (path: string) => void;
    }
}

export {};
