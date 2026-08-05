import { IEvaluation, LINE_MAP } from "../interfaces";
import type { IOpeningMove } from "../components/openingExplorer/openingExplorerReducers";
import type { IHistoryGameResponse } from "../components/historyList/historyListReducers";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Opening-book API returns an array of weighted moves; validate before dispatch. */
export function isOpeningMoveArray(data: unknown): data is IOpeningMove[] {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(
    (item) =>
      isRecord(item) &&
      typeof item.move === "string" &&
      typeof item.weight === "number" &&
      typeof item.fen === "string" &&
      typeof item.san === "string"
  );
}

/** Stockfish / worker evaluation lines expose at least score + pv UCI fields (LINE_MAP keys). */
export function isIEvaluation(value: unknown): value is IEvaluation {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value[LINE_MAP.pv] === "string" && typeof value[LINE_MAP.score] === "string";
}

function isHistoryMoveLike(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === "number" &&
    typeof value.parentId === "number" &&
    typeof value.fen === "string" &&
    typeof value.notation === "string" &&
    typeof value.shortNotation === "string"
  );
}

export function isIHistoryGameResponse(value: unknown): value is IHistoryGameResponse {
  if (!isRecord(value)) {
    return false;
  }
  if (
    typeof value.id !== "number" ||
    typeof value.user_id !== "number" ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string" ||
    !Array.isArray(value.moves)
  ) {
    return false;
  }
  return (value.moves as unknown[]).every(isHistoryMoveLike);
}

export function isHistoryGameResponseList(data: unknown): data is IHistoryGameResponse[] {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(isIHistoryGameResponse);
}
