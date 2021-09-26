import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button className="square"
                index={this.props.index}
                col={this.props.col}
                row={this.props.row}
                onClick={() => { this.props.onClick(); }}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {

    renderSquare(i, col, row) {
        return (
            <Square
                value={this.props.squares[i]}
                index={i}
                key={i}
                col={col}
                row={row}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let list = [
            <div key={0} className="board-row">
                <label className="serial"></label>
                <label className="serial">1</label>
                <label className="serial">2</label>
                <label className="serial">3</label>
            </div>
        ];
        let index = 0;
        let range = this.props.range;
        for (let i = 0; i < range; i++) {
            let content = [];
            for (let j = 0; j < range; j++) {
                content.push(this.renderSquare(index, j + 1, i + 1));
                index++;
            }
            list.push(<div key={i + 1} className="board-row">
                <label className="serial">{i + 1}</label>
                {content}
            </div>);
        }

        return (
            <div>
                {list}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            location: [{
                col: '0',
                row: '0'
            }],
            stepNumber: 0,
            xIsNext: true,
            range: 3,
            isSort: false
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const location = this.state.location.slice(0, this.state.stepNumber + 1);
        const currentLocation = Object.assign({}, location[location.length - 1]);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const btnSquare = document.querySelectorAll("button.square")[i];
        currentLocation.col = btnSquare.getAttribute("col");
        currentLocation.row = btnSquare.getAttribute("row");

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            location: location.concat([currentLocation]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    sortMoves() {
        this.setState({
            isSort: !this.state.isSort
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    playAgain() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            location: [{
                col: '0',
                row: '0'
            }],
            stepNumber: 0,
            xIsNext: true,
            isSort: false
        });
        var elems =document.querySelectorAll("button.square");
        [].forEach.call(elems, function (el) {
            el.classList.remove("active");
        });
        
    }

    isDraw(squares) {
        return squares.every(square => square !== null);
    }

    render() {
        const history = this.state.history;
        const location = this.state.location;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const isSort = this.state.isSort;
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.isDraw(current.squares)) {
            status = 'A Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const active = {
            background: "#16e6fb"
        }
        const inactive = {
            background: "grey"
        }
        const moves = history.map((step, move) => {
            const locationCurrent = location[move];
            const desc = move ? 'Go to move #' + move + ` - (${locationCurrent.col},${locationCurrent.row})` : 'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={this.state.stepNumber === move ? active : inactive}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <strong>Tic Tac Toe</strong>
                    <Board
                        squares={current.squares}
                        range={this.state.range}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="pl-1">{status}</div>
                    <ol>{isSort ? moves.reverse() : moves}</ol>
                </div>
                <div className="game-action">
                    <div><button onClick={() => this.sortMoves()}>Toggle Sort</button></div>
                    <div><button onClick={() => this.playAgain()}>Play Again</button></div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            const btnSquares = document.querySelectorAll("button.square");
            btnSquares[a].classList.add("active");
            btnSquares[b].classList.add("active");
            btnSquares[c].classList.add("active");
            return squares[a];
        }
    }
    return null;
}