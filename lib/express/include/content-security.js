const scriptSRC = [
  "'self'",
  "blob:",
  "'unsafe-inline'",
  "https://code.jquery.com/jquery-3.5.1.slim.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bs-custom-file-input/dist/bs-custom-file-input.js",
  "https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.js",
  "chrome-extension://elgalmkoelokbchhkhacckoklkejnhcd/build/ng-validate.js",
  "https://api.mapbox.com/"
  
];
const styleSRC = [
  "'self'",
  "blob:",
  "'unsafe-inline'",
  "https://fonts.googleapis.com/",
  "https://api.mapbox.com/"
  
];
const connectSRC = [
  "https://api.mapbox.com/",
  "https://events.mapbox.com/"
];
const fontSRC = [
  "'self'",
  "https://fonts.gstatic.com/",
  "https://api.mapbox.com/",
];
const imageSRC = [
  "'self'",
  "blob:",
  "data:",
  "https://res.cloudinary.com/shiftkeycoder-org/",
  "https://api.mapbox.com/",
];
const contentPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: [...connectSRC],
    scriptSrc: [...scriptSRC],
    styleSrc: [ ...styleSRC],
    imgSrc: [...imageSRC],
    fontSrc: [...fontSRC],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}

module.exports = { contentPolicy };