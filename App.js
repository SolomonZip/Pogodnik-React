import React, { useState, useEffect } from 'react';

const API_KEY = '14e8f0bb8da91fb352ce4c9ac465b0b7'

function App() {
  const [city, setCity] = useState('Москва');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`
      );
      if (!weatherRes.ok) throw new Error('Город не найден');
      const weatherData = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`
      );
      if (!forecastRes.ok) throw new Error('Не удалось загрузить прогноз');
      const forecastData = await forecastRes.json();

      const dailyForecast = forecastData.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      ).slice(0, 5);

      setCurrentWeather(weatherData);
      setForecast(dailyForecast);
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city.trim()) {
      fetchWeather(city);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const formatDate = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Прогноз погоды</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Найти</button>
      </form>

      {loading && <div style={styles.loading}>Загрузка...</div>}
      {error && <div style={styles.error}>Ошибка: {error}</div>}

      {currentWeather && (
        <div style={styles.currentCard}>
          <h2>
            {currentWeather.name}, {currentWeather.sys.country}
          </h2>
          <div style={styles.currentMain}>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt={currentWeather.weather[0].description}
            />
            <div>
              <div style={styles.temp}>{Math.round(currentWeather.main.temp)}°C</div>
              <div style={styles.description}>{currentWeather.weather[0].description}</div>
            </div>
          </div>
          <div style={styles.details}>
            <div>💧 Влажность: {currentWeather.main.humidity}%</div>
            <div>💨 Ветер: {currentWeather.wind.speed} м/с</div>
            <div>🌡️ Ощущается как: {Math.round(currentWeather.main.feels_like)}°C</div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h3 style={styles.forecastTitle}>Прогноз на 5 дней</h3>
          <div style={styles.forecastContainer}>
            {forecast.map((day, index) => (
              <div key={index} style={styles.forecastCard}>
                <div style={styles.forecastDate}>{formatDate(day.dt_txt)}</div>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <div style={styles.forecastTemp}>{Math.round(day.main.temp)}°C</div>
                <div style={styles.forecastDesc}>{day.weather[0].description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '40px',
  },
  input: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '250px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: '20px',
  },
  currentCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '40px',
    textAlign: 'center',
  },
  currentMain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    margin: '20px 0',
  },
  temp: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#e67e22',
  },
  description: {
    fontSize: '18px',
    color: '#555',
    textTransform: 'capitalize',
  },
  details: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    fontSize: '16px',
    color: '#2c3e50',
    flexWrap: 'wrap',
  },
  forecastTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  forecastContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap',
  },
  forecastCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '15px',
    textAlign: 'center',
    flex: '1',
    minWidth: '100px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  forecastDate: {
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#2980b9',
  },
  forecastTemp: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  forecastDesc: {
    fontSize: '14px',
    color: '#555',
    textTransform: 'capitalize',
  },
};

export default App;
