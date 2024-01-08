let leftFriends = 3;
let leftEnemy = 3;
let forwardedFriends = 0;
let forwardedEnemy = 0;

let turnCount = 0;

let tryNumber = localStorage.getItem('try');

if(!tryNumber) {
    localStorage.setItem('try', 0);
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
    const triesTop = {};

    for(let i = 0; i <= tryNumber-0; i++) {
        const tries = localStorage.getItem(`try-${i}`);
        if(tries) {
            const [seconds, turns] = tries.split(' ');
            const splitted = seconds.split(/[:.]/).map(val => val-0);
            splitted.push(i);
            if(triesTop[turns]) {
                triesTop[turns].push(splitted);
            } else {
                triesTop[turns] = [splitted];
            }
        }
    }

    Object.values(triesTop).forEach(values => {
        values
            .sort((x, y) => x[0] - y[0])
            .sort((x, y) => {
                if (x[0] !== y[0]) {
                    return;
                }
                return x[1] - y[1];
            })
            .sort((x, y) => {
                if (x[0] !== y[0]) {
                    return;
                }
                if (x[1] === y[1]) {
                    return x[2] - y[2];
                }
            });
    });

    let innerIndex = 1;

    Object.entries(triesTop).forEach(([ key, value ]) => {
        value.forEach(result => {
            let span = document.createElement('span');
            span.textContent = `${innerIndex}: Попытка: ${result[3]} || \n Ходов: ${key} || \n Время:${result[0] + ':' + result[1] + ':' + result[2]}`;
            scoreBoard.appendChild(span);
            innerIndex+=1;
        });
    });
}

againButton.addEventListener('click', () => {
    location.reload();
});

goButton.addEventListener('click', () => {
    if (boat.children.length > 0) {
        goButton.setAttribute('disabled', true);

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

        setTimeout(() => {
            let friends = 0;
            let enemies = 0;

            passangers.forEach(passanger => {
                if (boat.classList.contains('boat-right')) {
                    if ((
                            passanger.classList.contains('enemy') && 
                            passanger.classList.contains('on-boat')
                        ) || (
                            passanger.classList.contains('enemy') && 
                            passanger.classList.contains('forwarded')
                        )
                    ) {
                        enemies++;
                    }
                    if ((
                            passanger.classList.contains('friend') && 
                            passanger.classList.contains('on-boat')
                        ) || (
                            passanger.classList.contains('friend') && 
                            passanger.classList.contains('forwarded')
                        )
                    ) {
                        friends++;
                    }
                } else {
                    if ((
                            passanger.classList.contains('enemy') && 
                            passanger.classList.contains('on-boat')
                        ) || (
                            passanger.classList.contains('enemy') && 
                            !passanger.classList.contains('forwarded')
                        )
                    ) {
                        enemies++;
                    }
                    if ((
                            passanger.classList.contains('friend') && 
                            passanger.classList.contains('on-boat')
                        ) || (
                            passanger.classList.contains('friend') && 
                            !passanger.classList.contains('forwarded')
                        )
                    ) {
                        friends++;
                    }
                }
            });

            if (friends < enemies && friends > 0) {
                playground.classList.add('hidden');
                goButton.classList.add('hidden');
                againButton.classList.remove('hidden');

                message.innerHTML = 'Вы проиграли!';
                message.classList.remove('hidden');
                stopTimer();
            }

            goButton.removeAttribute('disabled');
        }, 750);
    }
});

playButton.addEventListener('click', () => {
    localStorage.setItem('try', tryNumber-0+1);
    tryNumber = localStorage.getItem('try');
    tryContainer.innerHTML = `Попытка ${ tryNumber }`;

    document.querySelector('.water-back').classList.remove('hidden');
    document.querySelector('.turn').classList.remove('hidden');
    document.querySelector('.timer').classList.remove('hidden');

    playground.classList.remove('hidden');
    goButton.classList.remove('hidden')
    playButton.classList.add('hidden');
    document.querySelector('.start-screen-button').classList.remove('start-screen-button');
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

            if (forwardedFriends === 3 && forwardedEnemy === 3) {                       // Победа
                playground.classList.add('hidden');
                goButton.classList.add('hidden');
                document.querySelector('.water-back').classList.add('hidden');
                againButton.classList.remove('hidden');
                
                message.innerHTML = 'Вы выиграли!';
                message.classList.remove('hidden');
                scoreBoard.classList.remove('score-hidden');
                localStorage.setItem(`try-${tryNumber-0}`, `${timer.innerText} ${turnCount}`);
                checkResults();
                stopTimer();
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

