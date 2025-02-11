import { FavoriteBorder } from '@mui/icons-material';
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import { Dog } from '../../types/types';

type DogCardProps = {
  dog: Dog;
  favorites: string[];
  handleDogCardClicked: (dog: Dog) => void;
  handleFavorite: (dog: Dog) => void;
};

const DogCard = ({
  dog,
  favorites,
  handleDogCardClicked,
  handleFavorite,
}: DogCardProps) => {
  return (
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
          <FavoriteBorder
            onClick={() => handleFavorite(dog)}
            className={favorites.includes(dog.id) ? 'favorite' : 'not-favorite'}
          />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default DogCard;
