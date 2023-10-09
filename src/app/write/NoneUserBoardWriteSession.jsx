/* eslint-disable */ 
import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import styles from "./NoneUserBoardWriteForm.module.css";
import "./ckeditor-board-write.css"
import NoneUserBoardWriteForm from "./NoneUserBoardWriteForm";
function NoneUserBoardWriteSession() {
    
  let condition = true;
  const userNameRef = useRef(null);
  let domainUri = process.env.NEXT_PUBLIC_API_URL;
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('이름');
  const [usernameClass, setUsernameClass] = useState('once');
  const contentsRef = useRef(null);
  let finalId;
  const [sessionId, setSessionId] = useState(null);
  let ckeditior;
  let requestData;

  const eraseUsername = () => {
    console.log(usernameClass)
    console.log(usernameClass!=="")
    if(usernameClass!=="") {
        setUsernameClass("")
        setUsername("")
        return;
    }
    return;
}
const changeUsername = (e) => {
    const newValue = e.target.value;
    setUsername(newValue);
    return;
}
const erasePassword = () => {
    console.log(passwordClass)
    console.log(passwordClass!=="")
    if(passwordClass!=="") {
        setPasswordClass("")
        setPassword("")
        return;
    }
    return;
}
const changePassword = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
    return;
}
const eraseTitle = () => {
    console.log(titleClass)
    console.log(titleClass!=="")
    if(titleClass!=="") {
        setTitleClass("")
        setTitle("")
        return;
    }
    return;
}
const changeTitle = (e) => {
    const newValue = e.target.value;
    setTitle(newValue);
    return;
}
useEffect(() => {
    const script = document.createElement("script");  
    fetch(domainUri+"/board/finalId", requestData)
    .then(function (response) {
        let data = response.json();
        return data;
  })
  .then(function(data) {
      console.log(data);
      finalId = data;
  })
  .then(function() {
    // alert("??");
    console.log(contentsRef);
    alert("finalId = "+finalId);
  }).then(function() {
    document.body.appendChild(script);
    script.src = "/ckeditor/ckeditor.js";
    script.onload = function () {
    if(condition === true) {
      console.log("condition :  "+ condition)
      CKEDITOR.replace(contentsRef.current, {
        filebrowserUploadUrl: domainUri+"/image/upload/"+finalId,
        font_names:
          "맑은 고딕/Malgun Gothic;굴림/Gulim;돋움/Dotum;바탕/Batang;궁서/Gungsuh;Arial/Arial;Comic Sans MS/Comic Sans MS;Courier New/Courier New;Georgia/Georgia;Lucida Sans Unicode/Lucida Sans Unicode;Tahoma/Tahoma;Times New Roman/Times New Roman;MS Mincho/MS Mincho;Trebuchet MS/Trebuchet MS;Verdana/Verdana",
        font_defaultLabel: "맑은 고딕/Malgun Gothic",
        fontSize_defaultLabel: "12",
        skin: "office2013",
        language: "ko"
      });
      alert("??? sdfadf");
      condition = false;
   }

  }
  })

}, []);
    return (
        <div>
        {
          (condition===false)
        ? (<div>Loading...</div>) :  (<div><NoneUserBoardWriteForm contentsRef={contentsRef} condition={condition}
        username={username} setUsername={setUsername} usernameClass={usernameClass} setUsernameClass={setUsernameClass}
        userNameRef={userNameRef}></NoneUserBoardWriteForm>
        
        <Header></Header>
                <section id={styles.section}>
                    <div className={styles.bodyHeader}>
                        <form action="/" encType="multipart/form-data"  id="inline">
                            <div className={styles.item2}>
                                <input type="text" name={styles.username} value={username} id={styles.username} maxLength="255"  className={usernameClass} 
                                ref={userNameRef} onClick={eraseUsername} onChange={changeUsername}/>
                                <input type="text" name={styles.password} value={password} id={styles.password} maxLength="255"  className={passwordClass}
                                ref={passwordRef} onClick={erasePassword} onChange={changePassword}/>
                                <input type="text" name={styles.title} value={title} id={styles.title} maxLength="255"  className={titleClass}
                                ref={titleRef} onClick={eraseTitle} onChange={changeTitle}/>
                                <div id={styles.writeButton} ref={writeButtonRef}>글쓰기</div>

                            </div>
                        </form>
                    </div>

                    <textarea name="contents" className="form-control" ref={contentsRef} styles={styles}></textarea>
                    
                    <article></article>
                </section>

                <footer id={styles.footer}>
                    <h2 id={styles.footerText}>간단한 게시판 만들기 - 정재광</h2>
                </footer>
        </div>)
        
        }
        
    </div>
    );
}
export default NoneUserBoardWriteSession;