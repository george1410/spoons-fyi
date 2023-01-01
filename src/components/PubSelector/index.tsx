import { FC } from 'react';
import { Pub } from '../../pages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationCrosshairs,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import styles from './PubSelector.module.css';

const distance = (
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
) =>
  Math.sqrt(
    Math.pow(point2.latitude - point1.latitude, 2) +
      Math.pow(point2.longitude - point1.longitude, 2)
  );

const PubSelector: FC<{
  pubs: Pub[];
  onChange: (id: string) => void;
  selectedPubId: string;
}> = ({ pubs, onChange, selectedPubId }) => {
  return (
    <div className={styles.select}>
      <button
        className={styles.locationButton}
        onClick={(e) => {
          navigator.geolocation.getCurrentPosition((position) => {
            const myPosition = position.coords;

            const distances = pubs
              .map((pub) => ({
                ...pub,
                distance: distance(myPosition, {
                  latitude: pub.latitude,
                  longitude: pub.longitude,
                }),
              }))
              .sort((a, b) => a.distance - b.distance);

            onChange(distances[0].id.toString());
          });
        }}
      >
        <FontAwesomeIcon icon={faLocationCrosshairs} />
      </button>
      <select onChange={(e) => onChange(e.target.value)} value={selectedPubId}>
        <option disabled value="">
          Find nearest, or select a Wetherspoons pub
        </option>
        {pubs
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}, {pub.locationName}
            </option>
          ))}
      </select>
      <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
    </div>
  );
};

export default PubSelector;
