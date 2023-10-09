/* eslint-disable */ 
import NoneUserBoardEditForm from "./NoneUserBoardEditForm";
import React, { useRef,useEffect, useState } from 'react';
import "./ckeditor-board-edit.css";
import styles from "./NoneUserBoardEditForm.module.css";
function NoneUserEditLoadSession() {
  const [title, setTitle] = useState('');
  const contentsRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  let condition = true;
  let domainUri = process.env.NEXT_PUBLIC_API_URL;
  let ckeditior;
useEffect(() => {
  const script = document.createElement("script");  
    script.src = "/ckeditor/ckeditor.js";
    console.log("??");
    let requestData = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        // enctype : "multipart/form-data",
    };
        document.body.appendChild(script);
        script.onload = function () {
          if(condition === true) {
            console.log("condition :  "+ condition)

            condition = false;
            CKEDITOR.replace(contentsRef.current, {
              filebrowserUploadUrl: domainUri + "/image/upload/"+window.location.href.split("/edit/")[1],
              font_names:
                "맑은 고딕/Malgun Gothic;굴림/Gulim;돋움/Dotum;바탕/Batang;궁서/Gungsuh;Arial/Arial;Comic Sans MS/Comic Sans MS;Courier New/Courier New;Georgia/Georgia;Lucida Sans Unicode/Lucida Sans Unicode;Tahoma/Tahoma;Times New Roman/Times New Roman;MS Mincho/MS Mincho;Trebuchet MS/Trebuchet MS;Verdana/Verdana",
              font_defaultLabel: "맑은 고딕/Malgun Gothic",
              fontSize_defaultLabel: "12",
              skin: "office2013",
              language: "ko"
            });
            // writeButtonRef.current.addEventListener("click",saveGallery);
            
            console.log("??");
         }
        }
        let boardId = location.href.split("/boards/edit/")[1];
        let url = domainUri+"/boards/"+boardId+"/data";
        let params = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include'
    
        }
/*
        fetch(url,params)
        .then(function x(response) {
        if(response.status==500) {
            location.href = domainUri+"/404page";;
        }
        let data = response.json();
          return data;
    // then 절로 중복 방지
        })
        .then(function getBackData(data) {
        console.log(data);
        alert("??");
        setTitle(data.title);
        CKEDITOR.instances.contents.setData(data.contents);
        console.log(data.contents);
        setUsername(data.boardWriterId);
        return data.contents;
        }).then(function isErrorRetry(content) {
        console.log(CKEDITOR.instances.contents.getData(content));
        if(CKEDITOR.instances.contents.getData() === null) {
        // 데이터 등록이 바로 안되서 리다이렉트 함
            location.href = location.href;
        }
        
    }
    )
    
    useEffect(() => {
        setUrl().then(function(data) {
            setSessionId(data);    
            setText(sessionId);
        }).then(function() {    
            connect(sessionId);
            setButton();
            if(sessionId!==null) {
                x();
            }
        })
    },[sessionId])
*/
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
    
        
    return () => {
      script.onload = function () {    
        document.body.removeChild(script);
        // writeButtonRef.current.removeEventListener("click",saveGallery);
      },[]

    };
  }, );
  return (
    <div>
        {
        (contentsRef === null ) ||  (condition===null) 
        ? (<div>Loading...</div>) :  (<div><NoneUserBoardEditForm contentsRef={contentsRef} condition={condition} ></NoneUserBoardEditForm><textarea name="contents" className="form-control" ref={contentsRef} styles={styles}></textarea></div> )
        }
        
    </div>
);
}
export default NoneUserEditLoadSession;