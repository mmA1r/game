let leftFriends = 3;
let leftEnemy = 3;
let forwardedFriends = 0;
let forwardedEnemy = 0;

let turnCount = 0;

let tryNumber = localStorage.getItem('try');

if(!tryNumber) {
    localStorage.setItem('try', 1);
    tryNumber = localStorage.getItem('try');
} else {
    localStorage.setItem('try', tryNumber-0+1);
    tryNumber = localStorage.getItem('try');
}

const tryContainer = document.querySelector('.try');
const turnCounter = document.querySelector('.turn');
tryContainer.innerHTML = `Попытка ${ tryNumber }`;

const passangers = document.querySelectorAll('.passanger');
const boat = document.querySelector('.boat');
const rightGround = document.querySelector('.right-ground');
const leftGround = document.querySelector('.left-ground');
const playground = document.querySelector('.ground');

const playButton = document.getElementById('play-button');
const goButton = document.getElementById('go-button');
const againButton = document.getElementById('try-again-button');

const timer = document.getElementById("timer");
const scoreBoard = document.querySelector('.score-board');
const message = document.querySelector('.message');

const checkResults = () => {
    for(let i = 0; i < tryNumber-0; i++) {
        const tries = localStorage.getItem(`try-${i}`);
        if(tries) {
            const [seconds, turns] = tries.split(' ');
            let span = document.createElement('span');
            span.textContent = `Попытка ${i}: \n Время:${seconds} \n Ходов: ${turns}`;
            scoreBoard.appendChild(span);
        }
    }
}

checkResults();

againButton.addEventListener('click', () => {
    location.reload();
});

goButton.addEventListener('click', () => {
    if (boat.children.length > 0) {
        turnCount++;
        turnCounter.textContent = `Ходов: ${turnCount}`;
        if ((leftFriends < leftEnemy && leftFriends > 0) || (forwardedFriends < forwardedEnemy && forwardedFriends > 0)) {
            playground.classList.add('hidden');
            goButton.classList.add('hidden');
            againButton.classList.remove('hidden');

            message.innerHTML = 'Вы проиграли!';
            message.classList.remove('hidden');
            stopTimer();
        } else {
            if (!boat.classList.contains('boat-right')) {
                boat.classList.add('boat-right');
            } else {
                boat.classList.remove('boat-right');
            }
        }
    }
});

playButton.addEventListener('click', () => {
    playground.classList.remove('hidden');
    goButton.classList.remove('hidden')
    playButton.classList.add('hidden');
    startTimer();
});

passangers.forEach(passanger => {
    passanger.addEventListener('click', () => {

        const list = passanger.classList;

        // на лодку с берега
        if (!list.contains('on-boat') && boat.children.length < 2 && !list.contains('forwarded') && !boat.classList.contains('boat-right')) {
            list.add('on-boat');
            boat.appendChild(passanger);

            if(passanger.classList.contains('friend')) {
                leftFriends-=1;
            } else {
                leftEnemy-=1;
            }
        } else
        // спустить с лодки переправленного
        if (list.contains('on-boat') && boat.classList.contains('boat-right')) {
            list.remove('on-boat');
            list.add('forwarded');
            rightGround.append(passanger);

            if(passanger.classList.contains('friend')) {
                forwardedFriends+=1;
            } else {
                forwardedEnemy+=1;
            }

            if (forwardedFriends === 3 && forwardedEnemy === 3) {
                playground.classList.add('hidden');
                goButton.classList.add('hidden');
                againButton.classList.remove('hidden');
                
                message.innerHTML = 'Вы выиграли!';
                message.classList.remove('hidden');
                stopTimer();
                localStorage.setItem(`try-${tryNumber-0}`, `${timer.innerText} ${turnCount}`);
            }
        } else
        // забрать на лодку переправленного
        if (list.contains('forwarded') && !list.contains('on-boat') && boat.children.length < 2 && boat.classList.contains('boat-right')) {
            list.remove('forwarded');
            list.add('on-boat');
            boat.appendChild(passanger);

            if(passanger.classList.contains('friend')) {
                forwardedFriends-=1;
            } else {
                forwardedEnemy-=1;
            }
        } else
        // с лодки обратно на берег
        if (list.contains('on-boat') && !boat.classList.contains('boat-right')) {
            list.remove('on-boat');
            leftGround.appendChild(passanger);

            if(passanger.classList.contains('friend')) {
                leftFriends+=1;
            } else {
                leftEnemy+=1;
            }
        }
    });
});

let startTime;
let elapsedTime = 0;
let timerInterval;

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = Math.floor((elapsedTime % 1000) / 10);
  
  timer.textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

