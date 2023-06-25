import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUserStore from "../../store";

export const CheckForLogin = () => {
  const { firstName, fetched } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!firstName && fetched) navigate("/");
  }, [fetched, firstName]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};
