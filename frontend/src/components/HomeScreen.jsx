export default function HomeScreen({ startSinglePlayerGame, setScreen, centerStyle }) {

    return (
      <div style={centerStyle}>
        <h1>ThicTacToe</h1>
        <button onClick={startSinglePlayerGame}>🎮 Single Player</button>
        <button onClick={() => setScreen("multiplayer-menu")}>👥 Two Player</button>
      </div>
    );
}