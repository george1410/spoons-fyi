import React, { FC } from 'react';
import styles from './Footer.module.css';

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div>
        made by{' '}
        <a href="https://www.linkedin.com/in/georgemccarron">george mccarron</a>{' '}
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
  );
};

export default Footer;
