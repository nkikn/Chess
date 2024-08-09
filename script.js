
function start(){
    document.addEventListener("DOMContentLoaded", () => {
        const chessboard = document.getElementById("chessboard");
    
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement("div");
                square.classList.add("square");
    
                if ((row + col) % 2 === 0) {
                    square.classList.add("white");
                } else {
                    square.classList.add("black");
                }
    
                chessboard.appendChild(square);
            }
        }
    });
    
}

start();

function sendCommand(command) {
    fetch('/send_command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: command })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}


