import axios from "axios";

jest.mock("axios");

describe("API integration", () => {
  it("fetches game state", async () => {
    axios.get.mockResolvedValueOnce({
      data: { board: [[[null]]], current_player: "X", winner: null },
    });

    const res = await axios.get("/api/game/123/state");
    expect(res.data.current_player).toBe("X");
  });
});
