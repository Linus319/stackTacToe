import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TicTacToeGrid from './TicTacToeGrid';


export default function GameScreen({ overlayStyle, mode, winner, currentPlayer, gameStatus, mySymbol, loading, joinCode, newGame, backHome, gameId, board, makeMove }) {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={overlayStyle}>
            <h3>StackTacToe</h3>

            <p>Game type: {mode}</p>

            <p>{mode && mode === 'double' ? `Join code: ${joinCode}` : ""}</p>

            <p>{gameStatus && mode === 'double' ? `Game status: ${gameStatus}` : ""}</p>

            <p>
                {winner
                ? `🎉 Winner: ${winner === 'X' ? "Red" : "Blue"}`
                : (currentPlayer === mySymbol ? "Your turn" : "Waiting for opponent")}
            </p>

            <button onClick={newGame} disabled={mode === 'double' && (!winner || loading)}>New Game</button>
            <button onClick={backHome}>Back</button>
            </div>

            <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <TicTacToeGrid gameId={gameId} board={board} makeMove={makeMove} isLoading={loading} />
            <OrbitControls />
            </Canvas>

        </div>
    );
}