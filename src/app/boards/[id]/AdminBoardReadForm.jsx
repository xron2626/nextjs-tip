

import styles from "./UserBoardReadForm.module.css"
import React, { useRef,useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
function AdminBoardReadForm() {
    const [commentList, setCommentList] = useState([]);
    const [isAddComment,setIsAddComment] = useState(false);
    const [disLikeCount, setDisLikeCount] = useState('0'); 
    const [likeCount, setLikeCount] = useState('0'); 
    const [boardContent, setBoardContent] = useState(); 
    const [text, setText] = useState('이름'); // 텍스트 상태 설정
    const editButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);
    

    const commentContentRef = useRef(null);
    const [boardWriterName, setBoardWriterName] = useState(null); 

    let likeCountNumber;
    let disLikeCountNumber;
    let boardId;
    const [sessionId, setSessionId] = useState(null); 
    const [nickname, setNickname] = useState(null); 
    const [stompClient, setStompClient] = useState(null);

    
    let allCommentId = 1;
    // let domainUri = "http://localhost:8080";
    // let domainUri = "http://27.96.131.120:8080";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        setUrl().then(function(data) {
            setNickname(data.nickname);
            setSessionId(data.userId);    
            setText(nickname);
        }).then(function() {    
            connect(sessionId);
    
            if(sessionId!==null) {
                x();
            }
        })
    },[sessionId])

    const handleTextChange = (e) => {
      setText(e.target.value); // 텍스트 변경 시 상태 업데이트
    };
    function setUrl() {
        boardId = getBoardId();
        let url = domainUri+"/user/account";
        console.log(url);
        let accountData = {
            "method" : "GET",
            headers:{
                 "Content-Type": "application/json"
            },
            credentials: 'include'
        }
    
        return fetch(url,accountData).then(function findUsername(response) {
            return response.json();
        }).then(function(data) {
            // alert("data= "+data)
            // alert("userId "+data.userId);
            // alert("nickname "+data.nickname);
            
            return data;
        })
    }
    function getBoardId() {
        boardId = window.location.href.split("/boards/")[1];
        return boardId;
    }
    function isUser(commentWriter) {

        if(boardWriterName.includes("_")) {
            return true;
        }
        return isAdmin(commentWriter);
    }
    function isAdmin(userId) {
        let data= {
            method: "GET"
        };
        return fetch(domainUri+"/check/admin/"+userId,data).then(function (res) {
            return res.text();
        }).then(function(res){
            console.log(res);
            if(res==true) {
                return true;
            }
            return false;
        })
    }
    function setAlarmData(boardId,summaryCommentContent,commentWriter) {

        if (isUser(commentWriter)) {
            return setUserAlarmData(boardId,summaryCommentContent,commentWriter);
        }
        else {
            return setNoneUserAlarmData(boardId,summaryCommentContent,commentWriter);
        }
    
    }   
    function setNoneUserAlarmData(boardId,summaryCommentContent,commentWriter) {
        let alarmData = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "boardId": boardId,
                "summaryCommentContent": summaryCommentContent,
                "userName" : commentWriter,
                "commentWriter":sessionId,
                "isVisited" : false,
            })
        }
        return fetch(domainUri+"/alarm/none-user",alarmData).then(function(response) {
            return response.text();
        })
    }
    function setUserAlarmData(boardId,summaryCommentContent,commentWriter) {
        let alarmData = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "boardId": boardId,
                "summaryCommentContent": summaryCommentContent,
                "commentWriter" : commentWriter,
                "isVisited" : false
            }),
            credentials: 'include'

        }
        return fetch(domainUri+"/alarm/user",alarmData).then(function(response) {
            return response.text();
        })
    }

    function sendMessage(boardId,summaryCommentContent) {

        let data = {
            message:"update"
        }
        
        stompClient.send("/app/send-message-to-user", {"sessionId":sessionId},JSON.stringify(data));

        return setAlarmData(boardId,summaryCommentContent,sessionId)
        .then(function (response) {
            // window.location.href = window.location.href
                setCommentList([]);
                addComment();
                setIsAddComment(false);
        })

    }
    
    
    function resize() {
        commentContentRef.current.style.height = "1px";
        commentContentRef.current.style.height = (12+commentContentRef.current.scrollHeight)+"px";
    }
    const commentSubmit = () => {
        if(isAddComment===false) {
            
            setIsAddComment(true);
        boardId = getBoardId();
        let url = domainUri+"/user/comment/"+boardId;
        let data = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            "userId":sessionId,
            "content":commentContentRef.current.value,
            "boardId":boardId
        }),
            credentials: 'include'
        }

        fetch(url,data).then(function x(response){
          
            sendMessage(boardId,commentContentRef.current.value);
        })
        // console.log(isAddCommentClick);
        // return isAddCommentClick;
    }
    };

    function connect(sessionId) {
        
        const socket = new SockJS(domainUri+'/my-websocket-endpoint');
        const client = Stomp.over(socket);

        client.connect({}, function(frame) {
            console.log('Connected: ' + frame);
            client.subscribe('/user/'+sessionId+'/queue/messages', function(message) {
                alert("새로운 글이 작성되었습니다");
            });
        });
        setStompClient(client);

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
        addComment();
    }

function addComment() {
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
        method: 'get' // 통신할 방식
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
                    if(commentId === 11) {
                        return;
                    }
                    if (key === "nickname") {
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

function updateLikeCount() {
    let url = domainUri+"/board/like";
    boardId = getBoardId();
    let data ={
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "joinStatusId": boardId,
        })
    }
    fetch(url,data).then(function(response) {
        return response.text();
    }).then(function(response) {
        setLikeCount(response)
    })
}

function updateDisLikeCount() {
    boardId = getBoardId();
    let url = domainUri+"/board/dislike";

    let data ={
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "joinStatusId": boardId
        })
    }
    fetch(url,data).then(function(response) {
        return response.text();
    }).then(function(response) {
        setDisLikeCount(response)
    })
}

function editBoard() {
    let param = window.location.href.split("boards/")[1];
    window.location.href="/boards/edit/"+param;
}

function deleteBoard() {
    let param = window.location.href.split("boards/")[1];
    // http://localhost:8080/board/admin/29

    let url = domainUri+"/boardd/admin/"+ param;
    // 데이터를 전송할 url
    let requestData = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }}
    fetch(url, requestData)
        .then(function (response) {
            window.location.href=domainUri+"/?pageQuantity=1&boardQuantity=20";
        });
}

    return (
        <div>
          
            <div id={styles.background}>
                <div style={{display: "flex",justifyContent: "space-around"}}>
                    <div id={styles.top}>
                        <div id={styles.childTitle}>제목</div>
                    </div>
                </div>
            

                <div style={{display: "flex" , justifyContent: "space-evenly"}}>
                    <section style={{width: "90%"}} id={styles.section} >
                        <div id={styles.author}>글쓴이</div>
                        <div dangerouslySetInnerHTML={{__html:boardContent}}></div>
                    </section>
                </div>
                <div id={styles.boardTool}>
                    <div id={styles.feedback}>
                        <div id={styles.up} onClick={updateLikeCount}>
                            <div>좋아요</div>
                            <div id={styles.likeCount}>{likeCount}</div>
                        </div>
                        <div id={styles.down} onClick={updateDisLikeCount}>
                            <div>싫어요</div>
                            <div id={styles.disLikeCount}>{disLikeCount}</div>
                        </div>
                    </div>
                    <div id={styles.manage}>
                        <div id={styles.edit} onClick={editBoard} ref={editButtonRef}>수정</div>
                        <div id={styles.delete} onClick={deleteBoard} ref={deleteButtonRef}>삭제</div>
                    </div>
                </div>
            </div>
            <div id={styles.comment}>댓글</div>
            <hr className={styles.x}/>
            <div id={styles.commentGroup}>
            {commentList.map((item, index) => (
                <div key = {index} id={"comment"+{index}}>
                    <div className={styles.parentReadCommentArea}>
                        <div className={styles.parentReadCommentName}>{item.username}</div>
                    </div>
                    <div className={styles.parentWriteComment} >{item.content}</div>
                </div>
            ))}
            </div>
            <div id={styles.flex}>
                <div id={styles.commentWriteNameArea2}>
                    <div  className={styles.commentWrite1} id={styles.commentWriteName1} >{text}</div>
                </div>
            </div>
            <textarea className={styles.parentWriteComment}  id={styles.parentWriteComment1} style={{height: "335px"}}
            ref={commentContentRef} onKeyUp={resize} onKeyDown={resize} ></textarea>
            <div className={styles.parentCommentSubmitArea} id={styles.parentWriteCommentSubmit1}>
                <div className={styles.parentCommentSubmit} onClick={commentSubmit} >전송</div>
            </div>
            <div id={styles.white}></div>  
        </div>
    )
}
export default AdminBoardReadForm;