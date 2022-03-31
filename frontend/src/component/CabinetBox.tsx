import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './cabinetBox.css'

export default function CabinetBox(props:any){
  const history = useHistory();
  let isExpired:boolean = false;
  console.log("props.expire_time" + props.expire_time + "\n");
  console.log("props.isLent" + props.isLent  + "\n");

  if (props.isLent && props.expire_time){
    isExpired = new Date(props.expire_time) < new Date();
  }

  const clickHandler = () => {
    props.setTarget(props.cabinet_id);
    props.setCabiNum(props.cabinet_num);
  }

  const clickMyCabinet = () => {
    history.push('/return');
  }

  let clickEvent = clickHandler;
  let toggleName = props.intra_id !== "" ? "" : "modal";
  let targetName = props.isLent === -1 ? "#lentmodal" : "#contentsmodal";
  let vanilaClassName = "border justify-content-center";

  if (props.intra_id === props.user){
    toggleName = "modal";
    targetName = "";
    clickEvent = clickMyCabinet;
  }

  if (isExpired){
    vanilaClassName += " expiredLentCabinet";
    console.log("expiredLentCabinet\n");
  }else if (props.intra_id === props.user){
    vanilaClassName += " myLentCabinet";
    console.log("myLentCabinet\n");
  }else if (props.intra_id !== ""){
    vanilaClassName += " lentCabinet";
    console.log("lentCabinet\n");
  }

  return (
    <div className={vanilaClassName} data-bs-toggle={toggleName} data-bs-target={targetName} onClick={clickEvent}>
      <div id="cabinet_num">{props.cabinet_num}</div>
      <div id="intra_id">{props.intra_id}</div>
    </div>
  );
}
