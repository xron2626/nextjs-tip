

import styles from"./LoginForm.module.css"

import React, { useRef,useEffect, useState } from 'react';

function LoginForm() {
    useEffect(() => {
        let requestData = {
            "method" : "get",
            credentials: 'include' // 이 옵션을 설정해야 쿠키가 요청에 포함됨
        }
        fetch(domainUri+"/user/logout",requestData).then(function(data) {
    
        })
      }, []);
    
    let domainUri = process.env.NEXT_PUBLIC_API_URL;
    const [googleOauthUrl, setGoogleOauthUrl] = useState(domainUri+"/oauth2/authorization/google");
    const [naverOauthUrl, setNaverOauthUrl] = useState(domainUri+"/oauth2/authorization/naver");
    const [loginUrL, setLoginUrL] = useState(domainUri+"/login_proc");
    const erasePassword = () => {         
        console.log(passwordClass)
        console.log(passwordClass!=="")
        if(passwordClass!=="") {
            setPassword("")
            setPasswordClass("")
            setPasswordType("password")
            return;
        }
    }
    const changePassword = (e) => {
        const newValue = e.target.value;
        setPassword(newValue);
        return;
    }

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
    const [username, setUsername] = useState('username');
    
    const [usernameClass, setUsernameClass] = useState('once');
    const [passwordClass, setPasswordClass] = useState('once');
    const [password, setPassword] = useState('password');
    const [passwordType, setPasswordType] = useState('text');

 

    return (
<div id={styles.backgroundBody}>
    <div id={styles.login}>
        <div id={styles.check}>
            <p id={styles.loginText}>LOGIN</p>
        </div>
        <form action={loginUrL} method="post"  data-accept-charset="UTF-8" id="loginButton">
            <input type="text" id={styles.id}  name="username" value={username}   className={usernameClass}
            onClick={eraseUsername} onChange={changeUsername} />
            <input type={passwordType} id={styles.password} name="password" value={password}  className={passwordClass}
            onClick={erasePassword} onChange={changePassword} />
            <input type='submit' id={styles.loginBtn} value='로그인' />
        </form>

        <div id={styles.flex}>
            <a href="/find/id" id={styles.findID}>id 찾기</a>
            <a href="/change/password" id={styles.findPassword}>비밀번호 바꾸기</a>
        </div>
        <div id={styles.induce}>계정을 가입하지 않으셨나요?</div>
        <div id={styles.induce2}>지금
            <a href="/join" id={styles.join}> 가입 </a>
            <div id={styles.induce3} > 하세요 </div>
        </div>

        <div className={styles.panel} id={styles.naver}>
            <a href={naverOauthUrl}>네이버 로그인</a>
        </div>
        <div className={styles.panel} id={styles.google}>
            <a href={googleOauthUrl}>google 로그인</a>
        </div>

    </div>
</div>
    )
}

export default LoginForm;

