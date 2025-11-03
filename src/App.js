import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

/* --------------------- PART 1: Tic Tac Toe ---------------------- */

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O");

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

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
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function TicTacToeGame() {
  const [xIsNext, setXIsNext] = React.useState(true);
  const [squares, setSquares] = React.useState(Array(9).fill(null));

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} />
      </div>
      <button className="reset-btn" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
}

/* ------------------- PART 2: React Life Cycle ------------------- */

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      error: null,
      loading: false,
      notFound: false,
    };
  }

  componentDidMount() {
    // Fetch immediately when mounted
    if (this.props.userId) {
      this.fetchUserData(this.props.userId);
    }
  }

  componentDidUpdate(prevProps) {
    // Fetch new data when userId changes
    if (prevProps.userId !== this.props.userId && this.props.userId) {
      this.fetchUserData(this.props.userId);
    }
  }

  fetchUserData = (userId) => {
    this.setState({ loading: true, user: null, error: null, notFound: false });

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        // Check if user exists (valid id between 1–10)
        if (Object.keys(data).length === 0 || !data.id) {
          this.setState({ notFound: true, loading: false });
        } else {
          this.setState({ user: data, loading: false });
        }
      })
      .catch((error) => this.setState({ error, loading: false }));
  };

  render() {
    const { user, loading, error, notFound } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error.message}</div>;
    if (notFound) return <div>User not found</div>;
    if (!user) return null;

    return (
      <div style={{ marginTop: "10px" }}>
        <h3>{user.name}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website:</strong> {user.website}</p>
      </div>
    );
  }
}

class UserFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      submittedId: null,
      invalidInput: false,
    };
  }

  handleChange = (e) => {
    this.setState({ userId: e.target.value });
  };

  handleSearch = () => {
    const id = parseInt(this.state.userId);
    if (id >= 1 && id <= 10) {
      this.setState({ submittedId: id, invalidInput: false });
    } else {
      this.setState({ invalidInput: true, submittedId: null });
    }
  };

  render() {
    const { submittedId, invalidInput } = this.state;

    return (
      <div>
        <h2>User Profile Finder</h2>
        <input
          type="number"
          placeholder="Enter user ID (1–10)"
          onChange={this.handleChange}
        />
        <button onClick={this.handleSearch}>Fetch User</button>

        {invalidInput && (
          <div style={{ marginTop: "10px", color: "red" }}>User not found</div>
        )}

        {submittedId && <UserProfile userId={submittedId} />}
      </div>
    );
  }
}

/* ----------------------- MAIN APP ----------------------- */

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>React Assignment: Tic-Tac-Toe + Life Cycle Fetch</h1>

      <div className="section">
        <h2>🕹️ Part 1: Tic Tac Toe Game</h2>
        <TicTacToeGame />
      </div>

      <hr />

      <div className="section">
        <h2>👤 Part 2: User Fetch (React Lifecycle)</h2>
        <UserFetcher />
      </div>
    </div>
  );
}

export default App;
