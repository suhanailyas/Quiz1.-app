let questions = [
    {q:"HTML stands for?", options:["A) Hyper Text Markup Language","B) High Tool ML","C) Hyperlinks","D) None"], answer:0},
    {q:"CSS used for?", options:["A) Logic","B) Styling","C) DB","D) Server"], answer:1},
    {q:"JS is?", options:["A) Language","B) DB","C) OS","D) CPU"], answer:0},
    {q:"Bootstrap is?", options:["A) Framework","B) Language","C) DB","D) OS"], answer:0},
    {q:"<p> tag is?", options:["A) Heading","B) Paragraph","C) Span","D) Div"], answer:1}
];

questions.sort(()=>Math.random()-0.5);

let current=0, score=0, userAnswers=[];
let timer, timeLeft=30;

function startQuiz(){
    let name=document.getElementById("name").value;
    let reg=document.getElementById("reg").value;

    if(name=="" || reg==""){
        alert("Enter details!");
        return;
    }

    document.getElementById("startScreen").style.display="none";
    document.getElementById("quizScreen").style.display="block";

    document.getElementById("userInfo").innerText=name+" ("+reg+")";

    loadQuestion();
}

function loadQuestion(){
    clearInterval(timer);
    timeLeft=30;

    timer=setInterval(()=>{
        timeLeft--;
        document.getElementById("timer").innerHTML="<i class='fa fa-clock'></i> "+timeLeft;

        if(timeLeft==0){
            nextQuestion();
        }
    },1000);

    let q=questions[current];
    document.getElementById("question").innerText=q.q;

    let html="";
    q.options.forEach((opt,i)=>{
        html+=`<div class="option" onclick="checkAnswer(${i},this)">${opt}</div>`;
    });

    document.getElementById("options").innerHTML=html;

    updateProgress();
}

function checkAnswer(i,el){
    let correct=questions[current].answer;

    userAnswers[current]=i;

    if(i==correct){
        el.classList.add("correct");
        score++;
    }else{
        el.classList.add("wrong");
    }

    document.querySelectorAll(".option").forEach(o=>o.onclick=null);
}

function nextQuestion(){
    current++;

    if(current<questions.length){
        loadQuestion();
    }else{
        showResult();
    }
}

function updateProgress(){
    let percent=(current/questions.length)*100;
    let bar=document.getElementById("progressBar");

    bar.style.width=percent+"%";

    if(percent<40) bar.className="progress-bar bg-danger";
    else if(percent<80) bar.className="progress-bar bg-warning";
    else bar.className="progress-bar bg-success";
}

function showResult(){
    document.getElementById("quizScreen").style.display="none";
    document.getElementById("resultScreen").style.display="block";

    let name=document.getElementById("name").value;
    let reg=document.getElementById("reg").value;

    document.getElementById("finalInfo").innerText=name+" ("+reg+")";

    let reviewHTML="";

    questions.forEach((q,i)=>{
        let correct=q.answer;
        let user=userAnswers[i];

        let status = user==correct ? "correct-review" : "wrong-review";

        reviewHTML+=`
        <div class="review-box ${status}">
            <b>Q${i+1}: ${q.q}</b><br>
            Your Answer: ${q.options[user] || "Not Answered"}<br>
            Correct: ${q.options[correct]}
        </div>`;
    });

    document.getElementById("review").innerHTML=reviewHTML;

    document.getElementById("finalScore").innerText="Score: "+score+"/"+questions.length;
}

function toggleMode(){
    document.body.classList.toggle("dark-mode");
}

function downloadPDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let name=document.getElementById("name").value;
    let reg=document.getElementById("reg").value;

    doc.text("Quiz Result", 20, 20);
    doc.text("Name: "+name, 20, 30);
    doc.text("Reg No: "+reg, 20, 40);
    doc.text("Score: "+score+"/"+questions.length, 20, 50);

    doc.save("QuizResult.pdf");
}