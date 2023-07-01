import { useFormik } from "formik";
import { Calendar } from "primereact/calendar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import Button from "../../Components/common/Button";
import Input from "../../Components/common/Input";
import {
  findUser,
  addEvent,
  getEvents,
  delEvent,
} from "../../controller/UserControls";
import type { EventData, UserData } from "../../data/authData";
import useUserStore from "../../store";
import languageStore from "../../store/language";
import priceStore from "../../store/price";
import themeStore from "../../store/theme";
import "./CreateGame.scss";

const schema = yup.object().shape({
  name: yup.string().required(),
  time: yup.string().required(),
  adress: yup.string().required(),
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
  const [listModal, setListModal] = useState(false);
  const [findText, setFindText] = useState("");
  const userEmail = useUserStore((state) => state.email);
  const theme = themeStore((state) => state.isDark);
  const isEn = languageStore((state) => state.isEn);
  const [expenditure, setExpenditure] = useState([
    { name: "", price: "", id: Date.now() },
  ]);
  const [team, setTeam] = useState<string[]>([]);
  const [findUsers, setFindUsers] = useState<UserData[]>([]);
  const [yourGames, setYourGames] = useState<EventData[]>([]);
  const [unpayGames, setUnpayGames] = useState<EventData[]>([]);
  const navigate = useNavigate();
  const setPriceTo = priceStore((state) => state.setPrice);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      adress: "",
      teamCount: "",
      time: new Date(),
    },
    validationSchema: schema,
    onSubmit: () => {},
  });
  useEffect(() => {
    if (!createModal) {
      setExpenditure([{ name: "", price: "", id: Date.now() }]);
      setTeam([]);
      resetForm();
    } else {
      setListModal(false);
    }
  }, [createModal]);

  useEffect(() => {
    if (listModal) {
      setCreateModal(false);
    }
  }, [listModal]);

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

  const findPlayer = async (searchStr: string) => {
    setFindText(searchStr);

    if (searchStr) {
      const response = await findUser(searchStr);
      setFindUsers(response);
    } else {
      setFindUsers([]);
    }
  };

  const sendEventToServer = async () => {
    handleSubmit();

    if (team.length === 0) {
      toast(isEn ? "Добавьте игроков в команду" : "Add players");
    }

    if (
      Object.entries(errors).length === 0 &&
      team.length === parseFloat(values.teamCount) - 1
    ) {
      const payload = {
        address: values.adress,
        date: new Date(values.time).toLocaleString(),
        place: values.name,
        team,
        expenditure: expenditure.map((item) => ({
          name: item.name,
          price: parseFloat(item.price),
        })),
      };
      await addEvent(payload);
      setCreateModal(false);

      const event = await getEvents();

      if (event.length > 0) {
        if (
          event.filter((game) => game.team[0].email !== userEmail).length > 0
        ) {
          toast(
            isEn
              ? "Посмотрите события на которые вас пригласили"
              : "See events!"
          );
        }

        if (
          event.filter(
            (game) =>
              game.team[0].email === userEmail && !game.team[0].confirmed
          )
        ) {
          toast(isEn ? "У вас есть неоплаченные игры" : "You have unpay games");
        }
      }
    }
  };

  const getListOfGames = async () => {
    setListModal((prev) => (prev = !prev));
    const event = await getEvents();
    setYourGames(event.filter((game) => game.team[0].email === userEmail));
    setUnpayGames(event.filter((game) => game.team[0].email !== userEmail));
  };

  const addToTeam = (email: string) => {
    if (!values.teamCount) {
      toast(isEn ? "Выверите количество участников" : "Set count of players");

      return;
    }

    const arr = [...team];

    if (parseFloat(values.teamCount) - 1 === arr.length) {
      toast(isEn ? "Команда набрана" : "Team is full");

      return;
    }

    if (arr.findIndex((user) => user === email) === -1 && email !== userEmail) {
      arr.push(email);
      setTeam(arr);
      setFindUsers([]);
      setFindText("");
    } else {
      toast(isEn ? "Такой игрок уже есть" : "This player already exist");
    }
  };

  const deleteEvent = async (id: number) => {
    await delEvent(id);
    const event = await getEvents();
    setYourGames(event.filter((game) => game.team[0].email === userEmail));
    setUnpayGames(event.filter((game) => game.team[0].email !== userEmail));
  };

  const goToPay = (sum: EventData) => {
    if (sum.priceForPersone) {
      setPriceTo(Math.round(sum.priceForPersone));
    }

    navigate(`/pay-page/${sum.id}`);
  };

  return (
    <div className={theme ? "create-game dark-theme" : "create-game"}>
      <div className="create-game__btns-block">
        <Button
          className="create-game__button"
          onClick={() => setCreateModal((prev) => (prev = !prev))}
        >
          {isEn ? "Создать игру" : "Create game"}
        </Button>
        <Button
          className="create-game__button"
          onClick={() => getListOfGames()}
        >
          {isEn ? "Список игр" : "Games list"}
        </Button>
      </div>

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
              <p className="create-game__title">
                {isEn ? "Расходы на игру" : "Create"}
              </p>
              <Button
                className="authentication__button"
                type="button"
                onClick={addPrice}
              >
                +
              </Button>
            </div>
            {expenditure.map((item) => (
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
            <Input
              type="text"
              label={isEn ? "Найти игрока" : "Find player"}
              placeholder={isEn ? "Найти игрока" : "Find player"}
              value={findText}
              onChange={(event) => findPlayer(event.target.value)}
            />
            <ul>
              {findUsers.map((user) => (
                <li key={user.id}>
                  {user.firstName}
                  <Button
                    className="authentication__button"
                    onClick={() => addToTeam(user.email)}
                  >
                    +
                  </Button>
                </li>
              ))}
            </ul>
            <ol>
              {team.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
      {listModal && (
        <div className="games">
          <div className="games__item" key={Math.random()}>
            <p className="games__item-title">{isEn ? "Название" : "Name"}</p>
            <p className="games__item-title">{isEn ? "Адрес" : "Adress"}</p>
            <p className="games__item-title">{isEn ? "Время" : "Date"}</p>
            <p className="games__item-title">{isEn ? "К оплате" : "Price"}</p>
            <p className="games__item-title">
              {isEn ? "Расход" : "Expenditure"}
            </p>
            <p className="games__item-title">{isEn ? "Команда" : "Team"}</p>
            <p className="games__item-title">
              {isEn ? "Управление" : "Controls"}
            </p>
          </div>
          {yourGames.map((game) => (
            <div className="games__item" key={game.id}>
              <p className="games__item-small">{game.place}</p>
              <p className="games__item-small">{game.address}</p>
              <p className="games__item-small">{game.date}</p>
              <p className="games__item-small">
                {game.priceForPersone ? Math.round(game.priceForPersone) : ""}
              </p>
              <div className="games__item_cont" key={Math.random()}>
                {game.expenditure.map((exp) => (
                  <div className="games__item_exp" key={exp.price}>
                    <p className="games__item_exp-text">{exp.name}</p>
                    <p className="games__item_exp-text">{exp.price}</p>
                  </div>
                ))}
              </div>

              <div className="games__item_cont" key={Math.random()}>
                {game.team.map((exp) => (
                  <div className="games__item_exp" key={exp.id}>
                    <p className="games__item_exp-text">
                      {isEn ? "Игрок : " : "Player : "}
                      {exp.firstName}
                    </p>
                    <p className="games__item_exp-text">
                      {isEn ? "Оплачено : " : "Confirmed : "}
                      {exp.confirmed
                        ? isEn
                          ? "Да"
                          : "Yes"
                        : isEn
                        ? "Нет"
                        : "No"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="games__item_exp" key={Math.random()}>
                <Button
                  className="games_btn"
                  onClick={() => deleteEvent(game.id)}
                >
                  {isEn ? "Удалить" : "Delete"}
                </Button>
              </div>
            </div>
          ))}
          {unpayGames.map((game) => (
            <div className="games__item" key={game.id}>
              <p className="games__item-small">{game.place}</p>
              <p className="games__item-small">{game.address}</p>
              <p className="games__item-small">{game.date}</p>
              <p className="games__item-small">
                {game.priceForPersone ? Math.round(game.priceForPersone) : ""}
              </p>
              <div className="games__item_cont" key={Math.random()}>
                {game.expenditure.map((exp) => (
                  <div className="games__item_exp" key={exp.price}>
                    <p className="games__item_exp-text">{exp.name}</p>
                    <p className="games__item_exp-text">{exp.price}</p>
                  </div>
                ))}
              </div>

              <div className="games__item_cont" key={Math.random()}>
                {game.team.map((exp) => (
                  <div className="games__item_exp" key={exp.firstName}>
                    <p className="games__item_exp-text">
                      {isEn ? "Игрок : " : "Player : "}
                      {exp.firstName}
                    </p>
                    <p className="games__item_exp-text">
                      {isEn ? "Оплачено : " : "Confirmed : "}
                      {exp.confirmed
                        ? isEn
                          ? "Да"
                          : "Yes"
                        : isEn
                        ? "Нет"
                        : "No"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="games__item_exp" key={Math.random()}>
                <Button className="games_btn" onClick={() => goToPay(game)}>
                  {isEn ? "Оплатить" : "Pay"}
                </Button>
              </div>
            </div>
          ))}
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
