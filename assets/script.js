var searchInput = $("#search-form")

function displayResults(event) {
    event.preventDefault();

    var city = $("#search-input").val().trim();
    var locationQuery = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=479254904dda93ec8b70e3a77b647e14"
    

    fetch(locationQuery)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        var lat = data[0].lat
        var lon = data[0].lon
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=479254904dda93ec8b70e3a77b647e14"
        fetch(queryURL)
            .then(function(response) {
                return response.json();
            }).then(function(weatherData) {
                console.log(weatherData);
                var cityName = $("<h1>")
                cityName.text(weatherData.city.name +" "+ dayjs(weatherData.list[0].dt_txt).format("DD/MM/YYYY") + weatherData.list[0].weather[0].main)
                $("#today").prepend(cityName)
                var todayTemp = $("<p>")
                todayTemp.text((weatherData.list[0].main.temp - 273.15).toFixed(2) + " °C")
                $("#today").append(todayTemp)
                var todayWind = $("<p>")
                todayWind.text(weatherData.list[0].wind.speed + " KPH")
                $("#today").append(todayWind)
                var todayHumidity = $("<p>")
                todayHumidity.text(weatherData.list[0].main.humidity + " %")
                $("#today").append(todayHumidity)

                for (let i = 39; i > 0; i -= 8) {
                    var forecastDiv = $("<div>")
                    var date = $("<h1>")
                    date.text(dayjs(weatherData.list[i].dt_txt).format("DD/MM/YYYY") + weatherData.list[i].weather[0].main)
                    forecastDiv.prepend(date)  // Use forecastDiv instead of #forecastDiv
                    var temp = $("<p>")
                    temp.text((weatherData.list[i].main.temp - 273.15).toFixed(2) + " °C")
                    forecastDiv.append(temp)  // Use forecastDiv instead of #forecastDiv
                    var wind = $("<p>")
                    wind.text(weatherData.list[i].wind.speed + " KPH")
                    forecastDiv.append(wind)  // Use forecastDiv instead of #forecastDiv
                    var humidity = $("<p>")
                    humidity.text(weatherData.list[i].main.humidity + " %")
                    forecastDiv.append(humidity)  // Use forecastDiv instead of #forecastDiv
                    $("#forecast").prepend(forecastDiv);
                }
            })
    })
}

searchInput.on("submit", displayResults);