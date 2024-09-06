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
        // Implement chess logic to calculate moves for each piece type
        // Return an array of positions like ['a3', 'b4', 'c5'] etc.
        // For simplicity, you can start with pawn moves and expand to other pieces
        let moves = [];
    
        const files = 'abcdefgh';
        const rank = parseInt(position[1], 10);
        const file = position[0];
    
        if (pieceType === 'P') {  // Example for white pawn
            const move = `${file}${rank + 1}`;
            moves.push(move);
            // Add logic for other pawn moves (e.g., double move, captures)
        }
    
        // Add logic for other pieces (Rook, Knight, Bishop, Queen, King)
    
        return moves;
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