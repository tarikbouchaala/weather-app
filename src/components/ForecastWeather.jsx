import { Fragment } from 'react';
import { formatSecondsToTimeForecast, formatSecondsToDate, formatSecondsToDayName } from '../App';

export function ForecastWeather(props) {
  return (<div className='ForecastWeather'>
    <div className="favoritesCities">
      <button onClick={e => props.changeCity(35.5711, -5.3724)}>Tétouan</button>
      <button onClick={e => props.changeCity(35.7806, -5.8137)}>Tanger</button>
      <button onClick={e => props.changeCity(35.6166, -5.2752)}>Martil</button>
      <button onClick={e => props.changeCity(33.9911, -6.8401)}>Rabat</button>
    </div>
    <div className="container">
      <div className="threeHoursForecast">
        <div className="day">
          Today
        </div>
        <div className="forecast">
          <div className="now">
            <span className='title'>Now</span>
            <img src={`http://openweathermap.org/img/wn/${props.now.icon !== undefined ? props.now.icon : '01d'}@4x.png`} alt="Icon Weather" />
            <span className='degree'>
              {Math.floor(props.now.temp)}°
            </span>
          </div>
          {props.state.foreacastHours !== undefined && props.state.foreacastHours.map((e, i) => <Fragment key={i}>
            <div className="now">
              <span className='title'>{props.timeZone !== undefined && formatSecondsToTimeForecast(e.dt, props.timeZone.TimeZoneId)}</span>
              <img src={`http://openweathermap.org/img/wn/${e.weather[0].icon}@4x.png`} alt="Icon Weather" />
              <span className='degree'>
                {Math.floor(e.main.temp)}°
              </span>
            </div>
          </Fragment>
          )}
        </div>
      </div>
      <div className="daysFrecast">
        {props.state.forecastDays !== undefined && props.state.forecastDays.map((e, i) => {
          if (i == 0) {
            return <Fragment key={i}>
              <div className="days">
                <div className="details">
                  <div className="day">
                    Tommorow
                  </div>
                  <span className='date'>
                    {props.timeZone !== undefined && formatSecondsToDate(e.dt, props.timeZone.TimeZoneId)}
                  </span>
                </div>
                <div className="degree">
                  {Math.floor(e.main.temp)}°
                </div>
                <img src={`http://openweathermap.org/img/wn/${e.weather[0].icon}@4x.png`} alt="Icon Weather" />
              </div>
            </Fragment>;
          } else {
            return <Fragment key={i}>
              <div className="days">
                <div className="details">
                  <div className="day">
                    {props.timeZone !== undefined && formatSecondsToDayName(e.dt, props.timeZone.TimeZoneId)}
                  </div>
                  <span className='date'>
                    {props.timeZone !== undefined && formatSecondsToDate(e.dt, props.timeZone.TimeZoneId)}
                  </span>
                </div>
                <div className="degree">
                  {Math.floor(e.main.temp)}°
                </div>
                <img src={`http://openweathermap.org/img/wn/${e.weather[0].icon}@4x.png`} alt="Icon Weather" />
              </div>
            </Fragment>;
          }
        })}
      </div>
    </div>
  </div>);
}
