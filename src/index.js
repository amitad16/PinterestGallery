"use strict";

let container = document.getElementById("root");
const imgUrls = [
  "./img/300.jpeg",
  "./img/100.jpeg",
  "./img/300.jpeg",
  "./img/400.jpeg",
  "./img/200.jpeg",
  "./img/300.jpeg",
  "./img/100.jpeg",
  "./img/300.jpeg",
  "./img/400.jpeg",
  "./img/200.jpeg",
  "./img/300.jpeg",
  "./img/100.jpeg",
  "./img/300.jpeg",
  "./img/400.jpeg",
  "./img/200.jpeg"
];

let columns = 4;
let columnImgProps = [];

let getImgMeta = (url, callback) => {
  let img = new Image();
  img.src = url;
  img.onload = () => {
    callback(img.naturalWidth, img.naturalHeight);
  };
};

let getMinHeight = imagesData => {
  let heights = [];
  for (let v of imagesData) {
    heights.push(v.height);
  }
  return [heights.indexOf(Math.min(...heights)), _.min(heights)];
};

let addToColumnImgProps = (
  width,
  height,
  top,
  left = width * columnImgProps.length
) => {
  return [
    ...columnImgProps,
    {
      width,
      height,
      top,
      left
    }
  ];
};

let modifyColumnImgProp = (index, height, top) => {
  let temp = [...columnImgProps];

  temp[index] = {
    ...temp[index],
    height,
    top
  };

  return temp;
};

imgUrls.forEach((img, i) => {
  getImgMeta(img, (imgWidth, imgHeight) => {
    let divImgWrapper = document.createElement("DIV");
    divImgWrapper.setAttribute("class", "img-wrapper");
    let imgElement = document.createElement("IMG");
    imgElement.setAttribute("src", img);
    divImgWrapper.appendChild(imgElement);

    if (i < 4) {
      // columnImgProps = addToColumnImgProps(imgWidth, imgHeight, 0);
      columnImgProps.push({
        width: imgWidth,
        height: imgHeight,
        top: 0,
        left: imgWidth * columnImgProps.length
      });

      // console.log("props00: ", columnImgProps);

      divImgWrapper.style.top = columnImgProps[i].top;
      divImgWrapper.style.left = columnImgProps[i].left;
    } else {
      let minHeightAndIndex = getMinHeight(columnImgProps);
      let minHeightIndex = minHeightAndIndex[0];
      let minHeight = minHeightAndIndex[1];
      // console.log("props: ", columnImgProps);
      // console.log(columnImgProps[minHeightIndex].top);
      let prevTop = columnImgProps[minHeightIndex].top;
      let prevHeight = columnImgProps[minHeightIndex].height;
      let newTop = prevTop + prevHeight;
      let newHeight = prevHeight + imgHeight;

      columnImgProps = modifyColumnImgProp(minHeightIndex, newHeight, newTop);

      divImgWrapper.style.top = columnImgProps[minHeightIndex].top;
      divImgWrapper.style.left = columnImgProps[minHeightIndex].left;
    }
    container.appendChild(divImgWrapper);
    console.log(columnImgProps);
  });
});
