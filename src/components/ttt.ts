
//入力canvas
const SIZE = 256
const canvasIn = document.querySelector<HTMLCanvasElement>('#canvas-in')!
canvasIn.width = SIZE
canvasIn.height = SIZE
const ctxSrc = canvasIn.getContext('2d')!

//出力canvas
const canvasOut = document.querySelector<HTMLCanvasElement>('#canvas-out')!
canvasOut.width = SIZE
canvasOut.height = SIZE
const ctxOut = canvasOut.getContext('2d')!

let image = new Image()
let srcImage: ImageData
let outImage: ImageData

//フィルターselect
const selectFilter = document.querySelector<HTMLSelectElement>('.select-filter')
selectFilter?.addEventListener('change', e => {
  const target = e.target as HTMLSelectElement
  switch (target.value) {
    case 'binary':
      outImage = binarizationFilter(srcImage, ctxOut)
      break
    case 'redness':
      outImage = redFilter(srcImage, ctxOut)
      break
    case 'grayscale': 
      outImage = grayScaleFilter(srcImage, ctxOut)
      break
    case 'brighten':
      outImage = brightenFilter(srcImage, ctxOut)
      break
    case 'invert':
      outImage = invertionFilter(srcImage, ctxOut)
      break
    case 'laplacian'://laplacian
      outImage = laplacianFilter(srcImage, ctxOut)
      break
    case 'gaussian':
      outImage = gaussianFilter(srcImage, ctxOut)
      break
    case 'sharp':
      outImage = sharpnessFilter(srcImage, ctxOut)
      break
    case 'median':
      outImage = medianFilter(srcImage, ctxOut)
      break
    default:
      break
  }
  ctxOut.putImageData(outImage, 0, 0)
})

//ロードが終わったら画像をcanvasから取得
image.addEventListener('load', () => {
  ctxSrc.drawImage(image, 0, 0)
  
  srcImage = ctxSrc.getImageData(0, 0, SIZE, SIZE)
  document.querySelector('.select-filter')?.classList.add('appear')
})

//フィルターが変更されたら
let inputElement = document.querySelector<HTMLInputElement>('#fileInput')
inputElement?.addEventListener('change', e => {
  const target = e.target as HTMLInputElement
  if (target.files !== null) {
    image.src = URL.createObjectURL(target.files[0])
  }
}, false)

const binarizationFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D ,threshold=128) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      const R = data[pos]
      const G = data[pos + 1]
      const B = data[pos + 2]

      const lightness = 0.299 * R + 0.587 * G + 0.144 * B > threshold ? 255 : 0

      outImage.data[pos] = lightness
      outImage.data[pos + 1] = lightness
      outImage.data[pos + 2] = lightness
      outImage.data[pos + 3] = data[pos + 3]
    }
  }
  return outImage
}

const brightenFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      outImage.data[pos] = gammaTransform(data[pos])
      outImage.data[pos + 1] = gammaTransform(data[pos + 1])
      outImage.data[pos + 2] = gammaTransform(data[pos + 2])
      outImage.data[pos + 3] = data[pos + 3]
    }
  }

  return outImage
}

const gaussianFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const kernel = [
    [1 / 16, 2 / 16, 1 / 16],
    [2 / 16, 4 / 16, 2 / 16],
    [1 / 16, 2 / 16, 1 / 16]
  ]
  return spaceFilter(image, kernel, ctxOut)
}

const grayScaleFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      const R = data[pos]
      const G = data[pos + 1]
      const B = data[pos + 2]

      const lightness = 0.299 * R + 0.587 * G + 0.144 * B

      outImage.data[pos] = lightness
      outImage.data[pos + 1] = lightness
      outImage.data[pos + 2] = lightness
      outImage.data[pos + 3] = data[pos + 3]
    }
  }

  return outImage
}

const invertionFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      outImage.data[pos] = 255 - data[pos]
      outImage.data[pos + 1] = 255 - data[pos + 1]
      outImage.data[pos + 2] = 255 - data[pos + 2]
      outImage.data[pos + 3] = data[pos + 3]
    }
  }

  return outImage
}

const laplacianFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const kernel = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0]
  ]
  return spaceFilter(grayScaleFilter(image, ctxOut), kernel, ctxOut)
}

const medianFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      const arrayR = []
      const arrayG = []
      const arrayB = []

      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if (!(i === 0 || i === height - 1 || j === 0 || j === width - 1)) {
            const kpos = 4 * (((i - 1) + k ) * width + ((j -1) + l))
            arrayR.push(data[kpos])
            arrayG.push(data[kpos+ 1])
            arrayB.push(data[kpos+ 2])
          } else {
            arrayR.push(255)
            arrayG.push(255)
            arrayB.push(255)
          }
        }
      } 

      const R = arrayR.sort()[4]
      const G = arrayG.sort()[4]
      const B = arrayB.sort()[4]

      outImage.data[pos] = R
      outImage.data[pos + 1] = G
      outImage.data[pos + 2] = B
      outImage.data[pos + 3] = data[pos + 3]
    }
  }
  return outImage
}

const redFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      outImage.data[pos] = gammaTransform(data[pos])
      outImage.data[pos + 1] = data[pos + 1]
      outImage.data[pos + 2] = data[pos + 2]
      outImage.data[pos + 3] = data[pos + 3]
    }
  }

  return outImage
}


const sharpnessFilter = (image: ImageData, ctxOut: CanvasRenderingContext2D) => {
  const kernel = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1]
  ]
  return spaceFilter(image, kernel, ctxOut)
}

const spaceFilter = (image: ImageData, kernel: number[][], ctxOut: CanvasRenderingContext2D) => {
  const width = image.width
  const height = image.height
  const data = image.data

  let outImage = ctxOut.createImageData(width, height)

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const pos = 4 * (i * width + j)

      let R = 0
      let G = 0
      let B = 0

      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if (!(i === 0 || i === height - 1 || j === 0 || j === width - 1)) {
            const kpos = 4 * (((i - 1) + k ) * width + ((j -1) + l))
            R += data[kpos] * kernel[k][l]
            G += data[kpos + 1] * kernel[k][l]
            B += data[kpos + 2] * kernel[k][l]
          } else {
            R += 255
            G += 255
            B += 255
          }
        }
      } 

      outImage.data[pos] = R
      outImage.data[pos + 1] = G
      outImage.data[pos + 2] = B
      outImage.data[pos + 3] = data[pos + 3]
    }
  }
  return outImage
}

const gammaTransform = (x: number, gamma=2) => {
  return 255 * (x / 255) ** (1 / gamma)
}