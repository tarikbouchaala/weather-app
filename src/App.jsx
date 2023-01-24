import rain from './assets/images/rain.jpg'
import clear from './assets/images/clear.jpg'
import clear_night from './assets/images/clear_night.jpg'
import cloudy from './assets/images/cloudy.jpg'
import mist from './assets/images/mist.jpg'
import snow from './assets/images/snow.jpg'
import thunderstorm from './assets/images/thunderstorm.jpg'
import black_clouds from './assets/images/black_clouds.jpg'

import { useEffect, useState, useRef } from 'react';
import './App.css';
import { toast } from 'react-toastify';
import axios from "axios";

import { DateTime } from 'luxon'
import { ForecastWeather } from './components/ForecastWeather'
import { CurrentWeather } from './components/CurrentWeather'

export const formatSecondsToDayName = (s, zone, format = "cccc") => DateTime.fromSeconds(s).setZone(zone).toFormat(format)
export const formatSecondsToDate = (s, zone, format = "dd LLL") => DateTime.fromSeconds(s).setZone(zone).toFormat(format)
export const formatSecondsToTime = (s, zone, format = "HH:mm a") => DateTime.fromSeconds(s).setZone(zone).toFormat(format)
export const formatSecondsToTimeForecast = (s, zone, format = "hh a") => DateTime.fromSeconds(s).setZone(zone).toFormat(format)
export const formatSecondsToFullDate = (s, zone, format = "cccc,dd LLL yyyy' | Local time: 'HH:mm a") => DateTime.fromSeconds(s).setZone(zone).toFormat(format)

function App() {
  const [unit, setUnit] = useState(null)
  const [lon, setLon] = useState(-5.3724)
  const [lat, setLat] = useState(35.5711)
  const [dataForecast, setDataForecast] = useState()
  const [dataCurrent, setDataCurrent] = useState()
  const [timeZone, setTimeZone] = useState()
  const [currentState, setCurrentState] = useState({})
  const [forecastState, setForecastState] = useState({})

  //Change Background
  const backgroundRef = useRef()

  //For Use Location

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      setLat(`${latitude}`)
      setLon(`${longitude}`)
    })
  }

  //For Fetching data each time the logitude and latitude changes

  useEffect(() => {
    if (lon !== null && lat !== null) {

      //Getting Timezone

      const options = {
        method: 'GET',
        url: 'https://geocodeapi.p.rapidapi.com/GetTimezone',
        params: { latitude: lat, longitude: lon },
        headers: {
          'X-RapidAPI-Key': '14f69d9750msh7e966fb3457c71ap1eb6d5jsn982a6d487934',
          'X-RapidAPI-Host': 'geocodeapi.p.rapidapi.com'
        }
      };
      const getTimeZone = async () => {
        const response = axios.request(options)
        return (await response).data
      }
      getTimeZone().then(data => {
        setTimeZone(data)
      })

      //Setting dataForecast 

      let weatherApiLinkForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}`
      let weatherApiLinkCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}`
      if (unit !== null) {
        weatherApiLinkForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}&units=${unit}`
        weatherApiLinkCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}&units=${unit}`
      }
      const getDataForeCast = async () => {
        const response = await axios.get(weatherApiLinkForecast)
        return response.data
      }
      getDataForeCast().then(data => setDataForecast(data))

      //Setting dataCurrent

      const getDataCurrent = async () => {
        const response = await axios.get(weatherApiLinkCurrent)
        return response.data
      }
      getDataCurrent().then(data => {
        setDataCurrent(data)
        toast.success(`You searched for ${data.name}, ${data.sys.country}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })

    }

  }, [lon, lat, unit])

  //Changing degree Unit

  const handleUnit = (unit) => {
    setUnit(unit)
    toast.info(`You Changed unit to ${unit === "metric" ? 'Celcius' : unit === "imperial" ? 'Farenheit' : 'Kelvin'}`, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  //For handling the searched city

  //functions to manipulate forecast data

  function getForecastHoursArray(data) {
    let date = new Date()
    let day = ''
    if (date.getDate() >= 1 && date.getDate() <= 9) {
      day = "0" + date.getDate()
    }
    else {
      day = date.getDate()
    }
    let today = date = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + day
    let todayWeather = []
    for (let i of data) {
      if (i['dt_txt'].split(' ')[0] == today) {
        todayWeather.push(i)
      }
    }
    if (todayWeather.length > 0) {
      let indexOfTodayWeather
      for (let i in data) {
        if (i == data.indexOf(todayWeather[0])) {
          indexOfTodayWeather = i
        }
      }
      let datesTable = data.slice(indexOfTodayWeather, 3)
      return datesTable
    } else {
      return data.slice(0, 3)
    }
  }
  function getForecastDaysArray(data) {
    let datesTable = []
    for (let i of data) {
      if (i['dt_txt'].split(' ')[1] === "12:00:00") {
        datesTable.push(i)
      }
    }
    return datesTable
  }

  useEffect(() => {

    if (dataCurrent !== undefined && dataForecast !== undefined) {
      const { dt: date, main: { temp, feels_like, humidity, temp_max, temp_min }, sys: { sunrise, sunset, country }, name, weather: [{ main, icon }], wind: { speed } } = dataCurrent
      setCurrentState({ date: date, temp: temp, feels_like: feels_like, humidity: humidity, temp_max: temp_max, temp_min: temp_min, sunrise: sunrise, sunset: sunset, country: country, name: name, description: main, icon: icon, windSpeed: speed })
      setForecastState({ foreacastHours: getForecastHoursArray(dataForecast.list), forecastDays: getForecastDaysArray(dataForecast.list) })
    }
  }, [dataCurrent])

  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'https://geocodeapi.p.rapidapi.com/GetTimezone',
      params: { latitude: lat, longitude: lon },
      headers: {
        'X-RapidAPI-Key': '14f69d9750msh7e966fb3457c71ap1eb6d5jsn982a6d487934',
        'X-RapidAPI-Host': 'geocodeapi.p.rapidapi.com'
      }
    };
    const getTimeZone = async () => {
      const response = axios.request(options)
      return (await response).data
    }
    getTimeZone().then(data => {
      setTimeZone(data)
    })

    let weatherApiLinkForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}`
    let weatherApiLinkCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}`

    const getDataForeCast = async () => {
      const response = await axios.get(weatherApiLinkForecast)
      return response.data
    }
    getDataForeCast().then(data => setDataForecast(data))

    //Setting dataCurrent

    const getDataCurrent = async () => {
      const response = await axios.get(weatherApiLinkCurrent)
      return response.data
    }
    getDataCurrent().then(data => setDataCurrent(data))
  }, [])

  //when unit changes

  useEffect(() => {
    if (lon !== null && lat !== null) {
      let weatherApiLinkForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}`
      let weatherApiLinkCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}`
      if (unit !== null) {
        weatherApiLinkForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}&units=${unit}`
        weatherApiLinkCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=7319155358ec2528936b7d35447a1c72&lat=${lat}&lon=${lon}&units=${unit}`
      }

      //setting dataForecast

      const getDataForeCast = async () => {
        const response = await axios.get(weatherApiLinkForecast)
        return response.data
      }
      getDataForeCast().then(data => setDataForecast(data))

      //Setting dataCurrent

      const getDataCurrent = async () => {
        const response = await axios.get(weatherApiLinkCurrent)
        return response.data
      }
      getDataCurrent().then(data => setDataCurrent(data))

    }
  }, [unit])
  const changeCity = (lat, lon) => {
    setLat(lat)
    setLon(lon)
  }
  useEffect(() => {
    if (currentState.icon === "09d" || currentState.icon === "09n" || currentState.icon == "10d" || currentState.icon == "10n") {
      backgroundRef.current.style.backgroundImage = `url(${rain})`
    }
    else if (currentState.icon === "11d" || currentState.icon === "11n") {
      backgroundRef.current.style.backgroundImage = `url(${thunderstorm})`
    }
    else if (currentState.icon === "13d" || currentState.icon === "13n") {
      backgroundRef.current.style.backgroundImage = `url(${snow})`
    }
    else if (currentState.icon === "50d" || currentState.icon === "50n") {
      backgroundRef.current.style.backgroundImage = `url(${mist})`
    }
    else {
      if (currentState.icon === "01n" || currentState.icon === "02n" || currentState.icon === "03n") {
        backgroundRef.current.style.backgroundImage = `url(${clear_night})`
      }
      else if (currentState.icon === "02d") {
        backgroundRef.current.style.backgroundImage = `url(${cloudy})`
      }
      else if (currentState.icon === "03d" || currentState.icon === "04d" || currentState.icon === "04n") {
        backgroundRef.current.style.backgroundImage = `url(${black_clouds})`
        backgroundRef.current.style.backgroundPositionY = 'center'
      }
      else {
        backgroundRef.current.style.backgroundImage = `url(${clear})`
        backgroundRef.current.style.backgroundPositionY = 'center'
      }
    }
  }, [currentState])
  const handleOnSearchChange = (searchData) => {
    setLat(searchData.value.split(" ")[0])
    setLon(searchData.value.split(" ")[1])
  };

  return (
    <div className="App">
      <CurrentWeather pressureValues={forecastState.foreacastHours} backgroundRef={backgroundRef} timeZone={timeZone} state={currentState} unit={unit} handleOnSearchChange={handleOnSearchChange} handleLocation={handleLocation} handleUnit={handleUnit} />
      <ForecastWeather state={forecastState} now={currentState} timeZone={timeZone} changeCity={changeCity} />
    </div>
  );
}

export default App;