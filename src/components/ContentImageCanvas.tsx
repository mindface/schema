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

export function ContentImageCanvas() {
  const {state,dispatch} = useContext(readEntoContext);
  const [viewReadEntos,setViewReadEntos] = useState<Array<{id:number,name:string,items:ReadEnto[]}>>([]);
  const [overlap,overlapSet] = useState(false);
  const [writeData,writeDataSet] = useState<WriteData[]>([]);
  const [context,contextSet] = useState<CanvasRenderingContext2D>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileElement = useRef<HTMLInputElement>(null);
  const imgElement = useRef<HTMLDivElement>(null);
  const putCanvasElement = useRef<HTMLDivElement>(null);
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

  const viewing = (e: ChangeEvent) => {
      const targetElement = e.currentTarget as HTMLInputElement
      const canvasElement = document.createElement('canvas');
      const boxElement = document.createElement('div');
      boxElement.className = "canvasBox";
      const inputElement = document.createElement('input');
      let num = '1';
      inputElement.type = "range";
      inputElement.step = "0.1";
      inputElement.max = "1";
      inputElement.addEventListener('change', (e) => {
        num = inputElement.value;
        boxElement.setAttribute('style',`opacity:${num};`)
      });
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ctx = canvasElement?.getContext('2d');

      if(targetElement && targetElement?.files?.length === 0) return
      const file = targetElement.files![0];
      const blobURLref = window.URL.createObjectURL(file)
      const reader = new FileReader();
      reader.onload = function(evt) {
        const img = new Image();
        img.src = evt.target?.result as any;
        img.onload = function() {
          const _w = img.naturalWidth;
          const _h = img.naturalHeight;
          canvasElement!.width = _w;
          canvasElement!.height = _h;
          ctx?.drawImage(img,0,0,_w,_h);
          // canvasElement?.setAttribute('style',`width:${img.naturalWidth}px; height: ${img.naturalHeight}px;`)
          // canvas.current!.width = Number(img.naturalWidth ?? '0');
          // canvas.current!.height = Number(img.naturalHeight ?? '0');
          const imageData = ctx?.getImageData(0,0,_w ,_h);
          const ctx_ = canvasLaplacianFilter(canvasGrayScale(ctx!,imageData!,_w,_h), ctx!);
          ctx?.putImageData(ctx_,0,0);
          imgElement.current?.appendChild(img);

          boxElement?.appendChild(canvasElement);
          boxElement?.appendChild(img);
          boxElement?.appendChild(inputElement);
          putCanvasElement.current?.appendChild(boxElement);
        }
      }
      reader.readAsDataURL(file);
    };

    // ctx?.drawImage(img,0,0,w,h);
  useEffect(() => {
  },[]);

  return (
    <div className="ContentRatio">
      <div className="input-area">
        <input type="file" name="" ref={fileElement} onChange={viewing} />
      </div>
      <div className="swtch" onClick={() => overlapSet(!overlap)} >{overlap ? 'on':'off' }</div>
      <div className={overlap ?'put-box on':'put-box'}>
        <div className="img-box" ref={imgElement}></div>
        <div className="canvas-box"ref={putCanvasElement} ></div>
      </div>
    </div>
  )
}
