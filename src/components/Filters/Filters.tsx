import { Slider } from '@mui/material';

import { JSX } from '@emotion/react/jsx-runtime';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Dispatch, SetStateAction } from 'react';
import toggleSortOrder from '../../utils/handleSortDogs';
import './Filters.css';

type FilterProps = {
  breeds: string[];
  selectedBreed: string;
  setSelectedBreed: Dispatch<SetStateAction<string>>;
  setEnteredZipCode: Dispatch<SetStateAction<string>>;
  ageRange: number[];
  setAgeRange: Dispatch<SetStateAction<number[]>>;
  sortOrder: string;
  setSortOrder: Dispatch<SetStateAction<string>>;
  handleGenerateMatch: () => void;
  matchButtonContent: string | JSX.Element;
};

const Filters = ({
  breeds,
  selectedBreed,
  setSelectedBreed,
  setEnteredZipCode,
  ageRange,
  setAgeRange,
  sortOrder,
  setSortOrder,
  handleGenerateMatch,
  matchButtonContent,
}: FilterProps) => {
  const BreedArrowIconPosition =
    sortOrder === 'breed:desc' ? (
      <KeyboardArrowUp sx={{ position: 'relative', top: '5px' }} />
    ) : (
      <KeyboardArrowDown sx={{ position: 'relative', top: '5px' }} />
    );
  const NameArrowIconPosition =
    sortOrder === 'name:desc' ? (
      <KeyboardArrowUp sx={{ position: 'relative', top: '5px' }} />
    ) : (
      <KeyboardArrowDown sx={{ position: 'relative', top: '5px' }} />
    );

  return (
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
          onKeyDown={(e) =>
            e.key === 'Enter' && setEnteredZipCode(e.currentTarget.value)
          }
        />
      </div>
      <div className="age-slider">
        <label>
          Age Range: {ageRange[0]} - {ageRange[1]}
        </label>
        <Slider
          sx={{ color: '#300c38', marginLeft: '10px', marginRight: '10px' }}
          value={ageRange}
          onChange={(_, newValue) => setAgeRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={14}
        />
      </div>
      <div className="top-buttons">
        <button
          onClick={() => toggleSortOrder(sortOrder, setSortOrder, 'breed')}
          className="sort-button"
        >
          Sort by Breed {BreedArrowIconPosition}
        </button>
        <button
          onClick={() => toggleSortOrder(sortOrder, setSortOrder, 'name')}
          className="sort-button"
        >
          Sort by Name {NameArrowIconPosition}
        </button>
        <button className="match-button" onClick={handleGenerateMatch}>
          {matchButtonContent}
        </button>
      </div>
    </div>
  );
};

export default Filters;
