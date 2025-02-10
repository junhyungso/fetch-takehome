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
import Typography from '@mui/material/Typography';
import PopModal from '../../components/PopModal/PopModal';

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

const DogsFeed = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');
  const [ageRange, setAgeRange] = useState([0, 14]);
  const [isFindMatch, setIsFindMatch] = useState(false);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog>({
    id: '',
    img: '',
    name: '',
    age: 0,
    zip_code: '',
    breed: '',
  });
  const [clickedDog, setClickedDog] = useState<Dog>({
    id: '',
    img: '',
    name: '',
    age: 0,
    zip_code: '',
    breed: '',
  });
  const [openModal, setOpenModal] = useState(false);

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
        const response = await axios.get(`${API_BASE_URL}/dogs/search`, {
          params: {
            breeds: selectedBreed ? [selectedBreed] : [],
            size: 25,
            from: currentPage * 25,
            ageMin: ageRange[0],
            ageMax: ageRange[1],
            sort: `breed:${sortOrder}`,
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
      }
    };
    fetchDogs();
  }, [ageRange, currentPage, selectedBreed, sortOrder]);

  const handleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites: string[]) =>
      prevFavorites.includes(dog.id)
        ? prevFavorites.filter((id) => id !== dog.id)
        : [...prevFavorites, dog.id]
    );
  };

  const handleSortDogs = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
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
      const matchResponse = await axios.post(
        `${API_BASE_URL}/dogs/`,
        [response.data.match],
        { withCredentials: true }
      );
      console.log(matchResponse);
      setMatchedDog(matchResponse.data[0]);
    } catch (error) {
      console.error('Error generating match:', error);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleGenerateMatch = async () => {
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

  return (
    <>
      <NavBar />
      <div className="page-content">
        <h1>Fetch the Perfect Dog for You!</h1>
        <div className="description-text">
          Browse through all the dogs available for adoption at your leisure and
          choose the perfect dog that meets your match. You can filter by their
          breed, location, and age. If you are not sure on how to choose the
          best type for you, click the heart icon on all the dogs you like and
          we will find the perfect match for you with our very own algorithm!
          <div>
            <ArrowDropDownIcon fontSize="large" />
          </div>
        </div>
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
            <input className="zip-input" placeholder="10001" />
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
            <button onClick={handleSortDogs}>
              Sort
              {sortOrder === 'asc' ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowUpIcon />
              )}
            </button>
            <button className="match-button" onClick={handleGenerateMatch}>
              Find My Match
            </button>
          </div>
        </div>
        <div className="dogs-container">
          {dogs.map((dog) => (
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
              Find My Match
            </button>
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
