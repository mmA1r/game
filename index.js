localStorage.setItem('leftFriend', 3);
localStorage.setItem('leftEnemy', 3);

localStorage.setItem('forwardedFriend', 0);
localStorage.setItem('forwardedEnemy', 0);

const passangers = document.querySelectorAll('.passanger');
const boat = document.querySelector('.boat');
const rightGround = document.querySelector('.right-ground');
const leftGround = document.querySelector('.left-ground');
const playground = document.querySelector('.ground');

const playButton = document.getElementById('play-button');
const goButton = document.getElementById('go-button');
const againButton = document.getElementById('try-again-button');

const message = document.querySelector('.message');

againButton.addEventListener('click', () => {
    location.reload();
});

goButton.addEventListener('click', () => {
    if (boat.children.length > 0) {
        const leftFriend = localStorage.getItem('leftFriend');
        const leftEnemy = localStorage.getItem('leftEnemy');
        const forwardedFriend = localStorage.getItem('forwardedFriend');
        const forwardedEnemy = localStorage.getItem('forwardedEnemy');

        if ((leftFriend < leftEnemy && leftFriend > 0) || (forwardedFriend < forwardedEnemy && forwardedFriend > 0)) {
            playground.classList.add('hidden');
            goButton.classList.add('hidden');
            againButton.classList.remove('hidden');

            message.innerHTML = 'Вы проиграли!';
            message.classList.remove('hidden');
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
});

passangers.forEach(passanger => {
    passanger.addEventListener('click', () => {
        const leftFriend = localStorage.getItem('leftFriend');
        const leftEnemy = localStorage.getItem('leftEnemy');
        const forwardedFriend = localStorage.getItem('forwardedFriend');
        const forwardedEnemy = localStorage.getItem('forwardedEnemy');

        const list = passanger.classList;

        // на лодку с берега
        if (!list.contains('on-boat') && boat.children.length < 2 && !list.contains('forwarded')) {
            list.add('on-boat');
            boat.appendChild(passanger);

            if(passanger.classList.contains('friend')) {
                localStorage.setItem("leftFriend", leftFriend-1);
            } else {
                localStorage.setItem("leftEnemy", leftEnemy-1);
            }
        } else
        // спустить с лодки переправленного
        if (list.contains('on-boat') && boat.classList.contains('boat-right')) {
            list.remove('on-boat');
            list.add('forwarded');
            rightGround.append(passanger);

            if(passanger.classList.contains('friend')) {
                localStorage.setItem("forwardedFriend", forwardedFriend-0+1);
            } else {
                localStorage.setItem("forwardedEnemy", forwardedEnemy-0+1);
            }

            if (localStorage.getItem('forwardedFriend')-0 === 3 && localStorage.getItem('forwardedEnemy')-0 === 3) {
                playground.classList.add('hidden');
                goButton.classList.add('hidden');
                againButton.classList.remove('hidden');
                
                message.innerHTML = 'Вы выиграли!';
                message.classList.remove('hidden');
            }
        } else
        // забрать на лодку переправленного
        if (list.contains('forwarded') && !list.contains('on-boat') && boat.children.length < 2) {
            list.remove('forwarded');
            list.add('on-boat');
            boat.appendChild(passanger);

            if(passanger.classList.contains('friend')) {
                localStorage.setItem("forwardedFriend", forwardedFriend-1);
            } else {
                localStorage.setItem("forwardedEnemy", forwardedEnemy-1);
            }
        } else
        // с лодки обратно на берег
        if (list.contains('on-boat') && !boat.classList.contains('boat-right')) {
            list.remove('on-boat');
            leftGround.appendChild(passanger);

            if(passanger.classList.contains('friend')) {
                localStorage.setItem("leftFriend", leftFriend-0+1);
            } else {
                localStorage.setItem("leftEnemy", leftEnemy-0+1);
            }
        }
    });
});

