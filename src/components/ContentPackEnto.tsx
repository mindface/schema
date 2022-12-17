import { useEffect, useState, useRef,useContext } from "react";
import { readEntoContext } from "../context/readEnto";
import { packEntoContext } from "../context/packEnto";
import { FetchApi } from "../lib/fetch-api";
import { ReadEnto } from "../types/readEnto";
import { PackEnto } from "../types/packEnto";
import { PartDaialog ,PropsRef} from "./PartDaialog";

import { Dataing } from "../lib/samdata";
const fetchApi = new FetchApi()

export function ContentPackEnto() {
  const {state,dispatch} = useContext(readEntoContext);
  const {state_p,dispatch_p} = useContext(packEntoContext);
  const [viewReadEntos,setViewReadEntos] = useState<Array<{id:number,name:string,items:ReadEnto[]}>>([]);
  const [title,titleSet] = useState<string>("");
  const [description,descriptionSet] = useState<string>("");
  const [editItem,editItemSet] = useState<PackEnto>();
  const [randomItemMin,randomItemMinSet] = useState(0);
  const [randomItemMax,randomItemMaxSet] = useState(0);
  const [totalNumber,totalNumberSet] = useState(0);
  const [limitNumber,limitNumberSet] = useState(0);
  const [limitCount,limitCountSet] = useState(0);
  const dialogRef = useRef<PropsRef>(null);

  const [] = useState()
  const dataing = new Dataing(10,5,1);
  const getRandom = dataing.forRandom;

  const addItemAction = () => {
    const dates: PackEnto[] = state_p.items ?? [];
    dates.push({
      id: dates.length + 1,
      title: title,
      description: description,
      itemNumber: 0,
      groupNumber: 0
    })
    dispatch_p({type:"data/addList",dates})
    // console.log(state.dates)
  };

  const editItemAction = (item: PackEnto) => {
    dialogRef.current?.open()
    editItemSet(item)
  }

  const upodateItemAction = () => {
    let num = getRandom(Number(randomItemMin ?? 0),Number(randomItemMax ?? 0));
    num = Math.floor(num*10)/10
    const data = {...editItem,
      title: title,
      description: description,
      coreNumber: num,
      limitNumber: Number(Math.floor(num*10)/10),
      minNumber: Number(Math.floor(num*10)/10)
    }
    dispatch_p({type:"data/update",data})
  }

  const deleteItemAction = (id:number) => {
    const list: PackEnto[] = state_p.items ?? [];
    const dates = list.filter((item) => item.id !==id)
    if (window.confirm('この動作は取り消せません')) {
      dispatch_p({type:"data/addList",dates})
    }
  }

  const judgement = () => {
    if(state.items.length > 0) {
      const totalItems = state.items.filter((item) => item.coreNumber > state.division)
      const limitItems = state.items.filter((item) => item.coreNumber < state.division)
      totalNumberSet(totalItems.length)
      limitNumberSet(limitItems.length)
      limitCountSet(state.items.length ?? 0)
    }
  }

  const viewAction = (id:number) => {
    state_p.items.forEach((item) => {
      if(item.id === id){
        titleSet(item.title)
        descriptionSet(item.description)
      }
    })
  }

  // const chnageCardData = (index:number) => {
  //   const dates = viewReadEntos[index].items
  //   listTitleSet(viewReadEntos[index].name)
  //   dispatch_p({type:"data/addList",dates});
  // }

  useEffect(() => {
    judgement();
  },[]);

  return (
    <div className="Content">
      <div className="fields-division flex">
        <div className="fields p-b3">
          <div className="definition-area">
            <p>判定値 | {state.division}</p>
            <p>すべてのカード数 | {limitCount}</p>
            <p>以上のカード数 | {totalNumber}</p>
            <p>制限したカード数 | {limitNumber}</p>
          </div>
          <div className="setData-area">
            {/* {viewReadEntos.map((item,index) =>
              <button key={index} onClick={() => chnageCardData(index)}>{item.name}セットアップ</button>
            )} */}
            {(state_p.items ?? []).map((item,index) =>
              <div key={index} className="division-info base-card">
                <h3 className="title">{item.title}</h3>
                <div className="btns">
                  <button className="btn" onClick={() => viewAction(item.id)}>view</button>
                  <button className="btn" onClick={() => deleteItemAction(item.id)}>delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fields p-b3">
          <div className="field p-1">
            <input className="input" type="text" value={title} onChange={(v) => titleSet(v.target.value)} />
          </div>
          <div className="field p-1">
            <label htmlFor="textarea" className="label"></label>
            <textarea className="textarea" name="" id="textarea" cols={30} rows={10} value={description} onChange={(v) => descriptionSet(v.target.value)}></textarea>
          </div>
          <div className="field p-1">
            <button className="btn" onClick={() => addItemAction()}>分析に追加</button>
          </div>
        </div>
      </div>
    </div>
  )
}
