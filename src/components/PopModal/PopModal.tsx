import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Dog } from '../../pages/DogFeed/DogsFeed';

type ModalProps = {
  openModal: boolean;
  handleClose: () => void;
  dog: Dog;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PopModal = ({ openModal, handleClose, dog }: ModalProps) => {
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="dog-image-container">
          <img src={dog.img} alt={dog.name} className="dog-image" />
        </div>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {dog.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Breed: {dog.breed}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Age: {dog.age}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Zip: {dog.zip_code}
        </Typography>
      </Box>
    </Modal>
  );
};

export default PopModal;
