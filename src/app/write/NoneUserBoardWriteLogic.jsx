/* eslint-disable */ 

import { useEffect, useRef } from "react";


// import NoneUserBoardWrtieUi from "./NoneUserBoardWriteUi";
function NoneUserBoardWriteLogic({contentsRef,writeButtonRef,userNameRef,passwordRef,titleRef}) {
  // jsx로 다 교체하면 코드 블럭이 안 꺠지므로 바꾸는게 좋을듯 
  let domainUri = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    console.log(contentsRef);
    const script = document.createElement("script");
    script.src = "./ckeditor/ckeditor.js";
    document.body.appendChild(script);
    script.onload = function () {
      CKEDITOR.replace(contentsRef.current, {
        filebrowserUploadUrl: "/image/upload",
        font_names:
          "맑은 고딕/Malgun Gothic;굴림/Gulim;돋움/Dotum;바탕/Batang;궁서/Gungsuh;Arial/Arial;Comic Sans MS/Comic Sans MS;Courier New/Courier New;Georgia/Georgia;Lucida Sans Unicode/Lucida Sans Unicode;Tahoma/Tahoma;Times New Roman/Times New Roman;MS Mincho/MS Mincho;Trebuchet MS/Trebuchet MS;Verdana/Verdana",
        font_defaultLabel: "맑은 고딕/Malgun Gothic",
        fontSize_defaultLabel: "12",
        skin: "office2013",
        language: "ko",
      });
      writeButtonRef.current.addEventListener("click",saveGallery);
      console.log(writeButtonRef.current)
      console.log("??");
      
    };
    return () => {
      script.onload = function () {      
        document.body.removeChild(script);
        writeButtonRef.current.removeEventListener("click",saveGallery);
      },[[]]

    };
  }, ); //useEffect []를 넣으면 한번만 작동하는데, script를 삽입하는 코드는 잘 되는지 확인한다고 2번 실행되서 두번 함수 작동해서 소멸자 쪽에 지움 
// 만약 한번만 동작시키고 싶으면 let이나 useState(랜더링 목적) 중 골라서 동작시키면 됨 

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
        username: requestUsername,
        password: requestPassword,
        title: requestTitle,
        contents: CKEDITOR.instances[contentsRef.current.name].getData(),
      })
    };


    fetch(domainUri+"/edit/api", requestData).then(function (
      response
    ) {
      alert("저장되었습니다");
      window.location.href = domainUri+"?pageQuantity=1&boardQuantity=20";
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
