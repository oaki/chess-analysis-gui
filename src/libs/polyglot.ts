// 'use strict';
//
// const constants = require('./constants');
//
// function isNumeric(n) {
//     return !isNaN(parseFloat(n)) && isFinite(n);
// }
//
// function rankFileToIndex(rankIndex, fileIndex) {
//     return (rankIndex + 1) * 15 + fileIndex + 18;
// }
//
// function indexToRank(index) {
//     return ((index / 15) >> 0) - 2;
// }
//
// function indexToFile(index) {
//     return index % 15 - 3;
// }
//
// function algebraicToIndex(algebraic) {
//     const splitted = algebraic.split('');
//     const fileIndex = splitted[0].charCodeAt(0) - 97;
//     const rankIndex = parseInt(splitted[1], 10) - 1;
//     return rankFileToIndex(rankIndex, fileIndex);
// }
//
// function indexToAlgebraic(index) {
//     const fileIndex = indexToFile(index) + 1;
//     const rankIndex = indexToRank(index) + 1;
//     return String.fromCharCode(96 + fileIndex) + rankIndex;
// }
//
// function index64ToIndex180(index64) {
//     const rank = index64ToRank(index64);
//     const file = index64ToFile(index64);
//     const index180 = rankFileToIndex(rank, file);
//     return index180;
// }
//
// function index64ToRank(index64) {
//     return (index64 / 8) >> 0;
// }
//
// function index64ToFile(index64) {
//     return index64 % 8;
// }
//
// function moveToString(move) {
//     return indexToAlgebraic(moveFrom(move)) + indexToAlgebraic(moveTo(move)) +
//         (movePromotion(move) ? constants.INVERSE_PIECE_MAP[movePromotion(move)] : '');
// }
//
// // Inspired by chess.js implementation
// function moveToShortString(board, move) {
//     // Needs to have unique IDENTIFIER + TO
//     // If not unique, add FILE
//     // If still not unique, remove FILE add RANK
//     const from = moveFrom(move);
//     const to = moveTo(move);
//     const bits = moveBits(move);
//     const captured = moveCaptured(move);
//     const capturedString = captured !== constants.EMPTY ? 'x' : '';
//     const piece = board.board[from] & constants.JUST_PIECE;
//     const pieceString = piece === constants.PAWN ? '' : constants.INVERSE_PIECE_MAP[piece].toUpperCase();
//     let fromString = '';
//     let checkString = '';
//     const promotion = movePromotion(move);
//     const promotionString = promotion ? '=' + constants.INVERSE_PIECE_MAP[promotion].toUpperCase() : '';
//     const moves = board.generateLegalMoves();
//     const toAlgebraic = indexToAlgebraic(to);
//     const fromAlgebraic = indexToAlgebraic(from);
//     const rank = indexToRank(from);
//     const file = indexToFile(from);
//     let possibleMove, possibleFrom, possibleTo, possiblePiece, possibleRank, possibleFile;
//     let ambiguous = false;
//     // Rank is always ambiguous on pawn captures
//     const ambiguousRank = captured !== constants.EMPTY && piece === constants.PAWN;
//     const ambiguousFile = false;
//
//     // Test ambiguity against all possible moves
//     for (let i = 0; i < moves.length; i++) {
//         possibleMove = moves[i];
//         possibleFrom = moveFrom(possibleMove);
//         possibleTo = moveTo(possibleMove);
//         possiblePiece = board.board[possibleFrom] & constants.JUST_PIECE;
//         possibleRank = indexToRank(possibleFrom);
//         possibleFile = indexToFile(possibleFrom);
//
//         // Remove exact from<->to match
//         if (possiblePiece === piece && possibleFrom !== from && possibleTo === to) {
//             if (possibleRank === rank) {
//                 ambiguousRank = true;
//             }
//
//             if (possibleFile === file) {
//                 ambiguousFile = true;
//             }
//         }
//     }
//
//     if (ambiguousRank && ambiguousFile) {
//         // Both ambiguous, add full from
//         fromString = fromAlgebraic;
//     } else if (ambiguousFile) {
//         // File ambiguous, add unique rank
//         fromString = fromAlgebraic[1];
//     } else if (ambiguousRank) {
//         // Rank ambiguous, add unique file
//         fromString = fromAlgebraic[0];
//     }
//
//     // Determine check status
//     board.addHistory();
//     board.addMove(move);
//
//     if (board.isInCheck()) {
//         // Checkmate
//         if (board.generateLegalMoves().length === 0) {
//             checkString = '#';
//         } else {
//             checkString = '+';
//         }
//     }
//
//     board.subtractMove(move);
//     board.subtractHistory();
//
//     return pieceString + fromString + capturedString + toAlgebraic + promotionString + checkString;
// }
//
// function createMove(from, to, bits, captured, promotion, order) {
//     let move = (from - constants.MOVE_INDEX_OFFSET) +
//         ((to - constants.MOVE_INDEX_OFFSET) << constants.MOVE_TO_SHIFT) +
//         (bits >> 1 << 1);
//
//     if (promotion) {
//         move += (promotion >> 1) << constants.MOVE_PROMOTION_SHIFT;
//     }
//
//     if (captured === undefined) {
//         captured = constants.EMPTY;
//     }
//
//     move += (captured >> 1) << constants.MOVE_CAPTURED_SHIFT;
//
//     if (order) {
//         move += order << constants.MOVE_ORDER_SHIFT;
//     }
//
//     return move;
// }
//
// function moveFrom(move) {
//     return (move & constants.MOVE_FROM_MASK) + constants.MOVE_INDEX_OFFSET;
// }
//
// function moveTo(move) {
//     return ((move & constants.MOVE_TO_MASK) >> constants.MOVE_TO_SHIFT) + constants.MOVE_INDEX_OFFSET;
// }
//
// function movePromotion(move) {
//     return ((move & constants.MOVE_PROMOTION_MASK) >> constants.MOVE_PROMOTION_SHIFT) << 1;
// }
//
// function moveCaptured(move) {
//     return ((move & constants.MOVE_CAPTURED_MASK) >> constants.MOVE_CAPTURED_SHIFT) << 1;
// }
//
// function moveBits(move) {
//     return move & constants.MOVE_BITS_MASK;
// }
//
// function moveOrder(move) {
//     return (move & constants.MOVE_ORDER_MASK) >> constants.MOVE_ORDER_SHIFT;
// }
//
// function moveAddOrder(move, order) {
//     return (move & (~constants.MOVE_ORDER_MASK)) + (order << constants.MOVE_ORDER_SHIFT);
// }
//
// // Recursive quicksort, apparently faster than Array.prototype.sort()
// // See https://jsperf.com/javascript-sort/103
// function quickSort(arr) {
//     if (arr.length <= 1) {
//         return arr;
//     }
//
//     const pivot = arr.splice(((arr.length / 2) >> 0), 1)[0];
//     const left = [];
//     const right = [];
//
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] > pivot) {
//             left.push(arr[i]);
//         } else {
//             right.push(arr[i]);
//         }
//     }
//
//     return quickSort(left).concat([pivot], quickSort(right));
// }
//
// function padIndices(pieceSquareTable) {
//     const paddedPieceSquareTables = [
//         new Int32Array(constants.WIDTH * constants.HEIGHT),
//         new Int32Array(constants.WIDTH * constants.HEIGHT)
//     ];
//
//     paddedPieceSquareTables[constants.BLACK].fill(0);
//     paddedPieceSquareTables[constants.WHITE].fill(0);
//
//     for (let index64 = 0; index64 < 64; index64++) {
//         const rank = index64ToRank(index64);
//         const file = index64ToFile(index64);
//         const index180 = rankFileToIndex(rank, file);
//         const invertedIndex180 = rankFileToIndex(7 - rank, file);
//
//         paddedPieceSquareTables[constants.BLACK][index180] = pieceSquareTable[index64];
//         paddedPieceSquareTables[constants.WHITE][invertedIndex180] = pieceSquareTable[index64];
//     }
//
//     return paddedPieceSquareTables;
// }
//
// export function unsignedHexString(number) {
//     if (number < 0) {
//         number = 0xFFFFFFFF + number + 1;
//     }
//
//     return number.toString(16).toUpperCase();
// }
//
// function bufferToArrayBuffer(buffer) {
//     return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
// }
