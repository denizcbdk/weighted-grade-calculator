window.onload = function() {
    updateMidterm();
    updateWeights();}
const saved = localStorage.getItem("saved");
const resultList = document.getElementById("resultList");
    if (saved) {
        resultList.innerHTML = saved;
    }
    resultList.addEventListener("click", function(event) {
        if (event.target.classList.contains("deleteResult")) {
            const listItem = event.target.parentElement;
            listItem.remove();            
            if (resultList.innerHTML.trim() === "") {
                localStorage.removeItem("saved");
            } else {
                localStorage.setItem("saved", resultList.innerHTML);
            }
        }})
    
function checkingRates(event) {
    event.preventDefault();
    const count = getMidtermCount();
    const finalRate = parseFloat(document.getElementById("pFinal").value);
    
    let midtermRate = 0; 
    const weights = document.querySelectorAll(".midterm_weight");
    
    if (count == 1) {
        midtermRate = parseFloat(weights[0].value);
    } else if (count == 2) {
        midtermRate = parseFloat(weights[0].value) + parseFloat(weights[1].value);
    } else {
        midtermRate = parseFloat(weights[0].value) + parseFloat(weights[1].value) + parseFloat(weights[2].value);
    }
    const totalRate = midtermRate + finalRate;
    
    if (totalRate !== 100) {
        alert("The contribution rates are wrong. The total must be 100%. Current: " + totalRate);
    } else {
        const results = calculateScore(midtermRate, finalRate);
        showResult(results.requiredScore, results.requiredGoalScore, results.goalScore);
    }
}
function calculateScore(midtermRate, finalRate) {

    const count = getMidtermCount();
    const midtermScore = document.querySelectorAll(".midterm_input");
    const weights = document.querySelectorAll('[class^="midterm_weight"]');
    const minimumScore = parseFloat(document.getElementById("min").value)
    const goalScore = parseFloat(document.getElementById("goal").value)
    const finalCalculationRate = finalRate / 100;

    let requiredScore = 0;
    let requiredGoalScore = 0;

    if(count == 1 ){
        let midtermCalculationRate1 = parseFloat(weights[0].value) / 100;
        requiredScore = (minimumScore - (parseFloat(midtermScore[0].value) * midtermCalculationRate1)) / (finalCalculationRate)
    }

    if(count == 2 ){
        let midtermCalculationRate1 = parseFloat(weights[0].value) / 100;
        let midtermCalculationRate2 = parseFloat(weights[1].value) / 100;
        requiredScore = (minimumScore - ((parseFloat(midtermScore[0].value) * midtermCalculationRate1) + (parseFloat(midtermScore[1].value) * midtermCalculationRate2))) / (finalCalculationRate)
    }

    else if(count == 3){ // else kısmını belirginleştirdim ki karışmasın
        let midtermCalculationRate1 = parseFloat(weights[0].value) / 100;
        let midtermCalculationRate2 = parseFloat(weights[1].value) / 100;
        let midtermCalculationRate3 = parseFloat(weights[2].value) / 100;
        requiredScore = (minimumScore - ((parseFloat(midtermScore[0].value) * midtermCalculationRate1) + (parseFloat(midtermScore[1].value) * midtermCalculationRate2) + (parseFloat(midtermScore[2].value) * midtermCalculationRate3))) / (finalCalculationRate)
    }

    if (goalScore !== 0) {
        if(count == 1 ){
            let midtermCalculationRate1 = parseFloat(weights[0].value) / 100;
            requiredGoalScore = (goalScore - (parseFloat(midtermScore[0].value) * midtermCalculationRate1)) / (finalCalculationRate)
        }

        if(count == 2 ){
            let midtermCalculationRate1 = parseFloat(weights[0].value) / 100;
            let midtermCalculationRate2 = parseFloat(weights[1].value) / 100;
            requiredGoalScore = (goalScore - ((parseFloat(midtermScore[0].value) * midtermCalculationRate1) + (parseFloat(midtermScore[1].value) * midtermCalculationRate2))) / (finalCalculationRate)
        }

        else if(count == 3){
            let midtermCalculationRate1 = parseFloat(weights[0].value) / 100;
            let midtermCalculationRate2 = parseFloat(weights[1].value) / 100;
            let midtermCalculationRate3 = parseFloat(weights[2].value) / 100;
            requiredGoalScore = (goalScore - ((parseFloat(midtermScore[0].value) * midtermCalculationRate1) + (parseFloat(midtermScore[1].value) * midtermCalculationRate2) + (parseFloat(midtermScore[2].value) * midtermCalculationRate3))) / (finalCalculationRate)
        }
    }
    return {
        requiredScore: requiredScore,
        requiredGoalScore: requiredGoalScore,
        goalScore: goalScore
    };
}
function showResult(requiredScore, requiredGoalScore, goalScore) {
    const minScoreTextElement = document.getElementById("minScoreText");
    const goalScoreTextElement = document.getElementById("goalScoreText");
    if (goalScore <= 100) {
        document.getElementById("minScoreText").innerText =
            "Minimum final score required to pass: " + requiredScore.toFixed(2);
    }
    if (goalScore !== 0) {
        document.getElementById("goalScoreText").innerText =
            "Final score needed to reach your target average: " + requiredGoalScore.toFixed(2);
    }
    if (requiredGoalScore > 100) {
        document.getElementById("goalScoreText").innerText =
            "It's not possible to reach your target average."
    }
    if (requiredScore > 100) {
        document.getElementById("minScoreText").innerText =
            "Passing is not possible even with a score of 100."
    }
    else if (goalScore == 0){
        goalScoreTextElement.innerText = "";
    }
    document.getElementById("popup").style.display = "flex";
}
function closePopup() {
    document.getElementById("popup").style.display = "none"
}
function saveResult(){
    const resultName = prompt("Save as:")
    if (resultName === null || resultName === "") {
        return;
    }
    const minScoreText = document.getElementById("minScoreText").innerText;
    const goalScoreText = document.getElementById("goalScoreText").innerText
    const resultList = document.getElementById("resultList")
    const newChild = document.createElement("li")
    newChild.style.padding = "10px";
    newChild.style.borderBottom = "1px solid #ddd";
    newChild.innerHTML = "<strong>" + resultName + "</strong>: " + minScoreText + " | " + goalScoreText + 
    ' <button type="button" class="deleteResult" onclick="deleteSaved(this)">Delete</button>';;
    resultList.appendChild(newChild);
    localStorage.setItem("saved", resultList.innerHTML);
    closePopup();
}
function deleteSaved(button) {
    const listItem = button.parentElement;
    const resultList = document.getElementById("resultList");
    listItem.remove();
    if (resultList.innerHTML.trim() === "") {
        localStorage.removeItem("saved");
    } else {
        localStorage.setItem("saved", resultList.innerHTML);
    }
}

function getMidtermCount() {
    return document.querySelector('input[name="midterm_choice"]:checked').value;
}

function updateMidterm() {
    const count = getMidtermCount();
    const midterm_container = document.getElementById("midterm_container");
    midterm_container.innerHTML = "";

    for(let current_count = 1;current_count<=count;current_count++){
        const label = (current_count === 1) ? "1st" : (current_count === 2) ? "2nd" : "3rd";
        midterm_container.innerHTML +=
        `<p>Your ${label} midterm score: <input type="number" class="midterm_input" min="0" max="100" required></p>`;
    }
}     

function updateWeights(){
    const count = getMidtermCount();
    const weight_container = document.getElementById("pMidterm");
    weight_container.innerHTML="";

    const finalRate = parseFloat(document.getElementById("pFinal").value) || 60;
    const totalMidtermAllowed = 100 - finalRate;
    const equalWeight = (totalMidtermAllowed / count).toFixed(0);

    for(let current_count = 1;current_count<=count;current_count++){
        weight_container.innerHTML +=
    `<input type="number" class="midterm_weight" style="width: 78px; margin-bottom: 8px; margin-right: 5px;" min="0" max="100" value="${equalWeight}" required>`
    }
}
