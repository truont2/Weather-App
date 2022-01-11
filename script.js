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
var searched = [];
var cityInput = document.querySelector("#input-city")
var API_ID = "b4e6fa354a73f1aeaf066627b2946d4c";
// card sections
var cards = document.querySelectorAll(".day");

// later remove class d-none from  weather section
// searchButton.addEventListener("click", fetchWeather); 
searchButton.addEventListener('click', thing);

searchedList.addEventListener('click', function(event) {
    if(event.target.matches('.previous')){
        fetchWeather(event.target.textContent)
    }
})


function thing(event) {
    event.preventDefault();
    let city = cityInput.value.trim();

    fetchWeather(city);
}

// function to load past search
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_ID}`)
    .then(function(response) {
        console.log(city);
        if (response.status < 400 && city !== '') {
            return response.json();
        } else {
            return;
        }
        
    })
    .then(function(data) {
        card.classList.remove("d-none");
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&appid=${API_ID}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data1) {
                cityname.textContent = data["name"];
                timeText.textContent = moment().format('l');
                renderCurrentWeather(data1);
                renderForcastWeather(data1);
            })
        })
        cityInput.value = ''
        if(!searched.includes(city) && city !== ''){
            searched.push(city)
            localStorage.setItem('cities', JSON.stringify(searched))
            storage()
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

function storage() {
    searchedList.textContent = '';
    container = JSON.parse(localStorage.getItem('cities'));
    console.log(container);
    container.map( item => {
        if(item !== '') {
            let li = document.createElement('button');
            li.setAttribute('class', 'btn btn-outline bg-secondary text-light col-12 previous my-2');
            li.textContent = item;
            searchedList.append(li);
        }     
    })

    renderLastCity();
}

storage();

function renderLastCity() {
    let lastCityIndex = container.length - 1;
    let lastCity = container[lastCityIndex];
}

