import React, { useRef,useEffect, useState } from 'react';
import NoneUserBoardReadForm from './NoneUserBoardReadForm';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
function LoadSessionForm() {
    const [sessionId, setSessionId] = useState(null);
    const boardId = window.location.href.split("/boards/")[1];
    const [boardWriterName, setBoardWriterName] = useState(null); 
    const [disLikeCount, setDisLikeCount] = useState(null); 
    const [likeCount, setLikeCount] = useState(null); 
    const [boardContent, setBoardContent] = useState(null); 
    const [commentList, setCommentList] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    let isAddCommentClick = false;
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    let likeCountNumber;
    let disLikeCountNumber;
    let allCommentId = 1;


    function getBoardId() {
        boardId = window.location.href.split("/boards/")[1];
        return boardId;
    }

    function addComment(isAddCommentClick) {
        // fetch 전송 하고
        // 뒤에 데이터 받게 하기
        let commentGroup;
        let boardId = document.location.href.split("boards/")[1];
        let userName;
    
        let readComment;
        let comment;
        let name;
        let textarea;
        let commentId = 1;
    
        let url = domainUri+"/comment/"+boardId+"?startId="+allCommentId;
        let data= {
            method: 'get', // 통신할 방식
            credentials: 'include'
        }
        fetch(url,data).then(function (response) {
            return response.json();
        }).then(function (x) {
            console.log(x);
            x.some(obj => {
                let newItem = {
                    content: '새로운 내용',
                    username: '새로운 유저',
                };
                Object.entries(obj)
                    .forEach(([key, value]) => {      
                        if(commentId==11) {
                            return;
                        }
                        if (key === "userName") {
                            newItem.username = value;
                        } else if (key === "content") {
                            newItem.content = value;
                        }
                    })
                if(commentId===11) {
                    return;
                }
                
                setCommentList(prevList => [...prevList, newItem]);
    
            })
            console.log("?"+commentId);
    
        });
    
    
    }

      function x() {
        let hrefArrays = document.location.href.split("boards/");
        let borderNumber = hrefArrays[1];
        let content;
        let form = document.createElement('div');
        form.setAttribute('method', 'post'); //POST 메서드 적용
        let url = domainUri+"/boards/"+borderNumber+"/data";
        // form.setAttribute('action', url);	// 데이터를 전송할 url
        // json 리다이렉트 vs form 전송 받기 근데 이경우는 form 이동으로 해버리면 로직이 되게 복잡해짐
      
        let requestData = {
            method: "GET",
            headers: {
                // Accept: "application/json",
                // "Content-Type": "application/json"
            },
            credentials: "include"
        }
        fetch(url, requestData)
            .then(function (response) {
                //  console.log(response.json());
                if(response.status===500) {
                    throw new Error("데이터 없음");
                }
                // alert("저장되었습니다");
                return response.json();
            })
            .then(function (datas) {
                setBoardWriterName(datas["boardWriterName"]);
                content = datas["contents"];
                likeCountNumber = datas['likeCount'];
                disLikeCountNumber = datas["disLikeCount"];
            }).then(function() {
            setBoardContent(content);
            setLikeCount(likeCountNumber);
            setDisLikeCount(disLikeCountNumber);
            
            return;
    
        }).catch(function (e) {
            
            console.log(e);
    
        });
    
        // let commentSubmitButtons = document.getElementsByClassName("parentCommentSubmitArea");
    
        if(isAddCommentClick === false) {
            addComment(isAddCommentClick);
            isAddCommentClick = true;
        }
        
    
    
    }


    function setUrl() {

        let url = domainUri+"/board/uuid?boardId="+boardId;
        console.log(url);
        let accountData = {
            "method" : "GET",
            credentials: "include"
        }
        
    
        return fetch(url,accountData).then(function findUsername(response) {
            return response.text();
        });
    }
    
    function connect(sessionId) {
        const socket = new SockJS(domainUri+'/my-websocket-endpoint');
        alert("socket = "+socket);
        const client = Stomp.over(socket);
        alert("client = "+client);
        client.connect({}, function(frame) {
            console.log('Connected: ' + frame);
            // client.subscribe('ws://http://localshot:8080/user/'+sessionId+'/queue/messages', function(message) {
            client.subscribe('/user/'+sessionId+'/queue/messages', function(message) {
                alert("새로운 글이 작성되었습니다");
            });
        });
        
        setStompClient(client);

      }
    useEffect(() => {
        setUrl().then(function(data) {
            alert("LoadSessionForm sessionId = "+data);
            setSessionId(data);
            return data;
        }).then(function(data) {
            connect(data);
            x();
         
        })
    },[])

    
    return (
        <div>
            {
            (sessionId === null ) || (boardWriterName===null) || (disLikeCount===null) || (likeCount === null) || (boardContent === null)
            || (stompClient === null) 
            ? (<div>Loading...</div>) :  (<NoneUserBoardReadForm sessionId={sessionId} setSessionId={setSessionId} 
            boardWriterName={boardWriterName} likeCount={likeCount} setLikeCount={setLikeCount} disLikeCount={disLikeCount} setDisLikeCount={setDisLikeCount}
            boardContent = {boardContent} stompClient={stompClient} commentList={commentList}
            /> )}
            
        </div>
    );
}

export default LoadSessionForm;