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

 
const getUserPosition = () => {
    console.log('from getUserForPosition');
    //this is an specific method of the browser to find out the user location
    navigator.geolocation.getCurrentPosition((location) => onPositionReceived(location), (error) => onPositionDenied(error));
}

const onPositionReceived = (position) => {
    const { coords: { latitude, longitude } } = position;
    callWeatherAPIUsingCoords(latitude, longitude, showCurrentWeatherInfo);
}
//5.a method that shows a message if the position is denied
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

//4.the function that calls the API
const callWeatherAPIUsingCoords = (latitude, longitude, onSucess) => {
    const URL = `${baseURL}lat=${latitude}&lon=${longitude}&key=${APIkey}`;
    const apiCall = fetch(URL); 
    //2. if the call works out :)
    apiCall.then((response) => response.json()).then((dataInfo) => onSucess(dataInfo.data[0]));
    //3. if the call goes wrong :(
    apiCall.catch((error) => console.error('Ooops, this is an error :(', error));
}

//7.show the info of the weather in that city(the icon and description are inside the weather section of the object)
const showCurrentWeatherInfo = (weatherObject) => {
    //console.log('weather info element', weatherObject);
    const {
        city_name,
        country_code,
        temp,
        weather: { description, icon }
    } = weatherObject;
    
    const weatherComponent = buildWeatherComponent(weatherObject);
    body = document.querySelector('.current-city');
    body.appendChild(weatherComponent);

}

function buildWeatherComponent(weatherObject) {

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

getCities(citiesArr);


