import { useState , useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FieldValues, useForm } from 'react-hook-form';
import styles from './PayPage.module.scss';
import { Calendar } from "primereact/calendar";
import { toast } from 'react-toastify';

import Button from "../../Components/common/Button";
import useUserStore from "../../store";
import languageStore from "../../store/language";
import themeStore from "../../store/theme";
import Alert from "../../Components/common/Alert/Alert";

import "./PayPage.module.scss";
import { confirmEvent, getOneEvent, payForEvent } from "../../controller/UserControls";

const PayPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.firstName);
  const theme = themeStore((state) => state.isDark);
  const isEn = languageStore((state) => state.isEn);
  const [price,setPrice] = useState(0)
  const { gameId } = useParams();

  const handler = () => {
    if (user === null) {
      navigate("/");
    }
  };

  useEffect(()=>{
    if(gameId){
      getOneEvent(parseFloat(gameId)).then(data=>{
        setPrice(data.priceForPersone)
      })
    }
  },[])

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitSuccessful },
    } = useForm();

  const onsubmit = (data: FieldValues) => {
    const newCard = {
      firstName: data.firstName,
      lastName: data.lastName,
      CVV: data.CVV,
      date: data.date,
      cardNumber: data.cardNumber,
    };
    if(gameId){
      confirmEvent(parseFloat(gameId))
      .then(()=>{
        payForEvent(parseFloat(gameId),price)
        .then(()=>{
          toast(isEn ? "Платеж подтвержден вы записаны на игру" : "Succes, you add confirmation")
          toast(isEn ? "Перенаправление на главную" : "Go to main")
          setTimeout(() => {
            navigate('/createGame')
          }, 2000);
        })
      })
      
    }
    
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [reset, isSubmitSuccessful]);
  
  return (
    <div className={theme ? "main-page dark-theme" : "main-page"}>
      <p className={styles.price}>{isEn ? "Сумма к оплате : " : "Price for pay : "} {price}</p>
      <form className={styles.form} onSubmit={handleSubmit((data) => onsubmit(data))}>
        <p className={styles.form__title}>{isEn ? "Имя" : "FirstName"}</p>
        <input placeholder={isEn ? "Имя" : "Name"} {...register('firstName', { required: true , maxLength: 20})} className={styles.form__text_inp} />
        <Alert text={isEn ? "Имя" : "FirstName"} show={errors.firstName} />

        <p className={styles.form__title}>{isEn ? "Фамилия" : "LastName"}</p>
        <input placeholder={isEn ? "Фамилия" : "LastName"} {...register('lastName', { required: true,  maxLength: 20 })} className={styles.form__text_inp} />
        <Alert text={isEn ? "Фамилия" : "LastName"} show={errors.lastName} />

        <p className={styles.form__title}>{isEn ? "Действительна до" : "To"}</p>
        <Calendar {...register('date', { required: true })}  value={new Date()} showIcon view="month" dateFormat="mm/yy"/>
        <Alert text={isEn ? "Укажите дату" : "Add date"}show={errors.date} />


        <p className={styles.form__title}>{isEn ? "Номер карты" : "Card Number"}</p>
        <input
          type="number"
          placeholder={isEn ? "Номер карты из 16 цифр" : "Card Number 16 numbers"}
          {...register('cardNumber', { required: true,  maxLength: 16,  minLength: 16 })}
          className={styles.form__text_inp}
        />
        <Alert text={isEn ? "Введите верный Номер карты" : "Wrong card Number"} show={errors.cardNumber} />

        <p className={styles.form__title}>{isEn ? "CVV" : "CVV"}</p>
        <input
          type="number"
          placeholder="CVV"
          {...register('CVV', { required: true,  maxLength: 3 , minLength:3})}
          className={styles.form__text_inp}
        />
        <Alert text={isEn ? "введите верный CVV" : "wrong CVV"}show={errors.CVV} />

        <Button type="submit" className="main-page__button" onClick={handler}>
        {isEn ? "Оплатить" : "Pay"}
      </Button>
      </form>
    </div>
  );
};

export default PayPage;
