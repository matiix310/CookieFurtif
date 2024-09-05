function drawImage(xStart, yStart, width, blob) {
  const canvas = document.getElementsByClassName("canvas")[0]
  const ctx = canvas.getContext("2d")
  const pixelWidth = canvas.width / 255

	let fakeCanvas = document.createElement('canvas')
  let fakeCtx = fakeCanvas.getContext("2d")
  
  var img = new Image();
	img.src = "data:image/png;base64," + blob
  
  img.onload = function() {
    fakeCanvas.width = img.width
    fakeCanvas.height = img.height
  	fakeCtx.drawImage(img, 0, 0)
    
    const fakePixelWidth = img.width / width
    const height = (width * img.height) / img.width
    
    const overlay = document.createElement("canvas")
    overlay.width = canvas.width
    overlay.height = canvas.height
    overlayCtx = overlay.getContext("2d")
    
    document.body.firstElementChild.appendChild(overlay);
    setInterval(() => {
      const styles = window.getComputedStyle(document.querySelector('.canvas'))
      const cssText = Array.from(styles).reduce((str, property) => {
        return `${str}${property}:${styles.getPropertyValue(
          property,
        )};`;
      }, '');
      overlay.style.cssText = cssText;
      overlay.style.pointerEvents = "none";
    })
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let data = fakeCtx.getImageData(fakePixelWidth * (x + 0.5), fakePixelWidth * (y + 0.5), 1, 1).data
        if (data[3] != 0) {
          overlayCtx.fillStyle = `rgba(
                  ${Math.floor(data[0])}, 
                  ${Math.floor(data[1])}, 
                  ${Math.floor(data[2])})`
          overlayCtx.fillRect(pixelWidth * (xStart + x + 0.25), pixelWidth * (yStart + y + 0.25), pixelWidth * 0.5, pixelWidth * 0.5)
        }
      }
    }
  }
}

const init = async () => {
  const config = await fetch("https://raw.githubusercontent.com/matiix310/KPlace/main/config.json")
  const json = await config.json()
  for (let image of json.images) {
    const res = await fetch(image.url)
    const blob = await res.text()
    drawImage(image.x, image.y, image.width, blob)
  }
}

init()
