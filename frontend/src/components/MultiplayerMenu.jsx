export default function MultiplayerMenu({ createMultiplayerGame, joinCode, setJoinCode, joinMultiplayerGame, backHome }) {
    return (
      <div className={'card'}>
        <h1>Two Player</h1>
        <button className='button' onClick={createMultiplayerGame}>Create Game</button>
        <input
          className='input'
          placeholder="Enter Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button className='button' onClick={joinMultiplayerGame}>Join Game</button>
        <button className='button' onClick={backHome}>Back</button>
      </div>
    );
}