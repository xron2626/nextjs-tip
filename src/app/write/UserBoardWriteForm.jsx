import { useRef,useState,useEffect } from "react";
import Header from "./Header";
import UserBoardWriteLogic from "./UserBoardWriteLogic";
import styles from "./UserBoardWriteForm.module.css"

function UserBoardWriteForm() {

    const contentsRef = useRef(null);
    const writeButtonRef = useRef(null);
    const userNameRef = useRef(null);
    const [condition, setCondition] = useState(true);
    const passwordRef = useRef(null);
    const titleRef = useRef(null);
    const [title, setTitle] = useState('제목');
    const [titleClass, setTitleClass] = useState('once');
    const [username, setUsername] = useState('이름');
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
            <div id={styles.divCenter}>
                <Header></Header>
                <section id={styles.section}>
                    <div className={styles.bodyHeader}>
                        <form action="/" encType="multipart/form-data"  id="inline">
                            <div className={styles.item2}>
                                <input type="text" name={styles.username} id={styles.username} maxLength="255"  className="once" 
                                value={username} readOnly={true}/>
                                <input type="text" name={styles.title} value={title} id={styles.title} maxLength="255"  className={titleClass}
                                ref={titleRef} onClick={eraseTitle} onChange={changeTitle} />
                                <div id={styles.writeButton} ref={writeButtonRef} >글쓰기</div>

                            </div>
                        </form>
                    </div>

                    
                    <textarea name="contents" className="form-control" ref={contentsRef}></textarea>
                    <article></article>
                </section>

                <footer id={styles.footer}>
                    <h2 id={styles.footerText}>간단한 게시판 만들기 - 정재광</h2>
                </footer>
        <UserBoardWriteLogic contentsRef={contentsRef} writeButtonRef={writeButtonRef}  username = {username}  setUsername = {setUsername}
        titleRef={titleRef} ></UserBoardWriteLogic>
        </div>
        )
}
export default UserBoardWriteForm;