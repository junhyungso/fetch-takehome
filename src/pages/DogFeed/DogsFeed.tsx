import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Pets } from '@mui/icons-material';

import Banner from '../../components/Banner/Banner';
import DogCard from '../../components/DogCard/DogCard';
import Filters from '../../components/Filters/Filters';
import NavBar from '../../components/NavBar/NavBar';
import PopModal from '../../components/PopModal/PopModal';
import { Dog } from '../../types/types';
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

const DogsFeed = ({ setIsAuthenticated }: DogFeedProps) => {
  const [breeds, setBreeds] = useState<string[]>([]);

  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  const [dogsError, setDogsError] = useState('');

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
  const [locationError, setLocationError] = useState<string>('');
  const [zipCodes, setZipCodes] = useState<string[]>([]);

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites: string[]) =>
      prevFavorites.includes(dog.id)
        ? prevFavorites.filter((id) => id !== dog.id)
        : [...prevFavorites, dog.id]
    );
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

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

  const handleDogCardClicked = (dog: Dog) => {
    setClickedDog(dog);
    setOpenModal(true);
  };

  const matchButtonContent = isLoadingMatch ? (
    'Loading...'
  ) : (
    <>
      Find My Match <Pets sx={{ position: 'relative', top: '4px' }} />
    </>
  );

  useEffect(() => {
    fetchBreeds(setBreeds);
  }, []);

  useEffect(() => {
    fetchLocations(enteredZipCode, setZipCodes, setLocationError);
  }, [enteredZipCode]);

  useEffect(() => {
    fetchDogs(
      ageRange,
      currentPage,
      selectedBreed,
      sortOrder,
      zipCodes,
      setDogs,
      setIsLoadingDogs,
      setDogsError
    );
  }, [ageRange, currentPage, selectedBreed, sortOrder, zipCodes]);

  return (
    <>
      <NavBar setIsAuthenticated={setIsAuthenticated} />
      <Banner />
      <div className="page-content">
        <Filters
          breeds={breeds}
          selectedBreed={selectedBreed}
          setSelectedBreed={setSelectedBreed}
          setEnteredZipCode={setEnteredZipCode}
          ageRange={ageRange}
          setAgeRange={setAgeRange}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleGenerateMatch={handleGenerateMatch}
          matchButtonContent={matchButtonContent}
        />
        <div className="dogs-container">
          {dogsError && <div>{dogsError}</div>}
          {locationError && <div>{locationError}</div>}
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
