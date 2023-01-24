import logo from '../assets/images/logo.jpg';
import '../'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTemperatureThreeQuarters, faDroplet, faWind, faSun, faArrowUp, faArrowDown, faWater } from '@fortawesome/free-solid-svg-icons';
import Search from './Search';
import { formatSecondsToTime, formatSecondsToFullDate } from '../App';

export function CurrentWeather(props) {
  return (<div className='CurrentWeather'>
    <div className="header">
      <img src={logo} alt="Logo" /><span className='title'>GuessWeather</span>
    </div>
    <div className="CurrentWeatherResult" ref={props.backgroundRef}>
      <div className="overlay"></div>
      <div className="main">
        <div className="searchArea">
          <div className="input">
            <Search onSearchChange={props.handleOnSearchChange} />
          </div>
          <div className="gps" onClick={props.handleLocation}>
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div className="units">
            <button className={props.unit === "metric" ? 'active' : undefined} onClick={e => props.handleUnit("metric")}>°C</button>
            <span>|</span>
            <button className={props.unit === "imperial" ? 'active' : undefined} onClick={e => props.handleUnit("imperial")}>°F</button>
            <span>|</span>
            <button className={props.unit === null ? 'active' : undefined} onClick={e => props.handleUnit(null)}>°K</button>
          </div>
        </div>
        <div className="searchResult">
          <div className="weather">
            <div className="weatherIconAndDegree">
              <img src={`http://openweathermap.org/img/wn/${props.state.icon !== undefined ? props.state.icon : '01d'}@4x.png`} alt="Icon Weather" />
              <span className='description'>{Math.floor(parseFloat(props.state.temp))}°</span>
            </div>
            <div className="weatherDescription">
              {props.state.description}
            </div>
          </div>
          <div className="weatherStats">
            <div className="city">
              {props.state.name}, {props.state.country}
            </div>
            <div className="feelsLike">
              Feels Like {Math.floor(parseFloat(props.state.feels_like))}°
            </div>
            <div className="minMaxWeatherDegree">
              <div className="maxDegree">
                <FontAwesomeIcon icon={faArrowUp} />
                <span>High: {Math.floor(parseFloat(props.state.temp_max))}°</span>
              </div>
              <span>|</span>
              <div className="minDegree">
                <FontAwesomeIcon icon={faArrowDown} />
                <span>Low: {Math.floor(parseFloat(props.state.temp_min))}°</span>
              </div>
            </div>
            <div className="sunRiseAndSet">
              <div className="sunRise">
                <FontAwesomeIcon icon={faSun} />
                <span>Rise: {props.timeZone !== undefined && formatSecondsToTime(props.state.sunrise, props.timeZone.TimeZoneId)}</span>
              </div>
              <span>|</span>
              <div className="sunSet">
                <FontAwesomeIcon icon={faSun} />
                <span>Set: {props.timeZone !== undefined && formatSecondsToTime(props.state.sunset, props.timeZone.TimeZoneId)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="localTime">
          {props.state.date !== undefined && props.timeZone !== undefined && formatSecondsToFullDate(props.state.date, props.timeZone.TimeZoneId)}
        </div>
      </div>
    </div>
    <div className="moreInfos">
      <div className="infos">
        <div className="infoStats">
          <div className="infoHeader">
            Wind
          </div>
          <div className="infoBody">
            Today Wind Speed
          </div>
          <div className="infoFooter">
            {props.unit === "imperial" ? Math.floor((parseFloat(props.state.windSpeed)) * 1.609344) : Math.floor((parseFloat(props.state.windSpeed)) * 3.6)} km/h
          </div>
        </div>
        <FontAwesomeIcon icon={faWind} />
      </div>
      <div className="infos">
        <div className="infoStats">
          <div className="infoHeader">
            Humidity
          </div>
          <div className="infoBody">
            Today Humidity
          </div>
          <div className="infoFooter">
            {props.state.humidity} %
          </div>
        </div>
        <FontAwesomeIcon icon={faDroplet} />
      </div>
      <div className="infos">
        <div className="infoStats">
          <div className="infoHeader">
            Ground Pressure
          </div>
          <div className="infoBody">
            Today Ground Pressure
          </div>
          <div className="infoFooter">
            {props.pressureValues !== undefined && props.pressureValues[0].main.sea_level} hpa
          </div>
        </div>
        <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
      </div>
      <div className="infos">
        <div className="infoStats">
          <div className="infoHeader">
            Sea Pressure
          </div>
          <div className="infoBody">
            Today Sea Pressure
          </div>
          <div className="infoFooter">
            {props.pressureValues !== undefined && props.pressureValues[0].main.grnd_level} hpa
          </div>
        </div>
        <FontAwesomeIcon icon={faWater} />
      </div>
    </div>
  </div>);
}
