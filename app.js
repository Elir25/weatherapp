// Go to this URL and register https://openweathermap.org/appid
// Get your API KEY (appid)
const APIkey = 'a8d7b80c35404e2394635a4dcc55471b';
const baseURL = 'https://api.weatherbit.io/v2.0/current?';


const getUserPosition = () => {
    console.log('from getUserForPosition');
    navigator.geolocation.getCurrentPosition((location) => onPositionReceived(location), (error) => onPositionDenied(error));
}

const onPositionReceived = (position) => {
    const { coords: { latitude, longitude } } = position;
    callWeatherAPIWithCoords(latitude, longitude);
};

const onPositionDenied = (error) => {
    const { message } = error;
    console.error(error);
    const notificationDivs = document.getElementsByClassName('notification');
    const notification = notificationDivs[0];
    notification.style.display = 'block';

    const p = document.createElement('p');
    p.innerText = message;

    notification.appendChild(p);
};

const callWeatherAPIWithCoords = (latitude, longitude) => {
    const URL = `${baseURL}lat=${latitude}&lon=${longitude}&key=${APIkey}`;

    const call = fetch(URL);
    // if the call goes right || 200;
    call.then((response) => response.json()).then((weatherInfo) => showWeatherInfo(weatherInfo.data[0]));
    // if something goes wrong || 403, 404, 402...
    call.catch((error) => console.error('Something went wrong', error));
}

const showWeatherInfo = (weatherObject) => {
  console.log('weather Info Element', weatherObject);

  // the icon, temperature value, temperature description, location (city, country)
  const { 
      city_name, 
      country_code,
      temp,
      weather: { description, icon } 
    } = weatherObject;

  const descriptionP =  document.querySelector('.temperature-description p');
  descriptionP.innerText = description;

  const locationP =  document.querySelector('.location p');
  locationP.innerText = `${city_name}, ${country_code}`;

  const temperatureValueP =  document.querySelector('.temperature-value p');
  temperatureValueP.innerHTML = `${temp}° <span>C</span>`;
  
  const weatherIconImg =  document.querySelector('.weather-icon img');
  const iconWithoutTheFirstLetter = icon.slice(1);
  weatherIconImg.setAttribute('src', `icons/${iconWithoutTheFirstLetter}.png`);

};

getUserPosition();