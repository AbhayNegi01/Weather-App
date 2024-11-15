import { create } from 'zustand';
import { DateTime } from 'luxon';

const api_key = String(import.meta.env.VITE_API_KEY)
const base_url = 'https://api.openweathermap.org/data/2.5/'

const useWeatherStore = create((set, get) => ({
    weatherData: null,
    hourlyData: [],
    dailyData: [],
    loading: false,
    isCelsius: true,
    theme: 'light',
    city: '',
    error: null,
    
    setCity: (city) => set({ city }),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    toggleMetric: () => set((state) => ({ isCelsius: !state.isCelsius })),

    toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
    })),

    formatToLocalTime: (secs, offset, format= "cccc, dd LLL yyyy' | Local time: 'hh:mm a" ) => 
        DateTime.fromSeconds(secs + offset, {zone: 'utc'}).toFormat(format),

    iconCodeToUrl: (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`, 

    formattedWeatherData: (data) => {
        const {
            name,
            dt,
            timezone,
            weather,
            coord: { lat, lon },
            main: { temp, feels_like, temp_min, temp_max, humidity },
            sys: { country, sunrise, sunset},
            wind: { speed },
        } = data;

        const {main, description, icon} = weather[0];
        const formattedLocalTime = get().formatToLocalTime(dt, timezone);

        return { 
            temp, 
            feels_like, 
            temp_min, 
            temp_max, 
            humidity,
            name,
            country,
            sunrise: get().formatToLocalTime(sunrise, timezone, 'hh:mm a'),
            sunset: get().formatToLocalTime(sunset, timezone, 'hh:mm a'),
            speed,
            main,
            description,
            icon: get().iconCodeToUrl(icon),
            formattedLocalTime,
            dt,
            timezone,
            lat, 
            lon,
        }
    },

    formattedForecastData: (secs, offset, data) => {
        //hourly
        const hourly = data
        .filter((item) => item.dt > secs)
        .map((item) => ({
            temp: item.main.temp,
            title: get().formatToLocalTime(item.dt, offset, "hh:mm a"),
            icon: get().iconCodeToUrl(item.weather[0].icon),
            date: item.dt_txt,
        }))
        .slice(0, 5);

        //daily
        const daily = data
        .filter((item) => item.dt_txt.slice(-8) === "00:00:00")
        .map((item) => ({
            temp: item.main.temp,
            title: get().formatToLocalTime(item.dt, offset, "ccc"),
            icon: get().iconCodeToUrl(item.weather[0].icon),
            date: item.dt_txt,
        }))

        return { hourly, daily };
    },
    
    fetchWeatherForecast: async(city) => {
        set({loading: true, error: null});
        try {
            const unit = get().isCelsius ? 'metric' : 'imperial';
            //console.log(unit)
            let weatherResponse;
            if (typeof city === 'string') {
                weatherResponse = await fetch(`${base_url}/weather?q=${city}&units=${unit}&appid=${api_key}`);
            } else if (typeof city === 'object') {
                const { lat, lon } = city;
                weatherResponse = await fetch(`${base_url}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${api_key}`);
            }
            if(!weatherResponse.ok) 
                throw new Error('City not found.... or Enter a valid city name....');
            const weatherData = await weatherResponse.json();
            const formattedWeather = get().formattedWeatherData(weatherData);
            //console.log(formattedWeather)
            
            const{ dt, timezone, lat, lon } = formattedWeather;

            const forecastResponse = await fetch(`${base_url}forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${api_key}`);
            if (!forecastResponse.ok)
                throw new Error('Forecast data not found');
            const forecastData = await forecastResponse.json();
            const formattedForecast = get().formattedForecastData(dt, timezone, forecastData.list)
           //console.log(formattedForecast)
            
            set({
                weatherData: formattedWeather,
                hourlyData: formattedForecast.hourly,
                dailyData: formattedForecast.daily,
                loading: false,
            });
        } catch(error) {
            console.log("Failed to fetch data: ", error);
            set({ loading: false, error: error.message, weatherData: null });
        }
    },
}));

export default useWeatherStore;