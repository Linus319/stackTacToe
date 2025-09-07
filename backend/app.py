from flask import Flask, jsonify, request
from flask_cors import CORS
from typing import Optional
import os
import uuid
from dotenv import load_dotenv

from models import Game

load_dotenv()

app = Flask(__name__)
CORS(app)

games = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "StackTacToe API is running"})

@app.route('/api/game/new', methods=['POST'])
def new_game():
    game_id = str(uuid.uuid4())
    games[game_id] = Game()
    return jsonify({"message": "New game created", "gameId": game_id})

@app.route('/api/game/<game_id>/state', methods=['GET'])
def get_game_state(game_id):
    game = games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    return jsonify({
        "board": game.board,
        "current_player": game.current_player,
        "winner": game.winner
    })

@app.route('/api/game/<game_id>/move', methods=['POST'])
def make_move(game_id):
    game = games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    
    data = request.get_json()
    x, y, z = data.get("x"), data.get("y"), data.get("z")

    if x is None or y is None or z is None:
        return jsonify({"error": "Missing coordinates"}), 400

    success = game.make_move(x, y, z)
    if not success:
        return jsonify({"error": "Invalid move"}), 400

    return jsonify({
        "success": True,
        "board": game.board,
        "current_player": game.current_player,
        "winner": game.winner
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)