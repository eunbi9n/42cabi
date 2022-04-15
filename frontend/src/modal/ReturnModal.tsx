import axios from 'axios'
import { useState } from 'react';
import './returnModal.css'

export default function ReturnModal(props: any) {
  const handleReturn = () => {
		let result:number = 0;
    const second:number = new Date().getSeconds();

    //if (new Date() < new Date(2022, 3, 18, 10, 0, 0)){
    //  return ;
    //}
    if (user && lentCabinet){
      result = user.user_id + lentCabinet.lent_cabinet_id + second;
    }
    if (result && result % 42 === 11){
     //setReturnTarget("#returneventmodal");
			return true;
    }else {
			return false;	
		}
  }
  const [returnTarget, setReturnTarget] = useState<string>(handleReturn() ? "#returneventmodal" : "#contentsmodal");
  
  const handleClick = async () => {
    const url = "/api/return";
    await axios.post(url, { lent_id: props.lentCabinet.lent_id }).then((res: any) => {
      if (res.status === 200) {
        localStorage.clear();
        props.setContent("반납되었습니다");
        props.setPath("/lent");
      }
    }).catch((err: any) => {
      console.log(err);
      props.setContent("다시 시도해주세요!");
      props.setPath("");
    })
  }
  // const handleReturn = () => {
  //   // let result:number = 0;
  //   // const second:number = new Date().getSeconds();

  //   //if (new Date() < new Date(2022, 3, 18, 10, 0, 0)){
  //   //  return ;
  //   //}
  //   //if (user && lentCabinet){
  //   //  result = user.user_id + lentCabinet.lent_cabinet_id + second;
  //   //}
  //   //if (result && result % 42 === 11){
  //     setReturnTarget("#returneventmodal");
  //     return true;
  //   //}
  // }

  return (
    <div className="modal" id="returnmodal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">이용 중인 사물함을 반납합니다.</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>사물함을 반납하시겠습니까?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">취소</button>
            <button type="button" className="btn btn-primary" id="btn-primary" data-bs-toggle="modal" data-bs-target={returnTarget} data-bs-dismiss="modal" onClick={handleClick}>반납</button>
          </div>
        </div>
      </div>
    </div>
  )
}
