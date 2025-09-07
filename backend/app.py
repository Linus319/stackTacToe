from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "StackTacToe API is running"})

@app.route('/api/game/new', methods=['POST'])
def new_game():
    return jsonify({"message": "New game created", "gameId": "temp-id"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)