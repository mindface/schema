import { useState } from "react";

import { ContentPackEnto } from "../components/ContentPackEnto";
import { ContentEnto } from "../components/ContentEnto";
import { ReadEntoProvider } from "../context/readEnto";
import { PackEntoProvider } from "../context/packEnto";

export function InfoPackEnto(){
  const [tab,tabSet] = useState(1);

  const tabAction = (id: number) => {
    switch (id) {
      case 1:
        tabSet(1)
        return
      case 2:
        tabSet(2)
        return
      default:
        tabSet(1)
        break;
    }
  }

  return <div className="infoPackEnto">
    <ReadEntoProvider>
      <PackEntoProvider>
        <div className="tab-area p-b2">
          <button className="btn" onClick={() => tabAction(1)}>シュミュレート</button>
          <button className="btn" onClick={() => tabAction(2)}>記録と分析</button>
        </div>
        {tab === 1 && <ContentPackEnto />}
        {tab === 2 && <ContentEnto />}
      </PackEntoProvider>
    </ReadEntoProvider>
  </div>
}
