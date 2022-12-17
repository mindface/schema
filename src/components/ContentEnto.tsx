import { useEffect, useState, useRef,useContext } from "react";
import { readEntoContext } from "../context/readEnto";
import { FetchApi } from "../lib/fetch-api";
import { ReadEnto } from "../types/readEnto";
import { PartDaialog ,PropsRef} from "./PartDaialog";

import { Dataing } from "../lib/samdata";

const fetchApi = new FetchApi()

export function ContentEnto() {
  const {state,dispatch} = useContext(readEntoContext);
  const [viewReadEntos,setViewReadEntos] = useState<Array<{id:number,name:string,items:ReadEnto[]}>>([]);
  const [title,titleSet] = useState<string>("");
  const [listTitle,listTitleSet] = useState<string>("");
  const [description,descriptionSet] = useState<string>("");
  const [editItem,editItemSet] = useState<ReadEnto>();
  const [randomItemMin,randomItemMinSet] = useState(0);
  const [randomItemMax,randomItemMaxSet] = useState(0);
  const [itemNumber,itemNumberSet] = useState(0);
  const [conditions,conditionsSet] = useState(0);
  const dialogRef = useRef<PropsRef>(null);

  const dataing = new Dataing(10,5,1);
  const getRandom = dataing.forRandom;
  const y = dataing.setObData([
    {key:"ninnchi",type:'string'},
    {key:"no",type:'number',min:20,max:21},
    {key:"ni",type:'number'},
    {key:"ng",type:'number'},
  ])

  const addCardAction = () => {
    const number = Number(itemNumber ?? 0);
    const dates: ReadEnto[] = [];
    const division = conditions;
    for (let index = 0; index < number; index++) {
      let num = getRandom(Number(randomItemMin ?? 0),Number(randomItemMax ?? 0));
      num = Math.floor(num*10)/10
      const itemId = index+1;
      dates.push({
        id: itemId,
        title: title,
        description: description,
        coreNumber: num,
        limitNumber: Number(Math.floor(num*10)/10),
        minNumber: Number(Math.floor(num*10)/10)
      });
    }
    dispatch({type:"data/addList",dates})
    dispatch({type:"data/divisionSet",division})
    // console.log(state.dates)
  };

  const editAction = (item: ReadEnto) => {
    dialogRef.current?.open()
    editItemSet(item)
  }

  const upodateAction = () => {
    let num = getRandom(Number(randomItemMin ?? 0),Number(randomItemMax ?? 0));
    num = Math.floor(num*10)/10
    const data = {...editItem,
      title: title,
      description: description,
      coreNumber: num,
      limitNumber: Number(Math.floor(num*10)/10),
      minNumber: Number(Math.floor(num*10)/10)
    };
    dispatch({type:"data/update",data});
  };

  const judgement = () => {
    if(state?.items && state?.items.length === 0) return [];
    const items = state?.items.filter((item) => conditions > item.coreNumber)
    return items ?? [];
  }

  const deleteCard = (id:number) => {
    (async () => {
      const res = await fetchApi.Delete<{Id:number}>('http://localhost:3003/cards',{Id:id})
      console.log(res)
    })()
  }

  const addCardData = () => {
    setViewReadEntos([...viewReadEntos,{id:viewReadEntos.length+1,name:listTitle,items:state?.items}])
  }

  const chnageCardData = (index:number) => {
    const dates = viewReadEntos[index].items
    listTitleSet(viewReadEntos[index].name)
    dispatch({type:"data/addList",dates});
  }

  const editArea = (type: string) => {
    useEffect(() => {
      if(type === "add") {
        titleSet("")
        descriptionSet("")
        randomItemMinSet(0)
        randomItemMaxSet(0)
      }else {
        titleSet(editItem?.title!)
        descriptionSet(editItem?.description!)
        randomItemMinSet(editItem?.minNumber!)
        randomItemMaxSet(editItem?.limitNumber!)
      }
    },[editItem])

    return (
      <div className="editarea">
        <div className="fields">
          <div className="field">
            タイトル｜ <input className="input" type="text" value={title ?? ''} onChange={(v) => titleSet(v.target.value)} />
          </div>
          <div className="field">
            詳細｜ <input type="text" className="input" value={description ?? ''} onChange={(v) => descriptionSet(v.target.value)} />
          </div>
          <div className="field">
            <p className="field-item">ランダム数値範囲(このランダムはブラウザのランダムに依存します。)</p>
            <p className="field-item">最低値の範囲｜{randomItemMin ?? 0} <br /><input type="range" value={randomItemMin ?? "0"} step={0.1} onChange={(v) => randomItemMinSet(Number(v.target.value))} /></p>
            <p className="field-item">最高値の範囲｜{randomItemMax ?? 0} <br /><input type="range" value={randomItemMax ?? "0"} step={0.1} onChange={(v) => randomItemMaxSet(Number(v.target.value))} /></p>
          </div>
          { type === "add" && <div className="field">
            <p>アイテム生成数 {itemNumber}</p>
            <p className="field-item">最低値の範囲｜ <input type="range" value={itemNumber?? 0} onChange={(v) => itemNumberSet(Number(v.target.value))} /></p>
          </div>}
          { type === "add" && <div className="field">
            <input type="range" id="conditions" name="conditions" value={conditions ?? 0} onChange={(l) => conditionsSet(Number(l.target.value))} min="0" max="10" step={0.1} />
            <label htmlFor="conditions">条件判定数 {conditions} (以上が表示されます。)</label>
          </div>}
          <div className="field">
            { type === "add" && <p><button className="btn" onClick={addCardAction}>追加</button></p>}
            { type === "edit" &&  <p><button className="btn" onClick={upodateAction}>更新</button></p>}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="ContentEntity">
        <>
          <div className="fields p-b3">
            <div className="field">
              <PartDaialog
                openText="追加"
                openView={true}
                children={editArea("add")}
              />
            </div>
            <div className="field">
              <input type="text" className="input" value={listTitle} onChange={(v) => listTitleSet(v.target.value)} />
              <button className="btn" onClick={() => addCardData()}>カテゴリに追加</button>
            </div>
            <div className="setData-area">
              {viewReadEntos?.map((item,index) =>
                <button key={index} onClick={() => chnageCardData(index)}>{item.name}セットアップ</button>
              )}
            </div>
          </div>
          <div className="cards-area">
            <h3 className="title">リミット範囲</h3>
            <div className="cards limit">
              {judgement().length > 0 && judgement().map((item) => <div className="card" key={item.id}>
                <p>{item.title} {item.coreNumber} <button className="btn" onClick={() => editAction(item)}>edit</button></p>
              </div>)}
            </div>
            <h3 className="title">全体</h3>
            <div className="cards base">
              {state?.items && (state?.items ?? []).map((item) => <div className="card" key={item.id}>
                <p>{item.title} {Number(item.coreNumber)} <button className="btn" onClick={() => editAction(item)}>edit</button></p>
              </div>)}
            </div>
            <PartDaialog
              children={editArea("edit")}
              ref={dialogRef}
            />
          </div>
          <div className="number-area">
            <span>{judgement().length}</span>/<span>{(state?.items ?? []).length}</span>
          </div>
          <div className="definition-area">
            <p>10以上で30以下は確認</p>
            <textarea name="" id="" cols={30} rows={10} placeholder={`ex)全体${(state?.items ?? []).length}より${judgement().length}以上は更新`}></textarea>
          </div>
        </>
    </div>
  )
}
