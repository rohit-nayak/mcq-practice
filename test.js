let questions = [];
let Score = 0;
let User;
let current = 0;
let t;
$(document).ready(async() => {

});

async function getQuestion() {
    $('#testBox').css('display', '');
    $('#modalBtn').css('display', 'none')
    $('#userName')[0].innerText = $('#user').val();
    try {
        await $.ajax({
            url: "https://mcq-practice-backend.herokuapp.com/getQuest",
            type: "POST",
            data: {
                user: $('#user')[0].value,
                category: $('#category')[0].value
            },
            success: (data) => {
                //console.log(data);
                questions = data.data;
            }
        });
        if (questions.length) {
            $('#qno')[0].innerHTML = '';
            for (i = 0; i < questions.length; i++) {
                $('#qno')[0].innerHTML += `<button class="btn btn-outline-info mr-2 mb-2" id="b${i}" onclick="showQuest(${i})">${i + 1}</button>`
            }
            showQuest(0);
            Timer(false);
        }
    } catch (error) {
        //console.log(error)
        if (error.responseJSON.error)
            alert(`error > ${error.responseJSON.error}`);
        else {
            alert('some error occured');
            console.log(error)
        }
        $('#testBox').css('display', 'none');
        $('#modalBtn').css('display', '');
        $('#userName')[0].innerText = '';
    }

}

function submitResponse(answer) {
    //console.log(`title is => ${$('#qBox')[0].firstElementChild.title}`)
    const response = $("input[name='answer']:checked").val();
    //console.log(response == answer)
    if (response == answer) {
        $('#b' + (Number($('#qBox')[0].firstElementChild.title)) % questions.length).removeClass('btn-outline-info');
        $('#b' + (Number($('#qBox')[0].firstElementChild.title)) % questions.length).addClass('disabled btn-success');
        $('#b' + (Number($('#qBox')[0].firstElementChild.title)) % questions.length).prop("onclick", null).off("click");
        Score += 1;
    } else {
        //console.log((Number($('#qBox')[0].firstElementChild.title)) % questions.length);
        $('#b' + (Number($('#qBox')[0].firstElementChild.title)) % questions.length).removeClass('btn-outline-info');
        $('#b' + (Number($('#qBox')[0].firstElementChild.title)) % questions.length).addClass('disabled btn-danger');
        $('#b' + (Number($('#qBox')[0].firstElementChild.title)) % questions.length).prop("onclick", null).off("click");
        Score -= 1.25;
    }
    $('#score')[0].innerText = Score;
    $("input[name='answer']").prop('checked', false)
        //console.log(`next question is => ${Number($('#qBox')[0].firstElementChild.title) % questions.length}`)
    let nextQues = Number($('#qBox')[0].firstElementChild.title);
    if (nextQues == questions.length)
        nextQues = 0;
    showQuest(nextQues);
}

function skip(index) {
    if ((index == current) && ($('#b' + index).hasClass('disabled')))
        return Timer(true);
    showQuest(index);
}

function showQuest(index) {
    //console.log(`index is ${index} and current is ${current}`)
    if ($('#b' + index).hasClass('disabled')) {
        return skip((index + 1) % questions.length);
    } else
        current = index;
    //console.log(index)
    const quest = `
        <div class="card" title="${(index) % questions.length}">
            <div class="card-header">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Q ${(index + 1) % (questions.length + 1)} : </span>
                    </div>
                    <p>${questions[index].question} </p>
                </div>
            </div>
            <div class="card-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="radio" value="${questions[index].op1}" name="answer" aria-label="Radio button for following text input" />
                        </div>
                    </div>
                    <input type="text" class="form-control" placeholder="${questions[index].op1}" aria-label="Text input with radio button" disabled />
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="radio" aria-label="Radio button for following text input" value="${questions[index].op2}" name="answer" />
                        </div>
                    </div>
                    <input type="text" class="form-control" placeholder="${questions[index].op2}" aria-label="Text input with radio button" disabled />
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="radio" aria-label="Radio button for following text input" value="${questions[index].op3}" name="answer" />
                        </div>
                    </div>
                    <input type="text" class="form-control" placeholder="${questions[index].op3}" aria-label="Text input with radio button" disabled />
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="radio" aria-label="Radio button for following text input" value="${questions[index].op4}" name="answer" />
                        </div>
                    </div>
                    <input type="text" class="form-control" placeholder="${questions[index].op4}" aria-label="Text input with radio button" disabled />
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="radio" aria-label="Radio button for following text input" value="${questions[index].op5}" name="answer" />
                        </div>
                    </div>
                    <input type="text" class="form-control" placeholder="${questions[index].op5}" aria-label="Text input with radio button" disabled />
                </div>
            </div>
            <div class=" card-footer">
                <button class="btn btn-success" id="submit" onclick="submitResponse('${questions[index].answer}')"> Submit </button>
                <button class="btn btn-secondary" id="skip" onclick="skip(${(index + 1) % questions.length})"> Skip </button>
            </div>
        </div>
        `;
    //console.log(quest)
    $('#qBox')[0].innerHTML = quest;
}

function Timer(toStop) {
    if (toStop) {
        clearInterval(t);
        return showScore();
    }
    let time = 20 * 60,
        minutes, seconds;
    t = setInterval(() => {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $('#timer')[0].innerText = minutes + ':' + seconds;
        if (--time < 0) {
            clearInterval(t);
            showScore()
                //time = duration;
        }
    }, 1000)
}

function showScore() {
    $('#testBox').css('display', 'none');
    $('#scoreCard').css('display', '');
    $('#finalScore')[0].innerText = Score;
}