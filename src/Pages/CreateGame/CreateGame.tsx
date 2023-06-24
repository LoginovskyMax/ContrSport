import { useFormik } from "formik";
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
// import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';

import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import useUserStore from "../../store";
import languageStore from "../../store/language";
import themeStore from "../../store/theme";

import "./CreateGame.scss";

const schema = yup.object().shape({
  name: yup.string().required(),
  time: yup.string().required(),
  adress: yup.string().required(),
  place: yup.string().required(),
  teamCount: yup.number().required(),
  expenditureName: yup.string().required(),
  expenditurePrice: yup.number().required(),
});
const inputsProps = [
  {
    key: "name",
    labelEn: "Name",
    labelRu: "Название",
    placeholderEn: "Name",
    placeholderRu: "Название",
    type: "text",
  },
  {
    key: "adress",
    labelEn: "Adress",
    labelRu: "Адресс",
    placeholderEn: "Adress",
    placeholderRu: "Адресс",
    type: "text",
  },
  {
    key: "place",
    labelEn: "Place",
    labelRu: "Место",
    placeholderEn: "Place",
    placeholderRu: "Место",
    type: "text",
  },
  {
    key: "teamCount",
    labelEn: "Number of members",
    labelRu: "Количество участников",
    placeholderEn: "Number of members",
    placeholderRu: "Количество участников",
    type: "number",
  },
  {
    key: "expenditureName",
    labelEn: "expenditure Name",
    labelRu: "Название расхода",
    placeholderEn: "expenditure Name",
    placeholderRu: "Название расхода",
    type: "text",
  },
  {
    key: "expenditurePrice",
    labelEn: "expenditure Price",
    labelRu: "Цена расхода",
    placeholderEn: "expenditure Price",
    placeholderRu: "Цена расхода",
    type: "number",
  },
] as const;

const CreateGame = () => {
  const [createModal, setCreateModal] = useState(false);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.userName);
  const theme = themeStore((state) => state.isDark);
  const isEn = languageStore((state) => state.isEn);

  const defaultState = {
    center: [49.80776, 73.088504],
    zoom: 10,
    controls: [],
  };

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        adress: "",
        place: "",
        teamCount: 1,
        time: new Date(),
        expenditureName: "",
        expenditurePrice: 0,
      },
      validationSchema: schema,
      onSubmit: (data) => {
        // отправка данных формы на сервер
        console.log(data);
        setCreateModal(false);
      },
    });

  return (
    <div className={theme ? "create-game dark-theme" : "create-game"}>
      {/* <YMaps  
        query={{
          apikey: "03fa8825-f7ae-44fd-a14b-9b6c576ab101",
        }}>
      <Map defaultState={defaultState}>
      <SearchControl options={{
      float: 'right',
      provider: 'yandex#map'
    }} />
        <Placemark geometry={[49.807760, 73.088504]} />
      </Map>
    </YMaps> */}
      <Button
        className="create-game__button"
        onClick={() => setCreateModal((prev) => (prev = !prev))}
      >
        {isEn ? "Создать игру" : "Create game"}
      </Button>
      {createModal && (
        <div>
          <form onSubmit={handleSubmit}>
            {inputsProps.map(
              ({
                key,
                labelRu,
                labelEn,
                type,
                placeholderEn,
                placeholderRu,
              }) => (
                <Input
                  key={key}
                  type={type}
                  label={isEn ? labelRu : labelEn}
                  name={key}
                  placeholder={isEn ? placeholderRu : placeholderEn}
                  value={values[key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorsMessage={
                    errors[key] && touched[key] ? errors[key] : undefined
                  }
                />
              )
            )}
            <Calendar
              value={values.time}
              onChange={handleChange}
              showTime
              hourFormat="24"
              name="time"
            />
            <Button className="authentication__button" type="submit">
              {isEn ? "Создать" : "Create"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateGame;
