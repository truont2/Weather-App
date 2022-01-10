var timeText = document.querySelector("#timetext");
var searchButton = document.querySelector("#searchBtn");
var cityname = document.querySelector("#City");
var weatherIconCurrent =document.querySelector(".currentWeather");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#Humidity");
var UV = document.querySelector("#UV");
var card = document.querySelector(".card");
var searchedList = document.querySelector(".list-group");
var searched = {};

// card sections

var cards = document.querySelectorAll(".day");
// later remove class d-none from  weather section
searchButton.addEventListener("click", fetchWeather); 
var inputCity = document.querySelector("#input-city");

// function to load past search
function fetchWeather() {

    var city = document.querySelector("#input-city").value.trim();
    var API_ID = "b4e6fa354a73f1aeaf066627b2946d4c";
    var input = inputCity.value.trim();

    if( input === "") {
        console.log(input);
        return;
    } else {
        card.classList.remove("d-none");
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_ID}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            cityname.textContent = data["name"];
            timeText.textContent = moment().format('l');
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&appid=${API_ID}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data1) {
                    console.log(data1);
                    renderCurrentWeather(data1);
                    renderForcastWeather(data1);
                    storeSearched(data["name"]);
                })
        })
    }

    
}

function renderCurrentWeather(data) {
    let icon = data.current.weather[0].icon;
    weatherIconCurrent.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    temp.textContent = data.current.temp;
    wind.textContent = data.current.wind_speed;
    humidity.textContent = data.current.humidity;
    UV.textContent = data.current.uvi;


}


function renderForcastWeather(data) {
    for(let i = 0; i < 5; i++) {
        var date = moment().add(i + 1, 'days').format('l');
        document.querySelector(`#day-${i + 1}`).textContent = date;

        var icon = document.querySelector(`#icon-${i + 1}`);
        var icon_img = data.daily[i].weather[0].icon;
        icon.src = `http://openweathermap.org/img/wn/${icon_img}@2x.png`

        var temp = document.querySelector(`#temp-${i + 1}`);
        temp.textContent = data.daily[i].temp.day;
        var wind = document.querySelector(`#wind-${i + 1}`);
        wind.textContent = data.daily[i].wind_speed;
        var hum = document.querySelector(`#hum-${i + 1}`);
        hum.textContent = data.daily[i].humidity;
    }
}

// create an object that stores the longitude and latitude of each city by its name or the name itself 
function storeSearched(cityName) {
    var q = 0;
    var searchedCity = document.createElement("button");
    searchedCity.textContent = cityName;
    searchedCity.classList.add("btn", "btn-secondary", "mb-3");
    searchedCity.setAttribute("type", "button");
    searchedCity.setAttribute("data-index", q);
    searchedList.appendChild(searchedCity);
    q++;

    searched[cityName] = cityName;
    localStoring();
}

function localStoring() {
    localStorage.setItem("cities", JSON.stringify(searched));
}

// if button is clicked, we grab its textvalue and use it to grab the corrosponding city name to load up the page data
// seems like stored data is only the most recent search 
// buttons are stored as well. 

function renderStored() {
    var q = 0;
    for(const key in searched) {
        var searchedCity = document.createElement("button");
        searchedCity.textContent = key;
        searchedCity.classList.add("btn", "btn-secondary", "mb-3");
        searchedCity.setAttribute("type", "button");
        searchedCity.setAttribute("data-index", q);
        searchedList.appendChild(searchedCity);
        q++;
    }
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        searched = storedCities;
    }

    renderStored();
}

init();
console.log(searched);