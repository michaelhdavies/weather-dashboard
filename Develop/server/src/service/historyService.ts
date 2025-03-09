import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';

// DONE: Define a City class with name and id properties
class City {
  constructor(
    public name: string,
    public id: string,
  ) {}
};

// DONE: Complete the HistoryService class
class HistoryService {
  // DONE: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  };

  // DONE: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  };

  // DONE: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      };
      console.log(`Cities Returned: ${parsedCities}`);
      return parsedCities;
    });
  };

  // DONE: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('City cannot be blank');
    };
    const newCity: City = { name: city, id: uuidv4() };
    const output = await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)) {
          return cities;
        }
        const writeData = [...cities, newCity];
        console.log(`Data to be Written: ${writeData}`);
        return writeData;
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
      console.log(`New City Returned: ${output}`);
      return output;
  };

  // * BONUS DONE: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
      .then((cities) => cities.filter((city) => city.id !== id))
      .then((filteredCities) => this.write(filteredCities));
  };
};

export default new HistoryService();
