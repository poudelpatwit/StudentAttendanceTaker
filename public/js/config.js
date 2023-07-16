let url;
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    url = 'http://localhost:3000'; // replace with your development server url
} else {
    url = 'https://enormous-oil-speedwell.glitch.me'; // replace with your production server url
}
