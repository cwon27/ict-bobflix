import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import proj4 from "proj4";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "../css/banner.css";
import "../css/home.css";
import { motion } from "framer-motion";

proj4.defs("EPSG:2097", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43");
function Home() {
  useEffect(() => {
    setHomeCatetoryMenu();
  }, []);
  const [category, setCategory] = useState([]);
  async function setHomeCatetoryMenu() {
    const result = await axios.get("http://192.168.0.3:20020/home/recommends");
    console.log(result.data);
    await setCategory(result.data);
  }

  let positions = [];

  const setMap = async () => {
    async function getApiData(kakao) {
      const response = await fetch("http://openapi.seoul.go.kr:8088/486164636f686f6e3130354c45446f5a/xml/LOCALDATA_072404/1/1000/");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();
      const parser = new DOMParser();
      const xmlText = parser.parseFromString(text, "text/xml");
      const dataRow = xmlText.querySelectorAll("row");

      dataRow.forEach((d) => {
        const title = d.querySelector("BPLCNM").innerHTML;
        const x = parseFloat(d.querySelector("X").innerHTML);
        const y = parseFloat(d.querySelector("Y").innerHTML);
        if (isNaN(x) || isNaN(y)) {
          return;
        }
        const [lng, lat] = proj4("EPSG:2097", "EPSG:4326", [x, y]);

        positions.push({
          title: title,
          latlng: new kakao.maps.LatLng(lat, lng),
        });
      });
    }
    const { kakao } = window;
    console.log(kakao);
    const container = document.getElementById("map"); // 지도를 표시할 div
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 지도의 중심좌표
      level: 1, // 지도의 확대 레벨
    };

    await getApiData(kakao);
    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    for (var i = 0; i < positions.length; i++) {
      // console.log(positions[i]);
      // 마커 이미지의 이미지 크기 입니다
      var imageSize = new kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
      // var m = new kakao.maps.Map(mapContainer, mapOption);
    }
  };

  const list = ["All", "한식", "중식", "양식", "일식", "기타"];
  const code = [100, 10, 20, 30, 40, 50];
  const img = ["all.jpg", "korean.jpg", "chinese.jpg", "western.jpg", "japanese.jpg", "dessert.jpg"];

  //DB
  var [postList, setPostList] = useState([]);

  return (
    // <main>
    <main style={{ backgroundColor: "#eeb0072c" }}>
      <div className="banner">
        <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} spaceBetween={0} slidesPerView={1} navigation pagination={{ clickable: true }}>
          <SwiperSlide>
            <img src="img/banner1.png"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/banner2.png"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/banner3.png"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/banner4.png"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/banner5.png"></img>
          </SwiperSlide>
          <SwiperSlide>
            <img src="img/banner6.png"></img>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="recommend_list">
        {list.map((text, i) => {
          return (
            <Link to={`/recommend?code=${code[i]}`}>
              <div className="recommend">
                <div>
                  <img src={`img/${img[i]}`}></img>
                </div>
                {/* <div className="img_hover"></div> */}
                <span>{text}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="res_list_all">
        {category.map((p, i) => {
          return (
            <div className="res_list_code">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{
                  ease: "easeInOut",
                  duration: 2,
                  y: { duration: 1 },
                }}
              >
                <div className="res_list">
                  <div className="container">
                    <h1 className="code_h1">{list[i + 1]}</h1>
                    <div className="row">
                      {p.map((record) => {
                        return (
                          <>
                            <div className="col-md-3" style={{ padding: "0px" }}>
                              <Link to={`/recommend/${record.idx}`}>
                                <div className="container">
                                  <div className="res_img">
                                    <img src={`http://192.168.0.3:20020/uploads/${record.img}`} />
                                    <span>{record.title}</span>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Home;
