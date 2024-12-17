import {Route, Outlet, Link, useLocation} from 'react-router-dom';
import "../css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import MypageEdit from "./MypageEdite";
import react, {useState, useRef, useEffect} from "react";
import axios from "axios";
function Header(){
    const [menuState, setMenuSteate] = useState(false);
    const [logStatus, setLogStatus] = useState(sessionStorage.getItem("logStatus"));
    const userid = sessionStorage.getItem("userid");

    const [userImg, setUserImg] = useState("");
    const menu = useRef();
    async function logout(){
         await axios.get("http://192.168.0.3:20020/logout").then((res)=>{
            sessionStorage.setItem("logStatus", "N");
            sessionStorage.removeItem("userid");
            setLogStatus('N');

        })
        .catch((error)=>{
            console.log(error);
        })
    }
    function menuOpen(){
        setMenuSteate(!menuState);
    }
    async function getImg(){
        const res = await axios.get(`http://192.168.0.3:20020/imgs/${userid}`, {
            responseType: 'arraybuffer',
          });
          const base64ArrayBuffer = (arrayBuffer) => {
            let binary = '';
            const bytes = new Uint8Array(arrayBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
          };
  
          const base64 = base64ArrayBuffer(res.data);
          const mimeType = res.headers['content-type'];
          
          setUserImg(`data:${mimeType};base64,${base64}`)
        }
    {useEffect(()=>{
        if(logStatus=="Y"){
            getImg();
        }
    })}
    const location = useLocation();
    if(location.pathname=='/mypage/edit'){
        return (
            <>
            <MypageEdit></MypageEdit>
            </>
        )
    }
    return (
        <>
        <header>
            <div className=''>

            <div className='header_icon' >
                <div onClick={menuOpen}><FontAwesomeIcon className='bar mobile' icon={faBars} size="2x" /></div>
                <div className='logo'><Link to="/">Bobflix</Link></div>
                <div className='pc nav_bar'>
                    <Link to={`/recommend?code=${100}`}>추천</Link>
                    {/* <Link to="/game">게임</Link> */}
                    <Link to="/community">커뮤니티</Link>
                </div>
            </div>
            <div className='log'>
                {logStatus != 'Y' && (<div><Link to="/login">로그인</Link></div>)}
                {logStatus=='Y'&&(<div><Link to="/mypage" className='myprofile'><img className='user_img' src={userImg}></img></Link><Link to="/" onClick={logout}>로그아웃</Link></div>)}
            </div>
            </div>
        </header>
        <div className={`${menuState?"show":"hide"} menu_bar`}  ref={menu}>
        <div className='header_icon'><div onClick={menuOpen}><FontAwesomeIcon className='bar' icon={faX} size="2x" /></div>
        <div className='logo'><Link to="/">Bobflix</Link></div></div>
            <div className='menu_list'>
                <Link className='menu' to={`/recommend?code=${100}`}><div >추천</div></Link>
                {/* <Link className='menu' to='/game'><div >게임</div></Link> */}
                <Link className='menu' to='/community'><div >커뮤니티</div></Link>
                {logStatus=="Y"&&(<Link className='menu' to='/mypage'><div >마이페이지</div></Link>)}
            </div>
        </div>
            <Outlet></Outlet>
        </>
    );
}

export default Header;