document.addEventListener("DOMContentLoaded", function () {
    const steps = ["a", "b", "c", "d"];
    let currentStep = 0;
     let cindex=0;
    let numCities = 0;
    let cities =[];



    const nextBtn = document.querySelector("#x button");
    const nextContainer = document.getElementById("x");
   
     
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

  
      function drawCities() {
        const canvas = document.getElementById("mapCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        cities.forEach(city => {
            ctx.beginPath();
            ctx.arc(city.x, city.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "gray";
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "black";
            ctx.fillText(city.id, city.x + 8, city.y - 8);
        });
    }


function drawRandomRoute() {
        const canvas = document.getElementById("mapCanvas");
        const ctx = canvas.getContext("2d");

        let route = [...Array(numCities).keys()];
        route.sort(() => Math.random() - 0.5);

        ctx.beginPath();
        ctx.moveTo(cities[route[0]].x, cities[route[0]].y);
        for (let i = 1; i < route.length; i++) {
            ctx.lineTo(cities[route[i]].x, cities[route[i]].y);
        }
        ctx.lineTo(cities[route[0]].x, cities[route[0]].y);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
    }




// nextBtn.addEventListener("click", function () {
//         if (currentStep === 0) {
//            numCities = parseInt(document.getElementById("g").value);
//                cities =[];

//             for (let i = 0; i < numCities; i++) {
//   cities.push({
//     id: i + 1,
//     x: Math.random()*600, 
//     y: Math.random()*400, 
//     isSafe: null ,
//     Temperature:null,
//     Humidity:null,
//     Speed:null,
//     Initial: null,
//     Rate:null,
//     Penalty:null
//   });


// }
//  currentStep = 1;
//   showStep(currentStep);
//         }

// let i=0;
// if (currentStep==1){
// while(i< numCities){
// showStep(currentStep);

// cities[i].Temperature = parseFloat(document.getElementById("temp").value);
// cities[i].Humidity = parseFloat(document.getElementById("humidity").value);
// cities[i].Speed = parseFloat(document.getElementById("wind").value);
// i++;

// }




 



// }






// currentStep=2;
// let z=0;
// if (currentStep==2){

// while(z<numCities){

// cities[z].Initial = parseFloat(document.getElementById("initTemp").value);
// cities[z].Rate = parseFloat(document.getElementById("coolRate").value);
// cities[z].Penalty = parseFloat(document.getElementById("penalty").value);
// z++;
// showStep(currentStep);
// }


 
// }














//     });

nextBtn.addEventListener("click", function () {
    if (currentStep === 0) {
        numCities = parseInt(document.getElementById("g").value);
        cities = [];
        for (let i = 0; i < numCities; i++) {
            cities.push({
                id: i + 1,
                x: Math.random() * 600,
                y: Math.random() * 400,
                isSafe: null,
                Temperature: null,
                Humidity: null,
                Speed: null,
                Initial: null,
                Rate: null,
                Penalty: null
            });
        }
        currentStep = 1;
        showStep(currentStep);
    } 
    else if (currentStep === 1) {
        cities[cindex].Temperature = parseFloat(document.getElementById("temp").value);
        cities[cindex].Humidity = parseFloat(document.getElementById("humidity").value);
        cities[cindex].Speed = parseFloat(document.getElementById("wind").value);
        
        cindex++;
        if (cindex >= numCities) {
            currentStep = 2;
            cindex = 0; 
        }
        showStep(currentStep);
    } 
    else if (currentStep === 2) {
       
        cities[cindex].Initial = parseFloat(document.getElementById("initTemp").value);
        cities[cindex].Rate = parseFloat(document.getElementById("coolRate").value);
        cities[cindex].Penalty = parseFloat(document.getElementById("penalty").value);
        
        cindex++;
        if (cindex >= numCities) {
            currentStep = 3; 
            
    drawCities();
 drawRandomRoute()
   
        }
        showStep(currentStep);
    }


 
});



  showStep(currentStep);








});
