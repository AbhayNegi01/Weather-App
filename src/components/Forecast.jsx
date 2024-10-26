import useWeatherStore from "../store/store";

const Forecast = ({ type }) => {
    
    const hourlyData = useWeatherStore((state) => state.hourlyData);
    const dailyData = useWeatherStore((state) => state.dailyData);

    const forecastData = type === 'hourly' ? hourlyData : dailyData;

    if (!forecastData) return null;

    return (
        <div className='mx-8'>
            <div className='flex items-center justify-start mt-6'>
                <p className='font-medium uppercase'>
                    {type === 'hourly' ? '3 hours step forecast' : '5 day forecast'}
                </p>
            </div>
            <hr className='my-1'/>
            <div className='flex items-center justify-between'>
                {forecastData.map((data, index) => (
                    <div key={index} className='flex flex-col items-center justify-center'>
                        <p className='font-light text-sm'>{data.title}</p>
                        <img 
                        src={data.icon}
                        alt="weather icon" 
                        className='w-12 my-1'
                        />
                        <p className='font-light text-sm'>{data.temp.toFixed()}°</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Forecast