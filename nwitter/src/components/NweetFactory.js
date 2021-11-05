import { dbService, storageService } from "fBase";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useRef } from "react";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { addDoc, collection } from "firebase/firestore";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attatchmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      // storage의 이미지 폴더 생성.
      const response = await uploadString(
        // 이 작업이 폴더에 이미지를 넣는 작업.
        attatchmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
      // 이미지가 저장된 stroage 주소를 받을 수 있다.
    }
    const nweetPosting = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetPosting);
    setNweet("");
    setAttachment("");

    /*     await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
    });
    setNweet(""); */
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
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    fileInput.current.value = "";
    setAttachment(null);
  };

  return (
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
  );
};
export default NweetFactory;
