export function getLastIndex(path: string): number {
    const lastIndex = path.split(".").slice(-1).join(".");
    return Number(lastIndex);
}

export function getPrefix(path: string): string {
    return path.split(".").slice(0, -1).join(".");
}

export function getBranchPath(path: string): string {

    let isOk = false;
    let newPath = path;
    while (path && !isOk) {
        const lastIndex = getLastIndex(newPath);
        if (lastIndex > 0) {
            isOk = true;
        }else{
            newPath = newPath.split(".").slice(0, -4).join(".");
        }
    }

    return newPath;
}