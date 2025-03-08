// Use this file to test functionality of components in isolation

let city = 'Salt Lake City';
let lat = 40.7608;
let lon = 111.8910;
let APIKey = 'c61bb184935f8c4ea5baef4371282fb3';
let baseURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

console.log(baseURL);