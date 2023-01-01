import { FC, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Select.module.css';

const Select: FC<{
  onChange: (value: string) => void;
  value: string;
  children: ReactNode;
}> = ({ onChange, value, children }) => {
  return (
    <div className={styles.select}>
      <select onChange={(e) => onChange(e.target.value)} value={value}>
        {children}
      </select>
      <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
    </div>
  );
};

export default Select;
