import { authService, dbService } from "fBase";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { collection, getDocs, query, where } from "@firebase/firestore";

export default ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    history.push("/");
    authService.signOut();
  };
  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  return (
    <>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};
