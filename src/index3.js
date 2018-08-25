"use strict";

const container = document.getElementById("root");
const imgUrls = [
  "https://picsum.photos/600/300",
  "https://picsum.photos/1000/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/100/50",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/50/50",
  "https://picsum.photos/800/1000",
  "https://picsum.photos/600/300",
  "https://picsum.photos/1000/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/100/50",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/50/50",
  "https://picsum.photos/800/1000",
  "https://picsum.photos/600/300",
  "https://picsum.photos/1000/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/100/50",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/100",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/400",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/300",
  "https://picsum.photos/200/300",
  "https://picsum.photos/50/50",
  "https://picsum.photos/800/1000"
];

let windowWidth = window.innerWidth;

window.addEventListener("resize", () => {
  windowWidth = window.innerWidth;
});

const options = {
  columnWidth: 200,
  offsetX: 32,
  offsetY: 32,
  showCaptions: !true,
  columns() {
    return Math.floor(
      (windowWidth + this.offsetX) / (this.columnWidth + this.offsetX)
    );
  }
};

const actions = { ADD: "ADD", MODIFY: "MODIFY" };

// Get image width and heigth from imgUrls array
const getImgMeta = (url, callback) => {
  let img = new Image();
  img.src = url;
  // Resize image according to columnWidth
  if (img.naturalWidth !== options.columnWidth) {
    let ratio = options.columnWidth / img.naturalWidth;
    let height = img.naturalHeight * ratio;
    let width = img.naturalWidth * ratio;
    callback(width, height);
  }
};

const reducer = (columnImgProps, action, ...props) => {
  if (action === actions.ADD) {
    return [
      ...columnImgProps,
      {
        width: props[0][0],
        height: props[0][1],
        top: props[0][2],
        left: props[0][3]
      }
    ];
  } else if (action === actions.MODIFY) {
    let modifiedColumnImgProps = [...columnImgProps];

    modifiedColumnImgProps[props[0][0]] = {
      ...modifiedColumnImgProps[props[0][0]],
      height: props[0][1],
      top: props[0][2]
    };

    return modifiedColumnImgProps;
  }
};

const addToColumnImgProps = reducer => {
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
const getMinHeight = columnImgProps => {
  let heights = [];
  for (let v of columnImgProps) {
    heights.push(v.height);
  }
  return [heights.indexOf(Math.min(...heights)), _.min(heights)];
};

const getMaxHeight = columnImgProps => {
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
const modifyColumnImgPropAction = (index, height, top) => {
  store.dispatch(actions.MODIFY, index, height, top);
};

const addToColumnImgPropsAction = (width, height, top, left) => {
  store.dispatch(actions.ADD, width, height, top, left);
};

const addCaptions = (i, element) => {
  const captionElement = document.createElement("DIV");
  captionElement.setAttribute("class", "caption");
  captionElement.innerHTML = i;
  element.appendChild(captionElement);
};

const createElements = (img, elementHeight) => {
  const element = document.createElement("DIV");
  const imgHolder = document.createElement("DIV");
  const imgElement = document.createElement("IMG");

  element.setAttribute("class", "img-wrapper");
  imgHolder.setAttribute("class", "img-holder");
  imgElement.setAttribute("class", "thumbnail");
  imgElement.setAttribute("src", img);
  imgElement.style.height = elementHeight;

  element.appendChild(imgHolder).appendChild(imgElement);

  return { element, imgElement };
};

imgUrls.forEach((img, i) => {
  let elementWidth, elementHeight;

  getImgMeta(img, (width, height) => {
    elementWidth = width;
    elementHeight = height;
  });

  const { element, imgElement } = createElements(img, elementHeight);

  if (options.showCaptions) addCaptions(i, element); // Add captions to image

  container.appendChild(element);

  element.style.width = options.columnWidth;
  elementHeight = imgElement.offsetHeight;

  if (options.showCaptions) {
    let captionHeight = document.querySelector(".caption").offsetHeight;
    elementHeight = imgElement.offsetHeight + captionHeight;
  }

  elementWidth = parseInt(element.style.width);

  if (i < options.columns()) {
    addToColumnImgPropsAction(
      elementWidth,
      elementHeight,
      0,
      elementWidth * store.getColumnImgProps().length + i * options.offsetX
    );

    element.style.top = store.getColumnImgProps()[i].top;
    element.style.left = store.getColumnImgProps()[i].left;
  } else {
    let minHeightAndIndex = getMinHeight(store.getColumnImgProps());
    let minHeightIndex = minHeightAndIndex[0];
    let minHeight = minHeightAndIndex[1];

    let newTop = minHeight + options.offsetY;
    let newHeight = minHeight + elementHeight + options.offsetY;

    modifyColumnImgPropAction(minHeightIndex, newHeight, newTop);

    element.style.top = store.getColumnImgProps()[minHeightIndex].top;
    element.style.left = store.getColumnImgProps()[minHeightIndex].left;
  }

  container.style.height = getMaxHeight(store.getColumnImgProps())[1];
  container.style.width =
    options.columns() * options.columnWidth +
    options.offsetX * (options.columns() - 1);
});
