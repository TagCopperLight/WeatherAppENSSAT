const URL = "https://api.open-meteo.com/v1/forecast?latitude=48.7326&longitude=-3.4566&hourly=temperature_2m,precipitation_probability,weather_code,surface_pressure,wind_speed_10m,uv_index&timezone=GMT";
const SUNSET_URL = "https://api.sunrisesunset.io/json?lat=48.7326&lng=-3.4566&timezone=Paris&time_format=24";

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

console.log(fetchData(URL));
fetchData(URL).then(data => {
    const today = new Date().toISOString().split('T')[0];
    const filteredData = data.hourly.time.map((time, index) => {
        if (time.startsWith(today)) {
            return {
                time: time,
                temperature: data.hourly.temperature_2m[index],
                precipitation_probability: data.hourly.precipitation_probability[index],
                weather_code: data.hourly.weather_code[index],
                surface_pressure: data.hourly.surface_pressure[index],
                wind_speed: data.hourly.wind_speed_10m[index],
                uv_index: data.hourly.uv_index[index]
            };
        }
    }).filter(entry => entry !== undefined);

    console.log(filteredData);

    console.log(today);
    const todayHour = new Date().toISOString().split('T')[0] + 'T' + new Date().toISOString().split('T')[1].split(':')[0] + ':00';
    const todayLastHour = new Date().toISOString().split('T')[0] + 'T' + (new Date().toISOString().split('T')[1].split(':')[0] - 1) + ':00';

    const todayData = filteredData.find(entry => entry.time === todayHour);
    console.log(todayData);
    const lastHourData = filteredData.find(entry => entry.time === todayLastHour);
    console.log(lastHourData);

    const wind_speed_element = document.getElementById('wind_speed');
    const wind_speed_change_element = document.getElementById('wind_speed_change');
    const wind_speed_change_img = document.getElementById('wind_speed_change_img');

    wind_speed_element.innerHTML = todayData.wind_speed + ' km/h';
    wind_speed_change_element.innerHTML = (todayData.wind_speed - lastHourData.wind_speed).toFixed(1) + ' km/h';
    if ((todayData.wind_speed - lastHourData.wind_speed).toFixed(1) >= 0) {
        wind_speed_change_img.src = 'public/up.svg';
    } else {
        wind_speed_change_img.src = 'public/down.svg';
    }

    const rain_probability_element = document.getElementById('rain_probability');
    const rain_probability_change_element = document.getElementById('rain_probability_change');
    const rain_probability_change_img = document.getElementById('rain_probability_change_img');

    rain_probability_element.innerHTML = todayData.precipitation_probability + '%';
    rain_probability_change_element.innerHTML = (todayData.precipitation_probability - lastHourData.precipitation_probability).toFixed(1) + '%';
    if ((todayData.precipitation_probability - lastHourData.precipitation_probability).toFixed(1) >= 0) {
        rain_probability_change_img.src = 'public/up.svg';
    } else {
        rain_probability_change_img.src = 'public/down.svg';
    }

    const pressure_element = document.getElementById('pressure');
    const pressure_change_element = document.getElementById('pressure_change');
    const pressure_change_img = document.getElementById('pressure_change_img');

    pressure_element.innerHTML = todayData.surface_pressure + ' hPa';
    pressure_change_element.innerHTML = (todayData.surface_pressure - lastHourData.surface_pressure).toFixed(1) + ' hPa';
    if ((todayData.surface_pressure - lastHourData.surface_pressure).toFixed(1) >= 0) {
        pressure_change_img.src = 'public/up.svg';
    } else {
        pressure_change_img.src = 'public/down.svg';
    }

    const uv_index_element = document.getElementById('uv_index');
    const uv_index_change_element = document.getElementById('uv_index_change');
    const uv_index_change_img = document.getElementById('uv_index_change_img');

    uv_index_element.innerHTML = todayData.uv_index;
    uv_index_change_element.innerHTML = (todayData.uv_index - lastHourData.uv_index).toFixed(1);
    if ((todayData.uv_index - lastHourData.uv_index).toFixed(1) >= 0) {
        uv_index_change_img.src = 'public/up.svg';
    } else {
        uv_index_change_img.src = 'public/down.svg';
    }

    const temperature_element = document.getElementById('temperature');

    temperature_element.innerHTML = todayData.temperature + '°C';

    const fourNextHours = [];
    const currentDate = new Date();

    for (let i = 1; i <= 4; i++) {
        const nextHour = new Date(currentDate.getTime() + i * 60 * 60 * 1000);
        fourNextHours.push(nextHour.toISOString().split('T')[0] + 'T' + nextHour.toISOString().split('T')[1].split(':')[0] + ':00');
    }

    const nextHoursData = filteredData.filter(entry => fourNextHours.includes(entry.time));

    var nextPrecipitation = nextHoursData.map(entry => entry.precipitation_probability);

    const hour_1 = document.getElementById('hour-1');
    const bar_1 = document.getElementById('bar-1');
    const proba_1 = document.getElementById('proba-1');
    const hour_2 = document.getElementById('hour-2');
    const bar_2 = document.getElementById('bar-2');
    const proba_2 = document.getElementById('proba-2');
    const hour_3 = document.getElementById('hour-3');
    const bar_3 = document.getElementById('bar-3');
    const proba_3 = document.getElementById('proba-3');
    const hour_4 = document.getElementById('hour-4');
    const bar_4 = document.getElementById('bar-4');
    const proba_4 = document.getElementById('proba-4');

    hour_1.innerHTML = new Date(fourNextHours[0]).toISOString().split('T')[1].split(':')[0] + ':00';
    bar_1.style.width = nextPrecipitation[0] + '%';
    proba_1.innerHTML = nextPrecipitation[0] + '%';

    hour_2.innerHTML = new Date(fourNextHours[1]).toISOString().split('T')[1].split(':')[0] + ':00';
    bar_2.style.width = nextPrecipitation[1] + '%';
    proba_2.innerHTML = nextPrecipitation[1] + '%';

    hour_3.innerHTML = new Date(fourNextHours[2]).toISOString().split('T')[1].split(':')[0] + ':00';
    bar_3.style.width = nextPrecipitation[2] + '%';
    proba_3.innerHTML = nextPrecipitation[2] + '%';

    hour_4.innerHTML = new Date(fourNextHours[3]).toISOString().split('T')[1].split(':')[0] + ':00';
    bar_4.style.width = nextPrecipitation[3] + '%';
    proba_4.innerHTML = nextPrecipitation[3] + '%';
});

fetchData(SUNSET_URL).then(data => {
    const sunset = data.results.sunset;
    const sunset_element = document.getElementById('sunset');
    sunset_element.innerHTML = sunset[0] + sunset[1] + ':' + sunset[3] + sunset[4];

    const sunrise = data.results.sunrise;
    const sunrise_element = document.getElementById('sunrise');
    sunrise_element.innerHTML = sunrise[0] + sunrise[1] + ':' + sunrise[3] + sunrise[4];

    const sunset_in_element = document.getElementById('sunset_in');
    const sunrise_in_element = document.getElementById('sunrise_in');

    const currentDate = new Date();
    const sunsetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), sunset[0]*10 + sunset[1], sunset[3]*10 + sunset[4]);
    const sunriseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), sunrise[0]*10 + sunrise[1], sunrise[3]*10 + sunrise[4]);

    const sunsetDiff = sunsetDate - currentDate;
    const sunriseDiff = sunriseDate - currentDate;

    const sunsetDiffInMinutes = Math.floor(sunsetDiff / 60000);
    const sunriseDiffInMinutes = Math.floor(sunriseDiff / 60000);

    const hoursSunset = Math.floor(sunsetDiffInMinutes / 60);
    const minutesSunset = sunsetDiffInMinutes % 60;

    const hoursSunrise = Math.floor(sunriseDiffInMinutes / 60);
    const minutesSunrise = sunriseDiffInMinutes % 60;

    sunset_in_element.innerHTML = hoursSunset + 'h' + minutesSunset + 'm';

    sunrise_in_element.innerHTML = hoursSunrise + 'h' + minutesSunrise + 'm';
});