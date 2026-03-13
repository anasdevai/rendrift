const http = require('http');

const script = {
    duration: 10,
    background: 'dark-gradient',
    baseStyle: {
        tiltX: 0,
        tiltY: 0,
        borderRadius: 12,
        shadowIntensity: 0.5
    },
    keyframes: [
        {
            time: 0,
            zoom: 1,
            focalX: 50,
            focalY: 50,
            easingIn: 'linear',
            easingOut: 'linear',
            reason: 'start'
        },
        {
            time: 5,
            zoom: 2,
            focalX: 30,
            focalY: 20,
            easingIn: 'ease-in-out',
            easingOut: 'ease-in-out',
            reason: 'zoom'
        },
        {
            time: 10,
            zoom: 1,
            focalX: 50,
            focalY: 50,
            easingIn: 'linear',
            easingOut: 'linear',
            reason: 'end'
        }
    ]
};

const data = JSON.stringify({
    jobId: 'agentra-debug-test',
    renderScript: script
});

const options = {
    hostname: 'localhost',
    port: 4001,
    path: '/render/execute',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Response:', body);
    });
});

req.on('error', (err) => {
    console.error('Error:', err.message);
});

req.write(data);
req.end();
