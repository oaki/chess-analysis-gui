import { IEvaluation, LINE_MAP } from "../interfaces";

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

export function parseOneLineResult(result: string, numOfMoves?: number): IEvaluation | null {
  if (result.indexOf("info") === -1 || result.indexOf("pv") === -1) {
    return null;
  }

  const evaluation: IEvaluation = parseLine(result);

  if (numOfMoves !== undefined) {
    evaluation[LINE_MAP.pv] = evaluation[LINE_MAP.pv].split(" ").slice(0, numOfMoves).join(" ");
  }
  return evaluation;
}

export function pairValues(name: string, str: string): string {
  const tmp = str.split(" ");

  const namePosition = tmp.indexOf(name);

  if (namePosition === -1) {
    throw new Error(`Name: ${name} is not exist in str: ${str}`);
  }

  if (name === "pv") {
    const tmpArr = tmp.splice(namePosition + 1);
    return tmpArr.join(" ");
  }
  return tmp[namePosition + 1];
}

export function parseLine(lineStr): IEvaluation {
  const score = String(parseFloat(pairValues("cp", lineStr)) / 100);
  const mate = lineStr.indexOf('mate')!==-1;
  const obj: IEvaluation = {
    [LINE_MAP.mate]: mate,
    [LINE_MAP.score]: score,
    [LINE_MAP.depth]: Number(pairValues("depth", lineStr)),
    [LINE_MAP.pv]: pairValues("pv", lineStr),
    [LINE_MAP.multipv]: pairValues("multipv", lineStr),
    [LINE_MAP.nodes]: Number(pairValues("nodes", lineStr)),
    [LINE_MAP.time]: pairValues("time", lineStr),
    [LINE_MAP.nps]: pairValues("nps", lineStr),
    [LINE_MAP.tbhits]: pairValues("tbhits", lineStr)
  };

  return obj;
}
