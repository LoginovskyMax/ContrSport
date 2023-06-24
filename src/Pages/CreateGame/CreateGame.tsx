import { useFormik } from "formik";
import { Calendar } from "primereact/calendar";
import { useEffect, useState } from "react";
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
] as const;

const CreateGame = () => {
  const [createModal, setCreateModal] = useState(false);
  const [teamError, setTeamError] = useState(false);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.userName);
  const theme = themeStore((state) => state.isDark);
  const isEn = languageStore((state) => state.isEn);
  const [expenditure, setExpenditure] = useState([
    { name: "", price: "", id: Date.now() },
  ]);
  const [teamCount, setTeamCount] = useState<number[]>([]);
  const [team, setTeam] = useState([]);

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
        teamCount: '',
        time: new Date(),
      },
      validationSchema: schema,
      onSubmit: (data) => {
         
      },
    });
  useEffect(() => {
    if (values.teamCount ) {
      const arr = new Array(parseFloat(values.teamCount)).fill(0);
      setTeamCount(arr);
    }
  }, [values.teamCount]);

  const setName = (value: string, id: number) => {
    const arr = [...expenditure];
    arr[arr.findIndex((item) => item.id === id)].name = value;
    setExpenditure(arr);
  };

  const setPrice = (value: string, id: number) => {
    const arr = [...expenditure];
    arr[arr.findIndex((item) => item.id === id)].price = value;
    setExpenditure(arr);
  };

  const addPrice = () => {
    const arr = [...expenditure];
    arr.push({ name: "", price: "", id: Date.now() });
    setExpenditure(arr);
  };

  const deletePrice = (id: number) => {
    let arr = [...expenditure];
    arr = arr.filter((item) => item.id !== id);
    setExpenditure(arr);
  };

  const findPlayer = (searchStr: string) => {
    // Запрос на поиск игрока
  };

  const sendEventToServer = () => {
    handleSubmit();
    if(team.length===0){
      setTeamError(true)
    }
    
    if (Object.entries(errors).length === 0 && team.length!==0) {
      const priceForPerson =
        expenditure.reduce((acc, item) => acc + parseFloat(item.price), 0) /
        parseFloat(values.teamCount);
      const payload = {
        ...values,
        team,
        expenditure,
        priceForPerson,
      };
      console.log(payload);
    }
  };

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
        <div className="create-game__cont">
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
          </form>
          <div>
            <div className="create-game__cont__title">
              <p>{isEn ? "Расходы на игру" : "Create"}</p>
              <Button
                className="authentication__button"
                type="button"
                onClick={addPrice}
              >
                +
              </Button>
            </div>
            {expenditure.map((item, i) => (
              <div key={item.id} className="create-game__price-list">
                <div>
                  <Input
                    type="text"
                    label={isEn ? "Название расхода" : "Expenditure name"}
                    placeholder={isEn ? "Название расхода" : "Expenditure name"}
                    value={item.name}
                    onChange={(event) => setName(event.target.value, item.id)}
                  />
                  <Input
                    type="number"
                    label={isEn ? "Cумма расхода" : "Expenditure price"}
                    placeholder={isEn ? "Cумма расхода" : "Expenditure price"}
                    value={item.price}
                    onChange={(event) => setPrice(event.target.value, item.id)}
                  />
                </div>
                <Button
                  className="authentication__button"
                  type="button"
                  onClick={() => deletePrice(item.id)}
                >
                  -
                </Button>
              </div>
            ))}
          </div>

          <div>
            <p>{isEn ? "Добавление игроков" : "Add players"}</p>
            <Input
              type="text"
              label={isEn ? "Почта игрока" : "Player email"}
              placeholder={isEn ? "Почта игрока" : "Player email"}
              onChange={(event) => findPlayer(event.target.value)}
            />
            <ol>
              {teamCount.map((_, i) => (
                <li key={Math.random()}>{i}</li>
              ))}
            </ol>
            {teamError && <p>{isEn ? "Мало игроков" : "Add players"}</p>}
          </div>
        </div>
      )}
      {createModal && (
        <Button
          className="authentication__button"
          type="button"
          onClick={sendEventToServer}
        >
          {isEn ? "Создать" : "Create"}
        </Button>
      )}
    </div>
  );
};

export default CreateGame;
