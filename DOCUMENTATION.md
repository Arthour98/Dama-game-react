# Russian Dama (Checkers) Game Documentation

## Project Structure

```
src/
├── App.jsx              # Main application component
├── DamaContext.jsx      # Game context provider
├── assets/             # Game assets (images)
│   ├── blackPawn.png   # Black pawn image
│   ├── whitePawn.png   # White pawn image
│   └── react.svg       # React logo
└── board/              # Game board components and utilities
    ├── DamaBoard.jsx   # Main game board component
    ├── Utils.js        # Game logic utilities
    ├── aiUtils.js      # AI movement logic
    └── gameUtils.js    # Game state utilities

```

## Core Components

### DamaBoard.jsx

Main component responsible for:

- Rendering the game board
- Handling user interactions
- Managing game state
- Drawing pieces and animations
- Managing the game flow

Key Parameters:

- `CANVAS_SIZE`: 800px - Size of the main game board
- `SQUARE_SIZE`: 100px - Size of each board square
- `CEMETERY_SIZE`: 100px - Width of the cemetery areas

### Utils.js

Core game logic utilities:

#### `createBoard(ctx)`

Creates the initial game board layout.

- Parameters:
  - `ctx`: Canvas 2D context
- Returns: Array of square objects with positions and indices

#### `Pawn Class`

Represents a game piece.

- Properties:
  - `x, y`: Position coordinates
  - `width, height`: Piece dimensions
  - `isKing`: Boolean indicating if piece is crowned
  - `id`: Unique identifier

Methods:

- `init(image)`: Initialize pawn with image
- `build()`: Draw pawn on canvas

#### `Square Class`

Represents a board square.

- Properties:
  - `x, y`: Position coordinates
  - `width, height`: Square dimensions
  - `color`: Square color

Methods:

- `build()`: Draw square on canvas

#### `getValidMoves(piece, boardSquares, friendlyPieces, enemyPieces)`

Calculates valid moves for a piece.

- Parameters:
  - `piece`: The piece to check moves for
  - `boardSquares`: Current board state
  - `friendlyPieces`: Array of allied pieces
  - `enemyPieces`: Array of enemy pieces
- Returns: Array of valid moves with properties:
  - `targetIndex`: Index of target square
  - `kill`: ID of piece to capture (if any)

#### `initializePawns(squares)`

Creates initial pawn setup.

- Parameters:
  - `squares`: Board squares array
- Returns: Object with `whitePawns` and `blackPawns` arrays

## Game Mechanics

### Movement Rules

1. Regular pawns move diagonally forward only
2. Kings can move diagonally in any direction
3. Captures are mandatory when available
4. Multiple captures must be completed in one turn
5. Pawns become kings when reaching opposite end

### AI Logic

The AI:

1. Prioritizes capture moves
2. Randomly selects from available moves when no captures exist
3. Implements a 500ms delay between moves
4. Supports multiple captures in one turn

### Visual Features

1. Cemetery displays for captured pieces
2. Piece highlighting for selection
3. Move highlighting for valid moves
4. Game over overlay
5. Animations for:
   - Piece movement
   - Captures
   - King promotion

## State Management

Key State Variables:

- `boardSquares`: Array of all board squares
- `whitePieces/blackPieces`: Arrays of active pieces
- `selectedPiece`: Currently selected piece
- `possibleMoves`: Valid moves for selected piece
- `isWhiteTurn`: Current turn indicator
- `gameMessage`: Game status message
- `capturedWhite/capturedBlack`: Captured pieces arrays
