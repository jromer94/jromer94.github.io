const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext('2d');


// Taken from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// Shuffle array taken from https://stackoverflow.com/a/2450976
const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// BFS search to find next paintable pixel.
// Next added to list of equally close is random.
// TODO think about how random is chosen.
// Can be made more random by choosing next of x distance instead?
const findNextPixel = (curr, painted) => {
  const queue = [curr];
  const seen = new Set();
  const dxdy = [[0,1], [1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1], [-1, 0], [0, -1]];
  while(queue.length > 0) {
    const {x: nextX, y: nextY} = queue.shift();
    if(seen.has(`${nextX}-${nextY}`) || nextX < 0 || nextX >= canvas.width || nextY < 0 || nextY >= canvas.height){
      continue
    }
    if(!painted.has(`${nextX}-${nextY}`)) {
      return {x: nextX, y: nextY};
    }
    shuffle(dxdy);
    dxdy.forEach(([dx, dy]) => queue.push({x: nextX + dx, y: nextY + dy}));
    seen.add(`${nextX}-${nextY}`);
  }
  return null;
}

const drawPixel = ({x, y}, {r, g, b}) => {
  ctx.fillStyle = `rgb(${r},${g}, ${b})`;
  ctx.fillRect(x, y, 1, 1);
}

// TODO make no change not possible and less ugly lol.
const findNextColor = ({r, g, b}) => {
  const diffs = [-1, 0, 1];
  next = {}
  if(r === 0){
    next.r = r + diffs[getRandomInt(1,3)];
  } else if(r === 255){
    next.r = r + diffs[getRandomInt(0,2)];
  } else {
    next.r = r + diffs[getRandomInt(0,3)];
  }

  if(g === 0){
    next.g = g + diffs[getRandomInt(1,3)];
  } else if(g === 255){
    next.g = g + diffs[getRandomInt(0,2)];
  } else {
    next.g = g + diffs[getRandomInt(0,3)];
  }

  if(b === 0){
    next.b = b + diffs[getRandomInt(1,3)];
  } else if(b === 255){
    next.b = b + diffs[getRandomInt(0,2)];
  } else {
    next.b = b + diffs[getRandomInt(0,3)];
  }

  return next;
};

const seen = new Set();
// TODO check inclusive
let currColor = {r: getRandomInt(0, 255), g: getRandomInt(0, 255), b: getRandomInt(0, 255)};
// TODO check inclusive
let currPixel = {x : getRandomInt(0, canvas.width), y: getRandomInt(0, canvas.height)};


const interval = setInterval(() => {
  const drawNext = () => {
    currPixel = findNextPixel(currPixel, seen);
    currColor = findNextColor(currColor);
    if(currPixel === null) {
      clearInterval(interval);
      return;
    }
    drawPixel(currPixel, currColor);
    seen.add(`${currPixel.x}-${currPixel.y}`)
  };

  [...Array(60)].forEach(() => drawNext());
}, 1000/60)
