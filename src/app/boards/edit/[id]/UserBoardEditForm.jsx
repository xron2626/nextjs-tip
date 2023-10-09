/* eslint-disable */ 





import React,{Component} from "react";
import { useRef,useState,useEffect } from "react";

import styles from "./NoneUserBoardEditForm.module.css"
import "./ckeditor-board-edit.css"
import Header from "./Header";


function UserBoardEditForm() {
    // let domainUri = "http://27.96.131.120:8080";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    // let domainUri = "https://port-0-changeproject-19k5ygi525lcw5y5kb.gksl2.cloudtype.app";
    let condition = true;
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('비밀번호');
    const contentsRef = useRef(null);
    const writeButtonRef = useRef(null);
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const titleRef = useRef(null);
  // section과 footer,header는 id로 적용해서 바꿈 

// div에 header(meta tag)랑 body 쓰면 안됨 class는 className, onclick같은 단어합친거는 camelcase로 onClick같이 변경, onclick="" 이거 였다면 {}로 변경
// 다른것도 하면 좋은데 안해도 되니까 일단 내버려둠 
// <textarea name="contents" className="form-control" id="contents"></textarea>도 
// <textarea name="contents" className="form-control" ref={contentsRef}></textarea>로
// 교체했음 이유는 textarea가 호출되어야 ckeditor에 관련 로직을 읽어내서 전송한다던가 같은 API때문에 timeOut이나 jquery의 dom을 읽어내는걸 REF에서 실행하는데
//  그러면 id는 필요가 없으니까 지우고, ui랑 컴포넌트를 분리하려고 했는데, 그것 떄문에 하나는 props가 강요되는 상황이라서 ㅇㅇ.. 
//  Redux, MobX, Zustand로 중간 컨테이너가 ui 컴포넌트 기능 컴포넌트 호출은 가능하나 너무 복잡한 관계로 일단 ui 컴포넌트가 기능호출하는 것으로 결정 
        
    function saveGallery() {
    if (confirm("저장하시겠습니까?") == false) {
        return;
    }
    let boardId = location.href.split("/boards/edit/")[1];
    let url = domainUri+"/board/user/edit/"+boardId;
    let isSecret = false;

    let requestData = {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: 'include' ,
            // enctype : "multipart/form-data",
            body: JSON.stringify({
                'boardId' : boardId,
                'title' : titleRef.current.value,
                'content' : CKEDITOR.instances.contents.getData(),
                'isSecret' : isSecret
        })
    };

        return fetch(url, requestData)
            .then(function (response) {
                    if(response.status===400) {
                        throw new Error("비밀번호가 다릅니다");
                    }
                alert("저장되었습니다");
                window.location.href="/";
                })
            .catch(function(error) {
                alert("비밀번호가 다릅니다");
            })
    }

useEffect(() => {
    alert("회원");
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
              filebrowserUploadUrl: domainUri+"/image/upload/"+window.location.href.split("/edit/")[1],
              font_names:
                "맑은 고딕/Malgun Gothic;굴림/Gulim;돋움/Dotum;바탕/Batang;궁서/Gungsuh;Arial/Arial;Comic Sans MS/Comic Sans MS;Courier New/Courier New;Georgia/Georgia;Lucida Sans Unicode/Lucida Sans Unicode;Tahoma/Tahoma;Times New Roman/Times New Roman;MS Mincho/MS Mincho;Trebuchet MS/Trebuchet MS;Verdana/Verdana",
              font_defaultLabel: "맑은 고딕/Malgun Gothic",
              fontSize_defaultLabel: "12",
              skin: "office2013",
              language: "ko"
            });
            // writeButtonRef.current.addEventListener("click",saveGallery);
            console.log(writeButtonRef.current)
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
    
        }

        fetch(url,params)
        .then(function x(response) {
        if(response.status==500) {
            location.href = domainUri+"/404page";;
        }
        let data = response.json();
          return data;
    // then 절로 중복 방지
        }).then(function getBackData(data) {
        console.log(data);
        setTitle(data.title);
        CKEDITOR.instances.contents.setData(data.contents);
        console.log(data.contents);
        setUsername(data.boardWriterName);
        return data.contents;
        }).catch(function(error) {
            location.href = location.href;
        }).then(function isErrorRetry(content) {
        console.log(CKEDITOR.instances.contents.getData(content));
        if(CKEDITOR.instances.contents.getData() === null) {
        // 데이터 등록이 바로 안되서 리다이렉트 함
            location.href = location.href;
        }
    })

        
    return () => {
      script.onload = function () {    
        document.body.removeChild(script);
        // writeButtonRef.current.removeEventListener("click",saveGallery);
      }

    };
  },[] );
        return (
        <div>
                <Header></Header>
                <section id={styles.section}>
                    <div className={styles.bodyHeader}>
                        <form action="/" encType="multipart/form-data"  id="inline">
                            <div className={styles.item2}>
                            <input type="text" name={styles.username} id={styles.username} maxLength="255"  className="once" 
                                value={username} readOnly={true}/>

                                <input type="text" name={styles.title} defaultValue={title} id={styles.title} maxLength="255"  className="once"
                                ref={titleRef}/>
                                <div id={styles.writeButton} ref={writeButtonRef} onClick={saveGallery}>글쓰기</div>

                            </div>
                        </form>
                    </div>

                    
                    <textarea name="contents" className="form-control" ref={contentsRef} ></textarea>
                    <article></article>
                </section>

                <footer id={styles.footer}>
                    <h2 id={styles.footerText}>간단한 게시판 만들기 - 정재광</h2>
                </footer>
       
        </div>
        

        )
    };


export default UserBoardEditForm;