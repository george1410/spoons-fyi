import React from 'react';
import styles from './Error.module.css';

const Error = () => {
  return (
    <p>
      Something went wrong.{' '}
      <a
        className={styles.errorLink}
        href="https://www.youtube.com/watch?v=6htT-aVJup4"
        target="_blank"
        rel="noreferrer"
      >
        Let&apos;s Go to the Winchester, have a nice cold pint, and wait for all
        this to blow over.
      </a>
    </p>
  );
};

export default Error;
