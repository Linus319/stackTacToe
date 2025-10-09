import random

class Game:
    def __init__(self):
        self.board = [[[None for _ in range(3)] for _ in range(3)] for _ in range(3)]
        self.current_player = 'X'
        self.winner = None
        self.player_x = None
        self.player_o = None
        self.status = "waiting"
        self.player_types = {}
        self.win_positions = None
    

    def make_move(self, x, y, z):
        if self.winner or self.board[x][y][z] is not None:
            return False
        self.board[x][y][z] = self.current_player
        if self.check_winner(x, y, z):
            self.winner = self.current_player
        else:
            self.current_player = 'O' if self.current_player == 'X' else 'X'
            self.win_positions = None
        return True


    def check_winner(self, x, y, z):
        player = self.board[x][y][z]

        if all(self.board[i][y][z] == player for i in range(3)):
            self.win_positions = [(i, y, z) for i in range(3)]
            return True

        if all(self.board[x][i][z] == player for i in range(3)):
            self.win_positions = [(x, i, z) for i in range(3)]
            return True

        if all(self.board[x][y][i] == player for i in range(3)):
            self.win_positions = [(x, y, i) for i in range(3)]
            return True

        if x == y and all(self.board[i][i][z] == player for i in range(3)):
            self.win_positions = [(i, i, z) for i in range(3)]
            return True
        if x + y == 2 and all(self.board[i][2-i][z] == player for i in range(3)):
            self.win_positions = [(i, 2-i, z) for i in range(3)]
            return True
        if x == z and all(self.board[i][y][i] == player for i in range(3)):
            self.win_positions = [(i, y, i) for i in range(3)]
            return True
        if x + z == 2 and all(self.board[i][y][2-i] == player for i in range(3)):
            self.win_positions = [(i, y, 2-i) for i in range(3)]
            return True
        if y == z and all(self.board[x][i][i] == player for i in range(3)):
            self.win_positions = [(x, i, i) for i in range(3)]
            return True
        if y + z == 2 and all(self.board[x][i][2-i] == player for i in range(3)):
            self.win_positions = [(x, i, 2-i) for i in range(3)]
            return True

        if (x == y == z) and all(self.board[i][i][i] == player for i in range(3)):
            self.win_positions = [(i, i, i) for i in range(3)]
            return True
        if (x + y + z == 4) and all(self.board[i][2-i][2-i] == player for i in range(3)):
            self.win_positions = [(i, 2-i, 2-i) for i in range(3)]
            return True
        if (x == y and x + z == 2) and all(self.board[i][i][2-i] == player for i in range(3)):
            self.win_positions = [(i, i, 2-i) for i in range(3)]
            return True
        if (x + y == 2 and x == z) and all(self.board[i][2-i][i] == player for i in range(3)):
            self.win_positions = [(i, 2-i, i) for i in range(3)]
            return True
        if (x + y == 2 and y == z) and all(self.board[2-i][i][i] == player for i in range(3)):
            self.win_positions = [(2-i, i, i) for i in range(3)]
            return True

        return False


    def is_winning_move(self, player, x, y, z):
        self.board[x][y][z] = player
        win = self.check_winner(x, y, z)
        self.board[x][y][z] = None
        return win


    def robot_move(self):
        empty_cells = [(x, y, z)
                    for x in range(3)
                    for y in range(3)
                    for z in range(3)
                    if self.board[x][y][z] is None]

        if not empty_cells:
            return False

        for x, y, z in empty_cells:
            if self.is_winning_move('O', x, y, z):
                self.make_move(x, y, z)
                return True

        for x, y, z in empty_cells:
            if self.is_winning_move('X', x, y, z):
                self.make_move(x, y, z)
                return True

        x, y, z = random.choice(empty_cells)
        self.make_move(x, y, z)
        return True