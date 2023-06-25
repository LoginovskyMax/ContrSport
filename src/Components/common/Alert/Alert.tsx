import styles from './Alert.module.scss';
import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

interface IProps {
  text: string;
  show: boolean | undefined | FieldError | Merge<FieldError, FieldErrorsImpl>;
}

const Alert = ({ text, show }: IProps) => {
  return <div>{show && <p className={styles.text}>{text}</p>}</div>;
};

export default Alert;