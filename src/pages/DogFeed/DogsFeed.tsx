import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import {
  ArrowDropDown,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Pets,
} from '@mui/icons-material';
import { Slider } from '@mui/material';

import DogCard from '../../components/DogCard/DogCard';
import NavBar from '../../components/NavBar/NavBar';
import PopModal from '../../components/PopModal/PopModal';
import {
  fetchBreeds,
  fetchDogs,
  fetchLocations,
  generateMatch,
} from '../../utils/api';
import './DogsFeed.css';

type DogFeedProps = {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};

const DogsFeed = ({ setIsAuthenticated }: DogFeedProps) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('breed:asc');
  const [ageRange, setAgeRange] = useState([0, 14]);
  const [isFindMatch, setIsFindMatch] = useState(false);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [matchError, setMatchError] = useState('');
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [clickedDog, setClickedDog] = useState<Dog | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [enteredZipCode, setEnteredZipCode] = useState<string>('');
  const [zipCodes, setZipCodes] = useState<string[]>([]);

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites: string[]) =>
      prevFavorites.includes(dog.id)
        ? prevFavorites.filter((id) => id !== dog.id)
        : [...prevFavorites, dog.id]
    );
  };

  const handleSortDogsByBreed = () => {
    if (
      sortOrder === 'breed:asc' ||
      sortOrder === 'name:asc' ||
      sortOrder === 'name:desc'
    ) {
      setSortOrder('breed:desc');
    } else {
      setSortOrder('breed:asc');
    }
  };

  const handleSortDogsByName = () => {
    if (
      sortOrder === 'name:asc' ||
      sortOrder === 'breed:asc' ||
      sortOrder === 'breed:desc'
    ) {
      setSortOrder('name:desc');
    } else {
      setSortOrder('name:asc');
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setIsFindMatch(false);
    setOpenModal(false);
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      alert('Like at least one dog to match!');
      return;
    }
    await generateMatch(
      favorites,
      setIsLoadingMatch,
      setMatchedDog,
      setMatchError
    );
    setIsFindMatch(true);
    handleOpenModal();
  };

  const handleAgeRangeChange = (e: Event, newValue: number | number[]) => {
    setAgeRange(newValue as number[]);
  };

  const handleDogCardClicked = (dog: Dog) => {
    setClickedDog(dog);
    setOpenModal(true);
  };

  const handleZipInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEnteredZipCode(e.target.value);
    }
  };

  const matchButtonContent = isLoadingMatch ? (
    'Loading...'
  ) : (
    <>
      Find My Match <Pets sx={{ position: 'relative', top: '4px' }} />
    </>
  );

  const arrowIconPosition =
    sortOrder === 'breed:asc' ||
    sortOrder === 'name:asc' ||
    sortOrder === 'name:desc' ? (
      <KeyboardArrowDown sx={{ position: 'relative', top: '5px' }} />
    ) : (
      <KeyboardArrowUp sx={{ position: 'relative', top: '5px' }} />
    );

  useEffect(() => {
    fetchLocations(enteredZipCode, setZipCodes);
  }, [enteredZipCode]);

  useEffect(() => {
    fetchBreeds(setBreeds);
  }, []);

  useEffect(() => {
    fetchDogs(
      ageRange,
      currentPage,
      selectedBreed,
      sortOrder,
      zipCodes,
      setDogs,
      setIsLoadingDogs
    );
  }, [ageRange, currentPage, selectedBreed, sortOrder, zipCodes]);

  return (
    <>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <div className="page-banner">
        <div className="page-title">Fetch the Perfect Dog for You!</div>
        <div className="description-text">
          Browse through all our beautiful dogs available for adoption at your
          leisure and choose the perfect one that meets your match. You can
          filter the search by their breed, location, and age. If you are not
          sure on how to choose the best type for you, click the heart icon on
          all the dogs you like and we will find the perfect match for you with
          our very own algorithm!
          <div>
            Help our dogs find a new, lovely home so that they can receive the
            love and warmth they need!
          </div>
        </div>
        <div>
          <ArrowDropDown fontSize="large" sx={{ margin: '20px 0px;' }} />
        </div>
      </div>
      <div className="page-content">
        <div className="filters">
          <div>
            <label>Filters: </label>
            <select
              onChange={(e) => setSelectedBreed(e.target.value)}
              value={selectedBreed}
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Zip: </label>
            <input
              className="zip-input"
              placeholder="10001"
              onKeyDown={handleZipInput}
            />
          </div>
          <div className="age-slider">
            <label>
              Age Range: {ageRange[0]} - {ageRange[1]}
            </label>
            <Slider
              sx={{ color: '#300c38' }}
              getAriaLabel={() => 'Temperature range'}
              value={ageRange}
              onChange={handleAgeRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={14}
            />
          </div>
          <div>
            <button className="sort-buttons" onClick={handleSortDogsByBreed}>
              Sort by Breed
              {arrowIconPosition}
            </button>
            <button className="sort-buttons" onClick={handleSortDogsByName}>
              Sort by Name
              {arrowIconPosition}
            </button>
            <button className="match-button" onClick={handleGenerateMatch}>
              {matchButtonContent}
            </button>
          </div>
        </div>
        <div className="dogs-container">
          {isLoadingDogs && <div className="spinner"></div>}
          {!isLoadingDogs &&
            dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                favorites={favorites}
                handleDogCardClicked={handleDogCardClicked}
                handleFavorite={handleFavorite}
              />
            ))}
        </div>
        <div className="bottom-buttons">
          <div className="page-buttons">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="page-button"
            >
              Previous
            </button>
            <button
              className="page-button"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
          <div className="match-button-bottom-container">
            <button
              className="match-button-bottom"
              onClick={handleGenerateMatch}
            >
              {matchButtonContent}
            </button>
            {matchError && <p>{matchError}</p>}
          </div>
        </div>
      </div>
      <PopModal
        openModal={openModal}
        handleClose={handleCloseModal}
        dog={isFindMatch ? matchedDog : clickedDog}
      />
    </>
  );
};

export default DogsFeed;
