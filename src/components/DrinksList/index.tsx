import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { FC } from 'react';
import { Inconsolata } from '@next/font/google';

import styles from './DrinksList.module.css';
import { DrinksResponse } from '../../pages/api/v1/pubs/[pubId]/drinks';
import Error from '../Error';

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

const DrinksList: FC<{
  pub: string | undefined;
  selectedCategory: string;
  pubId: string;
}> = ({ pub, pubId, selectedCategory }) => {
  const {
    data: drinks,
    isLoading,
    isError,
  } = useQuery(
    ['drinks', pubId],
    async ({ queryKey }) => {
      const { data } = await axios.get<DrinksResponse>(
        `/api/v1/pubs/${queryKey[1]}/drinks`
      );
      return data;
    },
    {
      enabled: !!pubId,
    }
  );

  if (!pubId) {
    return null;
  }

  if (isLoading) {
    return <p>Brewing the results...</p>;
  }

  if (isError) {
    return <Error />;
  }

  return (
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
                  The best value {getDrinkTypeText(selectedCategory)} in {pub}:
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
  );
};

export default DrinksList;
