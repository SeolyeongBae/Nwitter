import { authService } from "fBase";
import React from "react";
import { useHistory } from "react-router";

export default () => {
  const history = useHistory();
  const onLogOutClick = () => {
    history.push("/");
    authService.signOut();
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};
