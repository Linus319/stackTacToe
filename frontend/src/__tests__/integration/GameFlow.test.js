import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../App";
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

describe("GameFlow integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("can start a single player game", async () => {
    axios.post.mockResolvedValueOnce({ data: { gameId: "single1" } });
    axios.get.mockResolvedValueOnce({
      data: { board: [[[null]]], current_player: "X", winner: null },
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Single Player/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/game/new"),
      { mode: "single" }
    ));

    expect(await screen.findByText(/Your turn/i)).toBeInTheDocument();
  });

  it("can create a multiplayer game", async () => {
    axios.post.mockResolvedValueOnce({
      data: { gameId: "multi1", joinCode: "ABCD" },
    });

    render(<App />);
    fireEvent.click(screen.getByText(/Two Player/i));
    expect(screen.getByText(/Create Game/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Create Game/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/game/new"),
      { mode: "double" }
    ));

    expect(await screen.findByText(/Join code/i)).toBeInTheDocument();
    expect(screen.getByText(/Join code: ABCD/i)).toBeInTheDocument();
  });
});
