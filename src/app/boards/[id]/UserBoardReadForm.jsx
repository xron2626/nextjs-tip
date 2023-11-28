

import styles from "./UserBoardReadForm.module.css"
import React, { useRef,useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
function UserBoardReadForm() {
    const [commentList, setCommentList] = useState([]);
    const [isAddComment,setIsAddComment] = useState(false);
    const [disLikeCount, setDisLikeCount] = useState('0'); 
    const [likeCount, setLikeCount] = useState('0'); 
    const feedbackRef = useRef(null);
    const manageRef = useRef(null);
    const [boardContent, setBoardContent] = useState(); 
    const [titleContent, setTitleContent] = useState('제목'); 
    const [text, setText] = useState('이름'); // 텍스트 상태 설정
    const editButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);
    const [childCommentWriteUserName, setChildCommentWriteUserName] = useState([]);
    const [childCommentWritePassword, setChildCommentWritePassword] = useState([]);
    const [childCommentWriteContent, setChildCommentWriteContent] = useState([]);
    const [childCommentState, setChildCommentState] = useState('close'); // 텍스트 상태 설정
    const [parentCommentState, setParentCommentState] = useState('close'); // 텍스트 상태 설정

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
            setButton();
            if(sessionId!==null) {
                
                x();
            }
        })
    },[sessionId])

    const handleTextChange = (e) => {
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

    const handleChildCommentContent = (e,index) => {
        const updatedUserContents = [...childCommentWriteContent];
        updatedUserContents[index]=e.target.value;
        setChildCommentWriteContent(updatedUserContents); // 텍스트 변경 시 상태 업데이트
    };

    const childCommentSubmit = (parentCommentId,parentCommentUserId,index) => {
        boardId = getBoardId();
        // alert(parentCommentId);
        // alert(childCommentWriteUserName);
        // alert(childCommentWritePassword);
        // alert(childCommentWriteContent);
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
    const parentCommentSubmit = () => {
        if(isAddComment===false) {
            
            setIsAddComment(true);
        boardId = getBoardId();
        let url = domainUri+"/user/parentComment/"+boardId;
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
                feedbackRef.current.style.width="100%";
            }
        })
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
            setTitleContent(title);
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
                objectId: '임의의 값',
                userId: '유저 아이디',
                childCommentReadDataDtos:new Array()
            };
            Object.entries(obj)
                .forEach(([key, value]) => {      
                    if (key === "nickname") {
                        newItem.nickname = value;
                    } else if (key === "content") {
                        newItem.content = value;
                    } else  if(key === "objectId") {
                        newItem.objectId = value;
                    } else if(key ==="userId") {
                        newItem.userId = value;
                    } else {
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
    let url = domainUri+"/board/user/"+ param;
    // 데이터를 전송할 url
    let requestData = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        credentials: 'include'
    }
    
    fetch(url, requestData)
        .then(function (response) {
            window.location.href="/?pageQuantity=1&boardQuantity=20";
        });
}

    return (
        <div>
          
            <div id={styles.background}>
                <div style={{display: "flex",justifyContent: "space-around",paddingTop:"20px"}}>

                    <div id={styles.top}>
                        <div id={styles.childTitle}>{titleContent}</div>
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
                            <div>좋아요</div>
                            <div id={styles.likeCount}>{likeCount}</div>
                        </div>
                        <div id={styles.feedbackCenter}></div>
                        <div id={styles.down} onClick={updateDisLikeCount}>
                            <div>싫어요</div>
                            <div id={styles.disLikeCount}>{disLikeCount}</div>
                        </div>
                    </div>
                    <div id={styles.manage} ref={manageRef}>
                        <div id={styles.edit} onClick={editBoard} ref={editButtonRef}>수정</div>
                        <div id={styles.delete} onClick={deleteBoard} ref={deleteButtonRef}>삭제</div>
                    </div>
                </div>
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
                                                        <div id={styles.childCommentSelector}>L</div>
                                                        <div id={styles.otherCommentWriteNameArea1}>{item2.nickname}</div>
                                                    </div>
                                                    
                                                    <div id={styles.childCommentReadContent}>{item2.content}</div>

                                                    
                                                </div>)
                                        })}

                                        <div id={styles.childCommentSelector}>
                                            <div className={styles.childCommentGuide } onClick={toggleChildComment}>{childCommentState==="open"?"대댓글 감춤":"대댓글 쓰기"}</div>
                                            <div id={styles.otherChildCommentData}  className={childCommentState==="open"?styles[`block`]:styles[`none`]} >
                                                <div className={styles.childParentL}>
                                                    <div>L</div>
                                                    <div id={styles.otherCommentWriteNameArea1} >
                                                        <div 
                                                         suppressContentEditableWarning className={styles.commentWrite1} 
                                                        id={styles.commentWriteName1}>{text}</div>
                                                    </div>
                                                </div>
                                            
                                                <div id={styles.otherCommentContentArea}>
                                                    <textarea className={`${styles.parentWriteCommentContent} ${styles.parentWriteComment1}`}   style={{height: "100px"}}
                                                onKeyUp={resize} onKeyDown={resize}  value={childCommentWriteContent[index]} onChange={(e) => {handleChildCommentContent(e, index)}} ></textarea>
                                                </div>
                                                <div className={styles.parentCommentSubmitArea} id={styles.parentWriteCommentSubmit1}>
                                                    <div className={styles.parentCommentSubmit}  onClick={()=>childCommentSubmit(item.objectId,item.userId,index)} >전송</div>
                                                </div>  
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div id={styles.parentCommentGuide} onClick={toggleParentComment}>{parentCommentState==="open"?"댓글 감춤":"댓글 쓰기"}</div>
            <div id={styles.otherCommentWriteAreaParent} className={parentCommentState==="open"?styles[`block`]:styles[`none`]}>
                    <div id={styles.flex}>
                        <div id={styles.commentWriteNameArea2}>
                            <div  className={styles.commentWrite1} id={styles.commentWriteName1} >{text}</div>
                        </div>
                    </div>
                    <div id={styles.otherCommentContentArea}>
                        <textarea className={styles.parentWriteCommentArea}  id={styles.parentWriteComment1} style={{height: "100px"}}
                        ref={commentContentRef} onKeyUp={resize} onKeyDown={resize} defaultValue="내용"></textarea>
                    </div>
                    <div className={styles.parentCommentSubmitArea} id={styles.parentWriteCommentSubmit1}>
                        <div className={styles.parentCommentSubmit} onClick={parentCommentSubmit} >전송</div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
export default UserBoardReadForm;