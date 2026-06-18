import { IEvaluation, IWorkerResponse, LINE_MAP } from "../interfaces";

export type EvaluationPipelineResult = {
  fen: string;
  results: IWorkerResponse[];
}

export function parseWorkerEvaluation(
  rawResult: string,
  activeFen: string
): EvaluationPipelineResult | null {
  try {
    const parsed = JSON.parse(rawResult) as IWorkerResponse[];
    const results = parsed
      .filter((item) => item.fen === activeFen)
      .map((item) => normalizeEvaluation(item));

    if (results.length === 0) {
      return null;
    }

    return {
      fen: activeFen,
      results,
    };
  } catch (e) {
    return null;
  }
}

export function shouldUseLocalEvaluation(
  evaluation: IEvaluation | null
): boolean {
  if (!evaluation) {
    return false;
  }

  const nodes = Number(evaluation[LINE_MAP.nodes] || 0);
  const score = Number(evaluation[LINE_MAP.score] || 0);
  const pv = evaluation[LINE_MAP.pv] || "";

  return nodes > 50 * 1000 * 1000 && score > 3.5 && pv.length > 8;
}

export function withReducedNodes(
  fen: string,
  evaluation: IEvaluation
): IWorkerResponse {
  const nodes = Number(evaluation[LINE_MAP.nodes] || 0);
  return {
    fen,
    ...evaluation,
    [LINE_MAP.nodes]: nodes - 50 * 1000 * 1000,
  };
}

function normalizeEvaluation(data: IWorkerResponse): IWorkerResponse {
  if (!data[LINE_MAP.pv]) {
    return data;
  }
  return { ...data };
}
