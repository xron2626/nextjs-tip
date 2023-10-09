import React, { useRef, useState } from 'react';

function FindId() {
    const emailRef = useRef(null);
    const [timer, setTimer] = useState("00:00");
    const certificationCodeRef = useRef(null); 
    // const domainUri = "http://localhost:8080";
    // const domainUri = "https://port-0-changeproject-19k5ygi525lcw5y5kb.gksl2.cloudtype.app";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
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
        let url = domainUri + "/email/findId";
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
    function getUserId() {
        let data = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }
        fetch(domainUri+"/email/certificate/userId?certificationCode="+certificationCodeRef.current.value+
        "&email="+emailRef.current.value,data).then(function(response) {
            return response.text();
        }).then(function (data) {
            if(data==="fail") {
                alert("실패");
            }
            else {
                alert("당신의 ID는 "+data+"입니다.");
                location.href="/login";
            }
        })

    }
    return (
    <div>
        <input type="text" placeholder="이메일" ref={emailRef}/>
        <button onClick={getEmail}>전송</button>
        <p>{timer}</p>
        <input type="text" placeholder="인증번호"  ref={certificationCodeRef}/>
        <button onClick={getUserId}>확인</button>
    </div>)
}
export default FindId;