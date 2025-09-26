import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import TicTacToeGrid from "../../components/TicTacToeGrid";

describe("TicTacToeGrid", () => {
  it("renders 27 cubes", () => {
    const { container } = render(
      <Canvas>
        <TicTacToeGrid
          gameId="123"
          board={null}
          makeMove={jest.fn()}
          isLoading={false}
        />
      </Canvas>
    );

    expect(container.querySelectorAll("canvas")).toBeTruthy();
  });
});
