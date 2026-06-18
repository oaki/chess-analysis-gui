export class FetchError extends Error {
    constructor(message: unknown) {
        super(typeof message === "string" ? message : String(message));
    }
}