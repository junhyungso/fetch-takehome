import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import './DogsFeed.css';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Slider from '@mui/material/Slider';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CardActions } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PetsIcon from '@mui/icons-material/Pets';
import Typography from '@mui/material/Typography';
import PopModal from '../../components/PopModal/PopModal';

interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

type DogFeedProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};
export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface Match {
  match: string;
}

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const DogsFeed = ({ setIsAuthenticated }: DogFeedProps) => {
  const [breeds, setBreeds] = useState([]);
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

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dogs/breeds`, {
          withCredentials: true,
        });
        setBreeds(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
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
    fetchDogs();
  }, [ageRange, currentPage, selectedBreed, sortOrder, zipCodes]);

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
  const generateMatch = async () => {
    try {
      setIsLoadingMatch(true);
      const response = await axios.post(
        `${API_BASE_URL}/dogs/match`,
        favorites,
        { withCredentials: true }
      );

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
    await generateMatch();
    setIsFindMatch(true);
    handleOpenModal();
  };

  const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
    setAgeRange(newValue as number[]);
  };

  const handleDogCardClicked = (dog: Dog) => {
    setClickedDog(dog);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchLocations = async () => {
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
          console.log(nearbyZipCodes);
          setZipCodes(nearbyZipCodes);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchLocations();
  }, [enteredZipCode]);

  const handleZipInput = (e) => {
    if (e.key === 'Enter') {
      setEnteredZipCode(e.target.value);
    }
  };

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
          <ArrowDropDownIcon fontSize="large" sx={{ margin: '20px 0px;' }} />
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
              {sortOrder === 'breed:asc' ||
              sortOrder === 'name:asc' ||
              sortOrder === 'name:desc' ? (
                <KeyboardArrowDownIcon
                  sx={{ position: 'relative', top: '5px' }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  sx={{ position: 'relative', top: '5px' }}
                />
              )}
            </button>
            <button className="sort-buttons" onClick={handleSortDogsByName}>
              Sort by Name
              {sortOrder === 'name:asc' ||
              sortOrder === 'breed:asc' ||
              sortOrder === 'breed:desc' ? (
                <KeyboardArrowDownIcon
                  sx={{ position: 'relative', top: '5px' }}
                />
              ) : (
                <KeyboardArrowUpIcon
                  sx={{ position: 'relative', top: '5px' }}
                />
              )}
            </button>
            <button className="match-button" onClick={handleGenerateMatch}>
              {isLoadingMatch ? (
                'Loading...'
              ) : (
                <>
                  Find My Match{' '}
                  <PetsIcon sx={{ position: 'relative', top: '4px' }} />
                </>
              )}
            </button>
          </div>
        </div>
        <div className="dogs-container">
          {isLoadingDogs && <div className="spinner"></div>}
          {!isLoadingDogs &&
            dogs.map((dog) => (
              <Card variant="outlined" className="dog-profile" key={dog.id}>
                <CardContent
                  onClick={() => handleDogCardClicked(dog)}
                  sx={{ cursor: 'pointer' }}
                >
                  <div className="dog-image-container">
                    <img src={dog.img} alt={dog.name} className="dog-image" />
                  </div>
                  <Typography variant="h5" component="div">
                    {dog.name}
                  </Typography>
                  <Typography variant="body2">{dog.breed}</Typography>
                  <Typography variant="body2">Age: {dog.age}</Typography>
                  <Typography variant="body2">Zip: {dog.zip_code}</Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteBorderIcon
                      onClick={() => handleFavorite(dog)}
                      className={
                        favorites.includes(dog.id) ? 'favorite' : 'not-favorite'
                      }
                    />
                  </IconButton>
                </CardActions>
              </Card>
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
              {isLoadingMatch ? (
                'Loading...'
              ) : (
                <>
                  Find My Match{' '}
                  <PetsIcon sx={{ position: 'relative', top: '4px' }} />
                </>
              )}
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
