import React, { useCallback, useState, useEffect } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import { BsFillMoonFill, BsFillSunFill} from "react-icons/bs";
import { TbTemperatureCelsius, TbTemperatureFahrenheit } from "react-icons/tb";
import useWeatherStore from "../store/store";

const Input = () => {
    const [input, setInput] = useState('');
    const fetchWeatherForecast = useWeatherStore((state) => state.fetchWeatherForecast);
    const toggleMetric = useWeatherStore((state) => state.toggleMetric);
    const toggleTheme = useWeatherStore((state) => state.toggleTheme);
    const isCelsius = useWeatherStore((state) => state.isCelsius);
    const theme = useWeatherStore((state) => state.theme);
    const city = useWeatherStore((state) => state.city);
    const setCity = useWeatherStore((state) => state.setCity);

    const handleSubmit = useCallback((e) => {
        e.preventDefault;
        if(input.trim() === '') return;
        setCity(input);
        fetchWeatherForecast(input);
        setInput('');
    }, [input, fetchWeatherForecast]);

    const handleCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCity({lat: latitude, lon: longitude})
                fetchWeatherForecast({lat: latitude, lon: longitude});
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }, [fetchWeatherForecast]);

    const handleToggleMetric = () => {
        toggleMetric();
        fetchWeatherForecast(city); 
    }

    useEffect(() => {
        const htmlElement = document.documentElement.classList;
        if (theme === 'dark') {
            htmlElement.add('dark');
            htmlElement.remove('light');
        } else {
            htmlElement.add('light');
            htmlElement.remove('dark');
        }
    }, [theme]);


  return (
    <div className="flex flex-row justify-center my-6 mx-6">
        <div className="flex w-3/4 items-center justify-center space-x-11">
            <input 
            type="text"
            placeholder="search by city...."
            className="text-gray-500 text-xl font-light p-2 w-full max-w-md shadow-xl rounded-lg capitalize outline-none placeholder:lowercase"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />
            <BiSearch onClick={handleSubmit} size={35} className="cursor-pointer transition ease-out hover:scale-125"/>
            <BiCurrentLocation onClick={handleCurrentLocation} size={35} className="cursor-pointer transition ease-out hover:scale-125"/>
        </div>
        <div className="flex w-1/4 items-center justify-center space-x-11">
            <button 
            onClick={handleToggleMetric}
            className="text-lg font-medium ml-4 transition ease-out hover:scale-125"
            >
                {isCelsius ? <TbTemperatureCelsius size={30} /> : <TbTemperatureFahrenheit size={30}/>}
            </button>
            <button 
            onClick={toggleTheme}
            className="text-lg font-medium transition ease-out hover:scale-125"
            >
                {theme === 'light' ? <BsFillMoonFill size={25} /> : <BsFillSunFill size={25} />}
            </button>
        </div>
    </div>
  )
}

export default Input