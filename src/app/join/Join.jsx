
import styles from "./Join.module.css";
import { useEffect, useRef, useState } from "react";

import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';

function Join() {
    const emailRef = useRef(null);
    const emailCodeRef = useRef(null);
    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordVerificationRef = useRef(null);
    const nicknameRef = useRef(null);
    const selectList = ["남성", "여성", "성별을 알리고 싶지 않습니다."];
    const ageRef = useRef(null);
    const transRef = useRef(null);
    const phoneNumberRef = useRef(null);

    const [Selected, setSelected] = useState("남성");
    const [timer, setTimer] = useState("00:00");
    
    let count = 181;
    let time;
    let isClick = false;
    // let domainUri = "https://port-0-changeproject-19k5ygi525lcw5y5kb.gksl2.cloudtype.app";
    // let domainUri = "http://localhost:3000/api";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
  const handleSelect = (e) => {
    setSelected(e.target.value);
  };
    const sendPost = () => {
        // alert("trans = " + Selected);
        if (isClick === true) return;
        isClick = true;
        let url = domainUri + "/join";
        let userId = idRef.current.value;
        let nickname = nicknameRef.current.value;
        let password = passwordRef.current.value;
        let checkPassword = passwordVerificationRef.current.value;
        let email = emailRef.current.value;
        let emailCode = emailCodeRef.current.value;
        let age = ageRef.current.value;
        if(isNaN(age) || age==="") {
            isClick = false;
            alert("입력 값은 숫자이어야 합니다");
            return;
        }
        let phoneNumber = phoneNumberRef.current.value;
        // alert("PhoneNumber = "+phoneNumber);
        
        let trans = transRef.current.value;
        // alert("trans = "+trans);
        if (password !== checkPassword) {
            isClick = false;
            alert("비밀번호가 다릅니다");
            return;
        }
        let data = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'userId': userId,
                'nickname': nickname,
                'password': password,
                'email': email,
                'trans': trans,
                'emailCode': emailCode,
                'age': age,
                'phoneNumber': phoneNumber
            }),

        }
        fetch(url, data).then(response => {
            if (response.ok) {
                window.location.href = "/login";
            }
            return response.json();

        }).then(errorMsg => {
            isClick = false;

            alert(errorMsg.error);
        })
    }
    const getEmail = () => {
        if(timer==="00:00") {
            let params = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            // enctype : "multipart/form-data",
                body: JSON.stringify({
                    "email":emailRef.current.value
                })
            }
            let url = domainUri + "/email/join";
            fetch(url, params)
                .then(function (response) {
                //  console.log(response.json());
                    if (response.status === 500) {
                        throw new Error("데이터 없음");
                    }
                    return response.json();
                })
                .then(function (data) {
                    let email = data;
                    console.log(email);
                    return;

                }).catch(function (e) {
                    console.log(e);
                });
                setTimer("00:00");
                count = 181;
                time = setInterval(myTimer, 1000);
            }
            else {
                alert("이메일 인증에는 최소 제한시간이 존재합니다");
            }
        };
        
    function myTimer() {
        count = count - 1;
        let minute = Math.floor(count / 60);
        if (minute < 10) {
            minute = "0" + minute;
        }
        let second = count % 60;
        if (second < 10) {
            second = "0" + second;
        }
        console.log("count=" + count);
        setTimer(minute + ":" + second);
        if (count === 0) {
            clearInterval(time);	// 시간 초기화
            alert("시간이 완료되었습니다.");
        }
    }
    return (
        <div id={styles.background}>
            <div className={styles.area21}>
                <input type="button" value="로그인" id={styles.loginBox} className={styles.box} style={{cursor:"pointer"}}
                    onClick={() =>window.location.href ='/login'}/>
                <input type="button" value="회원가입" id={styles.joinBox} 
                    className={`${styles.container} ${styles.box}`}  
                    style={{cursor:"pointer"}}
                    onClick={() =>window.location.href ='/join'}/>
                <img src="/image/homeicone8.png" width="80px" height="40px"alt="My github" id={styles.home}
                    className={styles.container} style={{cursor:"pointer"}} />
                <input type="button" value="글쓰기" id={styles.writeBox} className={styles.box} style={{cursor:"pointer"}}
                    onClick={() =>window.location.href ='/write'}/>
                <input type="button" value="글 조회" id={styles.readBox} className={styles.box} style={{cursor:"pointer"}}
                    onClick={() =>window.location.href ='/?pageQuantity=1&boardQuantity=20'} />
            </div>

            <section id={styles.section}>
                <article id={styles.article}>
                    <div className={styles.con} id={styles.loginHeader}>
                        <div id={styles.login}>
                            <h1 id={styles.as}>회원가입</h1>
                        </div>
                    </div>
                    <div className={styles.con}>
                        <div className={styles.as}>
                            <p className={styles.x}>id</p>
                            <input type="text" id={styles.userId} placeholder="id" className={styles.flexBox} ref={idRef}/>
                        </div>
                    </div>
                    <div className={styles.con}>
                    <div className={styles.as}>
                            <p className={styles.x}>비밀번호</p>
                            <input type="text" id={styles.password} placeholder="비밀번호" className={styles.flexBox} 
                            ref={passwordRef}/>
                        </div>
                    </div>
                    <div className={styles.con}>
                    <div className={styles.as}>
                            <p className={styles.x}>비밀번호 확인</p>
                            <input type="text" id={styles.checkPassword} placeholder="비밀번호 확인" className={styles.flexBox}
                            ref={passwordVerificationRef}/>
                        </div>
                    </div>
                    <div className={styles.con}>
                    <div className={styles.as}>
                            <p className={styles.x}>닉네임</p>
                            <input type="text" id='nickname'placeholder="닉네임" className={styles.flexBox} ref={nicknameRef}/>
                        </div>
                    </div>
                    <div className={styles.con4}>
                        <div className={styles.as3}>
                            <p className={styles.x} >성별</p>
                            <select id={styles.trans} onChange={handleSelect} value={Selected} ref={transRef}>
                                {selectList.map((item) => (
                                    <option value={item} key={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.con3}>
                    <div className={styles.as2}>
                            <p className={styles.x}>이메일</p>
                            <div id={styles.emailDiv}>
                                <input type="text" placeholder="email" id={styles.userEmail} className={styles.flexBox} ref={emailRef}/>
                                <input type="button" value="인증 버튼" id={styles.checkUserEmailButton} className="inline-flex-1"
                                 onClick={getEmail} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.con}>
                    <div className={styles.as}>
                            <p className={styles.x}>이메일 인증코드</p>
                            <input type="text" id={styles.checkEmail} className={styles.flexBox} placeholder="인증 코드" ref={emailCodeRef}/>
                            <p id={styles.timer}>{timer}</p>
                        </div>
                    </div>
                    <div className={styles.con}>
                    <div className={styles.as}>
                            <p className={styles.x}>나이</p>
                            <input type="text" placeholder="나이" id={styles.age} className={styles.flexBox} ref={ageRef}/>
                        </div>
                    </div>    
                    <div className={styles.con}>
                    <div className={styles.as}>
                            <p className={styles.x}>전화번호</p>
                            <input type="text" placeholder="전화번호" id={styles.phoneNumber} className={styles.flexBox} ref={phoneNumberRef}/>
                        </div>
                    </div>
                    <div className={styles.con}>
                        <button id={styles.joinButton} onClick={sendPost}>회원가입</button>
                    </div>
                </article>
            </section>  
        <aside id={styles.aside}></aside>
        <footer id={styles.footer}></footer>
        </div>
    );
}
export default Join;
// select랑 Option -> selected랑 옵션 리스트로 변경 
