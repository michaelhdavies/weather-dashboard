import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// DONE: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

// DONE: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: Dayjs | string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number,
    public icon: string,
    public iconDescription: string,
  ) {}
};

// DONE: Complete the WeatherService class
class WeatherService {
  // DONE: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private city = '';
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  };

  // DONE: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('API base URL or API key not found');
      }
      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json()
      );
      console.log(`Location Data Returned: ${response}`);
      return response[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // DONE: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if(!locationData) {
      throw new Error('City not found');
    }
    const { name, lat, lon, country, state } = locationData;
    const coordinates: Coordinates = {
      name,
      lat,
      lon,
      country,
      state,
    };
    console.log(`Destructured Data Returned: ${coordinates}`)
    return coordinates;
  };

  // DONE: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    console.log(`geocodeQuery Returned: ${geocodeQuery}`);
    return geocodeQuery;
  };

  // DONE: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    console.log(`weatherQuery Returned: ${weatherQuery}`);
    return weatherQuery;
  };

  // DONE: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const output = await this.fetchLocationData(this.buildGeocodeQuery()).then((data) => 
      this.destructureLocationData(data)
    );
    console.log(`Fetch and Destructure Returns: ${output}`);
    return output;
  };

  // DONE: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(
        (res) => res.json()
      );
      if (!response) {
        throw new Error('Weather data not found');
      };
      const currentWeather: Weather = this.parseCurrentWeather(
        response.list[0]
      );
      const forecast: Weather[] = this.buildForecastArray(
        currentWeather,
        response.list
      );
      return forecast;
    } catch (err) {
      console.error(err);
      return err;
    };
  };

  // DONE: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format('M/D/YYYY');
    const currentWeather = new Weather(
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main
    );
    console.log(`Current Weather Returned: ${currentWeather}`);
    return currentWeather;
  };

  // DONE: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];
    const filteredWeatherData = weatherData.filter((data: any) => {
      return data.dt_txt.includes('12:00:00');
    });
    for (const day of filteredWeatherData) {
      weatherForecast.push(
        new Weather(
          this.city,
          dayjs.unix(day.dt).format('M/D/YYYY'),
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    }
    console.log(`Weather Forecast Returned: ${weatherForecast}`);
    return weatherForecast;
  };

  // DONE: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      if(coordinates) {
        const weather = await this.fetchWeatherData(coordinates);
        console.log(`Weather Returned: ${weather}`);
        return weather;
      }
      throw new Error('Weather data not found');
    } catch (err) {
      console.error(err);
      throw err;
    };
  };
}

export default new WeatherService();
