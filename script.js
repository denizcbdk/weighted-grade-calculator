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
    const midtermRate = parseFloat(document.getElementById("pMidterm").value);
    const finalRate = parseFloat(document.getElementById("pFinal").value);
    const totalRate = midtermRate + finalRate;
    if (totalRate !== 100) {
        alert("The contribution rates are wrong. The total must be 100%.");
    } else {
        const results = calculateScore(midtermRate, finalRate);
        showResult(results.requiredScore, results.requiredGoalScore, results.goalScore);
    }

}
function calculateScore(midtermRate, finalRate) {
    const midtermScore = parseFloat(document.getElementById("midterm").value)
    const minimumScore = parseFloat(document.getElementById("min").value)
    const goalScore = parseFloat(document.getElementById("goal").value)
    const midtermCalculationRate = midtermRate / 100;
    const finalCalculationRate = finalRate / 100;
    const requiredScore = (minimumScore - midtermScore * midtermCalculationRate) / (finalCalculationRate)
    let requiredGoalScore = null;
    if (goalScore !== 0) {
        requiredGoalScore = (goalScore - midtermScore * midtermCalculationRate) / (finalCalculationRate)
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