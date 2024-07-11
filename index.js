const quiz_answers = [
    "A theory about the creation of the universe",
    "The distance light travels in one year",
    ["Hydrogen", "Helium"],
    "Milky Way",
    "Albert Einstein",
    "Invisible matter that doesn't emit light",
    ["Spiral", "Elliptical", "Irregular"],
    "Space-Time",
    "Edwin Hubble",
    "Leftover radiation from the Big Bang",
    ["Nebular Hypothesis", "Big Bang Theory"],
    "13.8 billion years",
    "Mars",
    "The explosion of a star",
    ["A distant, active galactic nucleus", "Orbited by Miller and Mann"],
    "Gravity",
    "Ultrasound",
    "Hydrogen",
    ["The point beyond which nothing can escape", "The data layer of the black hole"],
    "Johannes Kepler",
];

let questions_per_page = 5;
let user_score = 0;
let page_number = 0;
var min_dis_ind = 0;
var max_dis_ind = questions_per_page;
const total_question = quiz_answers.length;

async function sleep(ms) {
    await new Promise((r) => setTimeout(r, ms));
}

function isEqual(a, b) {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}

function checkAns(quesInd) {
    const current_type = document.getElementById(`question_${quesInd}_type`).innerHTML;
    let current_answer;
    let current_answers = [];

    if (current_type === "text") {
        current_answer = document.getElementById(`answer_${quesInd}`).value;
        console.log(`inp : ${current_answer} : ans : ${quiz_answers[quesInd]}`);
        console.log(isEqual(quiz_answers[quesInd], current_answers));
        if (current_answer === quiz_answers[quesInd]) {
            user_score++;
        }
    } else if (current_type === "radio") {
        let options = document.getElementsByName(`answer_${quesInd}`);
        for (let option of options) {
            if (option.checked) {
                current_answer = option.value;
            }
        }
        if (current_answer == quiz_answers[quesInd]) {
            user_score++;
        }
    } else if (current_type === "checkbox") {
        let options = document.getElementsByName(`answer_${quesInd}`);
        for (let option of options) {
            if (option.checked) {
                current_answers.push(option.value);
            }
        }
        if (isEqual(quiz_answers[quesInd], current_answers)) {
            user_score++;
        }
    } else if (current_type === "dropdown") {
        current_answer = document.getElementById(`answer_${quesInd}`).value;
        console.log(`inp : ${current_answer} : ans : ${quiz_answers[quesInd]}`);
        console.log(current_answer == quiz_answers[quesInd]);
        if (current_answer === quiz_answers[quesInd]) {
            user_score++;
        }
    }
}

function startCountdown(duration) {
    let timer = duration,
        minutes,
        seconds;

    const countdownElement = document.getElementById("timer");

    const intervalId = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        countdownElement.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            countdownElement.textContent = "Time's up!";
            timer = -1;
            end_screen();
        }
    }, 1000);
}

function clear_parent() {
    if (page_number === 0) {
        return;
    }
    for (let i = 0; i < total_question; i++) {
        document.getElementById(`qa_section_${i}`).classList.add("qa_hidden");
    }
}

function prevQues() {
    if (page_number > 0) {
        page_number--;
        min_dis_ind -= questions_per_page;
        max_dis_ind -= questions_per_page;
        show_current_question();
    } else {
        page_number = 0;
    }
}

function nextQues() {
    if (page_number + 2 <= Math.floor(total_question / questions_per_page)) {
        page_number++;
        min_dis_ind += questions_per_page;
        max_dis_ind += questions_per_page;
        show_current_question();
    } else {
        end_quiz();
    }
}

function retake_test() {
    window.location.reload();
}

function startQuiz() {
    page_number = 0;
    min_dis_ind = 0;
    max_dis_ind = questions_per_page;
    startCountdown(300);
    document.getElementById("start_screen").style.display = "none";
    document.getElementById("mainBox").style.display = "block";
    show_current_question();
}

function end_quiz() {
    for (let ans_ind = 0; ans_ind < total_question; ans_ind++) {
        checkAns(ans_ind);
    }
    end_screen();
}

function show_current_question() {
    if (page_number == 0) {
        document.getElementById("previous_button").style.display = "none";
    } else {
        document.getElementById("previous_button").style.display = "inline";
    }
    if (page_number + 1 === Math.floor(total_question / questions_per_page)) {
        document.getElementById("next_button").innerText = "Submit";
    } else {
        document.getElementById("next_button").innerText = "Next";
    }
    clear_parent();

    for (let current_index = min_dis_ind; current_index < max_dis_ind; current_index++) {
        document.getElementById(`qa_section_${current_index}`).classList.remove("qa_hidden");
    }

    document.getElementById("page_counter").innerHTML = `${page_number + 1} / ${Math.floor(
        total_question / questions_per_page
    )}`;
}

function end_screen() {
    clear_parent();
    document.getElementById("qa_container").style.display = "none";
    document.getElementById("nav").style.display = "none";
    document.getElementById("timer_container").style.display = "none";
    document.getElementById("page_counter").style.display = "none";
    document.getElementById("retake_button").style.display = "block";
    document.getElementById("end_screen").style.display = "block";
    document.getElementById("user_score").innerHTML = `Your score is ${user_score}/${total_question}`;
}
