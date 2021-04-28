// Go to this URL and register https://openweathermap.org/appid
// Get your API KEY (appid)
const APIkey = 'a8d7b80c35404e2394635a4dcc55471b';
const baseURL = 'https://api.weatherbit.io/v2.0/current?';

const citiesArr = []
citiesArr.push({
    name: "Barcelona",
    latitude: 41.41,
    longitude: 2.19,
});
citiesArr.push({
    name: "Madrid",
    latitude: 40.41,
    longitude: -3.70,
});
citiesArr.push({
    name: "Paris",
    latitude: 48.85,
    longitude: 2.34,
});
//Get the user location
const getUserPosition = () => {
    console.log('from getUserForPosition');
    navigator.geolocation.getCurrentPosition((location) => onPositionReceived(location), (error) => onPositionDenied(error));
}

const onPositionReceived = (position) => {
    const { coords: { latitude, longitude } } = position;
    callWeatherAPIUsingCoords(latitude, longitude, showCurrentWeatherInfo);
}
//a method that shows a message if the position is denied
const onPositionDenied = (error) => {
    const { message } = error;
    console.error(error);
    const notificationDivs = document.getElementsByClassName('notification');
    const notification = notificationDivs[0];
    notification.style.display = 'block';

    const p = document.createElement('p');
    p.innerText = message;

    notification.appendChild(p);
}

//the function that calls the API
const callWeatherAPIUsingCoords = (latitude, longitude, onSucess) => {
    const URL = `${baseURL}lat=${latitude}&lon=${longitude}&key=${APIkey}`;
    const apiCall = fetch(URL);
    //if the call works out
    apiCall.then((response) => response.json()).then((dataInfo) => onSucess(dataInfo.data[0]));
    // if the call desn't work out
    apiCall.catch((error) => console.error('Ooops, this is an error :(', error));
}

//show the info of the weather in the user's city
const showCurrentWeatherInfo = (weatherObject) => {

    const weatherComponent = buildWeatherComponent(weatherObject);
    body = document.querySelector('.current-city');
    body.appendChild(weatherComponent);
}

function buildWeatherComponent(weatherObject) {
//component that is used to show the card with the info
    const {
        city_name,
        country_code,
        temp,
        weather: { description, icon }
    } = weatherObject;

    const divContainer = document.createElement('div');
    divContainer.className = 'container';

    const iconWithoutTheFirstLetter = icon.slice(1);

    divContainer.innerHTML = `
        <div class="app-title">
            <p>Weather</p>
        </div>
        <div class="notification"> </div>
        <div class="weather-container">
            <div class="weather-icon">
                <img src="icons/${iconWithoutTheFirstLetter}.png" alt="">
            </div>
            <div class="temperature-value">
                <p>${temp} °<span>C</span></p>
            </div>
            <div class="temperature-description">
                <p> ${description} </p>
            </div>
            <div class="location">
                <p>${city_name}, ${country_code}</p>
            </div>
        </div>
`
    return divContainer;
}

getUserPosition();//we need to call the function at the end

//cities secction 
const showCitiesWeather = (weatherObject) => {

    const divCities = document.querySelector('.cities');
    const weatherComponent = buildWeatherComponent(weatherObject);
    divCities.appendChild(weatherComponent);
}

function getCities(citiesArr) {
    citiesArr.forEach(city => {
        callWeatherAPIUsingCoords(city.latitude, city.longitude, showCitiesWeather);
    });
}
//input section tnat add a new city given the lat and lon

const formInputB = document.querySelector('#button');
formInputB.addEventListener('click', (event) => {
    event.preventDefault()
    showNewCityWithLatAndLon(citiesArr)
});

function showNewCityWithLatAndLon(citiesArr) {
    //validate the lat and long on the input
    const inputCity = document.querySelector('#city-name');
    const inputLat = document.querySelector('#lat');
    const inputLon = document.querySelector('#lon');

    if (isLatitude(inputLat.value) && isLongitude(inputLon.value)) {
        const newCityOb = { name: inputCity.value, latitude: inputLat.value, longitude: inputLon.value }
        citiesArr.push(newCityOb)
        callWeatherAPIUsingCoords(newCityOb.latitude, newCityOb.longitude, showCitiesWeather);
    } else alert('sorry :(');

}
//function that validate the latitude 
function isLatitude(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
} //function that validate and longitud
function isLongitude(lng) {
    return isFinite(lng) && Math.abs(lng) <= 180;
}

getCities(citiesArr);


