// Go to this URL and register https://openweathermap.org/appid
// Get your API KEY (appid)
const APIkey = 'a8d7b80c35404e2394635a4dcc55471b';
const baseURL = 'https://api.weatherbit.io/v2.0/current?';

/*const latitude = 6.253130;
const longitude = -75.571027;*/

//5.to get the user actual position and react if it receives it or not 
const getUserPosition = () => {
    console.log('from getUserForPosition');
    //this is an specific method of the browser to find out the user location
    navigator.geolocation.getCurrentPosition((location) => onPositionReceived(location), (error) => onPositionDenied(error));
}

const onPositionReceived = (position) => {
    const { coords: { latitude, longitude } } = position;
    callWeatherAPIUsingCoords(latitude, longitude);
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
const callWeatherAPIUsingCoords = (latitude, longitude) => {
    const URL = `${baseURL}lat=${latitude}&lon=${longitude}&key=${APIkey}`;
    const apiCall = fetch(URL); //1. save it in a variable 
    //2. if the call works out :)
    apiCall.then((response) => response.json()).then((dataInfo) => showWeatherInfo(dataInfo.data[0]));
    //3. if the call goes wrong :(
    apiCall.catch((error) => console.error('Ooops, this is an error :(', error));
}

//7.show the info of the wather in that city(the icon and description are inside the weather section of the object)
const showWeatherInfo = (weatherObject) => {
    console.log('weather info element', weatherObject);
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

}

getUserPosition();//we need to call the function at the end