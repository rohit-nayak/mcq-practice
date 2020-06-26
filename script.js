$(document).ready(() => {
    $("#save").click(() => {
        console.log('hello')
        const ques = {
            question: $('input')[0].value,
            op1: $('input')[1].value,
            op2: $('input')[2].value,
            op3: $('input')[3].value,
            op4: $('input')[4].value,
            answer: $('input')[5].value,
            category: $('select')[0].value
        }
        $.ajax({
            url: "https://mcq-practice-backend.herokuapp.com/add",
            type: "POST",
            data: ques,
            success: function(data, textStatus, jqXHR) {
                //data - response from server
                alert('Question added successfully');
                $('input:text').val('')
                $('select').val('english')
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('failed to add question');
                console.log(errorThrown)
            }
        });
    });

})