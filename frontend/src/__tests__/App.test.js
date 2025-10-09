import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import axios from "axios";

jest.mock("axios");
jest.mock("socket.io-client", () => ({
  io: () => ({
    emit: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    connected: true,
    on: jest.fn(),
  }),
}));

describe("App component", () => {
  it("renders HomeScreen by default", () => {
    render(<App />);
    expect(screen.getByText(/ThicTacToe/i)).toBeInTheDocument();
  });

  it("navigates to multiplayer menu", async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Two Player/i));
    expect(screen.getByText(/Create Game/i)).toBeInTheDocument()
  });

  it("starts single player game", async () => {
    axios.post.mockResolvedValueOnce({ data: { gameId: "123" } });
    axios.get.mockResolvedValueOnce({
      data: { board: [[[null]]], current_player: "X", winner: null },
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Single Player/i));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/game/new"),
        { mode: "single" }
      )
    );
  });
});
