import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { Dog } from '../types/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const handleLogin = async (
  name: string,
  email: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
  setLoginError: Dispatch<SetStateAction<string>>
) => {
  try {
    setIsLoading(true);
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      { name, email },
      { withCredentials: true }
    );
    if (response.data === 'OK') {
      setIsAuthenticated(true);
    }
  } catch (e: unknown) {
    setLoginError(e as string);
  } finally {
    setIsLoading(false);
  }
};

export const fetchBreeds = async (
  setBreeds: Dispatch<SetStateAction<string[]>>
) => {
  try {
    const response = await axios.get(`${BASE_URL}/dogs/breeds`, {
      withCredentials: true,
    });
    setBreeds(response.data);
  } catch (error) {
    console.log(error);
  }
};

export const fetchDogs = async (
  ageRange: number[],
  currentPage: number,
  selectedBreed: string,
  sortOrder: string,
  zipCodes: string[],
  setDogs: Dispatch<SetStateAction<Dog[]>>,
  setIsLoadingDogs: Dispatch<SetStateAction<boolean>>,
  setDogsError: Dispatch<SetStateAction<string>>
) => {
  try {
    setIsLoadingDogs(true);
    const response = await axios.get(`${BASE_URL}/dogs/search`, {
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
      `${BASE_URL}/dogs`,
      response.data.resultIds,
      { withCredentials: true }
    );
    setDogs(dogDetails.data);
  } catch (error) {
    console.log(error);
    setDogsError('Error fetching dogs. Please try agian later.');
  } finally {
    setIsLoadingDogs(false);
  }
};

export const fetchLocations = async (
  enteredZipCode: string,
  setZipCodes: Dispatch<SetStateAction<string[]>>,
  setLocationError: Dispatch<SetStateAction<string>>
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/locations`,
      [enteredZipCode],
      {
        withCredentials: true,
      }
    );

    if (response.data[0] === null) {
      setZipCodes([]);
    } else {
      try {
        const searchResponse = await axios.post(
          `${BASE_URL}/locations/search`,
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
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    setLocationError('Error fetching locations. Please try again later.');
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
    const response = await axios.post(`${BASE_URL}/dogs/match`, favorites, {
      withCredentials: true,
    });

    const matchedId: Match = response.data.match;

    const matchResponse = await axios.post(`${BASE_URL}/dogs/`, [matchedId], {
      withCredentials: true,
    });
    setMatchedDog(matchResponse.data[0]);
  } catch (error) {
    setMatchError(error as string);
  } finally {
    setIsLoadingMatch(false);
  }
};

export const handleLogout = async () => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`, { withCredentials: true });
  } catch (error: unknown) {
    console.log(error);
  }
};
