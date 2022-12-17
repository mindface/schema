
const headers: { "Content-Type": string; Authorization?: string } = {
  "Content-Type": "application/json",
};

interface Struct {
  key:string,
  type:string,
  min?:number,
  max?:number
}

interface ObjItem {
  [n:string]: (string|number)
}

export class Dataing {
  loop:number = 0;
  max:number = 0;
  min:number = 0;
  constructor(loop:number, max:number, min:number){
    this.loop = loop;
    this.max = max;
    this.min = min;
  }

  setObData<T>(structerInfo:Struct[]) {
    const _obj:ObjItem = {}
    structerInfo.forEach((item:Struct,index:number) => {
      _obj[`item${index}`] = item.key;
    });
    const list: ObjItem[] = [];
    for (let index = 0; index < this.loop; index++) {
      const obj:ObjItem = {}
      structerInfo.forEach((item:Struct) => {
        let setNumber:number = 0;
        if(item.type === 'number' && item.min && item.max){
          setNumber = this.forRandom(item.min,item.max);
        }else {
          setNumber = this.forRandom(this.min,this.max);
        }
        obj[item.key] = item.type === 'number' ? setNumber : item.type
      })
      list.push(obj);
    }
    return list;
  }

  forRandom(min:number,max:number) {
    return Math.random() * (max - min) + min;
  }

}

export const canvasGrayScale = (ctx: CanvasRenderingContext2D,data: ImageData,w:number,h:number) => {
  const pixels = data;
  const outImage = ctx.createImageData(w,h);
  for (let y = 0; y < h; y++) {
    for (let j = 0; j < w; j++) {
      const n = 4 * (y*w+j);
      var red = pixels.data[n];
      var green = pixels.data[n + 1];
      var blue = pixels.data[n + 2];
      const grayScale = (red * 0.299) + (green * 0.587) + (blue * 0.144);
      outImage.data[n] = grayScale;
      outImage.data[n + 1] = grayScale;
      outImage.data[n + 2] = grayScale;
      outImage.data[n + 3] = pixels.data[n + 3];
    }
  }
  return outImage;
}

export const canvasLaplacianFilter = (imageData: ImageData, ctxPut: CanvasRenderingContext2D) => {
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  const outImage = ctxPut.createImageData(w,h);
  const kernel = [
    [0,1,0],
    [1,-4,1],
    [0,1,0]
  ];

  for (let y = 0; y < h; y++) {
    for (let j = 0; j < w; j++) {

      const pos = 4 * (y*w + j);
      let r = 0;
      let g = 0;
      let b = 0;

      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if(!(y === 0 || y === h - 1 || j === 0 || j === w - 1 )){
            const kpos = 4*(((y - 1) + k) * w + ((j - 1) + l));
            r += data[kpos] * kernel[k][l];
            g += data[kpos + 1] * kernel[k][l];
            b += data[kpos + 2] * kernel[k][l];
          }else {
            r += 255;
            g += 255;
            b += 255;
          }
        }
      }

      outImage.data[pos] = r;
      outImage.data[pos + 1] = g;
      outImage.data[pos + 2] = b;
      outImage.data[pos + 3] = data[pos + 3];

    }
  }
  return outImage;
}
