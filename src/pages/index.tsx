import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { getPubs } from '../lib/wetherspoonsApi';
import styles from '../styles/Home.module.css';
import Footer from '../components/Footer';
import Controls from '../components/Controls';
import DrinksList from '../components/DrinksList';

export type Pub = {
  name: string;
  sortName: string;
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
};

const Home: FC = () => {
  const [selectedPubId, setSelectedPubId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: pubs } = useQuery(['pubs'], getPubs, {
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

  return (
    <>
      <div className={styles.content}>
        <h1 className={styles.title}>🍻 spoons.fyi</h1>
        <p className={styles.tagline}>
          Because nobody&apos;s in Wetherspoons for the atmosphere...
        </p>

        <Controls
          onSelectedPubChange={setSelectedPubId}
          selectedPub={selectedPubId}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        <DrinksList
          pub={pubs?.find((pub) => String(pub.id) === selectedPubId)?.name}
          pubId={selectedPubId}
          selectedCategory={selectedCategory}
        />
      </div>
      <Footer />
    </>
  );
};

export default Home;
