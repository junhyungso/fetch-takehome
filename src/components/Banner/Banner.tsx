import { ArrowDropDown } from '@mui/icons-material';
import styles from './Banner.module.css';

const Banner = () => {
  return (
    <div className={styles.pageBanner}>
      <div className={styles.pageTitle}>Fetch the Perfect Dog for You!</div>
      <div className={styles.descriptionText}>
        Browse through all our beautiful dogs available for adoption at your
        leisure and choose the perfect one that meets your match. You can filter
        the search by their breed, location, and age. If you are not sure on how
        to choose the best type for you, click the heart icon on all the dogs
        you like and we will find the perfect match for you with our very own
        algorithm!
        <div>
          Help our dogs find a new, lovely home so that they can receive the
          love and warmth they need!
        </div>
      </div>
      <div>
        <ArrowDropDown fontSize="large" sx={{ margin: '20px 0px;' }} />
      </div>
    </div>
  );
};
export default Banner;
