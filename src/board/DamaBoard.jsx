import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createBoard, Pawn, Square, getValidMoves, initializePawns } from './Utils';
import { AnimationManager, drawGlowEffect } from './animations';
import whitePawnImg from '../assets/whitePawn.png';
import blackPawnImg from '../assets/blackPawn.png';

const CANVAS_SIZE = 800;
const SQUARE_SIZE = 100;
const CEMETERY_SIZE = 100;

function Board() {
  const [boardSquares, setBoardSquares] = useState([]);
  const [whitePieces, setWhitePieces] = useState([]);
  const [blackPieces, setBlackPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameMessage, setGameMessage] = useState('');
  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);
  const animationManagerRef = useRef(null);

  const canvasRef = useRef(null);
  const whitePawnImageRef = useRef(null);
  const blackPawnImageRef = useRef(null);

  const initializeCanvas = useCallback((canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_SIZE + CEMETERY_SIZE * 2;
    canvas.height = CANVAS_SIZE;
    canvas.style.width = `${CANVAS_SIZE + CEMETERY_SIZE * 2}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    animationManagerRef.current = new AnimationManager(ctx, SQUARE_SIZE);
    return ctx;
  }, []);

  const makeAIMove = useCallback(() => {
    if (gameMessage || isWhiteTurn) return;

    // Get active pieces only
    const activeWhitePieces = whitePieces.filter(wp => 
      !capturedWhite.some(cp => cp.id === wp.id)
    );
    const activeBlackPieces = blackPieces.filter(bp => 
      !capturedBlack.some(cp => cp.id === bp.id)
    );

    // First, look for any mandatory captures
    const captureAllMoves = [];
    activeBlackPieces.forEach(piece => {
      const moves = getValidMoves(piece, boardSquares, activeBlackPieces, activeWhitePieces);
      const captureMoves = moves.filter(move => move.kill);
      captureMoves.forEach(move => {
        captureAllMoves.push({ piece, move });
      });
    });

    // If no captures available, look for regular moves
    const allMoves = captureAllMoves.length > 0 ? captureAllMoves : [];
    if (allMoves.length === 0) {
      activeBlackPieces.forEach(piece => {
        const moves = getValidMoves(piece, boardSquares, activeBlackPieces, activeWhitePieces);
        const regularMoves = moves.filter(move => !move.kill);
        regularMoves.forEach(move => {
          allMoves.push({ piece, move });
        });
      });
    }

    if (allMoves.length > 0) {
      // Prioritize captures
      const captureMoves = allMoves.filter(m => m.move.kill);
      const moveToMake = captureMoves.length > 0 
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : allMoves[Math.floor(Math.random() * allMoves.length)];

      const { piece, move } = moveToMake;
      const targetSquare = boardSquares[move.targetIndex];
      const newRow = Math.floor(targetSquare.y / SQUARE_SIZE);
      const wasKing = piece.isKing;
      const willBecomeKing = !wasKing && newRow === 0;

      const updatedPiece = {
        ...piece,
        x: piece.x,
        y: piece.y,
        isKing: wasKing || willBecomeKing
      };

      // Start move animation
      animationManagerRef.current.animateMove(
        updatedPiece,
        piece.x,
        piece.y,
        targetSquare.x,
        targetSquare.y,
        () => {
          // After movement animation completes
          if (move.kill) {
            const capturedPiece = whitePieces.find(p => p.id === move.kill);
            if (capturedPiece) {
              // First, complete the move
              const movedPiece = {
                ...updatedPiece,
                x: targetSquare.x,
                y: targetSquare.y
              };
              finishAIMove(movedPiece, move, targetSquare, null);

              // Then start capture animation
              animationManagerRef.current.animateCapture(capturedPiece, () => {
                // Only after animation completes, update the captured piece state
                if (willBecomeKing) {
                  // Start crown animation before finishing the capture
                  animationManagerRef.current.animateCrown(movedPiece, () => {
                    const kingPiece = {
                      ...movedPiece,
                      isKing: true,
                      x: targetSquare.x,
                      y: targetSquare.y
                    };
                    // Update the piece state with both position and king status
                    setBlackPieces(pieces => pieces.map(p =>
                      p.id === kingPiece.id ? kingPiece : p
                    ));
                    // Finally complete the capture
                    finishAIMove(kingPiece, move, targetSquare, capturedPiece);
                  });
                } else {
                  finishAIMove(movedPiece, move, targetSquare, capturedPiece);
                }
              });
            }
          } else if (willBecomeKing) {
            // If piece becomes king without capture
            const movedPiece = {
              ...updatedPiece,
              x: targetSquare.x,
              y: targetSquare.y
            };
            // First update position
            setBlackPieces(pieces => pieces.map(p =>
              p.id === movedPiece.id ? movedPiece : p
            ));
            // Then animate crown transformation
            animationManagerRef.current.animateCrown(movedPiece, () => {
              const kingPiece = {
                ...movedPiece,
                isKing: true
              };
              // Update the final king status
              setBlackPieces(pieces => pieces.map(p =>
                p.id === kingPiece.id ? kingPiece : p
              ));
              finishAIMove(kingPiece, move, targetSquare);
            });
          } else {
            const movedPiece = {
              ...updatedPiece,
              x: targetSquare.x,
              y: targetSquare.y
            };
            finishAIMove(movedPiece, move, targetSquare);
          }
        }
      );
    }
  }, [blackPieces, whitePieces, boardSquares, gameMessage, isWhiteTurn]);

  const finishAIMove = useCallback((updatedPiece, targetMove, targetSquare, capturedPiece = null) => {
    updatedPiece.x = targetSquare.x;
    updatedPiece.y = targetSquare.y;

    // Update piece position first
    setBlackPieces(pieces => pieces.map(p =>
      p.id === updatedPiece.id ? updatedPiece : p
    ));

    // Only after the move is complete, handle the capture
    if (capturedPiece) {
      // Make sure the piece hasn't already been captured
      setWhitePieces(pieces => {
        const alreadyCaptured = capturedWhite.some(cp => cp.id === capturedPiece.id);
        return alreadyCaptured ? pieces : pieces.filter(p => p.id !== capturedPiece.id);
      });
      setCapturedWhite(prev => {
        const alreadyCaptured = prev.some(cp => cp.id === capturedPiece.id);
        return alreadyCaptured ? prev : [...prev, capturedPiece];
      });
    }

    // Get active pieces for next move calculation
    const activeWhitePieces = whitePieces.filter(wp => 
      !capturedWhite.some(cp => cp.id === wp.id) && 
      wp.id !== capturedPiece?.id
    );

    // Check for more captures for the same piece
    const nextMoves = getValidMoves(updatedPiece, boardSquares,
      blackPieces.map(p => p.id === updatedPiece.id ? updatedPiece : p),
      activeWhitePieces
    ).filter(m => m.kill);

    if (nextMoves.length > 0 && targetMove.kill) {
      // Only continue with the same piece if it just made a capture
      const moveToMake = nextMoves[Math.floor(Math.random() * nextMoves.length)];
      const targetSquare = boardSquares[moveToMake.targetIndex];
      const capturedPiece = activeWhitePieces.find(p => p.id === moveToMake.kill);
      
      if (capturedPiece) {
        setTimeout(() => {
          const currentPiece = {
            ...updatedPiece,
            x: updatedPiece.x,
            y: updatedPiece.y
          };
          
          animationManagerRef.current.animateMove(
            currentPiece,
            currentPiece.x,
            currentPiece.y,
            targetSquare.x,
            targetSquare.y,
            () => {
              animationManagerRef.current.animateCapture(capturedPiece, () => {
                const movedPiece = {
                  ...currentPiece,
                  x: targetSquare.x,
                  y: targetSquare.y
                };
                finishAIMove(movedPiece, moveToMake, targetSquare, capturedPiece);
              });
            }
          );
        }, 500);
      }
    } else {
      setIsWhiteTurn(true);
    }
  }, [boardSquares, blackPieces, whitePieces, capturedWhite, animationManagerRef]);

  const drawBoard = useCallback((ctx) => {
    if (!ctx || !boardSquares.length) return;

    ctx.clearRect(0, 0, CANVAS_SIZE + CEMETERY_SIZE * 2, CANVAS_SIZE);

    // Draw cemetery areas
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(0, 0, CEMETERY_SIZE, CANVAS_SIZE); // Left cemetery
    ctx.fillRect(CANVAS_SIZE + CEMETERY_SIZE, 0, CEMETERY_SIZE, CANVAS_SIZE); // Right cemetery

    // Draw captured pieces in cemeteries
    const drawCemetery = (pieces, startX) => {
      pieces.forEach((piece, index) => {
        const spacing = 10; // Smaller spacing between pieces
        const pieceSize = 50; // Smaller piece size
        const y = index * (pieceSize + spacing); // Position with spacing
        const x = startX;
        
        // Save context for clipping
        ctx.save();
        
        // Create circular clipping path
        const centerX = x + CEMETERY_SIZE/2;
        const centerY = y + pieceSize/2;
        const radius = pieceSize/2 - 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        
        // Fill with background color first
        ctx.fillStyle = '#DDD';
        ctx.fill();
        
        // Create clipping path
        ctx.clip();

        // Draw the piece image
        const image = piece.id.startsWith('white') ? whitePawnImageRef.current : blackPawnImageRef.current;
        if (image) {
          try {
            ctx.drawImage(
              image,
              x + (CEMETERY_SIZE - pieceSize)/2,
              y,
              pieceSize,
              pieceSize
            );
          } catch (e) {
            console.error('Error drawing cemetery pawn:', e);
          }
        }
        
        ctx.restore();
      });
    };

    drawCemetery(capturedWhite, 0); // Left cemetery for captured white pieces
    drawCemetery(capturedBlack, CANVAS_SIZE + CEMETERY_SIZE); // Right cemetery for captured black pieces

    // Draw board squares
    boardSquares.forEach(square => {
      const isBlack = (square.row + square.col) % 2 === 1;
      new Square(ctx, square.x + CEMETERY_SIZE, square.y, SQUARE_SIZE, SQUARE_SIZE, 
        isBlack ? '#4A4A4A' : '#FFFFFF'
      ).build();
    });

    // Highlight possible moves
    possibleMoves.forEach(move => {
      const square = boardSquares[move.targetIndex];
      if (square) {
        new Square(ctx, square.x + CEMETERY_SIZE, square.y, SQUARE_SIZE, SQUARE_SIZE, '#90EE90').build();
      }
    });

    // Draw pieces
    const drawPieces = (pieces, imgRef, capturedPieces) => {
      if (imgRef.current && pieces && pieces.length > 0) {
        // Only draw pieces that are not in cemetery
        const activePieces = pieces.filter(p => 
          !capturedPieces.some(cp => cp.id === p.id)
        );
        activePieces.forEach(piece => {
          if (piece && typeof piece.x === 'number' && typeof piece.y === 'number') {
            const gamePiece = new Pawn(ctx, {
              ...piece,
              x: piece.x + CEMETERY_SIZE,
              width: SQUARE_SIZE,
              height: SQUARE_SIZE
            });
            gamePiece.init(imgRef.current);
          }
        });
      }
    };

    drawPieces(whitePieces, whitePawnImageRef, capturedWhite);
    drawPieces(blackPieces, blackPawnImageRef, capturedBlack);

    // Highlight selected piece
    if (selectedPiece) {
      ctx.save();
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        selectedPiece.x + CEMETERY_SIZE + 3,
        selectedPiece.y + 3,
        94,
        94
      );
      ctx.restore();
    }
  }, [boardSquares, whitePieces, blackPieces, possibleMoves, selectedPiece, capturedWhite, capturedBlack]);

  const finishMove = useCallback((updatedPiece, targetMove, targetSquare, capturedPiece = null) => {
    updatedPiece.x = targetSquare.x;
    updatedPiece.y = targetSquare.y;

    // Update piece position first
    setWhitePieces(pieces => pieces.map(p =>
      p.id === updatedPiece.id ? updatedPiece : p
    ));

    // Only after the move is complete, handle the capture
    if (capturedPiece) {
      setBlackPieces(pieces => pieces.filter(p => p.id !== capturedPiece.id));
      setCapturedBlack(prev => [...prev, capturedPiece]);
    }

    setSelectedPiece(null);
    setPossibleMoves([]);

    // Check for more captures
    const nextMoves = getValidMoves(updatedPiece, boardSquares,
      whitePieces.map(p => p.id === updatedPiece.id ? updatedPiece : p),
      blackPieces.filter(p => p.id !== (capturedPiece?.id))
    );

    if (targetMove.kill && nextMoves.some(m => m.kill)) {
      setSelectedPiece(updatedPiece);
      setPossibleMoves(nextMoves.filter(m => m.kill));
    } else {
      setIsWhiteTurn(false);
    }
  }, [boardSquares, whitePieces, blackPieces]);

  const handleClick = useCallback((e) => {
    if (gameMessage || !isWhiteTurn) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width)) - CEMETERY_SIZE;
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if clicking on an active piece (not in cemetery)
    const clickedPiece = whitePieces.find(piece => 
      !capturedWhite.some(cp => cp.id === piece.id) &&
      x >= piece.x && x <= piece.x + SQUARE_SIZE &&
      y >= piece.y && y <= piece.y + SQUARE_SIZE
    );

    if (clickedPiece) {
      if (!selectedPiece || selectedPiece.id !== clickedPiece.id) {
        const moves = getValidMoves(clickedPiece, boardSquares, whitePieces, blackPieces);
        setSelectedPiece(clickedPiece);
        setPossibleMoves(moves);
      }
      return;
    }

    // If clicking on a valid move square
    if (selectedPiece) {
      const targetMove = possibleMoves.find(move => {
        const square = boardSquares[move.targetIndex];
        return square &&
               x >= square.x && x <= square.x + square.width &&
               y >= square.y && y <= square.y + square.height;
      });

      if (targetMove) {
        const targetSquare = boardSquares[targetMove.targetIndex];
        const newRow = Math.floor(targetSquare.y / SQUARE_SIZE);
        const wasKing = selectedPiece.isKing;
        const willBecomeKing = !wasKing && newRow === 7;
        
        const updatedPiece = {
          ...selectedPiece,
          isKing: wasKing || willBecomeKing
        };

        // Start move animation
        animationManagerRef.current.animateMove(
          updatedPiece,
          selectedPiece.x,
          selectedPiece.y,
          targetSquare.x,
          targetSquare.y,
          () => {
            // After movement animation completes
            if (targetMove.kill) {
              const capturedPiece = blackPieces.find(p => p.id === targetMove.kill);
              if (capturedPiece) {
                // First, complete the move
                finishMove(updatedPiece, targetMove, targetSquare, null);
                
                // Then start capture animation
                animationManagerRef.current.animateCapture(capturedPiece, () => {
                  // Only after animation completes, update the captured piece state
                  finishMove(updatedPiece, targetMove, targetSquare, capturedPiece);
                  
                  // If piece becomes king after capture
                  if (willBecomeKing) {
                    animationManagerRef.current.animateCrown(updatedPiece, () => {
                      // Update king status
                      const kingPiece = { ...updatedPiece, isKing: true };
                      setWhitePieces(pieces => pieces.map(p =>
                        p.id === kingPiece.id ? kingPiece : p
                      ));
                    });
                  }
                });
              }
            } else if (willBecomeKing) {
              // If piece becomes king without capture
              animationManagerRef.current.animateCrown(updatedPiece, () => {
                finishMove(updatedPiece, targetMove, targetSquare);
              });
            } else {
              finishMove(updatedPiece, targetMove, targetSquare);
            }
          }
        );
      } else {
        // If clicked outside valid moves, deselect the piece
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    }
  }, [gameMessage, isWhiteTurn, boardSquares, whitePieces, blackPieces, selectedPiece, possibleMoves, finishMove]);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = initializeCanvas(canvas);
    if (!ctx) return;

    const squares = createBoard(ctx);
    setBoardSquares(squares);

    const { whitePawns, blackPawns } = initializePawns(squares);
    setWhitePieces(whitePawns);
    setBlackPieces(blackPawns);
    setGameMessage('');
    setCapturedWhite([]);
    setCapturedBlack([]);
  }, [initializeCanvas]);

  // Load images
  useEffect(() => {
    if (!boardSquares.length) return;

    const loadImages = async () => {
      const loadImage = (src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });

      const [whiteImg, blackImg] = await Promise.all([
        loadImage(whitePawnImg),
        loadImage(blackPawnImg)
      ]);

      whitePawnImageRef.current = whiteImg;
      blackPawnImageRef.current = blackImg;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        drawBoard(ctx);
      }
    };

    loadImages();
  }, [boardSquares.length, drawBoard]);

  // Update board when state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !boardSquares.length) return;
    const ctx = canvas.getContext('2d');
    drawBoard(ctx);
  }, [boardSquares, drawBoard]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationManagerRef.current) {
        animationManagerRef.current.clearAnimations();
      }
    };
  }, []);

  // Check game over
  useEffect(() => {
    if (!boardSquares.length) return;

    const activeWhitePieces = whitePieces.filter(wp => 
      !capturedWhite.some(cp => cp.id === wp.id)
    );
    const activeBlackPieces = blackPieces.filter(bp => 
      !capturedBlack.some(cp => cp.id === bp.id)
    );

    if (activeWhitePieces.length === 0) {
      setGameMessage('Black wins!');
    } else if (activeBlackPieces.length === 0) {
      setGameMessage('White wins!');
    } else {
      const currentPieces = isWhiteTurn ? activeWhitePieces : activeBlackPieces;
      const enemyPieces = isWhiteTurn ? activeBlackPieces : activeWhitePieces;
      
      const hasValidMoves = currentPieces.some(piece => 
        getValidMoves(piece, boardSquares, currentPieces, enemyPieces).length > 0
      );
      
      if (!hasValidMoves) {
        setGameMessage(`${isWhiteTurn ? 'Black' : 'White'} wins by stalemate!`);
      }
    }
  }, [boardSquares.length, whitePieces, blackPieces, isWhiteTurn]);

  // Trigger AI move
  useEffect(() => {
    if (!isWhiteTurn && !gameMessage) {
      const timer = setTimeout(makeAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isWhiteTurn, gameMessage, makeAIMove]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = initializeCanvas(canvas);
    if (!ctx) return;

    const squares = createBoard(ctx);
    setBoardSquares(squares);

    const { whitePawns, blackPawns } = initializePawns(squares);
    setWhitePieces(whitePawns);
    setBlackPieces(blackPawns);
    setGameMessage('');
    setSelectedPiece(null);
    setPossibleMoves([]);
    setIsWhiteTurn(true);
    setCapturedWhite([]);
    setCapturedBlack([]);
  }, [initializeCanvas]);

  return (
    <div className="game-container" style={{ 
      position: 'relative', 
      paddingTop: '100px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      backgroundColor: '#000000',
      minHeight: '100vh',
      width: '100%'
    }}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          border: '2px solid black',
        }}
      />
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={resetGame}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      </div>
      {gameMessage && (
        <div className="game-over" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '10px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          {gameMessage}
        </div>
      )}
    </div>
  );
}

export default Board;
