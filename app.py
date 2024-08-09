from flask import Flask, request, jsonify
import os

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/send_command', methods=['POST'])
def send_command():
    data = request.get_json()
    command = data.get('command')

    if command:
        # Here you would send the command to Klipper, this is just an example
        print(f"Sending command to Klipper: {command}")
        # Example: os.system(f'echo "{command}" > /tmp/printer')  # Adjust to your setup

        return jsonify({'status': 'success', 'command': command})
    else:
        return jsonify({'status': 'error', 'message': 'No command provided'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
