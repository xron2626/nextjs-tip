/* eslint-disable */ 
import styles from "./Alarm.module.css";
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
function Alarm() {
    const [boards, setBoards] = useState([]);
    const [pageClassName, setPageClassName] = useState([`${styles.itema}`]);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [nonePageNumbers, setNonePageNumbers] = useState([]);
    const [finalPageNumber,setFinalPageNumber] = useState([]);


    let isNextButton = true;
  
  // api 받을 때 setBoards로 교체하면 될듯 
    const [condition, setCondition] = useState(true);
    // let domainUri = "http://localhost:8080";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    // let domainUri = "https://www.siteproject22.online";
    let sessionId;
    let boardQuantity;
    let pageQuantity;
    const searchScript = (e) => {
        e.target.value="";
        return;
      }
      const changeCondition = () => {
        setCondition(false);
      }
    
    
        
    
      useEffect(() => {
        setUrl().then(function(data) {
          return sessionId = data;
        }).then(function(sessionId) {
          connect();
          return sessionId;
        }).then(function(sessionId) {
            // alert("sessionId = "+sessionId)
            bringData(sessionId);
        })
      }, []);
    
      
    
      const setUrl = () => {
        let url = domainUri+"/user-noneuser/account";
        let accountData = {
            "method" : "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: 'include' // 이 옵션을 설정해야 쿠키가 요청에 포함됨
        }
        return fetch(url,accountData).then(function findUsername(response) {
            return response.json();
        }).then(function(response) {
          return response.userId;
        })
      }
      const setPageUrl = (e) =>  {
        
        window.location.href = "/alarm?page="+e.target.textContent;
      }
      function connect() {
        const socket = new SockJS(domainUri+'/my-websocket-endpoint');
        let stompClient = Stomp.over(socket);
        console.log(socket);
        console.log(stompClient);
        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);

            stompClient.subscribe('/user/'+sessionId+'/queue/messages', function(message) {
                alert("새로운 글이 작성되었습니다");
            });
        });
        // 이거 연결하는 동시에 queue/messages2도 같이 등록해서 알림 서비스 n개 만들어봐야될듯
        // ㅇㅇ..
        const socket2 = new SockJS(domainUri+'/my-websocket-endpoint2');
        let stompClient2 = Stomp.over(socket2);
        stompClient2.connect({}, function(frame) {
            console.log('Connected: ' + frame);
            stompClient2.subscribe('/user/'+sessionId+'/queue/messages2', function(message) {
                alert("새로운 글이 작성되었습니다2");
            });
        });
      }
    
    
    let jwtTimeData = {
        method:'GET',
        credentials: 'include' // 이 옵션을 설정해야 쿠키가 요청에 포함됨
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
    
      function moveFirstPage () {
        window.location.href = "/alarm?page=1"
      }

      function movePreviousPage () {
        let currentPage = window.location.href.split("=")[1];
        if(Number(currentPage) === 1) {
            return;
        }
        let previosPage = Number(currentPage) -1;
        window.location.href = "/alarm?page="+ previosPage;
      }
      function moveNextPage () {
        
        let currentPage = window.location.href.split("=")[1];
        let nextPage = Number(currentPage) +1;
        if(currentPage < finalPageNumber) {
            window.location.href = "/alarm?page="+ nextPage;
        }
        
      }
      function moveFinalPage() {
        window.location.href = "/alarm?page="+ finalPageNumber;
      }
   
      function bringData(sessionId) {
    
        let item2 = document.getElementById("item2")
        let rows = [];
        console.log(item2);
        pageQuantity = getPageQuantity();
    
    
    
        // 1. 현재 페이지 로딩
        // 2. 게시판에 데이터 파싱할 조건
        // 3. 게시판 페이지 안보이게 처리
        // pageQuantity,@RequestBody Long boardQuantity
        let data = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include' // 이 옵션을 설정해야 쿠키가 요청에 포함됨

            
        }
        let idNumber;
        let idData = (pageQuantity - 1) * boardQuantity + 1;
        let currentSize = 1;
        let boardSize = 1;
        // alert("alarm - data 가져오기");
        fetch(domainUri+"/alarm/data/"+pageQuantity, data).then(function (response) {
            return response.json();
        }).then(function (data) {
          // alert("data = "+data);
          if(data.length>0) {
            
            setBoards(data);
          }
          }).then(function() {
            return fetch(domainUri+"/current/page?currentPageNumber="+pageQuantity+"&userId="+sessionId)
          }).then(function(data){
              return data.json();
          }).then(function(data) {
              
            // {"pageQuantity":1,"isNextButton":false,"startNumber":1,"currentPageFinalBoardQuantity":2}
            const appearPageNumbers = [];
            let i;
            for (i = data.tenFirstPageNum; i <= data.tenFinalPageNum; i++) {
              appearPageNumbers.push(i);
            }
            setPageNumbers(appearPageNumbers);
            const disappearPageNumbers = [];
            for(let j = i;j < 10;j++) {
              disappearPageNumbers.push(j);
            }
            setNonePageNumbers(disappearPageNumbers);
            if(data.isNextButton===false) {
              setPageClassName([`${styles.itema} ${styles.disappear}`])
            }
            setFinalPageNumber(data.allFinalPageNum);
            
          })
    
          
      }
      function getPageQuantity() {
        let isPageExistence = window.location.href.includes("?page=");

        if(isPageExistence === false) {
          pageQuantity = 1;
        }
        if(isPageExistence === true) {
          pageQuantity = window.location.href.split("?page=")[1];
        }
        return pageQuantity;
      }
     
    
  return (
    <div>
      <div className={styles.area21}>
        <input type="button" value="로그인" id={styles.loginBox} className={styles.box} style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/login'}/>
        <input type="button" value="회원가입" id={styles.joinBox } 
        className={`${styles.container} ${styles.box}`}  
        style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/join'}/>
        <img src="/image/homeicone8.png" width="80px" height="40px"alt="My github" id={styles.home}
         className={styles.container} style={{cursor:"pointer"}} />
        <input type="button" value="글쓰기" id={styles.writeBox} className={styles.box} style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/write'}/>
        <input type="button" value="글 조회" id={styles.readBox } className={styles.box} style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/?pageQuantity=1&boardQuantity=20'} />
      </div>
      <div className={styles.marginBox}>
        <a href="https://github.com/xron2929">
            <img src="/image/github2.png" width="30px" alt="My github" id={styles.github}
            className={styles.container} />
        </a>
        <a href="https://hellocoding.tistory.com/">
            <img src="/image/tistory2.png" width="40px" height="40px"alt="My github" id={styles.tistory}
             className={styles.container}   />
        </a>
        <a href="/alarm?page=1">
            <img src="/image/email2.png" width="30px" height="35px"alt="My github" id={styles.email}
             className={styles.container} />
        </a>
      </div>
      <section id={styles.section}>
        <div className={styles.bodyHeader}>
          <article id={styles.article}>
            <table id={styles.table}>
              <thead id={styles.thead}>
                <tr>
                  <th className={`${styles.thId} ${styles.th}`}>게시판 id</th>
                  <th className={`${styles.thTitle} ${styles.th}`}>게시판 이름</th>
                  <th className={`${styles.thAuthor} ${styles.th}`}>댓글 유저 이름</th>
                  <th className={`${styles.thContent} ${styles.th}`}>댓글 내용</th>
                </tr>
              </thead>
            
              <tbody id={styles.tbody}>
                {boards.map((board, index) => (
                  <tr key={index} className={styles.tr} onClick= {() =>window.location.href="/boards/"+board.boardId} >
                    <td className={`${styles.td} ${styles.thId}`}>{board.boardId}</td>
                    <td className={`${styles.td} ${styles.thTitle}`}>{board.title}</td>
                    <td className={`${styles.td} ${styles.thAuthor}`}>{board.commentWriter}</td>
                    <td className={`${styles.td} ${styles.thContent}`}>{board.summaryCommentContent}</td>
                  </tr>))}
                </tbody>
            </table>
          </article>
        </div>
        <div className={styles.container2}>
          <div className={styles.itema} id={styles.item1} onClick={moveFirstPage}>처음</div>
          <div className={styles.itema} id={styles.item} onClick={movePreviousPage}>이전</div>
          {pageNumbers.map((pageNumber) => (
          <div className={`${styles.itema} ${styles.appear}`}  key={pageNumber} onClick={setPageUrl}>
            {pageNumber}
          </div>
          ))}
          {nonePageNumbers.map((nonePageNumber) => (
            <div className={`${styles.itema} ${styles.disappear}`}  key={nonePageNumber}>
              {nonePageNumber}
            </div>
          ))}
          <div className={pageClassName} onClick={moveNextPage}>다음</div>
          <div className={pageClassName} onClick={moveFinalPage}>마지막</div>
        </div>

      </section>
      <aside id={styles.aside}></aside>
      <footer id={styles.footer}>
        <h2 id={styles.footerText}>간단한 게시판 만들기 - 정재광</h2>
      </footer>
    </div>
  );
}
export default Alarm;