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
        player = self.board[x][y][z]

        # Check row along X
        if all(self.board[i][y][z] == player for i in range(3)):
            return True
        # Check column along Y
        if all(self.board[x][i][z] == player for i in range(3)):
            return True
        # Check depth along Z
        if all(self.board[x][y][i] == player for i in range(3)):
            return True

        # Check diagonals on planes if on them
        if x == y and all(self.board[i][i][z] == player for i in range(3)):
            return True
        if x + y == 2 and all(self.board[i][2-i][z] == player for i in range(3)):
            return True
        if x == z and all(self.board[i][y][i] == player for i in range(3)):
            return True
        if x + z == 2 and all(self.board[i][y][2-i] == player for i in range(3)):
            return True
        if y == z and all(self.board[x][i][i] == player for i in range(3)):
            return True
        if y + z == 2 and all(self.board[x][i][2-i] == player for i in range(3)):
            return True

        # # Check space diagonals
        # if (x == y == z) and all(self.board[i][i][i] == player for i in range(3)):
        #     return True
        # if (x + y + z == 6) and all(self.board[i][2-i][2-i] == player for i in range(3)):
        #     return True
        # if (x == y and x + z == 2) and all(self.board[i][i][2-i] == player for i in range(3)):
        #     return True
        # if (x + y == 2 and x == z) and all(self.board[i][2-i][i] == player for i in range(3)):
        #     return True

        return False