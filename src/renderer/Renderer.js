import { BOARD_LENGTH } from '../../config/settings.js'

export default class Renderer {
    constructor(game) {
        this.game = game;
        this.board = game.board;
    }

    render() {
        this.renderBoard();
        this.renderStatistics();
    }

    renderBoard() {
        let board = this.board.pieces;
        
        // Selecting the table
        let table = document.querySelector("table");

        // Cleaning the table
        table.innerHTML = "";

        // Setting objects structures
        let tr = "<tr></tr>";
        let incorrectPiece = "<td>PIECE_VALUE</td>";
        let hiddenPiece = "<td style='visibility:hidden'></td>";
        let correctPiece = "<td class='correct-cell'>PIECE_VALUE</td>";

        // Reseting the correct pieces counter
        this.correctPieces = 0;

        board.forEach(row => {
            // Rendering the rows
            table.innerHTML += tr;
            let lastTR = document.querySelector("table tr:last-child");
            
            // Rendering the pieces
            row.forEach(piece => {
            if (piece != undefined) {
                if (this.board.isCorrectPosition(piece)) {
                    lastTR.innerHTML += correctPiece.replace("PIECE_VALUE", piece); 
                    this.correctPieces += 1;
                } else {
                    lastTR.innerHTML += incorrectPiece.replace("PIECE_VALUE", piece);
                }
            } else {
                lastTR.innerHTML += hiddenPiece;
            }
            })
        });
    }
    
    renderStatistics() {
        let percentageOfCorrectMoves = Math.floor((this.correctPieces/(BOARD_LENGTH*BOARD_LENGTH - 1))*100)

        document.querySelector("#number-of-moves").innerText = `MOVES: ${this.board.moves}`;
        document.querySelector("#progress-bar").style.backgroundPosition = percentageOfCorrectMoves + "%";
        document.querySelector("#progress-bar p").innerText = percentageOfCorrectMoves + "%";

        if (!this.showingWinScreen) document.querySelector("#game-board").display = "block";
    }
    
    run() {
        let loop = () => {
            requestAnimationFrame(loop);
            this.render();
        }
        requestAnimationFrame(loop);
    }
}