import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TicTacToeGrid from './TicTacToeGrid';
import { useState } from 'react';


export default function GameScreen({ mode, winner, currentPlayer, mySymbol, loading, joinCode, newGame, backHome, gameId, board, makeMove, winPositions }) {
    const [minimize, setMinimize] = useState(false);

    return (
        <div>
            <div className={`overlay ${minimize ? 'minimized' : ''}`}>
                <div className='content'>
                    <button className='minimize-button' onClick={() => setMinimize(!minimize)}>-</button>
                    {!minimize && <div>
                        <h3>ThicTacToe</h3>
                        <p>{mode && mode === 'double' ? `Join code: ${joinCode}` : ""}</p>
                        <p>
                            {winner
                                ? `${winner === 'X' ? "Red" : "Blue"} wins!`
                                : (currentPlayer === mySymbol ? "Your turn." : "Waiting for opponent.")}
                        </p>

                        <button className='button' onClick={newGame} disabled={mode === 'double' && (!winner || loading)}>New Game</button>
                        <button className='button' onClick={backHome}>Back</button>
                    </div>}
                </div>
            </div>
            <div className='game-container'>
                <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} />
                    <TicTacToeGrid gameId={gameId} board={board} makeMove={makeMove} isLoading={loading} winPositions={winPositions} />
                    <OrbitControls minDistance={5} maxDistance={10} />
                </Canvas>
            </div>

        </div>
    );
}