import React, { useState, useEffect  } from 'react';
import '../css/mypage_edit.css'; 

import axios from 'axios';

const Form = () => {
  const userid = sessionStorage.getItem("userid");
  const [userFile, setUserFile] = useState("");
  const [formData, setFormData] = useState({ });

  const handleImageChange = (e) => {
    const file1 = e.target.files[0];
    setUserFile(file1);
    // setFile(e.target.files[0]);
    console.log(file1);
    if (file1) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, userimg: reader.result }));
      };
      reader.readAsDataURL(file1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p=> {return{...p, [name]: value }});
  };

  async function handleSubmit(e) {
    e.preventDefault();
    await postEdit();
  };

  async function postEdit(){
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
      if (key == 'userimg' && formData[key]) {
        console.log(key, formData[key]);
        // 이미지 파일을 Blob으로 변환
          const byteString = atob(formData[key].split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: 'image/jpeg' });
        // formDataToSend.append('userimg', file);

      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

      const tel = `${formData.tel1}-${formData.tel2}-${formData.tel3}`;
      const email = `${formData.emailF}@${formData.emailDomain}`;
      formDataToSend.append('tel', tel);
      formDataToSend.append('email', email);

      formDataToSend.append('id', '사용자ID');
      console.log(formData, userFile);

      
      const response = await axios.post(`http://192.168.0.3:20020/mypage/${userid}/edit`, {formData, "img": userFile},{
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }
      );
      console.log("서버응답:", response.data);

      localStorage.setItem('userInfo', JSON.stringify({
        username: formData.username,
        nickname: formData.nickname,
        tel: tel,
        email: email,
        userimg: formData.userimg
      }));

      
      alert('정보가 성공적으로 수정되었습니다.');
      if (window.opener) {
        window.opener.location.reload();
      }
      window.close();
    } catch (error) {
      console.error('에러 발생:', error.response ? error.response.data : error.message);
      alert('정보 수정 중 오류가 발생했습니다.'+ (error.response ? error.response.data : error.message));
    }

  }

  const [value, setValue] = useState('');

  const tel = (e) => {
    const inputValue = e.target.value;
    // 숫자와 빈 문자열만 허용
    if (inputValue == '' || !/^[0-9\b]+$/.test(inputValue)) {
        alert("숫자만 입력하세요")
        
    }
  };
  const [users, setUsers] = useState([]);
  async function getUserData(){
    const result = await axios.get(`http://192.168.0.3:20020/mypage/${userid}`);
    console.log(result.data.userimg);
    setFormData(result.data);
    const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, userimg: reader.result }));
      };
      // reader.readAsDataURL(result.data.userimg);
  } 
  useEffect(() => {
    getUserData();

    },[]);

  //   fetchUsers();
  // }, []);
  
  //   axios.post('http://192.168.0.3:5000/edite',formData)
  //   .then(function(response){

  //   })
  //   .catch(function(error){

  //   });

  useEffect(() => {
    // 페이지가 로드된 후 스크롤바를 제거
    document.body.style.overflow = 'hidden';

    // 컴포넌트가 언마운트될 때 스타일을 원래대로 복원
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="myform-container" style={{ width: '780px', justifyContent: 'space-between'}}>
      <h1>내 정보수정</h1>
      <div className="profile-pic">
      <img  src={formData.userimg } style={{width:'150px', height: '150px', borderRadius:'50%'}}/>
        <input 
        name="userfile"
        enctype="multipart/form-data"
          type="file" 
          src={`${formData.userimg}`}
          onChange={handleImageChange} 
          style={{display: 'none'}} 
          id="profileImageInput"
          
        />
        <div onClick={() => document.getElementById('profileImageInput').click()}>
          프로필 변경하기
        </div>
      </div>
      <form className='my_edit_form' onSubmit={handleSubmit}>
        <div className="form-group">
        <label>이름</label>
          <input type="text" name="username" id="username"  onChange={handleChange} value={formData.username}/>
        </div>
        <div className="form-group">
        <label>닉네임</label>
          <input type="text" name="nickname" id="nickname"  onChange={handleChange} value={formData.nickname}/>
        </div>
        {/* <div className="form-group">
          <label>비밀번호</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>비밀번호 확인</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div> */}
        <div className="form-group">
          <label>연락처</label>
          <div className="contact-group">
              <select name="tel1" onChange={handleChange} className="contact-small" value={formData.tel1}>
              <option value="">선택</option>
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="02">02</option>
                <option value="031">031</option>
              </select>- 
            <input type="text" name="tel2" placeholder="xxxx" className="contact-small" maxlength="4" onChange={handleChange} value={formData.tel2}/> -
            <input type="text" name="tel3" placeholder="xxxx" className="contact-small" maxlength="4" onChange={handleChange} value={formData.tel3}/>
          </div>
        </div>
        <div className="form-group">
          <label>이메일주소</label>
          <div className="email-group">
            <input type="text" name="emailF" value={formData.emailF} onChange={handleChange} className="email-small" 
            style={{width:'145px'}}/> @
            <select name="emailDomain" className="email-small" onChange={handleChange} value={formData.emailDomain}>
              <option value="select">선택</option>
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
            </select>
          </div>
        </div>
        <div id="button" ><button type="submit">수정 완료</button></div>
      </form>
    </div>
  );
};

export default Form;
