let selectedPiece = null;
let selectedSquare = null;

document.addEventListener("DOMContentLoaded", function() {
    const chessboard = document.getElementById("chessboard");

    const initialBoard = [
        'r_black', 'n_black', 'b_black', 'q_black', 'k_black', 'b_black', 'n_black', 'r_black',
        'p_black', 'p_black', 'p_black', 'p_black', 'p_black', 'p_black', 'p_black', 'p_black',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
        'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'
    ];

    // Create the board with pieces
    initialBoard.forEach((piece, index) => {
        const square = document.createElement("div");
        square.classList.add("square");

        const row = Math.floor(index / 8);
        const col = index % 8;

        if ((row + col) % 2 === 0) {
            square.classList.add("white");
        } else {
            square.classList.add("black");
        }

        if (piece) {
            const pieceImage = document.createElement("img");
            pieceImage.src = `/static/chess_piece/${piece}.png`;
            pieceImage.classList.add("piece");
            pieceImage.draggable = true;
            pieceImage.addEventListener('dragstart', onDragStart);
            square.appendChild(pieceImage);
        }

        square.addEventListener('dragover', onDragOver);
        square.addEventListener('drop', onDrop);

        chessboard.appendChild(square);
    });

    // Function to convert chess notation to board index
    function chessNotationToIndex(notation) {
        const files = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
        const rank = 8-parseInt(notation[1], 10);
        const file = files[notation[0]];
        return rank * 8 + file;
    }

    function movePiece(from, to) {
        const squares = chessboard.children;
        const fromIndex = chessNotationToIndex(from);
        const toIndex = chessNotationToIndex(to);

        const piece = squares[fromIndex].querySelector("img");
        if (piece) {
            squares[toIndex].appendChild(piece);
        }
    }

    // Drag and drop functionality
    function onDragStart(event) {
        selectedPiece = event.target;
        selectedSquare = selectedPiece.parentElement;
        highlightPossibleMoves(selectedPiece, selectedSquare);
    }
    
    function highlightPossibleMoves(piece, square) {
        clearHighlightedMoves();  // Clear any previous highlights
    
        const pieceType = piece.src.split('/').pop().split('.')[0];
        const fromIndex = Array.from(chessboard.children).indexOf(square);
        const fromFile = 'abcdefgh'[fromIndex % 8];
        const fromRank = 8 - Math.floor(fromIndex / 8);
        const position = `${fromFile}${fromRank}`;
        
        const possibleMoves = getPossibleMoves(pieceType, position);
    
        possibleMoves.forEach(move => {
            const toIndex = chessNotationToIndex(move);
            chessboard.children[toIndex].classList.add('highlight');
        });
    }
    
    function clearHighlightedMoves() {
        document.querySelectorAll('.highlight').forEach(square => {
            square.classList.remove('highlight');
        });
    }

    function getPossibleMoves(pieceType, position) {
        let moves = [];
        const files = 'abcdefgh';
        const rank = parseInt(position[1], 10);
        const file = position[0];
        const fileIndex = files.indexOf(file);
    
        switch (pieceType) {
            case 'P': // White Pawn
                if (rank < 8) {
                    moves.push(`${file}${rank + 1}`);
                    // Double move if on initial position
                    if (rank === 2) {
                        moves.push(`${file}${rank + 2}`);
                    }
                    // Add capture moves (left and right diagonals)
                    // if (fileIndex > 0) {
                    //     moves.push(`${files[fileIndex - 1]}${rank + 1}`);
                    // }
                    // if (fileIndex < 7) {
                    //     moves.push(`${files[fileIndex + 1]}${rank + 1}`);
                    // }
                }
                break;
    
            case 'p_black': // Black Pawn
                if (rank > 1) {
                    moves.push(`${file}${rank - 1}`);
                    // Double move if on initial position
                    if (rank === 7) {
                        moves.push(`${file}${rank - 2}`);
                    }
                    // Add capture moves (left and right diagonals)
                    // if (fileIndex > 0) {
                    //     moves.push(`${files[fileIndex - 1]}${rank - 1}`);
                    // }
                    // if (fileIndex < 7) {
                    //     moves.push(`${files[fileIndex + 1]}${rank - 1}`);
                    // }
                }
                break;
    
            case 'R': case 'r_black': // Rook (White and Black)
                for (let i = 1; i < 8; i++) {
                    if (fileIndex + i < 8) moves.push(`${files[fileIndex + i]}${rank}`);
                    if (fileIndex - i >= 0) moves.push(`${files[fileIndex - i]}${rank}`);
                    if (rank + i <= 8) moves.push(`${file}${rank + i}`);
                    if (rank - i >= 1) moves.push(`${file}${rank - i}`);
                }
                break;
    
            case 'N': case 'n_black': // Knight (White and Black)
                const knightMoves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2]
                ];
                knightMoves.forEach(([dx, dy]) => {
                    const newFileIndex = fileIndex + dx;
                    const newRank = rank + dy;
                    if (newFileIndex >= 0 && newFileIndex < 8 && newRank >= 1 && newRank <= 8) {
                        moves.push(`${files[newFileIndex]}${newRank}`);
                    }
                });
                break;
    
            case 'B': case 'b_black': // Bishop (White and Black)
                for (let i = 1; i < 8; i++) {
                    if (fileIndex + i < 8 && rank + i <= 8) moves.push(`${files[fileIndex + i]}${rank + i}`);
                    if (fileIndex - i >= 0 && rank + i <= 8) moves.push(`${files[fileIndex - i]}${rank + i}`);
                    if (fileIndex + i < 8 && rank - i >= 1) moves.push(`${files[fileIndex + i]}${rank - i}`);
                    if (fileIndex - i >= 0 && rank - i >= 1) moves.push(`${files[fileIndex - i]}${rank - i}`);
                }
                break;
    
            case 'Q': case 'q_black': // Queen (White and Black)
                // Combine Rook and Bishop moves
                moves = [
                    ...getPossibleMoves('R', position),
                    ...getPossibleMoves('B', position)
                ];
                break;
    
            case 'K': case 'k_black': // King (White and Black)
                const kingMoves = [
                    [1, 0], [-1, 0], [0, 1], [0, -1],
                    [1, 1], [-1, 1], [1, -1], [-1, -1]
                ];
                kingMoves.forEach(([dx, dy]) => {
                    const newFileIndex = fileIndex + dx;
                    const newRank = rank + dy;
                    if (getElementOnPile(`${newFileIndex}${newRank}`) != 
                        newFileIndex >= 0 && newFileIndex < 8 && newRank >= 1 && newRank <= 8) {
                        moves.push(`${files[newFileIndex]}${newRank}`);
                    }
                });
                break;
        }
        
        return moves;
    }    

    
    function getElementOnPile(pile) {
        const files = 'abcdefgh';
        
        const file = pile[0];
        const rank = parseInt(pile[1], 10);
        
        const fileIndex = files.indexOf(file);
        
        const rankIndex = 8 - rank; // Convert rank (1-8) to a 0-based row index
        const boardIndex = rankIndex * 8 + fileIndex; // Combine rank and file indices
            const chessboard = document.getElementById('chessboard');
        const elementOnPile = chessboard.children[boardIndex];
        
        const pieceImage = elementOnPile.querySelector('img');
        
        if (pieceImage) {
            return pieceImage.src.split('/').pop().split('.')[0];
        } else {
            return null;  // No piece on this square
        }
    }
    
    

    function onDragOver(event) {
        event.preventDefault();
    }

    function onDrop(event) {
        event.preventDefault();
        const targetSquare = event.target.classList.contains('square') ? event.target : event.target.parentElement;
    
        if (targetSquare && selectedPiece && targetSquare.classList.contains('highlight')) {
            const fromIndex = Array.from(chessboard.children).indexOf(selectedSquare);
            const toIndex = Array.from(chessboard.children).indexOf(targetSquare);
    
            const fromFile = 'abcdefgh'[fromIndex % 8];
            const fromRank = 8 - Math.floor(fromIndex / 8);
            const toFile = 'abcdefgh'[toIndex % 8];
            const toRank = 8 - Math.floor(toIndex / 8);
    
            const move = `${fromFile}${fromRank}${toFile}${toRank}`;
            targetSquare.appendChild(selectedPiece);
            console.log(getElementOnPile(`${toFile}${toRank}`))
            makeMove(move);
        }
    
        clearHighlightedMoves();  // Clear highlights after the move is made
    }
    

    // Polling for the Raspberry Pi move
    function pollForRaspberryPiMove() {
        setInterval(() => {
            fetch('/get_move')
            .then(response => response.json())
            .then(data => {
                if (data.current_turn === 'white') {
                    const from = data.move.substring(0, 2); // Define 'from' here
                    const to = data.move.substring(2, 4); // Define 'to' here
                    movePiece(from, to);
                }
            })
            .catch(error => {
                console.error("Error fetching Raspberry Pi move:", error);
            });
        }, 1000);
    }

    pollForRaspberryPiMove();  // Start polling for moves

    function makeMove(move) {
        fetch('/make_move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ move: move, player: 'white' }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log("success!!!")
                // const from = data.move.substring(0, 2);
                // const to = data.move.substring(2, 4);
                // movePiece(from, to);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

});