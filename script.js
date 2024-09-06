function sendCommand(command) {
    fetch('http://<RaspberryPi_IP>/api/printer/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: command })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Command sent successfully:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
