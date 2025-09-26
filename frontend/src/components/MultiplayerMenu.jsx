export default function MultiplayerMenu({ centerStyle, createMultiplayerGame, joinCode, setJoinCode, joinMultiplayerGame, backHome }) {
    return (
      <div style={centerStyle}>
        <h2>Two Player</h2>
        <button onClick={createMultiplayerGame}>Create Game</button>
        <input
          placeholder="Enter Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={joinMultiplayerGame}>Join Game</button>
        <button onClick={backHome}>Back</button>
      </div>
    );
}