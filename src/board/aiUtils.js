export function findBestMove(pieces, enemyPieces, squares, getValidMoves) {
    let bestMove = null;
    let bestPiece = null;
    let bestScore = -Infinity;

    // Evaluate each piece and its possible moves
    pieces.forEach(piece => {
        const moves = getValidMoves(piece, squares, pieces, enemyPieces);
        moves.forEach(move => {
            let score = 0;

            // Prioritize captures
            if (move.kill) {
                score += 10;
            }

            // Prioritize king promotion
            const targetSquare = squares[move.targetIndex];
            const willBecomeKing = !piece.isKing && 
                                 ((targetSquare.row === 0) || (targetSquare.row === 7));
            if (willBecomeKing) {
                score += 5;
            }

            // Prioritize protecting pieces
            const isProtected = pieces.some(otherPiece => 
                otherPiece.id !== piece.id &&
                Math.abs(otherPiece.x - targetSquare.x) <= 200 &&
                Math.abs(otherPiece.y - targetSquare.y) <= 200
            );
            if (isProtected) {
                score += 2;
            }

            // Add some randomness to make the AI less predictable
            score += Math.random() * 0.5;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
                bestPiece = piece;
            }
        });
    });

    return { piece: bestPiece, move: bestMove };
}
