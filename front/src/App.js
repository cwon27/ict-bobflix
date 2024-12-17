import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from "./pages/Header.js";
import Home from "./pages/Home.js";
import Game from "./pages/Game.js";
import Join from "./pages/Join.js";
import Login from "./pages/Login.js";
import CommunityCreate from './pages/CommunityCreate.js';

import "./css/style.css";
import CommunityView from './pages/CommunityView.js';
import CommunityList from './pages/CommunityList.js';
import CommunityEdit from './pages/CommunityEdit.js';
import RecommendList from "./pages/RecommendList.js";
import RecommendView from './pages/RecommendView.js';
import RecommendCreate from "./pages/RecommendCreate.js";
import RecommendEdit from "./pages/RecommendEdit.js";
import Mypage from "./pages/Mypage.js";
import MypageEdit from "./pages/MypageEdite.js";

function App() {
  return (
    <div className="App">
      {/* <script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=f92a986eaffd7f538d4a966fbc2ad644&libraries=services,clusterer"
></script> */}
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Header/>}>
                  <Route index element={<Home/>}></Route>
                  {/* <Route path='/game' element={<Game/>}></Route> */}
                  <Route path='/login' element={<Login/>}></Route>
                  <Route path='/join' element={<Join/>}></Route>
                  <Route path='/community' element={<CommunityList></CommunityList>}></Route>
                  <Route path='/community/create' element={<CommunityCreate></CommunityCreate>}></Route>
                  <Route path='/community/:id' element={<CommunityView></CommunityView>}></Route>
                  <Route path='/community/:id/edit' element={<CommunityEdit></CommunityEdit>}></Route>
                  <Route path='/recommend' element={<RecommendList></RecommendList>}></Route>
                  <Route path="/recommend/:id" element={<RecommendView></RecommendView>}></Route>
                  <Route path="/recommend/create" element={<RecommendCreate></RecommendCreate>}></Route>
                  <Route path="/recommend/edit/:idx" element={<RecommendEdit></RecommendEdit>}></Route>
                  <Route path="/mypage" element={<Mypage></Mypage>}></Route>
                  <Route path="/mypage/edit" element={<MypageEdit></MypageEdit>}></Route>
              </Route>
          </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
