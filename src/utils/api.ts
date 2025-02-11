import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { Dog } from '../pages/DogFeed/DogsFeed';
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

type Match = {
  match: string;
};

export const fetchBreeds = async (
  setBreeds: Dispatch<SetStateAction<string[]>>
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dogs/breeds`, {
      withCredentials: true,
    });
    setBreeds(response.data);
  } catch (e) {
    console.log(e);
  }
};

export const fetchDogs = async (
  ageRange: number[],
  currentPage: number,
  selectedBreed: string,
  sortOrder: string,
  zipCodes: string[],
  setDogs: Dispatch<SetStateAction<Dog[]>>,
  setIsLoadingDogs: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoadingDogs(true);
    const response = await axios.get(`${API_BASE_URL}/dogs/search`, {
      params: {
        breeds: selectedBreed ? [selectedBreed] : [],
        size: 25,
        zipCodes: zipCodes.length > 0 ? zipCodes : [],
        from: currentPage * 25,
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        sort: sortOrder,
      },
      withCredentials: true,
    });

    const dogDetails = await axios.post(
      `${API_BASE_URL}/dogs`,
      response.data.resultIds,
      { withCredentials: true }
    );
    setDogs(dogDetails.data);
  } catch (error) {
    console.error('Error fetching dogs:', error);
  } finally {
    setIsLoadingDogs(false);
  }
};

export const fetchLocations = async (
  enteredZipCode: string,
  setZipCodes: Dispatch<SetStateAction<string[]>>
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/locations`,
      [enteredZipCode],
      {
        withCredentials: true,
      }
    );

    if (response.data[0] === null) {
      setZipCodes([]);
    } else {
      const searchResponse = await axios.post(
        `${API_BASE_URL}/locations/search`,
        {
          states: [response.data[0].state],
          size: 100,
        },
        {
          withCredentials: true,
        }
      );
      const nearbyZipCodes = searchResponse.data.results.map(
        (location: Location) => location.zip_code
      );
      setZipCodes(nearbyZipCodes);
    }
  } catch (e) {
    console.log(e);
  }
};

export const generateMatch = async (
  favorites: string[],
  setIsLoadingMatch: Dispatch<SetStateAction<boolean>>,
  setMatchedDog: Dispatch<SetStateAction<Dog | null>>,
  setMatchError: Dispatch<SetStateAction<string>>
) => {
  try {
    setIsLoadingMatch(true);
    const response = await axios.post(`${API_BASE_URL}/dogs/match`, favorites, {
      withCredentials: true,
    });

    const matchedId: Match = response.data.match;

    const matchResponse = await axios.post(
      `${API_BASE_URL}/dogs/`,
      [matchedId],
      { withCredentials: true }
    );
    setMatchedDog(matchResponse.data[0]);
  } catch (error) {
    setMatchError(error as string);
  } finally {
    setIsLoadingMatch(false);
  }
};
