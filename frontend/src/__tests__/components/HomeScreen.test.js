import { render, screen, fireEvent } from "@testing-library/react";
import HomeScreen from "../../components/HomeScreen";

describe("HomeScreen", () => {
  it("renders buttons and calls handlers", () => {
    const startSingle = jest.fn();
    const setScreen = jest.fn();

    render(
      <HomeScreen
        startSinglePlayerGame={startSingle}
        setScreen={setScreen}
        centerStyle={{}}
      />
    );

    fireEvent.click(screen.getByText(/Single Player/i));
    expect(startSingle).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Two Player/i));
    expect(setScreen).toHaveBeenCalledWith("multiplayer-menu");
  });
});
