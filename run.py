"from flask import Flask\n\napp = Flask(__name__)\n\n@app.route('/')\ndef home():\n    return 'Train Traffic Control AI - Flask API Running'\n\nif __name__ == '__main__':\n    app.run(debug=True)" 
