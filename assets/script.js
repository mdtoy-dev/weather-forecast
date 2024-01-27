var searchForm = $("#search-form");
var searchHistory = []

function displayResults(event) {
    event.preventDefault();

    var city = $("#search-input").val().trim();
    var locationQuery = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=479254904dda93ec8b70e3a77b647e14";

    fetch(locationQuery)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=479254904dda93ec8b70e3a77b647e14";
            fetch(queryURL)
                .then(function (response) {
                    return response.json();
                }).then(function (weatherData) {
                    console.log(weatherData);

                    $("#forecast").empty();
                    $("#today").empty();

                    var todayDiv = $("<div>");
                    var cityName = $("<h1>");
                    cityName.text(weatherData.city.name + " " + dayjs(weatherData.list[0].dt_txt).format("DD/MM/YYYY"));
                    todayDiv.prepend(cityName);

                    var weatherIcon = $("<img>");
                    var iconCodeToday = weatherData.list[0].weather[0].icon;
                    weatherIcon.attr("src", "http://openweathermap.org/img/wn/" + iconCodeToday + ".png");
                    todayDiv.append(weatherIcon);

                    var todayTemp = $("<p>");
                    todayTemp.text("Temp: " + (weatherData.list[0].main.temp - 273.15).toFixed(2) + " °C");
                    todayDiv.append(todayTemp);

                    var todayWind = $("<p>");
                    todayWind.text("Wind: " + weatherData.list[0].wind.speed + " KPH");
                    todayDiv.append(todayWind);

                    var todayHumidity = $("<p>");
                    todayHumidity.text("Humidity: " + weatherData.list[0].main.humidity + " %");
                    todayDiv.append(todayHumidity);

                    $("#today").css("border", "2px solid black");
                    $("#today").prepend(todayDiv);
                    

                    // Display forecast
                    for (let i = 39; i > 0; i -= 8) {
                        var forecastDiv = $("<div>");
                        forecastDiv.addClass("col");

                        var date = $("<h1>");
                        date.text(dayjs(weatherData.list[i].dt_txt).format("DD/MM/YYYY"));
                        forecastDiv.prepend(date);

                        var weatherIcon = $("<img>");
                        var iconCode = weatherData.list[i].weather[0].icon;
                        weatherIcon.attr("src", "http://openweathermap.org/img/wn/" + iconCode + ".png");
                        forecastDiv.append(weatherIcon);

                        var temp = $("<p>");
                        temp.text("Temp: " + (weatherData.list[i].main.temp - 273.15).toFixed(2) + " °C");
                        forecastDiv.append(temp);

                        var wind = $("<p>");
                        wind.text("Wind: " + weatherData.list[i].wind.speed + " KPH");
                        forecastDiv.append(wind);

                        var humidity = $("<p>");
                        humidity.text("Humidity: " + weatherData.list[i].main.humidity + " %");
                        forecastDiv.append(humidity);

                        $("#forecast").prepend(forecastDiv);
                    }

                });
        });

    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    displaySearchHistory(); 
}

function displaySearchHistory() {
    var historyDiv = $("#history");
    historyDiv.empty();

    if (searchHistory.length > 0) {
        for (var i = 0; i < searchHistory.length; i++) {
            var historyButton = $("<button>");
            historyButton.text(searchHistory[i]);
            historyButton.on("click", function () {
                $("#search-input").val($(this).text());
                searchForm.submit(); 
            });
            historyDiv.append(historyButton);
        }
    } else {
        historyDiv.text("No search history available.");
    }
}


searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
displaySearchHistory(); 
console.log(searchHistory);

searchForm.on("submit", displayResults);
