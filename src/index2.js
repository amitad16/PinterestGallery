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

// Get image width and heigth from imgUrls array
let getImgMeta = (url, callback) => {
  let img = new Image();
  img.src = url;
  img.onload = () => {
    callback(img.naturalWidth, img.naturalHeight);
  };
};

let reducer = (columnImgProps, width, height, top, left, action) => {
  if (action === "ADD") {
    return [
      ...columnImgProps,
      {
        width,
        height,
        top,
        left
      }
    ];
  } else if (action === "MODIFY") {
    let modifiedColumnImgProps = [...columnImgProps];

    modifiedColumnImgProps[index] = {
      ...modifiedColumnImgProps[index],
      height,
      top
    };

    return modifiedColumnImgProps;
  }
};

let addToColumnImgProps = reducer => {
  let columnImgProps = [];

  const getColumnImgProps = () => columnImgProps;

  // @aparam 5 -> 'ADD' or 'MODIFY'
  const dispatch = (
    width,
    height,
    top,
    left = width * columnImgProps.length,
    action
  ) => {
    columnImgProps = reducer(columnImgProps, width, height, top, left, action);
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

// @params (min height index from getMinHeight())
// @params (prevHeight from columnImgProps + imgHeight from getImgMeta())
// @params (prevTop from columnImgProps + prevHeight from columnImgProps)
// returns modified columnImgProps by changing the value of
// height and top at minHeight index
let modifyColumnImgProp = (index, height, top) => {
  store.dispatch();
};
