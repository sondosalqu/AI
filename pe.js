
const fs = require("fs");
const raw = fs.readFileSync("C:\\Users\\lenovo\\Desktop\\weather_data_linearly_separable.csv", "utf-8");

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
  return activation >= 0 ? 1 : 0;
}

for (let e = 0; e < epoch; e++) {
  for (let i = 0; i < X_train.length; i++) {
    let yPred = predict(X_train[i]);
    let error = y_train[i] - yPred;
    for (let j = 0; j < we.length; j++) {
      we[j] += learn * error * X_train[i][j];
    }
    bi += learn* error;
  }
}

let correct = 0;
for (let i = 0; i < X_test.length; i++) {
  if (predict(X_test[i]) === y_test[i]) {
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







