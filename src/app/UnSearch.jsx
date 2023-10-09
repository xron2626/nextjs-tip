
import styles from "./advertise.module.css";
import styles2 from "./none-advertise.module.css";
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';


// section과 footer header, aside, table는 id로 # 적용해서 바꿈 
function UnSearch() {
  const [boards, setBoards] = useState([]);
  const [pageClassName, setPageClassName] = useState([`${styles.itema}`]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [nonePageNumbers, setNonePageNumbers] = useState([]);
  const [formUrl, setFormUrl] = useState("https://port-0-changeproject-19k5ygi525lcw5y5kb.gksl2.cloudtype.app/board/search");
  let isNextButton = true;

  // api 받을 때 setBoards로 교체하면 될듯 
  const [condition, setCondition] = useState(true);
  // let domainUri = "http://27.96.131.120:8080";
  let domainUri = process.env.NEXT_PUBLIC_API_URL;
  // REACT_APP_API_URL
  // let domainUri = "https://port-0-java-springboot-17xqnr2algm9dni8.sel3.cloudtype.app";

  
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
      // alert("sessionId = "+data);
      connect(data);
    })
  }, []);

  

  const setUrl = () => {
    let url = domainUri+"/user-noneuser/account";
    let accountData = {
        "method" : "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
        
    }
    return fetch(url,accountData).then(function findUsername(response) {
        return response.json();
    }).then(function(response) {
      return response.userId;
    })
  }
  const setPageUrl = (e) =>  {
    boardQuantity = getBoardQuantity();
    window.location.href = "/?pageQuantity="+e.target.textContent+"&boardQuantity="+boardQuantity;
  }
  function connect(sessionId) {
    const socket = new SockJS(domainUri+'/my-websocket-endpoint/');
    
    let stompClient = Stomp.over(socket);
    console.log("socket= "+socket);
    console.log("stompClient= "+stompClient);
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        // alert("stompClient.suscribe sessionId = "+sessionId)
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
        // alert("stompClient2.suscribe sessionId = "+sessionId)
        stompClient2.subscribe('/user/'+sessionId+'/queue/messages2', function(message) {
            alert("새로운 글이 작성되었습니다2");
        });
    });
  }


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
    bringData();
  },[])
  
  function bringData() {

    let item2 = document.getElementById("item2")
    let rows = [];
    console.log(item2);

    let isPageExistence = document.location.href.includes("pageQuantity");
    let isBoardExistence = document.location.href.includes("boardQuantity");
    if(isPageExistence === false) {
        pageQuantity = 1;
    }
    if(isBoardExistence === false) {
        boardQuantity = 20;
    }

    if(isPageExistence === true) {
        let params = document.location.href.split("?")[1];
        pageQuantity = params.split("&")[0].split("=")[1];
    }
    if(isBoardExistence === true) {
        let params = document.location.href.split("?")[1];
        boardQuantity = params.split("&")[1].split("=")[1];
    }



    // 1. 현재 페이지 로딩
    // 2. 게시판에 데이터 파싱할 조건
    // 3. 게시판 페이지 안보이게 처리
    // pageQuantity,@RequestBody Long boardQuantity
    let data = {
        method: "GET",
      
        
    }
    let idNumber;
    let idData = (pageQuantity - 1) * boardQuantity + 1;
    let currentSize = 1;
    let boardSize = 1;

    fetch(domainUri+"/boards?pageQuantity="+pageQuantity+"&boardQuantity="+boardQuantity, data).then(function (response) {
        return response.json();
    }).then(function (responseData) {
      if(responseData.length>0) {
        
        setBoards(responseData);
        
      }
      }).then(function() {
        return fetch(domainUri+"/page?currentBoardPage="+pageQuantity+"&boardQuantity="+boardQuantity,data)
      }).then(function(data){
          return data.json();
      }).then(function(data) {
          
        // {"pageQuantity":1,"isNextButton":false,"startNumber":1,"currentPageFinalBoardQuantity":2}
        const appearPageNumbers = [];
        let i;
        for (i = 0; i < data.pageQuantity; i++) {
          appearPageNumbers.push(data.startNumber + i);
        }
        setPageNumbers(appearPageNumbers);
        const disappearPageNumbers = [];
        for(let j = i;j < 10;j++) {
          disappearPageNumbers.push(data.startNumber + j);
        }
        setNonePageNumbers(disappearPageNumbers);
        if(data.isNextButton===false) {
          setPageClassName([`${styles.itema} ${styles.disappear}`])
        }
      })

      
  }
  function getPageQuantity() {
    let isPageExistence = document.location.href.includes("pageQuantity");
    if(isPageExistence === false) {
      pageQuantity = 1;
    }
    if(isPageExistence === true) {
      let params = document.location.href.split("?")[1];
      pageQuantity = params.split("&")[0].split("=")[1];
    }
    return pageQuantity;
  }
  function getBoardQuantity() {
    let isBoardExistence = document.location.href.includes("boardQuantity");
    if(isBoardExistence === false) {
      boardQuantity = 20;
    }
    if(isBoardExistence === true) {
      let params = document.location.href.split("?")[1];
      boardQuantity = params.split("&")[1].split("=")[1];
    }
    return boardQuantity;
  }
  function getId(index) {
    pageQuantity = getPageQuantity();
    boardQuantity = getBoardQuantity();
    return (pageQuantity - 1)* boardQuantity + index;
  }
  function getCreatedDate(board) {
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let temp = board.createdDate.split('T')[0];
    let comparingYear = temp.split('-')[0];
    let comparingMonth = temp.split('-')[1];
    let comparingDate = temp.split('-')[2];

    if(parseInt(comparingYear) !== year) {
      return comparingYear+":"+comparingMonth+":"+comparingDate;
    }
    if(parseInt(comparingMonth) !== month) {
      return comparingMonth+":"+comparingDate;
    }
    if(parseInt(comparingDate) !== date) {
      return comparingMonth+":"+comparingDate;
    }
    let comparingHours = board.createdDate.split('T')[1].split(':')[0];
    let comparingMinutes = board.createdDate.split('T')[1].split(':')[1];
    return comparingHours+":"+comparingMinutes;
    // return hours+":"+minutes+":"+seconds;

  }
 
  
  return (
    <div>
      <div className={condition ?styles.area21 : styles2.area21}>
        <input type="button" value="로그인" id={condition ? styles.loginBox : styles2.loginBox} className={condition ? styles.box : styles2.box} style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/login'}/>
        <input type="button" value="회원가입" id={condition ? styles.joinBox : styles2.joinBox} 
        className={`${condition ? styles.container : styles2.container} ${condition ? styles.box : styles2.box}`}  
        style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/join'}/>
        <img src="/image/homeicone8.png" width="80px" height="40px"alt="My github" id={condition ? styles.home: styles2.home}
         className={condition ? styles.container : styles2.container} style={{cursor:"pointer"}} />
        <input type="button" value="글쓰기" id={condition ? styles.writeBox : styles2.writeBox} className={condition ? styles.box : styles2.box} style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/write'}/>
        <input type="button" value="글 조회" id={condition? styles.readBox : styles2.readBox} className={condition ? styles.box : styles2.box} style={{cursor:"pointer"}}
               onClick={() =>window.location.href ='/?pageQuantity=1&boardQuantity=20'} />
      </div>
      <div className={condition ? styles.marginBox : styles2.marginBox}>
        <a href="https://github.com/xron2929">
            <img src="/image/github2.png" width="30px" alt="My github" id={condition ? styles.github : styles2.github}
            className={condition ? styles.container : styles2.container} />
        </a>
        <a href="https://hellocoding.tistory.com/">
            <img src="/image/tistory2.png" width="40px" height="40px"alt="My github" id={condition ? styles.tistory : styles2.tistory}
             className={condition ? styles.container : styles2.container}   />
        </a>
        <a href="/alarm?page=1">
            <img src="/image/email2.png" width="30px" height="35px"alt="My github" id={condition ? styles.email : styles2.email}
             className={condition ? styles.container : styles2.container} />
        </a>
      </div>
      <section id={condition ? styles.section : styles2.section}>
        <div className={condition ? styles.bodyHeader : styles2.bodyHeader}>
          <form action="/board/search" data-accept-charset="utf-8" method="get" id={condition ? styles.flex : styles2.flex} >
            <input type="text" name="pageQuantity" defaultValue="1" hidden />
            <input type="text" name="boardQuantity" defaultValue="20" hidden />
            <input type="text" name="keyword" defaultValue="검색" id={condition ? styles.textarea : styles2.textarea} maxLength="255" onClick={searchScript} />
            <input type="submit" id={condition ? styles.searchButton : styles2.searchButton} value="검색" style={{cursor:"pointer"}} />
          </form>
          <form action="/write"  data-accept-charset="utf-8" method="get" className={condition ? styles.inline : styles2.inline}>
            <input type="submit" id={condition ? styles.writeButton : styles2.writeButton} value="글쓰기" style={{cursor:"pointer"}} />
        </form>
  

              

        </div>
        <article>
          <table id={condition ? styles.table : styles2.table}>
            <thead>
              <tr className={styles.tr}>
                  <th className={`${styles.thId} ${styles.th}`}>번호</th>
                  <th className={`${styles.thTitle} ${styles.th}`}>제목</th>
                  <th className={`${styles.thAuthor} ${styles.th}`}>글쓴이</th>
                  <th className={`${styles.thDate} ${styles.th}`}>날짜</th>
              </tr>
            </thead>
            <tbody id={styles.tbody}>
            {boards.map((board, index) => (
            <tr className={styles.tr} key={index} onClick= {() =>window.location.href="/boards/"+board.boardId}>
                <td className={`${styles.thId} ${styles.td}`}>{getId(index+1)}</td>
                <td className={`${styles.thTitle} ${styles.td}`}>{board.title}</td>
                <td className={`${styles.thAuthor} ${styles.td}`}>{board.userName}</td>
                <td className={`${styles.thDate} ${styles.td}`}>{getCreatedDate(board)}</td>
          </tr>))}</tbody>
          </table>
        </article>

        <div className={condition ? styles.container2 : styles2.container2}>
          <div className={styles.itema} id={styles.item1}>처음</div>
          {pageNumbers.map((pageNumber) => (
        <div className={`${styles.itema} ${styles.appear}`} id={`item${pageNumber}`} key={pageNumber} onClick={setPageUrl}>
          {pageNumber}
        </div>
        ))}
      {nonePageNumbers.map((nonePageNumber) => (
        <div className={`${styles.itema} ${styles.disappear}`} id={`item${nonePageNumber}`} key={nonePageNumber}>
          {nonePageNumber}
        </div>
      ))}
      <div className={pageClassName} id={styles.item12}>다음</div>
      
          
        </div>

      </section>
      <aside id={condition ? styles.aside : styles2.aside}>
        <img id={condition ? styles.advertisement : styles2.advertisement} src="/image/inflearn.png" />
        <img id={condition ? styles.exit : styles2.exit} src="/image/endend.png" style={{cursor:"pointer"}} onClick={changeCondition}  />
      </aside>
      <footer id={styles.footer}>
        <h2 id={styles.footerText}>간단한 게시판 만들기 - 정재광</h2>
      </footer>
    </div>
  );
}

export default UnSearch;