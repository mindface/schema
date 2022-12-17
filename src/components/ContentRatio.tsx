import React, { useEffect, useState, useRef,useContext, ReactFragment, ChangeEvent } from "react";
import { readEntoContext } from "../context/readEnto";
import { FetchApi } from "../lib/fetch-api";
import { ReadEnto } from "../types/readEnto";
import { Dataing, canvasLaplacianFilter, canvasGrayScale } from "../lib/samdata";

export interface WriteData {
  id:number;
  ratioNumber: number;
  title: string;
  body: string;
}

const fetchApi = new FetchApi()

export function ContentRatio() {
  const {state,dispatch} = useContext(readEntoContext);
  const [viewReadEntos,setViewReadEntos] = useState<Array<{id:number,name:string,items:ReadEnto[]}>>([]);
  const [title,titleSet] = useState<string>("");
  const [body,bodySet] = useState<string>("");
  const [writeData,writeDataSet] = useState<WriteData[]>([]);
  const [writeItem,writeItemSet] = useState<WriteData>();
  const [ratioNumber,ratioNumberSet] = useState(0);
  const dataing = new Dataing(10,5,1);
  const getRandom = dataing.forRandom;

  useEffect(() => {
    writeDataSet([{
      id:1,
      ratioNumber: 100,
      title: "rrr",
      body: "rrr"
    }]);
  },[]);

  const AddAction = () => {
    writeDataSet([...writeData,{
      id: writeData.length + 1,
      ratioNumber: 100,
      title: "rrr",
      body: "rrr"
    }]);
  }

  const edit = (item:WriteData) => {
    titleSet(item.title);
    bodySet(item.body);
    ratioNumberSet(item.ratioNumber);
    writeItemSet(item);
  };

  const update = () => {
    writeDataSet(() => {
      return writeData.map((item) => {
        if(item.id === writeItem!.id) {
          return {...item,ratioNumber:ratioNumber,title:title,body:body};
        }
        return item;
      })
    })
  };

  const setTotal = () => {
    let num = 0;
    writeData.map((item) => num += item.ratioNumber);
    return num;
  }

  return (
    <div className="ContentRatio">
      <div className="header-box flex">
        <div className="base-lang">
          <p>単語の情報の構成因子<input className="input" type="text" name="" id="" /></p>
        </div>
        <div className="btns">
          <button className="btn" onClick={() => AddAction()}>構造の追加</button>
        </div>
      </div>
      <div className="flex">
        <div className="info-box">
          <div className="edit-area p-2">
            <p className="number p-1"><input type="range" className="input" max={100} step={0.1} value={ratioNumber} onChange={(e) => ratioNumberSet(Number(e.target.value))} /> | {ratioNumber}%</p>
            <p className="title p-1"><input type="text" className="input" value={title} onChange={(e) => titleSet(e.target.value)} /></p>
            <div className="body p-1"><textarea name="" className="textarea" value={body} onChange={(e) => bodySet(e.target.value)} cols={30} rows={10}></textarea></div>
            <div className="btns"><button className="btn" onClick={() => update()}>update</button></div>
          </div>
        </div>
        <div className="view-box">
          <p className="total">total: <span className="picup">{setTotal()}%</span></p>
          <div className="data-area flex">
            {writeData.map((item,index) => { 
              return (
              <div className="item p-2" key={index} >
                <h3 className="title p-b1">{item.title}</h3>
                <div className="body p-b1">詳細｜{item.body}</div>
                <div className="btns flex flex-center">
                  <p className="number p-r1">保持比率 : {item.ratioNumber}%</p>
                  <button className="btn" onClick={() => edit(item)}>edit</button>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  )
}
