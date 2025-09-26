import ClickableCube from "./ClickableCube";

function TicTacToeGrid({ gameId, board, makeMove, isLoading }) {

  const positions = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        positions.push([x, y, z]);
      }
    }
  }

  const getCubeColor = (x, y, z) => {
    const cell = board?.[x]?.[y]?.[z];
    if (cell === 'X') return 'red';
    if (cell === 'O') return 'blue';
    return 'orange';
  };

  return (
    <>
      {positions.map((pos, index) => {
        const [x, y, z] = pos;
        const renderPos = [(x - 1) * 1.2, (y - 1) * 1.2, (z - 1) * 1.2]
        return (
          <ClickableCube
            key={index}
            position={renderPos}
            onClick={() => {
              if (!isLoading) makeMove(x, y, z);
            }}
            color={getCubeColor(x, y, z)}
          />
        );
      })}
    </>
  );
}

export default TicTacToeGrid;