// Reemplaza 'TU_CLAVE_DE_API' con tu clave de API de OpenWeatherMap
const apiKey = '11e8481ca38ac48b38217347f625590a';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const city= 'vitoria-gasteiz'

async function tiempoActual() {
    try {
      const tiempoResponse = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}`);
      const tiempoJson = await tiempoResponse.json();
      console.log(tiempoJson.list[0]);
      return tiempoJson.list[0];
    } catch (error) {
      console.error('Error en el fetch del tiempo del día actual:', error);
    }
  }

  async function tiempoProximosDias() {
    try {
      const tiempoProximosDiasResponse = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}`);
      const tiempoProximosDiasJson = await tiempoProximosDiasResponse.json();
      console.log(tiempoProximosDiasJson);
      return tiempoProximosDiasJson.list;
    } catch (error) {
      console.error('Error en el fetch del tiempo de los próximos días:', error);
    }
  }

  function agruparTiempoPorDia(tiempoProximosDiasJson) {
    const arrayObjDias = {};
  
    tiempoProximosDiasJson.forEach(pronostico => {
      const date = pronostico.dt_txt.split(' ')[0];
  
      if (!arrayObjDias[date] && Object.keys(arrayObjDias).length < 5) {
        arrayObjDias[date] = {
          date,
          temperatures: {
            min: pronostico.main.temp,
            max: pronostico.main.temp
          },
          weather: pronostico.weather[0].description
        };
      } else if (arrayObjDias[date]) {
        // Actualizar las temperaturas solo si son más altas o más bajas
        arrayObjDias[date].temperatures.min = Math.min(arrayObjDias[date].temperatures.min, pronostico.main.temp);
        arrayObjDias[date].temperatures.max = Math.max(arrayObjDias[date].temperatures.max, pronostico.main.temp);
      }
    });

    console.log("Array objDias",arrayObjDias);
    console.log("Valores Array objDias", Object.values(arrayObjDias));

    //devuelvo un array que contiene solo los valores del objeto, sin las claves (fechas) asociadas.
    return Object.values(arrayObjDias);
  }

  async function datosTiempo() {
    try {
      const datosTiempoActual = await tiempoActual();
      pintarTiempoActual(datosTiempoActual);

      const datosTiempoProximosDias = await tiempoProximosDias();
      const datosAgrupados = agruparTiempoPorDia(datosTiempoProximosDias);
     pintarTiempo5Dias(datosAgrupados);
    } catch (error) {
      console.error('Error getting weather data:', error);
    }
  }

  function pintarTiempoActual(weather) {
    console.log(weather);
    const card = document.getElementById('weather-card')
    const temperatureCelsius = Math.round(weather.main.temp - 273.15)
    const tiempoDescripcion = weather.weather[0].description
    console.log(tiempoDescripcion);
    const tiempoClass = tiempoAClase[tiempoDescripcion]
    const dia = formatSpanishDate(weather.dt_txt.split(' ')[0]);
    console.log(dia);
    // Obtener la hora actual
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const formattedTime = `${currentHour}:${currentMinute}`;

   /*  card.innerHTML = `
      <div class="tiempoHoy">
        <p class="${tiempoClass}"></p>   
        <div>     
        <p class="temperaturaCelsius">${temperatureCelsius}°</p>
        <p class="date">${formattedTime} ${dia.split(',')[0]}</p>
        </div>
      </div>
    `; */

    card.innerHTML += `
    <div class="tiempoHoy">
      <p class="cloudy-clear"></p>   
      <div>     
      <p class="temperaturaCelsius">${temperatureCelsius}°</span>
      <p class="date">${formattedTime} ${dia.split(',')[0]}</p>
      </div>
    </div>
  `;
  }

  function pintarTiempo5Dias(forecast) {
    const div5Days = document.getElementById('dias5');
    forecast.forEach(day => {
      console.log(day);
      const tiempoDescripcion = day.weather
      //const tiempoClass = tiempoAClase[tiempoDescripcion]
      const tiempoClass = 'sunny'
      const minTemperatureCelsius = Math.round(day.temperatures.min - 273.15);
      const maxTemperatureCelsius = Math.round(day.temperatures.max - 273.15);
      div5Days.innerHTML += `
        <div class="${tiempoClass}5"><p>${maxTemperatureCelsius} °C</p><p>${minTemperatureCelsius} °C</p></div>
      `;
    });
  }

  // Mapeo de descripciones a clases CSS
const tiempoAClase = {
  'scattered clouds':'cloudy-clear',
  'few clouds': 'few-cloudy',
  'broken clouds': 'broken-cloudy',
  'overcast clouds' : 'cloudy',
  'light rain' : 'light-rainy'
};

function formatSpanishDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', options);
}

  // Llama a la función principal para mostrar el tiempo
  datosTiempo();
