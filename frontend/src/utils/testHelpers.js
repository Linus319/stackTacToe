import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";

export function renderWithCanvas(ui) {
  return render(<Canvas>{ui}</Canvas>);
}
