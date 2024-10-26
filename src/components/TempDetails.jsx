import { FaThermometerEmpty } from 'react-icons/fa';
import { BiSolidDropletHalf } from 'react-icons/bi';
import { FiWind } from 'react-icons/fi'
import { GiSunrise, GiSunset } from 'react-icons/gi'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import useWeatherStore from '../store/store';

const TempDetails = () => {

  const weatherData = useWeatherStore((state) => state.weatherData);
  const isCelsius = useWeatherStore((state) => state.isCelsius);

  if (!weatherData) return null;

  const {
      temp,
      feels_like,
      temp_min,
      temp_max,
      humidity,
      speed,
      main,
      description,
      icon,
      sunrise,
      sunset
  } = weatherData;

  const verticalIcons = [
    {
      id:1,
      Icon: FaThermometerEmpty,
      title: "Real Feel:",
      value: `${feels_like.toFixed()}°`
    },
    {
      id:2,
      Icon: BiSolidDropletHalf,
      title: "Humidity:",
      value: `${humidity.toFixed()}%`
    },
    {
      id:3,
      Icon: FiWind,
      title: "Wind:",
      value: `${speed.toFixed()} ${isCelsius ? 'm/s' : 'mph'}`
    }
  ]

  const horizontalIcons = [
    {
      id:1,
      Icon: GiSunrise,
      title: "Sunrise:",
      value: sunrise
    },
    {
      id:2,
      Icon: GiSunset,
      title: "Sunset:",
      value: sunset
    },
    {
      id:3,
      Icon: MdKeyboardArrowUp,
      title: "High:",
      value: `${temp_max.toFixed()}°`
    },
    {
      id:4,
      Icon: MdKeyboardArrowDown,
      title: "Low:",
      value: `${temp_min.toFixed()}°`
    }
  ]
  
  return (
    <div className='mx-8'>
      <div className='flex items-center justify-center py-6 text-xl text-cyan-300 capitalize'>
        <p>{main}</p>
      </div>

      <div className='flex items-center justify-center -mt-5 text-sm text-cyan-300 capitalize'>
        <p>({description})</p>
      </div>

      <div className='flex flex-row items-center justify-between py-3'>
        <img 
        src={icon}
        alt="icon" 
        className='w-20 ml-12'
        />
        <p className='text-4xl'>{temp.toFixed()}°</p>

        <div className='flex flex-col space-y-3 items-start'>
          {verticalIcons.map(({id, Icon, title, value}) => (
            <div key={id} className="flex text-sm items-center justify-center">
              <Icon size={18} />
              <p className='ml-1 font-light'>
                {title}<span className='font-medium ml-1'>{value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-row items-center justify-center space-x-10 text-sm py-3 mt-4'>
        {horizontalIcons.map(({id, Icon, title, value}) => (
          <div key={id} className='flex items-center'>
            <Icon size={30} />
            <p className='font-light ml-1'>
              {title}<span className='font-medium ml-1'>{value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TempDetails