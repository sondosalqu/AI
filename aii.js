
   let numCities = 0;
    let cities =[];

document.addEventListener("DOMContentLoaded", function () {
    const steps = ["a","r","b", "c", "d"];
    let currentStep = 0;
     let cindex=0;
let costMatrix;
    let ftotalcost=0


    let route =[];
let initialTemp=0;
let coolingRate=0;



 
    const nextBtn = document.querySelector("#x button");
    const nextContainer = document.getElementById("x");
     const saBtn = document.getElementById("saBtn");
   
     
function showStep(index) {
        steps.forEach((id, i) => {
            document.getElementById(id).style.display = (i === index) ? "flex" : "none";
        });
        if (index >= steps.length) {
            nextContainer.style.display = "none";
        } else {
            nextContainer.style.display = "flex";
        }
    }

  



nextBtn.addEventListener("click", function () {
    if (currentStep === 0) {
        numCities = parseInt(document.getElementById("g").value);
        cities = [];
        for (let i = 0; i < numCities; i++) {
            cities.push({
                id: i + 1,
                x: null,
                y: null,
                isSafe: null,
                Temperature: null,
                Humidity: null,
                Speed: null,
                
            });
        }
        currentStep = 1;
        showStep(currentStep);
    } 



 else if (currentStep === 1) {
        cities[cindex].x = parseFloat(document.getElementById("xa").value);
        cities[cindex].y= parseFloat(document.getElementById("ya").value);
       
        
        cindex++;
        if (cindex >= numCities) {
            currentStep = 2;
            cindex = 0; 
        }
        showStep(currentStep);
    } 


    else if (currentStep === 2) {
        cities[cindex].Temperature = parseFloat(document.getElementById("temp").value);
        cities[cindex].Humidity = parseFloat(document.getElementById("humidity").value);
        cities[cindex].Speed = parseFloat(document.getElementById("wind").value);
        
        cindex++;
        if (cindex >= numCities) {
            currentStep = 3;
            cindex = 0; 
        }
        showStep(currentStep);
    } 
    else if (currentStep === 3) {
       
        initialTemp = parseFloat(document.getElementById("initTemp").value);
        coolingRate = parseFloat(document.getElementById("coolRate").value);
        
        
        
            currentStep = 4; 
            
    drawCities();
 drawRandomRoute();
    costMatrix = buildCostMatrix();
        }
        showStep(currentStep);
    


 
});



  showStep(currentStep);














function calculateCityDistance(city1, city2, penalty) {
    let distance = Math.sqrt(Math.pow(city2.x - city1.x, 2) + Math.pow(city2.y - city1.y, 2));

  
    if ( city2.isSafe === 1) {
        distance += penalty;
    }
    
    return distance;
}


function calculateRouteCost(route) {
    let totalCost = 0;
    const penalty = 50;
    
    for (let i = 0; i < route.length; i++) {
        const currentCity = cities[route[i]];
        const nextCity = cities[route[(i + 1) % route.length]];
        let segmentCost = calculateCityDistance(currentCity, nextCity, penalty);
        
        totalCost += segmentCost;
    }
    
    return totalCost;
}

saBtn.addEventListener("click", function () {
       if (cities.length === 0) {
        alert("Please create cities first");
        return;
    }

    let currentRoute = [...route];
    let bestRoute = [...route];
    let bestCost = calculateRouteCost(route);
    let temperature = initialTemp;
       if (initialTemp <= 0 || coolingRate <= 0 || coolingRate >= 1) {
        alert("Please enter valid values:\nInitial Temperature > 0\n0 < Cooling Rate < 1");
        return;
    }
    
    for (let iter = 0; iter < 1000; iter++) {
        const newRoute = [...currentRoute];
        const i = Math.floor(Math.random() * cities.length);
        const j = Math.floor(Math.random() * cities.length);
        [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
        
        const newCost = calculateRouteCost(newRoute);
        const costDifference = newCost - calculateRouteCost(currentRoute);
        
        if (costDifference < 0 || Math.random() < Math.exp(-costDifference / temperature)) {
            currentRoute = [...newRoute];
            
            if (newCost < bestCost) {
                bestRoute = [...newRoute];
                bestCost = newCost;
            }
        }
        
        temperature *= coolingRate;
    }
    
    
    drawCities();
    drawOptimizedRoute(bestRoute);
    
     
});







function drawRandomRoute() {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");
    const penalty = 50;
    
    route = [...Array(numCities).keys()];
    route.sort(() => Math.random() - 0.5);
    ftotalcost = 0; 

    ctx.beginPath();
    ctx.moveTo(cities[route[0]].x, cities[route[0]].y);
    
    for (let i = 0; i < route.length; i++) {
        const nextIndex = (i + 1) % route.length;
        const currentCity = cities[route[i]];
        const nextCity = cities[route[nextIndex]];
    
        ctx.lineTo(nextCity.x, nextCity.y);
        const midX = (currentCity.x + nextCity.x) / 2;
        const midY = (currentCity.y + nextCity.y) / 2;
        const distance = calculateCityDistance(currentCity, nextCity, penalty);
        
        ftotalcost = calculateRouteCost(route); 
        ctx.font = "9px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText(distance.toFixed(2), midX, midY);
    }
    
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
     //ctx.font = "16px Arial";
   // ctx.fillStyle = "black";
   // ctx.fillText(`Initial Cost: ${ftotalcost.toFixed(2)}`, 20, 30);
}


function buildCostMatrix() {
    const penalty = 50;
    let costMatrix = Array(numCities).fill(null).map(() => Array(numCities).fill(0));

    for (let i = 0; i < numCities; i++) {
        for (let j = 0; j < numCities; j++) {
            if (i === j) {
                costMatrix[i][j] = 0;
            } else {
                costMatrix[i][j] = calculateCityDistance(cities[i], cities[j], penalty);
            }
        }
    }
    return costMatrix;
}







function drawOptimizedRoute(route) {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");
    const penalty = 50;
    let totalCost = 0;
    let penaltyCost = 0;

    ctx.beginPath();
    ctx.moveTo(cities[route[0]].x, cities[route[0]].y);
    
    for (let i = 0; i < route.length; i++) {
        const nextIndex = (i + 1) % route.length;
        const currentCity = cities[route[i]];
        const nextCity = cities[route[nextIndex]];
        
        ctx.lineTo(nextCity.x, nextCity.y);
        
        const midX = (currentCity.x + nextCity.x) / 2;
        const midY = (currentCity.y + nextCity.y) / 2;
        const distance = calculateCityDistance(currentCity, nextCity, penalty);
        totalCost += distance;
        
     
      
        
        ctx.font = "9px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(distance.toFixed(2), midX, midY);
    }
    
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Initial Cost: ${ftotalcost.toFixed(2)}`, 20, 30);
    ctx.fillText(`Optimized Cost: ${totalCost.toFixed(2)}`, 20, 50);

}

});














let model;
fetch("model.json")
  .then(res => res.json())
  .then(data => {
    model = data;
    console.log("Model loaded:", model);
  });

  function predict(inputs) {
  let activation = inputs.reduce((sum, x, i) => sum + x * model.weights[i], model.bias);
  return activation >= 0 ? 1 : 0;
}



function normalizeInput(inputs, mins, maxs) {
  return inputs.map((val, i) => {
    const range = maxs[i] - mins[i];
    return range === 0 ? 0 : (val - mins[i]) / range;
  });
}

document.getElementById("predictBtn").addEventListener("click", () => {
  if (!model) {
    alert("Model not loaded yet!");
    return;
  }
  cities.forEach(city => {
    let inputs = [city.Temperature, city.Humidity, city.Speed];
    let normInputs = normalizeInput(inputs, model.mins, model.maxs); 
    let pred = predict(normInputs);
    city.isSafe = (pred === 0);
  });
  drawCities();
});


      function drawCities() {
        const canvas = document.getElementById("mapCanvas");
        const ctx = canvas.getContext("2d");
        

        cities.forEach(city => {
            ctx.beginPath();

            ctx.arc(city.x, city.y, 6, 0, Math.PI * 2);
            if(city.isSafe===null){
                   ctx.fillStyle = "gray";
            }
            else if(city.isSafe){
                  ctx.fillStyle = "green";
            }
            else{
                  ctx.fillStyle = "red";
            }
            
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "black";
            ctx.fillText(city.id, city.x + 8, city.y - 8);
        });
    }




function updateTable() {
const tableBody = document.querySelector("#cityTable tbody");

  tableBody.innerHTML = ""; 
  cities.forEach(city=>{

        const row = document.createElement("tr");

row.innerHTML = `
      <td>${city.id}</td>
      <td>${city.Temperature ?? "-"}</td>
      <td>${city.Humidity ?? "-"}</td>
      <td>${city.Speed ?? "-"}</td>
      <td style="color:${city.isSafe === null ? "gray" : city.isSafe ? "green" : "red"}">
        ${city.isSafe === null ? "Not Predicted" : (city.isSafe ? "Safe" : "Unsafe")}
      </td>
    `;
    tableBody.appendChild(row);

  }

  );


}

document.getElementById("showTableBtn").addEventListener("click", () => {
  updateTable();
  
  document.getElementById("cityDialog").showModal();
}
);

document.getElementById("closeDialog").addEventListener("click", () => {
  
    document.getElementById("cityDialog").close();


}
);
