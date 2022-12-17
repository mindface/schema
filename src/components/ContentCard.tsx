import { useEffect, useState, useRef ,useContext } from "react";
import { dataContext } from "../context/data";
import { FetchApi } from "../lib/fetch-api";
import { ConnectInfo } from "../types/connectInfo";
import { Card } from "../types/data";

import { Dataing } from "../lib/samdata";

const fetchApi = new FetchApi()

export function ContentCard() {
  const {state,dispatch} = useContext(dataContext);
  const [viewCards,setViewCards] = useState<Card[]>([]);
  const [viewData,setViewData] = useState<ConnectInfo[]>([]);
  const title = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const description_c = useRef<HTMLInputElement>(null);
  const randomInfo_c = useRef<HTMLInputElement>(null);
  const random_card_min = useRef<HTMLInputElement>(null);
  const random_card_max = useRef<HTMLInputElement>(null);
  const childId = useRef<HTMLInputElement>(null);
  const palentId = useRef<HTMLInputElement>(null);
  const randomInfo = useRef<HTMLInputElement>(null);
  const [] = useState()
  const dataing = new Dataing(10,5,1);
  const getRandom = dataing.forRandom;
  const y = dataing.setObData([
    {key:"ninnchi",type:'string'},
    {key:"no",type:'number',min:20,max:21},
    {key:"ni",type:'number'},
    {key:"ng",type:'number'},
  ])

  const addCardAction = () => {
    const number = state.dates.length+1;
    const num = getRandom(Number(random_card_min.current?.value!),Number(random_card_max.current?.value!));
    const data = {
      title:title.current?.value!,
      description: description_c.current?.value!,
      setNumber: 0,
      coreNumber:Number(Math.floor(num*10)/10)
    };
    (async () => {
      const res = await fetchApi.Post<Card>('http://localhost:3003/cards',data)
      console.log(res)
    })()
    // dispatch({type:"data/add",data})
    // console.log(state.dates)
  };

  const upodateAction = (item: Card) => {
    const data = {
      id: item.id!,
      title: "item.titlekokoko",
      description: item.description,
      setNumber: item.setNumber,
      coreNumber: item.coreNumber
    };
    (async () => {
      console.log(data)
      const res = await fetchApi.Put<Card>('http://localhost:3003/cards',data)
      console.log(res)
    })()
  };

  const deleteCard = (id:number) => {
    (async () => {
      const res = await fetchApi.Delete<{Id:number}>('http://localhost:3003/cards',{Id:id})
      console.log(res)
    })()
  };

  const deleteAction = () => {};

  const addConnectAction = () => {
    const sendData:ConnectInfo = {
      name: name.current?.value ?? "none",
      description: description.current?.value ?? "",
      childId: Number(childId.current?.value) ?? 10,
      palentId: Number(palentId.current?.value) ?? 10,
    };
    (async () => {
      const res = await fetchApi.Post<ConnectInfo>('http://localhost:3003/connectInfo',sendData)
      console.log(res)
    })()
  }

  useEffect(() => {
    (async () => {
      const res = await fetchApi.Get<{connectInfo:ConnectInfo[]}>('http://localhost:3003/connectInfo')
      const cards = await fetchApi.Get<{cards:Card[]}>('http://localhost:3003/cards')
      setViewCards(cards.cards);
      console.log(cards)
      if(res.connectInfo) {
        setViewData(res.connectInfo);
      }
    })()
  },[])

  return (
    <div className="ContentEntity">
      <div className="fields">
        <p>card</p>
        <p>タイトル｜<input type="text" ref={title} /></p>
        <p>詳細｜<input type="text" ref={description_c} /></p>
        <div className="field">
          <input type="range" id="randomInfo" ref={randomInfo} defaultValue={1} name="culme" min="0" max="10" />
          <label htmlFor="randomInfo">ランダム数値範囲</label>
        </div>
        <p>card min<input type="number" ref={random_card_min} defaultValue={0} /></p>
        <p>card max<input type="number" ref={random_card_max} defaultValue={1} /></p>
        <p><button onClick={addCardAction}>addCard</button></p>
      </div>
      <div className="fields">
        <div className="field">
          <input type="text" ref={name} />
        </div>
        <div className="field">
          <input type="text" ref={description} />
        </div>
        <div className="field">
          <input type="range" id="randomInfo_c" ref={randomInfo_c} name="culme" min="0" max="10" />
          <label htmlFor="randomInfo_c">ランダム数値範囲</label>
        </div>
        <div className="field">
          <input type="range" id="childId" ref={childId} name="culme" min="0" max="100" />
          <label htmlFor="childId">ランダム数値範囲</label>
        </div>
        <div className="field">
          <input type="range" id="palentId" ref={palentId} name="culme" min="0" max="1000" />
          <label htmlFor="palentId">ランダム数値範囲</label>
        </div>
        <div className="field">
          <button onClick={addConnectAction}>addConnectInfo</button>
        </div>
        <div className="field">
          <input type="range" id="volume" name="culme" min="0" max="11" />
          <label htmlFor="volume">calume</label>
        </div>
        <div className="field">02</div>
        <div className="field">03</div>
        {viewData.map((item) => <div key={item.ID}>{item.name}</div>)}
        {viewCards.map((item) => <div key={item.id}>
          <p>{item.title}</p>
          <p><button onClick={() => upodateAction(item)}>upodate</button></p>
          <p><button onClick={() => deleteCard(item.id!)}>delete</button></p>
        </div>)}
      </div>
    </div>
  )
}
