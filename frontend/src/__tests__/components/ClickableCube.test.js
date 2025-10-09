import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import ClickableCube from "../../components/ClickableCube";

jest.mock("three", () => ({
  ...jest.requireActual("three"),
  MeshStandardMaterial: jest.fn(),
}));

describe("ClickableCube", () => {
  it("renders without crashing", () => {
    render(
      <Canvas>
        <ClickableCube position={[0, 0, 0]} onClick={jest.fn()} color="red" />
      </Canvas>
    );
  });
});
