document.addEventListener("DOMContentLoaded", function () {
    const steps = ["a", "b", "c", "d"];
    let currentStep = 0;

    const nextBtn = document.querySelector("#x button");
    const nextContainer = document.getElementById("x");

    function showStep(index) {
        steps.forEach((id, i) => {
            document.getElementById(id).style.display = (i === index) ? "flex" : "none";
        });

        if (index === steps.length - 1) {
            nextContainer.style.display = "none";
        } else {
            nextContainer.style.display = "flex";
        }
    }

    nextBtn.addEventListener("click", function () {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    showStep(currentStep);
});
