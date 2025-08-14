



const fs = require("fs");
const readline = require("readline");

const csvPath = "weather_data_linearly_separable.csv";
const raw = fs.readFileSync(csvPath, "utf-8").trim();
const lines = raw.split(/\r?\n/);


const colT = header.indexOf("Temperature");
const colH = header.indexOf("Humidity");
const colW = header.indexOf("Wind");
const colY = header.indexOf("SafeToFly");

if ([colT, colH, colW, colY].some(i => i === -1)) {
  throw new Error("error.");
}

const rows = lines.slice(1).filter(line => line.trim().length > 0);
let X_raw = [];
let y = [];

for (const line of rows) {
  const parts = line.split(",").map(v => v.trim());
  const T = Number(parts[colT]);
  const H = Number(parts[colH]);
  const W = Number(parts[colW]);
  const Y = Number(parts[colY]);
  if ([T, H, W, Y].some(v => Number.isNaN(v))) continue;
  X_raw.push([T, H, W]);
  y.push(Y);
}

if (X_raw.length === 0) throw new Error("error");

function shuffleInPlace(X, y) {
  for (let i = X.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [X[i], X[j]] = [X[j], X[i]];
    [y[i], y[j]] = [y[j], y[i]];
  }
}
shuffleInPlace(X_raw, y);

const trainSize = Math.floor(X_raw.length * 0.8);
const X_train_raw = X_raw.slice(0, trainSize);
const y_train = y.slice(0, trainSize);
const X_test_raw  = X_raw.slice(trainSize);
const y_test  = y.slice(trainSize);

function calcMinsMaxs(X) {
  const d = X[0].length;
  const mins = Array(d).fill(Infinity);
  const maxs = Array(d).fill(-Infinity);
  for (const row of X) {
    for (let i = 0; i < d; i++) {
      if (row[i] < mins[i]) mins[i] = row[i];
      if (row[i] > maxs[i]) maxs[i] = row[i];
    }
  }
  return { mins, maxs };
}

function scaleRow(row, mins, maxs) {
  return row.map((v, i) => {
    const range = maxs[i] - mins[i];
    return range === 0 ? 0 : (v - mins[i]) / range;
  });
}

function scaleX(X, mins, maxs) {
  return X.map(row => scaleRow(row, mins, maxs));
}

const { mins, maxs } = calcMinsMaxs(X_train_raw);
const X_train = scaleX(X_train_raw, mins, maxs);
const X_test  = scaleX(X_test_raw,  mins, maxs);

let weights = Array(3).fill(0);
let bias = 0;
const lr = 0.1;
const epochs = 250;

function predictRaw(inputs) {
  let a = bias;
  for (let i = 0; i < weights.length; i++) a += inputs[i] * weights[i];
  return a; 
}
function predictClass(inputs) {
  const a = predictRaw(inputs);
  return a >= 0 ? 1 : 0; 
}

for (let e = 0; e < epochs; e++) {
  for (let i = 0; i < X_train.length; i++) {
    const a = predictClass(X_train[i]);
    const error = y_train[i] - a; 
    for (let j = 0; j < weights.length; j++) {
      weights[j] += lr * error * X_train[i][j];
    }
    bias += lr * error;
  }
}

let correct = 0;
let tp=0, tn=0, fp=0, fn=0;
for (let i = 0; i < X_test.length; i++) {
  const pred = predictClass(X_test[i]);
  const gt = y_test[i];
  if (pred === gt) correct++;
  if (gt === 1 && pred === 1) tp++;
  else if (gt === 0 && pred === 0) tn++;
  else if (gt === 0 && pred === 1) fp++;
  else if (gt === 1 && pred === 0) fn++;
}
const accuracy = X_test.length ? correct / X_test.length : 1;

console.log("== Training done ==");
console.log("Weights:", weights.map(v => +v.toFixed(6)));
console.log("Bias:", +bias.toFixed(6));
console.log(`Accuracy: ${(accuracy * 100).toFixed(2)}%`);
console.log(`Confusion Matrix (test):
TP=${tp}  FP=${fp}
FN=${fn}  TN=${tn}`);

const model = { weights, bias, accuracy, mins, maxs, header: { Temperature: colT, Humidity: colH, Wind: colW, Label: colY } };
fs.writeFileSync("model.json", JSON.stringify(model, null, 2));
console.log("Model saved to model.json");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askOnce() {
  rl.question("Temperature: ", (t) => {
    rl.question("Humidity: ", (h) => {
      rl.question("Wind: ", (w) => {
        const rawInputs = [Number(t), Number(h), Number(w)];
        if (rawInputs.some(v => Number.isNaN(v))) {
          console.log("enter");
          return askOnce();
        }
        const xScaled = scaleRow(rawInputs, mins, maxs);
        const activation = predictRaw(xScaled);
        const pred = activation >= 0 ? 1 : 0;
        console.log(`Activation: ${activation.toFixed(4)}`);
        if (pred === 0) console.log("Safe to Fly (0)");
        else console.log("Unsafe to Fly (1)");
        rl.question("(y/n): ", ans => {
          if (ans.trim().toLowerCase() === "y") askOnce();
          else rl.close();
        });
      });
    });
  });
}

askOnce();










/*const readline = require("readline");

const fs = require("fs");
const rawData = fs.readFileSync("weather_data_linearly_separable.csv", "utf-8");
const raw = fs.readFileSync(
 "weather_data_linearly_separable.csv" ,
  "utf-8"
);
let lines = raw.trim().split("\n");

let data = lines.slice(1).map(line => line.split(",").map(Number));

const trainSize = Math.floor(data.length * 0.8);
let train = data.slice(0, trainSize);
let test= data.slice(trainSize);

let X_train = train.map(row => row.slice(0, 3));
let y_train = train.map(row => row[3]);

let X_test = test.map(row => row.slice(0, 3));
let y_test = test.map(row => row[3]);

let we = [0, 0, 0];
let bi= 0;
let learn= 0.01;
let epoch = 100;

function predict(inputs) {
  let activation = inputs.reduce((sum, x, i) => sum + x * we[i], bi);
  let pred = activation >= 0 ? 1 : 0;
  return { pred, activation };
}
for (let e = 0; e < epoch; e++) {
  for (let i = 0; i < X_train.length; i++) {
    let yPred = predict(X_train[i]).pred; 
    let error = y_train[i] - yPred;
    for (let j = 0; j < we.length; j++) {
      we[j] += learn * error * X_train[i][j];
    }
    bi += learn * error;
  }
}


let correct = 0;
for (let i = 0; i < X_test.length; i++) {
  if (predict(X_test[i]).pred === y_test[i]) {  
    correct++;
  }
}


let accuracy = correct / X_test.length;
console.log("Weights:", we);
console.log("Bias:", bi);
console.log("Accuracy:", accuracy);






let model = {
    weights: we,
  bias: bi,
       accuracy: accuracy
};

fs.writeFileSync("model.json", JSON.stringify(model, null, 2));
console.log("Model saved to model.json");




const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
;*/
