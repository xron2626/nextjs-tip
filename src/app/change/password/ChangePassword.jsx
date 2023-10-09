import React, { useRef, useState } from 'react';

function ChangePassword() {
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    // const domainUri = "https://port-0-changeproject-19k5ygi525lcw5y5kb.gksl2.cloudtype.app";
    const emailRef = useRef(null);
    const [timer, setTimer] = useState("00:00");
    const certificationCodeRef = useRef(null); 
    const userIdRef = useRef(null); 
    
    
    const changingPasswordRef = useRef(null); 
    let count = 181;
    let time;
    const getEmail = () => {
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
        let url = domainUri + "/email/changePassword";
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
    };


    function myTimer() {

        count = count - 1; // 타이머 선택 숫자에서 -1씩 감산함(갱신되기 때문)
        let minute = Math.floor(count / 60);
        if (minute < 10) {
            minute = "0" + minute;
        }
        let second = count % 60;
        if (second < 10) {
            second = "0" + second;
        }
        // console.log("m="+minute);
        // console.log("s="+second);
        console.log("count=" + count);
        setTimer(minute + ":" + second);
        if (count == 0) {
            clearInterval(time);	// 시간 초기화
            alert("시간이 완료되었습니다.");
        }
    }
    function changePassword() {
        let data = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            // enctype : "multipart/form-data",
            }
        fetch(domainUri+"/email/certificate/password?email="+emailRef.current.value+"&certificationCode="+certificationCodeRef.current.value
            +"&userId="+userIdRef.current.value+"&changePassword="+changingPasswordRef.current.value,data).then(function(response) {
            return response.text();
        }).then(function (data) {
            if(data==="fail") {
                alert("실패");
            }
            else window.location.href="/";
        })

    
    }
    return (
    <div>
        <input type="text" placeholder="유저 id"  id="userId" ref={userIdRef}/>
        <input type="text" placeholder="바꿀 비밀번호"  id="changingPassword" ref={changingPasswordRef} />
        <p></p>
        <input type="text" placeholder="이메일" id="email" ref={emailRef}/>
        <button onClick={getEmail}>전송</button>
        <p>{timer}</p>
        <input type="text" placeholder="인증번호"  id="certificationCode" ref={certificationCodeRef}/>
        <button onClick={changePassword}>확인</button>
    </div>
    );
}
export default ChangePassword;