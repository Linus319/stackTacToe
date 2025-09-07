from typing import List, Optional

class Game:
    def __init__(self):
        self.board = [[[None for _ in range(3)] for _ in range(3)] for _ in range(3)]
        self.current_player = 'X'
        self.winner: Optional[str] = None
    
    def make_move(self, x: int, y: int, z: int) -> bool:
        if self.winner or self.board[x][y][z] is not None:
            return False
        self.board[x][y][z] = self.current_player
        if self.check_winner(x, y, z):
            self.winner = self.current_player
        else:
            self.current_player = 'O' if self.current_player == 'X' else 'X'
        return True

    def check_winner(self, x, y, z) -> bool:
        # TODO: implement winnning logic
        return False