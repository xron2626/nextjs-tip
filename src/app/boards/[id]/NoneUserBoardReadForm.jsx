

import styles from "./NoneUserBoardReadForm.module.css"
import React, { useRef,useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';




function NoneUserBoardReadForm() {
    

    const [isAddComment,setIsAddComment] = useState(false);

    const [commentList, setCommentList] = useState([]);
    const [text, setText] = useState('이름'); // 텍스트 상태 설정
    const [childCommentState, setChildCommentState] = useState('close'); // 텍스트 상태 설정
    const [parentCommentState, setParentCommentState] = useState('close'); // 텍스트 상태 설정

    const handleTextChange = (e,countData2) => {
        setText(e.target.value); // 텍스트 변경 시 상태 업데이트
    };
    const toggleChildComment = (e,index) => {
        
        if(childCommentState === "open") {
            setChildCommentState("close");
        }
        else {
            setChildCommentState("open");
        }
    };
    
    const toggleParentComment = (e,index) => {
        
        if(parentCommentState === "open") {
            setParentCommentState("close");
        }
        else {
            setParentCommentState("open");
        }
    };
    const handleChildCommentUsername = (e,index) => {
        
        const updatedUserNames = [...childCommentWriteUserName];
        updatedUserNames[index]=e.target.value;
        setChildCommentWriteUserName(updatedUserNames); // 텍스트 변경 시 상태 업데이트
        // alert(childCommentWriteUserName[index]);

    };
   

    const handleChildCommentPassword = (e,index) => {
        const updatedPasswords = [...childCommentWritePassword];
        updatedPasswords[index] = e.target.value;
        setChildCommentWritePassword(updatedPasswords); 
    };

    const handleChildCommentContent = (e,index) => {
        const updatedUserContents = [...childCommentWriteContent];
        updatedUserContents[index]=e.target.value;
        setChildCommentWriteContent(updatedUserContents); // 텍스트 변경 시 상태 업데이트
    };
    const [commentInputs, setCommentInputs] = useState(Array());

    const [disLikeCount, setDisLikeCount] = useState('0'); 
    const [likeCount, setLikeCount] = useState('0'); 
    const [boardContent, setBoardContent] = useState(); 
    const [titleContent, setTitleContent] = useState('제목'); 
    const [childCommentWriteUserName, setChildCommentWriteUserName] = useState([]);
    const [childCommentWritePassword, setChildCommentWritePassword] = useState([]);
    const [childCommentWriteContent, setChildCommentWriteContent] = useState([]);
    
   
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const feedbackRef = useRef(null);
    const manageRef = useRef(null);
    const parentCommentContentRef = useRef(null);
    const [boardWriterName, setBoardWriterName] = useState(null); 

    let likeCountNumber;
    let disLikeCountNumber;
    let boardId;
    const [sessionId, setSessionId] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const editButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);
    
    let allCommentId = 1;
    // let domainUri = "http://27.96.131.120:8080";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    // let domainUri = "https://port-0-java-springboot-17xqnr2algm9dni8.sel3.cloudtype.app";
    
    useEffect(() => {
        setUrl().then(function(data) {
            setSessionId(data);
            return data;
        }).then(function(sessionId) {
        
            connect(sessionId);
            setButton();
            x();
        })
    },[])
    function setButton() {
        let url = domainUri +"/board/userAuthority?boardId="+boardId;
        let data = {
            "METHOD":"GET",
            credentials: "include"
        };


        fetch(url,data).then(function(response){
            return response.text();
        }).then(function(response){
            if(response!=="ok") {
                deleteButtonRef.current.style.display="none";
                editButtonRef.current.style.display="none";
                manageRef.current.style.display="none";
                feedbackRef.current.style.width="90%";

            }
        })
    }
    
    

    function setUrl() {
        boardId = getBoardId();
        let url = domainUri+"/board/uuid?boardId="+boardId;
        console.log(url);
        let accountDataData = {
            "method" : "GET",
            credentials: "include"
        }
        
    
        return fetch(url,accountDataData).then(function findUsername(response) {
            return response.text();
        });
    }
    // boardId를 가져옴 
    function getBoardId() {
        boardId = window.location.href.split("/boards/")[1];
        return boardId;
    }
    // 일반 사용자인지 확인 
    function isUser(commentWriter) {
        // alert("isJustUser "+boxardWriterName.includes("_"));
        if(boardWriterName.includes("_")) {
            return true;
        }
        // alert("it is not Just User");
        return isAdmin(commentWriter);
    }
    // 어드민인지 확인 
    function isAdmin(userId) {
        
        let data= {
            method: "GET",
            credentials: "include"
        };
        fetch(domainUri+"/check/admin/"+userId,data).then(function (res) {
            // alert("??");
            return res.text();
        }).then(function(res){
            // alert("isAdmin: "+res);
            if(res==true) {
                return true;
            }
            return false;
        })
    }                 
    function setAlarmData(boardId,summaryCommentContent,commentWriter) {

        if (isUser(commentWriter)) {
            return setCommentUserAlarmData(boardId,summaryCommentContent,commentWriter);
        }
        else {
            return setCommentNoneUserAlarmData(boardId,summaryCommentContent,commentWriter);
        }
    
    }   
    
    // 게시글 작성자가 비유저인 경우
    function setCommentNoneUserAlarmData(boardId,summaryCommentContent,commentWriter) {
        let alarmData = {
            method: "POST",
            headers: {
                // Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "boardId": boardId,
                "summaryCommentContent": summaryCommentContent,
                "userName" : commentWriter,
                "boardWriterId":sessionId,
                "isVisited" : false,
            }),
            credentials: "include"
        }
        return fetch(domainUri+"/alarm/none-user",alarmData).then(function(response) {
            return response.text();
        })
    }
    
    // 게시글 작성자가 유저인 경우
    function setCommentUserAlarmData(boardId,summaryCommentContent,commentWriter) {
        let alarmData = {
            method: "POST",
            headers: {
                Accept: "application/json",
                // "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "boardId": boardId,
                "boardWriterName" : boardWriterName,
                "summaryCommentContent": summaryCommentContent,
                "commentWriter" : commentWriter,
                "isVisited" : false
            }),
            credentials: "include"
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
            
            // router.push(window.location.href);
            
        })

    }
    const childCommentSubmit = (parentCommentId,parentCommentUserId,index) => {
        boardId = getBoardId();
        // alert(parentCommentId);
        // alert(childCommentWriteUserName);
        // alert(childCommentWritePassword);
        // alert(childCommentWriteContent);
        // alert("username = "+childCommentWriteUserName[0]);
        // alert("password = "+childCommentWritePassword[0]);
        let url = domainUri+"/noneUser/childComment/"+boardId;
        let data = {
            method: "POST",
            headers: {
                  // Accept: "application/json",
                 "Content-Type": "application/json"
            },
            body: JSON.stringify({
            "nickname":childCommentWriteUserName[index],
            "password":childCommentWritePassword[index],
            "content":childCommentWriteContent[index],
            "parentId":parentCommentId
        }),
        credentials: "include"

    }
    // alert(" isAddComment = "+isAddComment);
        if(isAddComment===false) {
            
        setIsAddComment(true);
        fetch(url,data) .then(function(response) {
            if (!response.ok) {
                console.log("Network response was not ok");
            }
            return response.text();
            })
            //.then(function(data) {
        
        //"http://localhost:8080/boards"+boardId;
        // 알림 서비스 추가

            // return sendMessage(boardId,childCommentWriteContent,parentCommentUserId);
            // }).then(function() {

            // });
        // console.log(isAddCommentClick);
        // return isAddCommentClick;
        }

    };
    const parentCommentSubmit = () => {
        
        boardId = getBoardId();
        let url = domainUri+"/noneUser/parentComment/"+boardId;
        let data = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            "password": passwordRef.current.value,
            "nickname": usernameRef.current.textContent,
            "content":parentCommentContentRef.current.value,
        }),
        credentials: "include"

    }
    // alert(" isAddComment = "+isAddComment);
        if(isAddComment===false) {
            
        setIsAddComment(true);
        fetch(url,data) .then(function(response) {
            if (!response.ok) {
                console.log("Network response was not ok");
            }
            return response.text();
            }).then(function(data) {
            
        //"http://localhost:8080/boards"+boardId;
        // 알림 서비스 추가

            return sendMessage(boardId,parentCommentContentRef.current.value);
            }).then(function() {

            });
        // console.log(isAddCommentClick);
        // return isAddCommentClick;
        }
    };

    
    function resize() {
        parentCommentContentRef.current.style.height = "1px";
        parentCommentContentRef.current.style.height = (12+parentCommentContentRef.current.scrollHeight)+"px";
    }
  
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
    let title;
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
            title = datas["title"];
            likeCountNumber = datas['likeCount'];
            disLikeCountNumber = datas["disLikeCount"];
        }).then(function() {
        setBoardContent(content);
        setTitleContent(title)
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
                objectId: '임의의 값',
                userId: '유저 아이디',
                childCommentReadDataDtos:new Array()
            };
            

            
            Object.entries(obj)
                .forEach(([key, value]) => {      
                    if(commentId==11) {
                        return;
                    }
                    if (key === "nickname") {
                        newItem.username = value;
                    } else if (key === "content") {
                        newItem.content = value;
                    } else  if(key === "objectId") {
                        newItem.objectId = value;
                    } else if(key ==="userId") {
                        newItem.userId = value;
                    }
                    else {
                        // alert("key = "+key+" value = "+value);
                        
                        Object.entries(value).forEach(([key2,value2]) => {
                                let childItem = {
                                    userId: "자식 유저 아이디",
                                    content: '자식 유저의 새로운 내용',
                                    nickname: '자식 유저의 별명'
                                }
                                childItem.userId = value2.userId;
                                childItem.content = value2.content;
                                // alert(" childItem.content = "+childItem.content)
                                childItem.nickname = value2.nickname;
                                newItem.childCommentReadDataDtos.push(childItem)

                            })
                            
                            let username ="이름";
                            let password ="비밀번호";
                            let content ="내용";
              
                            setChildCommentWriteUserName(prevList => [...prevList, username ]);
                            setChildCommentWritePassword(prevList => [...prevList, password]);
                            setChildCommentWriteContent(prevList => [...prevList, content]);
                            
                    }
                    
                    
                    
                })
            
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
        }),
        credentials: "include"
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
        ,credentials: "include"
    }
    fetch(url,data).then(function(response) {
        return response.text();
    }).then(function(response) {
        setDisLikeCount(response)
    }),[]}

function editBoard() {
    let param = window.location.href.split("boards/")[1];
    window.location.href="/boards/edit/"+param;
}
function deleteBoard() {
    let boardId = window.location.href.split("boards/")[1];
    window.location.href=domainUri+"/board/none-user/delete/"+boardId;
}

    return (
        <div>
            <div id={styles.background}>
                <div style={{display: "flex",justifyContent: "space-around",paddingTop:"20px"}}>
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
                    <div id={styles.feedback} ref={feedbackRef}>
                        <div id={styles.up} onClick={updateLikeCount}>
                            <img src="../thumbs-up-solid.svg"></img>
                            <div id={styles.likeCount}>{likeCount}</div>
                        </div>
                        <div id={styles.feedbackCenter}></div>
                        <div id={styles.down} onClick={updateDisLikeCount}>
                        <img src="../thumbs-down-solid.svg"></img>
                            <div id={styles.disLikeCount}>{disLikeCount}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id={styles.manage} ref={manageRef}>
                <button id={styles.edit} onClick={editBoard} ref={editButtonRef}>수정</button>
                <button id={styles.delete} onClick={deleteBoard} ref={deleteButtonRef}>삭제</button>
            </div>
            <div id={styles.comment}>댓글</div>
            <div id={styles.commentGroup}>
            {commentList.map((item, index) => (
                <div key={index} className={styles.parentCommentDiv0} >
                        <div className={styles.parentCommentDiv1} id={styles[`parentComment${index}`]}>
                        <div >
                            <div className={styles.parentReadCommentArea}>
                                <div className={styles.parentReadCommentName}>{item.username}</div>
                            </div>
                            <div className={styles.parentWriteComment} >{item.content}</div>
                                <div id={styles.changeId}>
                                    
                                        <div id={styles.otherCommentWriteAreaParent}>
                                        {item.childCommentReadDataDtos.map((item2,index2) =>{
                                            // alert("commentList["+index+"]."+"childCommentReadDataDtos["+index2+"].content= "+commentList[index].childCommentReadDataDtos[index2].content)
                                                return(
                                                
                                                <div key={index2} className={styles.childCommentDiv}> 
                                                    <div className={styles.childCommnetReadArea}> 
                                                        
                                                        <div id={styles.otherCommentWriteNameArea1}>{item2.nickname}</div>
                                                    </div>
                                                    
                                                    <div id={styles.childCommentReadContent}>{item2.content}</div>
                                                    <hr className={styles.hr}/>
                                                    
                                                </div>)
                                        })}

                                        <div id={styles.childCommentSelector}>
                                            <div className={styles.childCommentGuide } onClick={toggleChildComment}>{childCommentState==="open"?"대댓글 감춤":"대댓글 쓰기"}</div>
                                            <div id={styles.otherChildCommentData}  className={childCommentState==="open"?styles[`block`]:styles[`none`]} >
                                                <div className={styles.childParentL}>
                                                    <div className={styles.childParentLDiv}>
                                                        <div className={styles.childParentLDivChildDiv}>
                                                            <div id={styles.otherCommentWriteNameArea2} >
                                                                <input type="text" value={childCommentWriteUserName[index]}
                                                                onInput={(e) => {handleChildCommentUsername(e,index)}} className={styles.commentWriteName1} 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div id={styles.otherCommentWritePasswordArea}>
                                                    <input type="password" className={`${styles.commentWrite1} ${styles.otherCommentWritePassword1}`}  
                                                        onInput={(e) => {handleChildCommentPassword(e, index)}} value={childCommentWritePassword[index]} placeholder="비말번호"/>
                                                    </div>
                                                </div>
                                                
                                        
                                            
                                                <div id={styles.otherCommentContentArea}>
                                                    <textarea className={`${styles.parentWriteCommentContent} ${styles.parentWriteComment1}`}   style={{height: "100px"}}
                                                onKeyUp={resize} onKeyDown={resize}  value={childCommentWriteContent[index]} onChange={(e) => {handleChildCommentContent(e, index)}} ></textarea>
                                                </div>
                                                </div>
                                                <div className={styles.parentCommentSubmitArea} id={styles.parentWriteCommentSubmit1} onClick={()=>childCommentSubmit(item.objectId,item.userId,index)}>
                                                    <div className={styles.parentCommentSubmit} >전송</div>
                                                </div>  
                                            </div>
                                        </div>
                                        <hr className={styles.hr}/>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
            ))}
                <div id={styles.parentCommentGuide} onClick={toggleParentComment}>{parentCommentState==="open"?"댓글 감춤":"댓글 쓰기"}</div>
                <div id={styles.otherCommentWriteAreaParent2}  className={parentCommentState==="open"?styles[`block`]:styles[`none`]}>
                    
                    <div id={styles.flex}>
                        <div id={styles.otherCommentWriteNameArea2}>
                            <div contentEditable="true" onInput={handleTextChange} suppressContentEditableWarning className={styles.commentWrite1} 
                            id={styles.commentWriteName1} ref={usernameRef}>{text}</div>
                            
                        </div>
                        <div id={styles.otherCommentWritePasswordArea}>
                            <input type="password" className={`${styles.commentWrite1} ${styles.otherCommentWritePassword1}`} defaultValue="비밀번호" id={styles.otherCommentWritePassword1} 
                            ref={passwordRef} />
                        </div>
                    </div>
                    
                    <div id={styles.otherCommentContentArea}>
                        <textarea className={`${styles.parentWriteCommentContent} ${styles.parentWriteComment1}`} id={styles.parentWriteComment1} style={{height: "100px"}}
                        ref={parentCommentContentRef} onKeyUp={resize} onKeyDown={resize} ></textarea>
                    </div>
                    <div className={styles.parentCommentSubmitArea} id={styles.parentWriteCommentSubmit1}  onClick={parentCommentSubmit}>
                    <div className={styles.parentCommentSubmit}>전송</div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default NoneUserBoardReadForm;