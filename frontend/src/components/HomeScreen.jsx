export default function HomeScreen({ startSinglePlayerGame, setScreen }) {
    return (
      <div className={'card'}>
        <h1>ThicTacToe</h1>
        <button className='button' onClick={startSinglePlayerGame}>Single Player</button>
        <button className='button' onClick={() => setScreen("multiplayer-menu")}>Two Player</button>
      </div>
    );
}