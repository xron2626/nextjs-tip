
import React,{Component} from "react";
import styles from "./NoneUserBoardEditForm.module.css"

class Header extends Component {
    render() {
       return (
       <header id={styles.header}>
       <div className={styles.left}>
               <input type="button" value="로그인" id={styles.loginBox} className={`${styles.container} ${styles.box}`} style={{cursor:'pointer'}}
                      onClick={() => window.location.href = '/login'}
                      />
              <input type="button" value="회원가입" id={styles.joinBox} className={`${styles.container} ${styles.box}`} style={{cursor:'pointer'}}
                      onClick={() => window.location.href = '/join'}
                      />
              <img src="/image/homeicone8.png" width="80px" height="40px"alt="My github" id="home" className={styles.container}
              style={{cursor:'pointer'}} />
              <input type="button" value="글쓰기" id={styles.writeBox} className={`${styles.container} ${styles.box}`} style={{cursor:'pointer'}}
                      onClick={() => window.location.href = '/write'}
                      />
              <input type="button" value="글 조회" id="readBox" className={`${styles.container} ${styles.box}`} style={{cursor:'pointer'}}
                      onClick={() => window.location.href = '/?pageQuantity=1&boardQuantity=20'}

                      />

       </div> 
       </header>
       )
    };

}
export default Header;