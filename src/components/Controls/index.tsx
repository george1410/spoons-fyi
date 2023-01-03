import { useQuery } from '@tanstack/react-query';
import React, { FC } from 'react';
import { BeatLoader } from 'react-spinners';
import { getPubs } from '../../lib/wetherspoonsApi';
import Error from '../Error';
import PubSelector from '../PubSelector';
import Select from '../Select';

import styles from './Controls.module.css';

const Controls: FC<{
  onSelectedPubChange: (id: string) => void;
  selectedPub: string;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}> = ({
  onSelectedPubChange,
  selectedPub,
  onCategoryChange,
  selectedCategory,
}) => {
  const {
    data: pubs,
    isLoading,
    isError,
  } = useQuery(['pubs'], getPubs, {
    select: (pubs) =>
      pubs.map((pub) => ({
        name: pub.name,
        sortName: pub.sortName,
        id: pub.venueId,
        locationName: pub.menuLocation,
        latitude: pub.lat,
        longitude: pub.long,
      })),
  });

  if (isLoading) {
    return (
      <>
        Loading
        <BeatLoader color="#ffffff" />
      </>
    );
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className={styles.controls}>
      <PubSelector
        onChange={onSelectedPubChange}
        selectedPubId={selectedPub}
        pubs={pubs}
      />

      <Select onChange={onCategoryChange} value={selectedCategory}>
        <option value="All">All Drinks</option>
        <option value="Beer">Beer</option>
        <option value="Cider">Cider</option>
        <option value="Wine">Wine</option>
        <option value="Other">Other</option>
      </Select>
    </div>
  );
};

export default Controls;
