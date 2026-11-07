    // Clock above chat
    let clockInterval = 0;
    const chatClock = document.createElement('p');
    chatClock.id = 'chatClock';
    chatClock.style.flexGrow = '2';
    chatClock.style.fontFamily = 'system-ui';
    document.getElementById("usercount").insertAdjacentElement('afterend', chatClock);

    const setChatClock = () => {
        const clockDate = new Date();
        const localTime = clockDate.toLocaleTimeString("JPN");
        const UTCTime = clockDate.toLocaleTimeString("JPN", {timeZone: 'UTC'});

        chatClock.innerText = `Local ${localTime} | UTC ${UTCTime}`;
    }
	
    setChatClock();
    clockInterval = setInterval(setChatClock, 1000);



    // Favicon
    const favicon=document.createElement('link');
    favicon.id='favicon';
    favicon.rel='shortcut icon';
    favicon.type='image/png';
    favicon.sizes='64x64';
    favicon.href=`https://pomf2.lain.la/f/ux35dtbp.png`;
    document.head.appendChild(favicon);



    // Keybinds
    var keyHeld = false; //control keypress rapidfire
    $(window).bind('keyup', function(){ keyHeld=false; });

    $(window).bind('keydown', function(event) {
        var inputBox = document.getElementById("chatline");
        var inputVal = inputBox.value;

        if (event.ctrlKey && !event.shiftKey){
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a': //Select input box
                // Check if we already have some form of text input focused
                const INPUT_TAGS = ["INPUT", "TEXTAREA"];
                if (INPUT_TAGS.includes(document.activeElement.tagName)) return;

                event.preventDefault();
                if(!keyHeld){
                    keyHeld=true;
                    inputBox.focus();
                    inputBox.setSelectionRange(0,inputVal.length);
                }

                break;
            case 's': //spoiler
                if (!keyHeld) {
                    keyHeld=true;
                    event.preventDefault();
                    var selSt = inputBox.selectionStart;
                    var selEnd = inputBox.selectionEnd;

                    if (inputBox === document.activeElement) {
                        if(inputBox.selectionStart == inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0,selSt) +"[sp]"+ inputVal.substring(selSt,selEnd) +"[/sp]"+inputVal.substring(selEnd,inputVal.length);
                            inputBox.setSelectionRange(selSt +4,selSt +4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0,selSt) +"[sp]"+ inputVal.substring(selSt,selEnd) +"[/sp]"+inputVal.substring(selEnd,inputVal.length);
                            inputBox.setSelectionRange(selEnd+9,selEnd+9);
                        }
                    }
                }
                
                break;
            }
        }
    });

    document.querySelectorAll('.username').forEach(username => {
        if (username.textContent.includes("DesuTheMaid")) {
            // Split the name into two parts: "Desu" and "Maid"
            const part1 = "Desu"  // "Desu"
            const part2 = "The"; // "The"
            const part3 = "Maid";   // "Maid"
            
            // Update the username HTML with colored spans
            username.innerHTML = `<span style="color: darkred;">${part1}</span><span style="color: #ffe5c8;">${part2}</span><span style="color: green;">${part3}</span>: `;
        }
    });


