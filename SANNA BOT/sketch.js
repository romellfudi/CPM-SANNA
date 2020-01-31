// PAE Business Intelligence 2017 -1, UESAN
// OWNER: Romell Freddy Domínguez Zárate
// PROFESOR: Julio

//
var name = 'User';
let dni;
let edad;
// variebles globales lógicas
let bot;
//
let value;
let input;
let reply;
// variables globales visuales
let BOT = 'SANNA\'s ChatBot&emsp;::&emsp;';
let button;
let user_input;
let output;
let log = '';
let last_bot_ok = '';

let speech;
let speechRec;

let continuous = true;
let interim = false;

function setup() {
    noCanvas();

    speech = new p5.Speech('Google español');
    // setear español
    speechRec = new p5.SpeechRec('es-ES', gotSpeech);

    bot = new RiveScript();
    bot.loadFile("SANNA.rive", botReady, botError);



    speechRec.start(continuous, interim);

    function botReady() {
        console.log('Chatbot ready!');
        bot.sortReplies();
    }

    function botError() {
        console.log('Chatbot error!')
    }


    button = select('#submit');
    user_input = select('#user_input');
    output = select('#output');

    button.mousePressed(chat);

}

let inputSpeech;

function gotSpeech() {
    if (speechRec.resultValue) {
        inputSpeech = speechRec.resultString;

        value = bot.getVariable("res");
        if (value === "6") {
            inputSpeech = inputSpeech.replace(/ /g, "");
        }
        user_input.value(inputSpeech);
        chat();
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        chat();
    }
}

function procesar(reply) {
    document.getElementById("user_input").value = '';
    if (reply.startsWith('ERR:')) {
        console.log(reply);
        botDice('Disculpa, no te puedo entender.');
        botDice(last_bot_ok) // TODO repetir pregunta
    } else { // procesar lógica
        last_bot_ok = reply;
        extraerVariables();
        logica(reply)
    }
}

function logica(reply) {
    let res = reply;
    value = bot.getVariable("res");
    console.log(value);
    switch (value) {
        case "1":
            botDice(reply);
            res = bot.reply("local-user", "pr nombre");
            procesar(res);
            break;
        case "2":
            botDice(reply);
            res = bot.reply("local-user", "pr dni");
            procesar(res);
            break;
        case "3":
            botDice(reply);
            res = bot.reply("local-user", "chat bot");
            procesar(res);
            break;
        default:
            botDice(res);
    }
}

function chat() {
    user_input = select('#user_input');
    input = user_input.value();
    userDice(input); // visualizar en la web la información tal cual
    switch (value) {
        case "7":
            if (input.indexOf(' ') >= 0) {
                var name_ = input.substr(input.lastIndexOf(' ') + 1);
                input = "soy " + name_;
            } else {
                input = "soy " + input;
            }
            break;
        case "6":
            if (isNumber(input)) { // agregar si únicamente número
                input = 'mi dni es ' + input;
            }
            break;
        default:
            break;
    }
    console.log("Enviando:" + input);
    reply = bot.reply("local-user", input);
    procesar(reply);
}

function botDice(res) {
    speech.speak(res);
    speech.started(startSpeaking);
    speech.ended(endSpeaking);
    log = log + BOT + res + '<br>';
    output.html(log);
    
}

function startSpeaking() {

}

function endSpeaking() {

}

function userDice(res) {
    log = log + name + '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;::&emsp;' + res + '<br>';
    output.html(log);
}

function extraerVariables() {
    name = getR("user");
    dni = getR("dni");
    edad = getR("edad");
}

function getR(val) {
    var temp = bot.getVariable(val);
    console.log(val + ":" + temp);
    return temp;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}