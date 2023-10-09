/* eslint-disable */ 

import { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
// import NoneUserBoardWrtieUi from "./NoneUserBoardWriteUi";  
// npm install sockjs-client 
// npm install @stomp/stompjs


function NoneUserBoardWriteLogic({contentsRef,writeButtonRef,userNameRef,passwordRef,titleRef,password}) {
  let condition = true;
  let sessionId;
  let domainUri = process.env.NEXT_PUBLIC_API_URL;
  // let domainUri = "http://27.96.131.120:8080";
  
  // let domainUri = "https://port-0-changeproject-19k5ygi525lcw5y5kb.gksl2.cloudtype.app";
  let finalId;
  // jsx로 다 교체하면 코드 블럭이 안 꺠지므로 바꾸는게 좋을듯 
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./ckeditor/ckeditor.js";
    console.log("??");
    let requestData = {
        method: "GET",

        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        // enctype : "multipart/form-data",
    };
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
          console.log(contentsRef);
          document.body.appendChild(script);
        }).then(function() {
          script.onload = function () {
          if(condition === true) {
            console.log("condition :  "+ condition)
            condition = false;
            CKEDITOR.replace(contentsRef.current, {
              filebrowserUploadUrl: domainUri+"/image/upload/"+finalId,
              font_names:
                "맑은 고딕/Malgun Gothic;굴림/Gulim;돋움/Dotum;바탕/Batang;궁서/Gungsuh;Arial/Arial;Comic Sans MS/Comic Sans MS;Courier New/Courier New;Georgia/Georgia;Lucida Sans Unicode/Lucida Sans Unicode;Tahoma/Tahoma;Times New Roman/Times New Roman;MS Mincho/MS Mincho;Trebuchet MS/Trebuchet MS;Verdana/Verdana",
              font_defaultLabel: "맑은 고딕/Malgun Gothic",
              fontSize_defaultLabel: "12",
              skin: "office2013",
              language: "ko"
            });
            writeButtonRef.current.addEventListener("click",saveGallery);
            console.log(writeButtonRef.current)
            console.log("??");
         }

        }
        });

  }, []); //useEffect []를 넣으면 한번만 작동하는데, script를 삽입하는 코드는 잘 되는지 확인한다고 2번 실행되서 두번 함수 작동해서 소멸자 쪽에 지움 


let jwtTimeData = {
    method:'GET'
}

  useEffect(() => {
    fetch(domainUri+"/jwt/time",jwtTimeData)
      .then((response) => {
          return response.text();
      }).then((data)=> {
      let isJwtExpired = Number(data);

      if(isJwtExpired === 0) {
          return JwtExpiredProcess();
      }
      if(isJwtExpired === -1) {
          return;
      }

      return setTimeout(JwtExpiredProcess,isJwtExpired)
    })
  }, []); // [] 내용물이 없으면 최초 1회만 호출


  function JwtExpiredProcess() {
      window.location.href =  domainUri + "/jwt/expiration";
  }
  useEffect(() => {
    setUrl().then(function(data) {
      sessionId = data;
      connect(sessionId);
    })
  }, []);

    

  

  function setUrl() {
    let url = domainUri + "/user-noneuser/account";
    let accountData = {
        "method" : "GET",
        headers : {
          "Content-Type": "application/json"
        }
    }

    return fetch(url,accountData).then(function findUsername(response) {
        return response.json().nickname;
    });
  }
  function connect(sessionId) {
    let stompClient = null;
    const socket = new SockJS(domainUri+'/my-websocket-endpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/user/'+sessionId+'/queue/messages', function(message) {
            alert("새로운 글이 작성되었습니다");
        });
    });
  }




function saveGallery () {
  if (window.confirm("저장하시겠습니까?") === false) {
      return;
  }
    let requestUsername = userNameRef.current.value
    let requestPassword = passwordRef.current.value;
    let requestTitle = titleRef.current.value;

    let requestData = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
  
      },
      body: JSON.stringify({
        'id' : finalId,
        'username' : requestUsername,
        'password' : requestPassword,
        'title' : requestTitle,
        'content' : CKEDITOR.instances[contentsRef.current.name].getData()
      }),
      credentials: "include"
    };


    fetch(domainUri+"/board/none-user", requestData).then(function (response) {
      alert("저장되었습니다");
      window.location.href="/?pageQuantity=1&boardQuantity=20";
      console.log(response);
    });
}
  // 위에는 saveGallery 기본 js 함수 

  return (
    <div>

    </div>
  );
}
export default NoneUserBoardWriteLogic;
