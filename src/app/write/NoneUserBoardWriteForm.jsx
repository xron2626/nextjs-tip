
import React,{Component} from "react";
import { useRef,useState } from "react";

import styles from "./NoneUserBoardWriteForm.module.css"
import "./ckeditor-board-write.css"
import Header from "./Header";
import NoneUserBoardWriteLogic from "./NoneUserBoardWriteLogic2";
function NoneUserBoardWriteForm() {
    const [username, setUsername] = useState('이름');
    const [password, setPassword] = useState('비밀번호');
    const [title, setTitle] = useState('제목');
    const [usernameClass, setUsernameClass] = useState('once');
    const [passwordClass, setPasswordClass] = useState('once');
    const [titleClass, setTitleClass] = useState('once');

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
        
    
        const eraseUsername = () => {
            console.log(usernameClass)
            console.log(usernameClass!=="")
            if(usernameClass!=="") {
                setUsernameClass("")
                setUsername("")
                return;
            }
            return;
        }
        const changeUsername = (e) => {
            const newValue = e.target.value;
            setUsername(newValue);
            return;
        }
        const erasePassword = () => {
            console.log(passwordClass)
            console.log(passwordClass!=="")
            if(passwordClass!=="") {
                setPasswordClass("")
                setPassword("")
                return;
            }
            return;
        }
        const changePassword = (e) => {
            const newValue = e.target.value;
            setPassword(newValue);
            return;
        }
        const eraseTitle = () => {
            console.log(titleClass)
            console.log(titleClass!=="")
            if(titleClass!=="") {
                setTitleClass("")
                setTitle("")
                return;
            }
            return;
        }
        const changeTitle = (e) => {
            const newValue = e.target.value;
            setTitle(newValue);
            return;
        }

        return (
        <div>
                <Header></Header>
                <section id={styles.section}>
                    <div className={styles.bodyHeader}>
                        <form action="/" encType="multipart/form-data"  id="inline">
                            <div className={styles.item2}>
                                <input type="text" name={styles.username} value={username} id={styles.username} maxLength="255"  className={usernameClass} 
                                ref={userNameRef} onClick={eraseUsername} onChange={changeUsername}/>
                                <input type="text" name={styles.password} value={password} id={styles.password} maxLength="255"  className={passwordClass}
                                ref={passwordRef} onClick={erasePassword} onChange={changePassword}/>
                                <input type="text" name={styles.title} value={title} id={styles.title} maxLength="255"  className={titleClass}
                                ref={titleRef} onClick={eraseTitle} onChange={changeTitle}/>
                                <div id={styles.writeButton} ref={writeButtonRef}>글쓰기</div>

                            </div>
                        </form>
                    </div>

                    
                    <textarea name="contents" className="form-control" ref={contentsRef}></textarea>
                    <article></article>
                </section>

                <footer id={styles.footer}>
                    <h2 id={styles.footerText}>간단한 게시판 만들기 - 정재광</h2>
                </footer>
        <NoneUserBoardWriteLogic contentsRef={contentsRef} writeButtonRef={writeButtonRef} userNameRef={userNameRef}
        passwordRef={passwordRef} titleRef={titleRef} ></NoneUserBoardWriteLogic>
        </div>
        

        )
    };

export default NoneUserBoardWriteForm;