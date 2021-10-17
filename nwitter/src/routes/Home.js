import { dbService } from "fBase";
import React, { useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Home = ({ userObj }) => {
  console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();
  const getNweets = async () => {
    const dbnweets = await getDocs(collection(dbService, "nweets"));
    dbnweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
        creatorId: userObj.uid,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    //댓글 코드 참고함. 시간순 정렬 + version 9 문제 해결, but database 자체에서 트윗 전송 안 됨. time 때문인 듯.
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); //API 가져오기
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    fileInput.current.value = "";
    setAttachment(null);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} widt="50px" height="50px" />
            <button onClick={onClearAttachment}> Clear </button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
