import dotenv from 'dotenv';
dotenv.config();

// DONE: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// DONE: Define a class for the Weather object
class Weather { 
  cityName: string;
  date: string;
  icon: string;
  temp: number; 
  humid: number;
  wind: number;

  constructor(cityName:string, date:string, icon:string, temp: number, humid: number, wind: number) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.temp = temp;
    this.humid = humid;
    this.wind = wind;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // DONE: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  };

  // DONE: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const query: string = this.buildGeocodedQuery();
    try {
      const apiData = await fetch(query);
      const response = await apiData.json();
      console.log(response);
      const cdnData: Coordinates[] = response[0];
      return cdnData;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  };
  // DONE: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {}
  // DONE: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geoUrl = `${this.baseURL}geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
    return geoUrl;
  }
  // DONE: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherUrl = `${this.baseURL}data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return weatherUrl;
  };
  // DONE: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string) {
    try {
      const apiRes = await fetch(query);
      const response = apiRes.json();
      console.log(response);
      return response;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  };
  // DONE: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const destruc = this.fetchAndDestructureLocationData(query);
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    //loop through forecast for 5 days 
    // lofic to grab 1 from the array of 14 and then put it inside the weather array on the front end
    
  }
  // DONE: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchLocationData();

  }
}

export default new WeatherService();
