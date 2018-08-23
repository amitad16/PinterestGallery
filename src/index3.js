"use strict";

let container = document.getElementById("root");
const imgUrls = [
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/600",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100"
];

let columns = 6;

// Get image width and heigth from imgUrls array
let getImgMeta = (url, callback) => {
  let img = new Image();
  img.src = url;
  // img.onload = () => {
  callback(img.naturalWidth, img.naturalHeight);
  // };
};

let reducer = (columnImgProps, action, ...props) => {
  if (action === "ADD") {
    return [
      ...columnImgProps,
      {
        width: props[0][0],
        height: props[0][1],
        top: props[0][2],
        left: props[0][3]
      }
    ];
  } else if (action === "MODIFY") {
    let modifiedColumnImgProps = [...columnImgProps];

    modifiedColumnImgProps[props[0][0]] = {
      ...modifiedColumnImgProps[props[0][0]],
      height: props[0][1],
      top: props[0][2]
    };

    return modifiedColumnImgProps;
  }
};

let addToColumnImgProps = reducer => {
  let columnImgProps = [];

  const getColumnImgProps = () => columnImgProps;

  // @param 1 -> 'ADD' or 'MODIFY'
  // @param 2 -> props = [width, height, top, left = width * columnImgProps.length]
  //  or [index, height, top]
  const dispatch = (action, ...props) => {
    columnImgProps = reducer(columnImgProps, action, props);
  };

  return { getColumnImgProps, dispatch };
};

const store = addToColumnImgProps(reducer);

// @params (columnImgProps)
// returns [index, minHeight] form columImgProps array
let getMinHeight = columnImgProps => {
  let heights = [];
  for (let v of columnImgProps) {
    heights.push(v.height);
  }
  return [heights.indexOf(Math.min(...heights)), _.min(heights)];
};

let getMaxHeight = columnImgProps => {
  let heights = [];
  for (let v of columnImgProps) {
    heights.push(v.height);
  }
  return [heights.indexOf(Math.max(...heights)), _.max(heights)];
};

// @params (min height index from getMinHeight())
// @params (minHeight from columnImgProps + elementHeight from getImgMeta())
// @params (prevTop from columnImgProps + minHeight from columnImgProps)
// returns modified columnImgProps by changing the value of
// height and top at minHeight index
let modifyColumnImgPropAction = (index, height, top) => {
  store.dispatch("MODIFY", index, height, top);
};

let addToColumnImgPropsAction = (width, height, top, left) => {
  store.dispatch("ADD", width, height, top, left);
};

imgUrls.forEach((img, i) => {
  let elementWidth, elementHeight;

  getImgMeta(img, (width, height) => {
    elementWidth = width;
    elementHeight = height;
  });

  let element = document.createElement("DIV");
  let imgHolder = document.createElement("DIV");
  let imgElement = document.createElement("IMG");
  let captionElement = document.createElement("DIV");

  element.setAttribute("class", "img-wrapper");
  imgHolder.setAttribute("class", "img-holder");
  imgElement.setAttribute("class", "thumbnail");
  captionElement.setAttribute("class", "caption");
  imgElement.setAttribute("src", img);

  captionElement.innerHTML = "Heoolllloooooooo hejlsdkjf lskjdf lksjdf";

  element.appendChild(imgHolder).appendChild(imgElement);
  element.appendChild(captionElement);

  console.log(element.offsetHeight);

  let styles = {
    width: elementWidth,
    height: elementHeight
  };

  let elementStyle = element.style;
  for (let styleName in styles) {
    elementStyle[styleName] = styles[styleName];
  }

  elementWidth = parseInt(element.style.width);
  elementHeight = parseInt(element.style.height);

  // console.log(elementWidth, elementHeight);

  if (i < columns) {
    addToColumnImgPropsAction(
      elementWidth,
      elementHeight,
      0,
      elementWidth * store.getColumnImgProps().length + i * 32
    );

    element.style.top = store.getColumnImgProps()[i].top;
    element.style.left = store.getColumnImgProps()[i].left;
  } else {
    let minHeightAndIndex = getMinHeight(store.getColumnImgProps());
    let minHeightIndex = minHeightAndIndex[0];
    let minHeight = minHeightAndIndex[1];

    let newTop = minHeight + 32;
    let newHeight = minHeight + elementHeight + 32;

    modifyColumnImgPropAction(minHeightIndex, newHeight, newTop);
    let top = store.getColumnImgProps()[minHeightIndex].top;
    let left = store.getColumnImgProps()[minHeightIndex].left;
    element.style.top = top;
    element.style.left = left;
  }
  container.style.height = getMaxHeight(store.getColumnImgProps())[1];
  container.appendChild(element);
});
