import { ContentCard } from "../components/ContentCard";
import { DataProvider } from "../context/data";

export function InfoSettings(){
  return <div className="infoSettings">
    <DataProvider>
      <ContentCard />
    </DataProvider>
  </div>
}
