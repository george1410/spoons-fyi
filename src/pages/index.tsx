import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Inconsolata } from '@next/font/google';
import { FC, useState } from 'react';
import { getPubs } from '../lib/wetherspoonsApi';
import styles from '../styles/Home.module.css';
import { DrinksResponse } from './api/v1/pubs/[pubId]/drinks';
import PubSelector from '../components/PubSelector';
import Select from '../components/Select';

export type Pub = {
  name: string;
  sortName: string;
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
};

const inconsolata = Inconsolata({ display: 'swap' });

const getDrinkTypeText = (category: string) => {
  switch (category) {
    case 'All':
      return 'drink';

    case 'Other':
      return 'other drink';

    default:
      return category.toLowerCase();
  }
};

const Home: FC = () => {
  const [selectedPubId, setSelectedPubId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const {
    data: pubs,
    isLoading: isLoadingPubs,
    isError: isErrorPubs,
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

  const {
    data: drinks,
    isLoading: isLoadingDrinks,
    isInitialLoading: isInitialLoadingDrinks,
    isError: isErrorDrinks,
  } = useQuery(
    ['drinks', selectedPubId],
    async ({ queryKey }) => {
      const { data } = await axios.get<DrinksResponse>(
        `/api/v1/pubs/${queryKey[1]}/drinks`
      );
      return data;
    },
    {
      enabled: !!selectedPubId,
    }
  );

  return (
    <>
      <div className={styles.content}>
        <h1 className={styles.title}>🍻 spoons.fyi</h1>
        <p className={styles.tagline}>
          Because nobody&apos;s in Wetherspoons for the atmosphere...
        </p>
        {isLoadingPubs ? (
          'Loading...'
        ) : isErrorPubs ? (
          <p>
            Something went wrong.{' '}
            <a
              className={styles.errorLink}
              href="https://www.youtube.com/watch?v=6htT-aVJup4"
              target="_blank"
              rel="noreferrer"
            >
              Let&apos;s Go to the Winchester, have a nice cold pint, and wait
              for all this to blow over.
            </a>
          </p>
        ) : (
          <div className={styles.controls}>
            <PubSelector
              onChange={setSelectedPubId}
              selectedPubId={selectedPubId}
              pubs={pubs}
            />

            <Select onChange={setSelectedCategory} value={selectedCategory}>
              <option value="All">All Drinks</option>
              <option value="Beer">Beer</option>
              <option value="Cider">Cider</option>
              <option value="Wine">Wine</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        )}
        {isInitialLoadingDrinks || (drinks && isLoadingDrinks) ? (
          <p>Brewing the results...</p>
        ) : null}
        {isErrorDrinks ? (
          <p>
            Something went wrong.{' '}
            <a
              className={styles.errorLink}
              href="https://www.youtube.com/watch?v=6htT-aVJup4"
              target="_blank"
              rel="noreferrer"
            >
              Let&apos;s Go to the Winchester, have a nice cold pint, and wait
              for all this to blow over.
            </a>
          </p>
        ) : null}
        {drinks ? (
          <ol className={styles.list}>
            {drinks
              .filter((drink) =>
                selectedCategory === 'All'
                  ? true
                  : drink.category === selectedCategory
              )
              .sort((a, b) => a.pricePerMlAlcohol - b.pricePerMlAlcohol)
              .map((product, index) => (
                <li key={product.name + product.volume + index}>
                  <div className={`${styles.rank} ${inconsolata.className}`}>
                    {String(index + 1).padStart(3, '0')}
                  </div>
                  <div>
                    {index === 0 ? (
                      <span>
                        The best value {getDrinkTypeText(selectedCategory)} in{' '}
                        {
                          pubs?.find((pub) => String(pub.id) === selectedPubId)
                            ?.name
                        }
                        :
                      </span>
                    ) : null}
                    <h3>
                      {product.name} - {product.serveSizeName}
                    </h3>
                    <span>
                      {product.abv}% ABV &#8226;{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(product.price)}{' '}
                      &#8226; {product.volume}ml &#8226;{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'GBP',
                        maximumFractionDigits: 4,
                      }).format(product.pricePerMlAlcohol * 10)}
                      /unit
                    </span>
                  </div>
                </li>
              ))}
          </ol>
        ) : null}{' '}
      </div>
      <footer className={styles.footer}>
        <div>
          made by{' '}
          <a href="https://www.linkedin.com/in/georgemccarron">
            george mccarron
          </a>{' '}
          &#8226; inspired (a lot) by{' '}
          <a
            href="https://thetab.com/uk/2019/05/24/i-made-it-my-mission-to-rank-every-spoons-drink-by-value-for-alcohol-102051"
            target="_blank"
            rel="noreferrer"
          >
            this lad
          </a>
        </div>
        <div>
          hosted on{' '}
          <a href="https://vercel.com" target="_blank" rel="noreferrer">
            vercel
          </a>
        </div>
        <div>
          code on{' '}
          <a
            href="https://github.com/george1410/spoons-fyi"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </div>
      </footer>
    </>
  );
};

export default Home;
