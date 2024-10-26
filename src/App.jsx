import Forecast from "./components/Forecast"
import Input from "./components/Input"
import TempDetails from "./components/TempDetails"
import TimeLocation from "./components/TimeLocation"
import useWeatherStore from "./store/store"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function App() {

  const { weatherData, error, loading } = useWeatherStore()

  return (
    <div className='bg-gradient-to-tr from-blue-900 via-blue-800 to-black/40 min-h-screen py-8 dark:from-gray-900 dark:via-gray-800 dark:to-black'>
        <div className='w-full max-w-3xl mx-auto shadow-lg rounded-lg px-4 py-3 bg-gradient-to-br from-cyan-600 to-blue-700 text-white dark:from-gray-600 dark:to-black'>
          <h1 className="text-2xl font-semibold text-center my-2">Weather App</h1>
          <Input />
          {loading && <div className="ml-[360px] mb-6"><AiOutlineLoading3Quarters size={20} /></div>}
            
          {error && <p className="text-red-400 text-center">{error}</p>}

          {weatherData && (
          <>
            <TimeLocation />
            <TempDetails />
            <Forecast type="hourly" />
            <Forecast type="daily" />
          </>)}

          <p className="text-sm text-gray-400 mt-10">
            &copy; Copyright 2024. All Rights Reserved by Abhay Negi.
          </p>
        </div>
    </div>
  )
}

export default App
