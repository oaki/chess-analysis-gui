import {IEvaluation, LINE_MAP} from "../interfaces";

export function parseResult(result: string, fen: string): IEvaluation[] {
    if (result.indexOf("info") === -1) {
        return [];
    }
    let lines = result.split("\n");
    lines = lines.filter(line => line.indexOf("info") !== -1 && line.indexOf("pv") !== -1);
    if (lines.length < 1) {
        return [];
    }

    const output: IEvaluation[] = [];

    lines.forEach((line) => {
        const r: any = parseLine(line);
        r.fen = fen;
        output[parseInt(r[LINE_MAP.multipv]) - 1] = r;
    });
    return output;
}

export function pairValues(name, str) {
    const tmp = str.split(" ");

    const namePosition = tmp.indexOf(name);

    if (namePosition === -1) {
        return false;
    }

    if (name === "pv") {
        const tmpArr = tmp.splice(namePosition + 1);
        return tmpArr.join(" ");
    }
    return tmp[namePosition + 1];
}

export function parseLine(lineStr): IEvaluation {
    const score = String(parseFloat(pairValues("cp", lineStr)) / 100);
    const obj: IEvaluation = {
        [LINE_MAP.mate]: pairValues("mate", lineStr), // mate
        [LINE_MAP.score]: score,
        [LINE_MAP.depth]: pairValues("depth", lineStr),
        [LINE_MAP.pv]: pairValues("pv", lineStr),
        [LINE_MAP.multipv]: pairValues("multipv", lineStr),
        [LINE_MAP.nodes]: pairValues("nodes", lineStr),
        [LINE_MAP.time]: pairValues("time", lineStr),
        [LINE_MAP.nps]: pairValues("nps", lineStr),
        [LINE_MAP.tbhits]: pairValues("tbhits", lineStr),
    };

    return obj;
}
