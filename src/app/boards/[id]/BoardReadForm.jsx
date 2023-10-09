import { useRef,useState,useEffect } from "react";
import NoneUserBoardReadForm  from "./NoneUserBoardReadForm";
import UserBoardReadForm from "./UserBoardReadForm";
import AdminBoardReadForm from "./AdminBoardReadForm";

function BoardReadForm() {
    const [isUserAccount, setIsUserAccount] = useState(null);
    // let domainUri = "http://27.96.131.120:8080";
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    // let domainUri = "https://port-0-java-springboot-17xqnr2algm9dni8.sel3.cloudtype.app";
    useEffect(() => {
        getUserAccount();
    },[])
    function getUserAccount() {
        let params = {
            method: "get",
            headers: {
                // Accept: "application/json",
                // "Content-Type": "application/json"
            },
            credentials: "include" // 이 옵션을 설정해야 쿠키가 요청에 포함됨

        }
        const url = domainUri+"/role";
        return fetch(url, params)
            .then(function (response) {
                
                return response.json();
            })
            .then(function (data) {

                setIsUserAccount(data.role);
                return;
            })
     
    }
    return(
        <div>
        {isUserAccount === null ? (<div>Loading...</div>) : isUserAccount === "비회원" ? <NoneUserBoardReadForm/> : 
        isUserAccount === "OAUTH 유저" ? (  <UserBoardReadForm/>) : isUserAccount === "일반 회원가입 유저" ? <UserBoardReadForm/> : ( <AdminBoardReadForm/> )}
      </div>
    )
}
export default BoardReadForm;