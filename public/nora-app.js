(function() {
  console.log('🚀 Nora app loaded');

  // Update status bar time
  function updateStatusTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('statusTime').textContent = `${hours}:${minutes}`;
  }
  updateStatusTime();
  setInterval(updateStatusTime, 60000); // Update every minute

  // Check if video and avatar exist
  const heroVideo = document.getElementById('heroVideo');
  const heroPlaceholder = document.getElementById('heroPlaceholder');
  const avatarImg = document.getElementById('avatarImg');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');

  heroVideo.addEventListener('loadeddata', function() {
    heroPlaceholder.style.display = 'none';
  });

  heroVideo.addEventListener('error', function() {
    heroPlaceholder.style.display = 'flex';
  });

  avatarImg.addEventListener('load', function() {
    avatarImg.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
  });

  avatarImg.addEventListener('error', function() {
    avatarPlaceholder.style.display = 'flex';
  });

  // Try to load avatar
  const testImg = new Image();
  testImg.onload = function() {
    avatarImg.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
  };
  testImg.src = 'nora-avatar.jpg';

  // Configuration
  const WEBHOOK_URL = "https://hook.us2.make.com/fjivuprpif5r1asrcclnp1lvelgcc1ms";

  // Elements
  const coverScreen = document.getElementById('coverScreen');
  const dmScreen = document.getElementById('dmScreen');
  const startBtn = document.getElementById('startBtn');
  const backBtn = document.getElementById('backBtn');
  const chat = document.getElementById('chat');
  let typing = document.getElementById('typing');
  const inputArea = document.getElementById('inputArea');
  const choices = document.getElementById('choices');
  const categoryGrid = document.getElementById('categoryGrid');
  const textInput = document.getElementById('textInput');
  const textField = document.getElementById('textField');
  const sendBtn = document.getElementById('sendBtn');
  const dropdowns = document.getElementById('dropdowns');

  // State
  let conversationStarted = false;
  let viewedCategories = [];
  let userData = {
    name: '',
    birthday: '',
    birthday_confirmed: false,
    timezone: '',
    timezone_short: '',
    extras_opt_in: 'no',
    birth_time: 'unknown',
    note: '',
    reaction: ''
  };

  // Mock saju results
  // Saju results (will be filled from webhook response)
  let sajuResults = null;

  // Screen switching
  startBtn.addEventListener('click', function() {
    console.log('Start button clicked');
    coverScreen.classList.remove('active');
    dmScreen.classList.add('active');
    
    if (!conversationStarted) {
      // Re-reference typing element in case DOM was reset by Start over
      typing = document.getElementById('typing');
      startConversation();
      conversationStarted = true;
    }
  });

  backBtn.addEventListener('click', function() {
    dmScreen.classList.remove('active');
    coverScreen.classList.add('active');
  });

  // Utility functions
  function scrollToBottom() {
    // 즉시 스크롤 (chat 영역 + input area까지)
    chat.scrollTop = chat.scrollHeight + 100;
    // 약간 지연 후 다시 (애니메이션 대응)
    setTimeout(() => {
      chat.scrollTop = chat.scrollHeight + 100;
    }, 50);
    setTimeout(() => {
      chat.scrollTop = chat.scrollHeight + 100;
    }, 200);
  }

  function addMessage(text, sender) {
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${h}:${m}`;
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerHTML = `<div class="bubble">${text}<span class="bubble-time">${timeStr}</span></div>`;
    chat.insertBefore(msg, typing);
    scrollToBottom();
  }

  function showTyping(duration = 800) {
    typing.classList.add('show');
    scrollToBottom();
    return new Promise(resolve => {
      setTimeout(() => {
        typing.classList.remove('show');
        resolve();
      }, duration);
    });
  }

  function hideAllInputs() {
    inputArea.classList.remove('show');
    choices.classList.remove('show');
    categoryGrid.classList.remove('show');
    textInput.classList.remove('show');
    dropdowns.classList.remove('show');
  }

  function showChoices(options, callback) {
    hideAllInputs();
    choices.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt;
      btn.onclick = () => {
        addMessage(opt, 'user');
        hideAllInputs();
        callback(opt);
      };
      choices.appendChild(btn);
    });
    choices.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }

  function showCategories(categories, callback) {
    hideAllInputs();
    categoryGrid.innerHTML = '';
    
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      if (viewedCategories.includes(cat)) {
        btn.classList.add('viewed');
      }
      btn.textContent = cat;
      btn.onclick = () => {
        if (!viewedCategories.includes(cat)) {
          viewedCategories.push(cat);
        }
        addMessage(cat, 'user');
        hideAllInputs();
        callback(cat);
      };
      categoryGrid.appendChild(btn);
    });
    
    categoryGrid.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }

  function showTextInput(placeholder, callback, optional = false) {
    hideAllInputs();
    textField.value = '';
    textField.placeholder = placeholder;
    textInput.classList.add('show');
    inputArea.classList.add('show');
    textField.focus();
    
    const handler = () => {
      const value = textField.value.trim();
      if (value || optional) {
        if (value) addMessage(value, 'user');
        hideAllInputs();
        callback(value);
        sendBtn.removeEventListener('click', handler);
      }
    };
    
    sendBtn.addEventListener('click', handler);
    textField.onkeypress = (e) => {
      if (e.key === 'Enter') handler();
    };
  }

function showDropdowns(config, callback) {
    hideAllInputs();
    dropdowns.innerHTML = '';
    
    config.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'dropdown-row';
      
      row.forEach(item => {
        const select = document.createElement('select');
        select.id = item.id;
        if (item.id === 'month' || item.id === 'day' || item.id === 'year') {
          const placeholder = document.createElement('option');
          placeholder.value = '';
          placeholder.disabled = true;
          placeholder.selected = true;
          placeholder.textContent = item.id === 'month' ? 'Month' : item.id === 'day' ? 'Day' : 'Year';
          select.appendChild(placeholder);
        }
        item.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (opt.selected) option.selected = true;
          select.appendChild(option);
        });
        rowDiv.appendChild(select);
      });
      
      dropdowns.appendChild(rowDiv);
    });
    
    const btn = document.createElement('button');
    btn.className = 'send-btn';
    btn.textContent = 'Send';
    btn.style.width = '100%';
    btn.style.marginTop = '10px';
    btn.onclick = () => {
      const values = {};
      config.flat().forEach(item => {
        values[item.id] = document.getElementById(item.id).value;
      });
      if (values.month === '' || values.day === '' || values.year === '') {
        alert('Please select your birth date.');
        return;
      }
      hideAllInputs();
      callback(values);
    };
    dropdowns.appendChild(btn);
    
    dropdowns.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }
  function detectTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    } catch {
      return 'America/New_York';
    }
  }

  // Conversation flow
  async function startConversation() {
    // Check localStorage for saved data
    const savedData = localStorage.getItem('nora_user_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.name && parsed.birthday && parsed.timezone_short) {
          await showTyping(650);
          addMessage(`Hey ${parsed.name}!`, 'nora');
          
          await showTyping(700);
          
          // Build info message with birth time if available
          let infoMessage = `I have you as ${parsed.birthday}`;
          if (parsed.birth_time && parsed.birth_time !== 'unknown') {
            // Convert 24h to 12h format for display
            const hour24 = parseInt(parsed.birth_time.split(':')[0]);
            const minute = parsed.birth_time.split(':')[1];
            const hour12 = hour24 === 0 ? 12 : (hour24 > 12 ? hour24 - 12 : hour24);
            const ampm = hour24 >= 12 ? 'PM' : 'AM';
            infoMessage += `, ${hour12}:${minute} ${ampm}`;
          }
          infoMessage += `, ${parsed.timezone_short}.<br>Still accurate?`;
          
          addMessage(infoMessage, 'nora');
          
          showChoices(['Yes', 'Update info'], async (choice) => {
            if (choice === 'Yes') {
              // Use saved data
              userData.name = parsed.name;
              userData.birthday = parsed.birthday;
              userData.timezone = parsed.timezone;
              userData.timezone_short = parsed.timezone_short;
              userData.birth_time = parsed.birth_time || 'unknown';
              userData.birthday_confirmed = true;
              await step4_extras(true); // Returning user
            } else {
              // Update info - ask what to update
              await showTyping(600);
              addMessage("What would you like to update?", 'nora');
              
              showChoices(['Birthday', 'Birth time'], async (updateChoice) => {
                if (updateChoice === 'Birthday') {
                  // Go to birthday input, keep birth_time in localStorage
                  const savedBirthTime = parsed.birth_time; // Save birth time
                  // Don't remove localStorage - just reset userData
                  userData = {
                    name: parsed.name, // Keep name
                    birthday: '',
                    birthday_confirmed: false,
                    timezone: '',
                    timezone_short: '',
                    extras_opt_in: 'no',
                    birth_time: savedBirthTime || 'unknown', // Keep birth time
                    note: ''
                  };
                  await step2_birthday();
                } else {
                  // Go to birth time input
                  userData.name = parsed.name;
                  userData.birthday = parsed.birthday;
                  userData.timezone = parsed.timezone;
                  userData.timezone_short = parsed.timezone_short;
                  userData.birthday_confirmed = true;
                  await step5_birthTimeKnown(true); // Skip explanation
                }
              });
            }
          });
          return;
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
    
    // No saved data - start fresh
    await startFresh();
  }
  
  async function startFresh() {
    if (userData.name && userData.birthday_confirmed) {
      await show3Bubbles();
      return;
    }

    await showTyping(650);
    addMessage('Hey there.', 'nora');
    
    await showTyping(700);
    addMessage('Sit with me for a minute?', 'nora');
    
    showChoices(['Sure', "Yeah, let's do this"], async (choice) => {
      await step1_name();
    });
  }

  async function step1_name() {
    await showTyping(600);
    addMessage('What should I call you?', 'nora');
    
    showTextInput('Your name', async (name) => {
      userData.name = name;
      await step2_birthday();
    });
  }

  async function step2_birthday() {
    await showTyping(600);
    addMessage("When's your birthday?", 'nora');
    
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({ value: String(i).padStart(2, '0'), label: String(i).padStart(2, '0') });
    }
    
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({ value: String(i).padStart(2, '0'), label: String(i).padStart(2, '0') });
    }
    
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      years.push({ value: String(i), label: String(i) });
    }
    
    const detectedTz = detectTimezone();
    const timezones = [
      { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST)', short: 'PST' },
      { value: 'America/Denver', label: 'Mountain Standard Time (MST)', short: 'MST' },
      { value: 'America/Chicago', label: 'Central Standard Time (CST)', short: 'CST' },
      { value: 'America/New_York', label: 'Eastern Standard Time (EST)', short: 'EST' },
      { value: 'America/Anchorage', label: 'Alaska Standard Time (AST)', short: 'AST' },
      { value: 'Pacific/Honolulu', label: 'Hawaii-Aleutian Standard Time (HST)', short: 'HST' }
    ];
    
    timezones.forEach(tz => {
      if (tz.value === detectedTz) tz.selected = true;
    });
    
    showDropdowns([
      [
        { id: 'month', options: months },
        { id: 'day', options: days },
        { id: 'year', options: years }
      ],
      [
        { id: 'timezone', options: timezones }
      ]
    ], async (values) => {
      userData.birthday = `${values.month}/${values.day}/${values.year}`;
      userData.timezone = values.timezone;
      
      const selectedTz = timezones.find(tz => tz.value === values.timezone);
      userData.timezone_short = selectedTz ? selectedTz.short : 'ET';
      
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const prettyDate = `${monthNames[parseInt(values.month)-1]} ${parseInt(values.day)}, ${values.year}`;
      addMessage(prettyDate, 'user');
      
      await step3_confirm();
    });
  }

  async function step3_confirm() {
    await showTyping(700);
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const parts = userData.birthday.split('/');
    const prettyDate = `${monthNames[parseInt(parts[0])-1]} ${parseInt(parts[1])}, ${parts[2]}`;
    const tzShort = userData.timezone_short || 'ET';
    
    // Check if we have existing birth time (from update flow)
    const existingData = localStorage.getItem('nora_user_data');
    let existingBirthTime = 'unknown';
    
    console.log('🔍 step3_confirm - existingData:', existingData);
    
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        existingBirthTime = parsed.birth_time || 'unknown';
        console.log('🔍 step3_confirm - parsed birth_time:', existingBirthTime);
      } catch (e) {
        console.error('Error parsing existing data:', e);
      }
    }
    
    console.log('🔍 step3_confirm - final existingBirthTime:', existingBirthTime);
    
    // If updating birthday and have birth time, confirm both together
    if (existingBirthTime && existingBirthTime !== 'unknown') {
      const hour24 = parseInt(existingBirthTime.split(':')[0]);
      const minute = existingBirthTime.split(':')[1];
      const hour12 = hour24 === 0 ? 12 : (hour24 > 12 ? hour24 - 12 : hour24);
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      
      addMessage(`Okay, ${userData.name}.<br>Did you mean ${prettyDate}, ${hour12}:${minute} ${ampm} (${tzShort})?`, 'nora');
    } else {
      addMessage(`Okay, ${userData.name}.<br>Did you mean ${prettyDate} (${tzShort})?`, 'nora');
    }
    
    showChoices(["Yes, that's right", 'No, fix it'], async (choice) => {
      if (choice === "Yes, that's right") {
        userData.birthday_confirmed = true;
        userData.birth_time = existingBirthTime; // Use existing birth time
        
        const saveData = {
          name: userData.name,
          birthday: userData.birthday,
          timezone: userData.timezone,
          timezone_short: userData.timezone_short,
          birth_time: existingBirthTime
        };
        
        localStorage.setItem('nora_user_data', JSON.stringify(saveData));
        
        // Skip extras if we already have birth time
        if (existingBirthTime && existingBirthTime !== 'unknown') {
          await step7_note();
        } else {
          await step4_extras();
        }
      } else {
        // Ask what to fix
        await showTyping(600);
        addMessage("What would you like to update?", 'nora');
        
        showChoices(['Birthday', 'Birth time'], async (fixChoice) => {
          if (fixChoice === 'Birthday') {
            await step2_birthday();
          } else {
            // Fix birth time only
            await step5_birthTimeKnown(true); // Skip explanation, go straight to input
          }
        });
      }
    });
  }

  async function step4_extras(isReturningUser = false) {
    // Skip "Want to go deeper" if returning user already has all data
    if (isReturningUser && userData.birth_time && userData.birth_time !== 'unknown') {
      await step7_note();
      return;
    }
    
    await showTyping(650);
    addMessage('Want to go deeper? I can get more specific if you share a couple extra things.', 'nora');
    
    showChoices(['Yes', 'No thanks'], async (choice) => {
      userData.extras_opt_in = choice === 'Yes' ? 'yes' : 'no';
      
      if (choice === 'Yes') {
        await step5_birthTimeKnown();
      } else {
        await step7_note();
      }
    });
  }

  async function step5_birthTimeKnown(skipExplanation = false) {
    // If coming from "Update birth time", skip explanation and go straight to input
    if (skipExplanation) {
      await step6_birthTime();
      return;
    }
    
    await showTyping(600);
    addMessage('Quick question - birth time?', 'nora');
    
    await showTyping(700);
    addMessage("It makes the reading way more specific. If you don't know, no worries - I'll estimate.", 'nora');
    
    showChoices(['Yes', 'No'], async (choice) => {
      if (choice === 'Yes') {
        await step6_birthTime();
      } else {
        await step7_note();
      }
    });
  }

  async function step6_birthTime() {
    await showTyping(600);
    addMessage('Cool. What time?', 'nora');
    
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push({ value: String(i), label: String(i) });
    }
    
    const minutes = [];
    for (let i = 0; i < 60; i++) {  // 1분 단위로 변경!
      minutes.push({ value: String(i).padStart(2, '0'), label: String(i).padStart(2, '0') });
    }
    
    const ampm = [
      { value: 'AM', label: 'AM' },
      { value: 'PM', label: 'PM' }
    ];
    
    showDropdowns([
      [
        { id: 'hour', options: hours },
        { id: 'minute', options: minutes },
        { id: 'ampm', options: ampm }
      ]
    ], async (values) => {
      let hour = parseInt(values.hour);
      if (values.ampm === 'PM' && hour !== 12) hour += 12;
      if (values.ampm === 'AM' && hour === 12) hour = 0;
      
      const displayTime = `${values.hour}:${values.minute} ${values.ampm}`;
      userData.birth_time = `${String(hour).padStart(2, '0')}:${values.minute}`;
      addMessage(displayTime, 'user');
      
      // Confirm birth time
      await showTyping(600);
      addMessage(`So ${displayTime} - did I get that right?`, 'nora');
      
      showChoices(['Yes', 'No, fix it'], async (choice) => {
        if (choice === 'Yes') {
          // Update localStorage with birth time
          const savedData = localStorage.getItem('nora_user_data');
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              parsed.birth_time = userData.birth_time;
              localStorage.setItem('nora_user_data', JSON.stringify(parsed));
            } catch (e) {
              console.error('Error updating birth_time:', e);
            }
          }
          
          // Final confirmation of everything
          await showTyping(600);
          const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          const parts = userData.birthday.split('/');
          const prettyDate = `${monthNames[parseInt(parts[0])-1]} ${parseInt(parts[1])}, ${parts[2]}`;
          
          addMessage(`Just to confirm: ${prettyDate}, ${displayTime}, ${userData.timezone_short}?`, 'nora');
          
          showChoices(['Yes', 'No, fix it'], async (finalChoice) => {
            if (finalChoice === 'Yes') {
              await step7_note();
            } else {
              // Ask what to fix
              await showTyping(600);
              addMessage("What would you like to update?", 'nora');
              
              showChoices(['Birthday', 'Birth time'], async (fixChoice) => {
                if (fixChoice === 'Birthday') {
                  await step2_birthday();
                } else {
                  await step6_birthTime();
                }
              });
            }
          });
        } else {
          // Go back to time input
          await showTyping(500);
          addMessage("No worries. Let's try again.", 'nora');
          await step6_birthTime();
        }
      });
    });
  }

  async function step7_note() {
    await showTyping(650);
    addMessage('Anything on your mind?', 'nora');
    
    showTextInput('Nothing? That\'s cool, just send', async (value) => {
      userData.note = value;
      await step8_sendWebhook();
    }, true);
  }

 function convertToKST(userData) {
  if (userData.birth_time === 'unknown') {
    return userData;
  }
  
  // Parse input
  const [month, day, year] = userData.birthday.split('/').map(Number);
  const [hour, minute] = userData.birth_time.split(':').map(Number);
  
  // Timezone offsets from UTC (in hours)
  const offsets = {
    'America/New_York': -5,    // EST (winter)
    'America/Chicago': -6,     // CST
    'America/Denver': -7,      // MST
    'America/Los_Angeles': -8, // PST (winter)
    'America/Anchorage': -9,   // AKST
    'Pacific/Honolulu': -10    // HST
  };
  
  const userOffset = offsets[userData.timezone] || -8;
  const kstOffset = 9;
  
  // Convert to UTC, then to KST
  const hoursToAdd = kstOffset - userOffset; // e.g., 9 - (-8) = 17
  
  // Create date and add hours
  let kstDate = new Date(year, month - 1, day, hour, minute);
  kstDate.setHours(kstDate.getHours() + hoursToAdd);
  
  const kstMonth = String(kstDate.getMonth() + 1).padStart(2, '0');
  const kstDay = String(kstDate.getDate()).padStart(2, '0');
  const kstYear = kstDate.getFullYear();
  const kstHour = String(kstDate.getHours()).padStart(2, '0');
  const kstMinute = String(kstDate.getMinutes()).padStart(2, '0');
  
  console.log(`🌍 ${userData.birthday} ${userData.birth_time} ${userData.timezone_short} → ${kstMonth}/${kstDay}/${kstYear} ${kstHour}:${kstMinute} KST`);
  
  return {
    ...userData,
    birthday: `${kstMonth}/${kstDay}/${kstYear}`,
    birth_time: `${kstHour}:${kstMinute}`,
    timezone: 'Asia/Seoul',
    timezone_short: 'KST',
    original_timezone: userData.timezone,
    original_timezone_short: userData.timezone_short
  };
}
  async function step8_sendWebhook() {
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === '1';
    
    if (!isTestMode) {
      const lastUsed = localStorage.getItem('nora_last_used');
      const today = new Date().toDateString();
      
      if (lastUsed === today) {
        await showTyping(700);
        addMessage("You already got your free reading today.<br>Come back tomorrow, or get the full version for $8.99.", 'nora');
        
        await showTyping(500);
        showChoices(['Get full version', 'Come back tomorrow'], async (choice) => {
          if (choice === 'Get full version') {
            // sajuResults 없으면 백그라운드에서 다시 받기
            if (!sajuResults) {
              const saved = localStorage.getItem('nora_saju_results');
              if (saved) {
                sajuResults = JSON.parse(saved);
              } else {
                // 백그라운드로 무료 리딩 다시 받기
                await showTyping(800);
                addMessage("Give me a sec while I pull your chart together... 🔮", 'nora');
                typing.style.display = 'flex';
                try {
                  const kstData = convertToKST(userData);
                  const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(kstData)
                  });
                  typing.style.display = 'none';
                  if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                      sajuResults = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
                    } else if (result.reading) {
                      sajuResults = typeof result.reading === 'string' ? JSON.parse(result.reading) : result.reading;
                    } else {
                      sajuResults = result;
                    }
                    localStorage.setItem('nora_saju_results', JSON.stringify(sajuResults));
                  }
                } catch(e) {
                  typing.style.display = 'none';
                  console.error('Background webhook error:', e);
                }
              }
            }  
            await showTyping(600);
            addMessage("Where should I send your full reading? 📩", 'nora');

            const askForEmail = async () => {
              showTextInput('Your email', async (email) => {
                if (!email || !email.includes('@')) {
                  await showTyping(400);
                  addMessage("Hmm, that doesn't look right — try again?", 'nora');
                  askForEmail();
                  return;
                }

                hideAllInputs();
                await showTyping(600);
                addMessage("Perfect. I'll send everything there after you complete payment. 🔮", 'nora');
                await showTyping(500);

                const paypalWrapper = document.createElement('div');
                paypalWrapper.id = 'paypal-button-container';
                paypalWrapper.style.cssText = 'padding: 12px 0;';
                chat.insertBefore(paypalWrapper, typing);
                scrollToBottom();

                if (typeof paypal === 'undefined') {
                  await new Promise((resolve) => {
                    const checkPaypal = setInterval(() => {
                      if (typeof paypal !== 'undefined') {
                        clearInterval(checkPaypal);
                        resolve();
                      }
                    }, 100);
                  });
                }

                paypal.Buttons({
                  createOrder: function(data, actions) {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: '8.99' },
                        custom_id: email
                      }]
                    });
                  },
                  onApprove: function(data, actions) {
                    return actions.order.capture().then(async function(details) {
                      paypalWrapper.remove();
                      if (!sajuResults) {
                        const saved = localStorage.getItem('nora_saju_results');
                        if (saved) sajuResults = JSON.parse(saved);
                      }
                      addMessage("You're all set. 🔮", 'nora');

                      const elementKeys = ['Yin Metal','Yang Metal','Yin Water','Yang Water',
                        'Yin Wood','Yang Wood','Yin Fire','Yang Fire','Yin Earth','Yang Earth'];
                      const userElement = elementKeys.find(k =>
                        sajuResults?.bubbles?.identity?.includes(k)) || 'Unknown';

                      try {
                        await fetch('https://hook.us2.make.com/dz3pmqu48qix5rtjadzc708ar3hhzm59', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            type: 'paid_reading',
                            email: email,
                            name: userData.name,
                            element: userElement,
                            missing_element: sajuResults?.bubbles?.pattern?.match(/missing (?:element )?(?:is )?(\w+)/i)?.[1] || 'Unknown',
                            birthday: userData.birthday,
                            birth_time: userData.birth_time,
                            reaction: userData.reaction || 'Unknown',
                            element_slug: userElement.toLowerCase().replace(/ /g, '-'),
                            bubble_identity: sajuResults?.bubbles?.identity || '',
                            bubble_pattern: sajuResults?.bubbles?.pattern || '',
                            bubble_action: sajuResults?.bubbles?.action || '',
                            bubble_question: sajuResults?.bubbles?.your_question || '',
                            compat_1: sajuResults?.bubbles?.compatible_elements?.[0] || '',
                            compat_2: sajuResults?.bubbles?.compatible_elements?.[1] || '',
                            compat_3: sajuResults?.bubbles?.compatible_elements?.[2] || '',
                            love_today: sajuResults?.categories?.Love?.today || '',
                            love_month: sajuResults?.categories?.Love?.this_month || '',
                            love_year: sajuResults?.categories?.Love?.this_year || '',
                            money_today: sajuResults?.categories?.Money?.today || '',
                            money_month: sajuResults?.categories?.Money?.this_month || '',
                            money_year: sajuResults?.categories?.Money?.this_year || '',
                            work_today: sajuResults?.categories?.Work?.today || '',
                            work_month: sajuResults?.categories?.Work?.this_month || '',
                            work_year: sajuResults?.categories?.Work?.this_year || '',
                            energy_today: sajuResults?.categories?.Energy?.today || '',
                            energy_month: sajuResults?.categories?.Energy?.this_month || '',
                            energy_year: sajuResults?.categories?.Energy?.this_year || '',
                            timestamp: new Date().toISOString()
                          })
                        });
                      } catch(e) { console.error('Webhook error', e); }

                      await new Promise(r => setTimeout(r, 800));
                      await showTyping(900);
                      addMessage("Your full reading is on its way — check your email in the next few minutes. ✨", 'nora');
                      await showTyping(700);
                      addMessage("And if it hits different... you know what to do 👀", 'nora');
                      await showTyping(800);
showChoices(['Start a new reading', '🔗 Send to a friend'], async (choice) => {
  if (choice === 'Start a new reading') {
    conversationStarted = false;
    sajuResults = null;
    viewedCategories = [];
    localStorage.removeItem('nora_last_used');
    chat.innerHTML = '<div class="typing" id="typing"><span class="typing-text">Nora is typing</span><div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>';
    typing = document.getElementById('typing');
    dmScreen.classList.remove('active');
    coverScreen.classList.add('active');
  } else {
    const baseUrl = 'https://readnora.com';
    const shareText = `I just got my full Korean saju reading and it somehow knew everything about me 😭🔮\nwhat's yours → ${baseUrl}`;
    if (navigator.share) {
      try { await navigator.share({ text: shareText, url: baseUrl }); } catch(e) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      addMessage("Copied! Send it to someone 👀", 'nora');
    }
  }
});
                    });
                  },
                  onError: function(err) {
                    console.error('PayPal error:', err);
                    addMessage("Something went wrong with payment. Please try again. 🙏", 'nora');
                  }
                }).render('#paypal-button-container');
              }, false);
            };
            askForEmail();

          } else {
            await showTyping(500);
            addMessage("See you tomorrow! 🌙", 'nora');
            hideAllInputs();
          }
        });
        return;
      }
    }
    
    await showTyping(800);
    addMessage('Give me a sec.<br>Pulling your threads together.', 'nora');
    
    typing.style.display = 'flex';
    scrollToBottom();
    
    try {
      console.log('Sending data:', userData);
      const kstData = convertToKST(userData);
      console.log('📤 Original:', userData);
      console.log('📤 KST:', kstData);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kstData)
      });
      
      typing.style.display = 'none';
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Webhook response:', result);
      
      if (result.success && result.data) {
        sajuResults = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      } else if (result.reading) {
        sajuResults = typeof result.reading === 'string' ? JSON.parse(result.reading) : result.reading;
      } else {
        sajuResults = result;
      }
      
      console.log('Parsed sajuResults:', sajuResults);
      localStorage.setItem('nora_saju_results', JSON.stringify(sajuResults));
      
    } catch (error) {
      console.error('Webhook error:', error);
      typing.style.display = 'none';
      
      await showTyping(700);
      addMessage("Hmm, something didn't work.<br>Mind trying that again?", 'nora');
      
      await showTyping(500);
      showChoices(['Start over'], () => {
        conversationStarted = false;
        sajuResults = null;
        userData = {
          name: '',
          birthday: '',
          birthday_confirmed: false,
          timezone: '',
          timezone_short: '',
          extras_opt_in: 'no',
          birth_time: 'unknown',
          note: ''
        };
        viewedCategories = [];
        
        localStorage.removeItem('nora_user_data');
        localStorage.removeItem('nora_last_used');
        
        chat.innerHTML = '<div class="typing" id="typing"><span class="typing-text">Nora is typing</span><div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>';
        
        dmScreen.classList.remove('active');
        coverScreen.classList.add('active');
      });
      
      return;
    }
    
    const today = new Date().toDateString();
    if (!isTestMode) {
      localStorage.setItem('nora_last_used', today);
    }
    
    await show3Bubbles();
  }


  async function show3Bubbles() {
    // Check if sajuResults exists
    if (!sajuResults || !sajuResults.bubbles) {
      await showTyping(700);
      addMessage("Sorry, I couldn't read your fortune right now.<br>Please try again.", 'nora');
      return;
    }
    
    await showTyping(700);
    addMessage(sajuResults.bubbles.identity, 'nora');
    
    await showTyping(800);
    addMessage(sajuResults.bubbles.pattern, 'nora');
    
    await showTyping(800);
    addMessage(sajuResults.bubbles.action, 'nora');
    
    // 4th bubble - TEASER only (first sentence)
    if (sajuResults.bubbles.your_question) {
      await showTyping(900);
      const fullAnswer = sajuResults.bubbles.your_question;
      const firstSentence = fullAnswer.split('.')[0] + '.';
      addMessage(firstSentence, 'nora');
      
      await showTyping(700);
      addMessage("That's just the beginning of what I see about your question.<br>Want the full answer? $8.99 gets you everything.", 'nora');
    } else if (userData.note && userData.note.trim().length > 0) {
      await showTyping(900);
      addMessage(`I see your question about "${userData.note}".<br>I have insights for you, but the full answer is in the premium reading.`, 'nora');
    }

    // Reaction step
    await showTyping(800);
    addMessage("Does this sound like you?", 'nora');

    showChoices(['😮 Omg yes', '🤔 Kinda', '😐 Not really'], async (reaction) => {
      userData.reaction = reaction;

      if (reaction === '😮 Omg yes') {
        await showTyping(600);
        addMessage("Right? Your chart doesn't lie. 🔮", 'nora');
      } else if (reaction === '🤔 Kinda') {
        await showTyping(600);
        addMessage("That's actually super common — the full reading usually fills in the gaps.", 'nora');
      } else {
        await showTyping(600);
        addMessage("Interesting. The details might surprise you more than the overview does.", 'nora');
      }

      await showTyping(800);
      addMessage("I can show you one area for free.<br>Which one speaks to you right now?", 'nora');

      showCategories(['Love', 'Money', 'Work', 'Energy'], showCategoryReading);
    });
  }

  async function showCategoryReading(category) {
    await showTyping(700);
    
    // 각 카테고리별 시작 문구
    const intros = {
      'Love': `${category} - let's look at your heart.`,
      'Money': `${category} - let's talk about your flow.`,
      'Work': `${category} - let's see your path.`,
      'Energy': `${category} - let's check your vibe.`
    };
    
    addMessage(intros[category] || `${category} - let's see what's up.`, 'nora');
    
    const reading = sajuResults.categories[category];
    
    // FREE: Only show "today"
    await showTyping(900);
    addMessage(reading.today, 'nora');
    
    // Teaser for more
    await showTyping(1000);
    addMessage("That's what I see for today.", 'nora');

    // Social hook — share nudge before upsell
    await showTyping(800);
    addMessage("If this hit different, send it to a friend. Their reaction is always 👀", 'nora');
    showShareButton();

    await showTyping(600);
    // Show upgrade option
    await showUpsell();
  }

  function showShareButton() {
    const baseUrl = 'https://readnora.com';

    // Extract element from identity bubble
    const identity = sajuResults?.bubbles?.identity || '';
    const compatibles = (sajuResults?.bubbles?.compatible_elements || []).slice(0, 3);

    const elementMap = {
      'Yin Wood':'🌿','Yang Wood':'🌲','Yin Fire':'🕯️','Yang Fire':'🔥',
      'Yin Earth':'🪨','Yang Earth':'🌍','Yin Metal':'🪬','Yang Metal':'⚔️',
      'Yin Water':'💧','Yang Water':'🌊',
    };

    let myElement = null;
    for (const key of Object.keys(elementMap)) {
      if (identity.includes(key)) { myElement = { name: key, emoji: elementMap[key] }; break; }
    }

    // Build dynamic OG image URL
    let ogImageUrl = `${baseUrl}/api/og`;
    if (myElement && compatibles.length > 0) {
      const params = new URLSearchParams({
        element: myElement.name,
        c1: compatibles[0] || '',
        c2: compatibles[1] || '',
        c3: compatibles[2] || '',
      });
      ogImageUrl = `${baseUrl}/api/og?${params.toString()}`;
    }

    // Update OG meta tags dynamically
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImageUrl);
    document.getElementById('twitterImage')?.setAttribute('content', ogImageUrl);

    // Build share text
    let shareText;
    if (myElement && compatibles.length > 0) {
      const compatStr = compatibles.map(c => `${elementMap[c] || '✨'} ${c}`).join('  ');
      shareText = `I'm ${myElement.name} ${myElement.emoji}\nmy best matches: ${compatStr}\n\nthis korean saju thing actually knew things about me 😭🔮\nwhat's yours → ${baseUrl}`;
    } else {
      shareText = `I just got my Korean saju reading and it somehow knew everything about me 😭🔮\nwhat's yours → ${baseUrl}`;
    }

    // Build button
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; gap:8px; padding: 4px 0 8px 0;';

    const btn = document.createElement('button');
    btn.innerHTML = '🔗 Send to a friend';
    btn.style.cssText = `
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 18px;
      background: linear-gradient(135deg, #C9A9E9 0%, #E8B4D3 100%);
      color: white;
      border: none;
      border-radius: 22px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(201,169,233,0.4);
      transition: all 0.2s;
    `;

    btn.onclick = async () => {
      if (navigator.share) {
        try {
          await navigator.share({ text: shareText, url: baseUrl });
        } catch (e) { /* user cancelled */ }
      } else {
        await navigator.clipboard.writeText(shareText);
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => { btn.innerHTML = '🔗 Send to a friend'; }, 2000);
      }
    };

    wrapper.appendChild(btn);
    chat.insertBefore(wrapper, typing);
    scrollToBottom();
  }

async function showUpsell() {
    await showTyping(900);
    addMessage("That was the preview. The full reading gets into things I can't say in a free reading — your question, your patterns, your next 2 months specifically.", 'nora');
    
    await showTyping(800);
    addMessage("$8.99 🔮 Worth it?", 'nora');
    
    showChoices(['Yes, show me', 'Not now'], async (choice) => {
      if (choice === 'Yes, show me') {
        await showTyping(700);
        addMessage("Where should I send your full reading? 📩", 'nora');
        await showTyping(400);

        const askForEmail = async () => {
          showTextInput('Your email', async (email) => {
            if (!email || !email.includes('@')) {
              await showTyping(400);
              addMessage("Hmm, that doesn't look right — try again?", 'nora');
              askForEmail();
              return;
            }

            hideAllInputs();
            await showTyping(600);
            addMessage("Perfect. I'll send everything there after you complete payment. 🔮", 'nora');
            await showTyping(500);

            const paypalWrapper = document.createElement('div');
            paypalWrapper.id = 'paypal-button-container';
            paypalWrapper.style.cssText = 'padding: 12px 0;';
            chat.insertBefore(paypalWrapper, typing);
            scrollToBottom();

            if (typeof paypal === 'undefined') {
              await new Promise((resolve) => {
                const checkPaypal = setInterval(() => {
                  if (typeof paypal !== 'undefined') {
                    clearInterval(checkPaypal);
                    resolve();
                  }
                }, 100);
              });
            }

            paypal.Buttons({
              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: '8.99' },
                    custom_id: email
                  }]
                });
              },
              onApprove: function(data, actions) {
                return actions.order.capture().then(async function(details) {
                  paypalWrapper.remove();
                  if (!sajuResults) {
                    const saved = localStorage.getItem('nora_saju_results');
                    if (saved) sajuResults = JSON.parse(saved);
                  }
                  addMessage("You're all set. 🔮", 'nora');

                  const elementKeys = ['Yin Metal','Yang Metal','Yin Water','Yang Water',
                    'Yin Wood','Yang Wood','Yin Fire','Yang Fire','Yin Earth','Yang Earth'];
                  const userElement = elementKeys.find(k =>
                    sajuResults?.bubbles?.identity?.includes(k)) || 'Unknown';

                  try {
                    await fetch('https://hook.us2.make.com/dz3pmqu48qix5rtjadzc708ar3hhzm59', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'paid_reading',
                        email: email,
                        name: userData.name,
                        element: userElement,
                        missing_element: sajuResults?.bubbles?.pattern?.match(/missing (?:element )?(?:is )?(\w+)/i)?.[1] || 'Unknown',
                        birthday: userData.birthday,
                        birth_time: userData.birth_time,
                        reaction: userData.reaction || 'Unknown',
                        element_slug: userElement.toLowerCase().replace(/ /g, '-'),
                        bubble_identity: sajuResults?.bubbles?.identity || '',
                        bubble_pattern: sajuResults?.bubbles?.pattern || '',
                        bubble_action: sajuResults?.bubbles?.action || '',
                        bubble_question: sajuResults?.bubbles?.your_question || '',
                        compat_1: sajuResults?.bubbles?.compatible_elements?.[0] || '',
                        compat_2: sajuResults?.bubbles?.compatible_elements?.[1] || '',
                        compat_3: sajuResults?.bubbles?.compatible_elements?.[2] || '',
                        love_today: sajuResults?.categories?.Love?.today || '',
                        love_month: sajuResults?.categories?.Love?.this_month || '',
                        love_year: sajuResults?.categories?.Love?.this_year || '',
                        money_today: sajuResults?.categories?.Money?.today || '',
                        money_month: sajuResults?.categories?.Money?.this_month || '',
                        money_year: sajuResults?.categories?.Money?.this_year || '',
                        work_today: sajuResults?.categories?.Work?.today || '',
                        work_month: sajuResults?.categories?.Work?.this_month || '',
                        work_year: sajuResults?.categories?.Work?.this_year || '',
                        energy_today: sajuResults?.categories?.Energy?.today || '',
                        energy_month: sajuResults?.categories?.Energy?.this_month || '',
                        energy_year: sajuResults?.categories?.Energy?.this_year || '',
                        timestamp: new Date().toISOString()
                      })
                    });
                  } catch(e) { console.error('Webhook error', e); }

                  await new Promise(r => setTimeout(r, 800));
                  await showTyping(900);
                  addMessage("Your full reading is on its way — check your email in the next few minutes. ✨", 'nora');
                  await showTyping(700);
                  addMessage("And if it hits different... you know what to do 👀", 'nora');
                  await showTyping(800);
showChoices(['Start a new reading', '🔗 Send to a friend'], async (choice) => {
  if (choice === 'Start a new reading') {
    conversationStarted = false;
    sajuResults = null;
    viewedCategories = [];
    localStorage.removeItem('nora_last_used');
    chat.innerHTML = '<div class="typing" id="typing"><span class="typing-text">Nora is typing</span><div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>';
    typing = document.getElementById('typing');
    dmScreen.classList.remove('active');
    coverScreen.classList.add('active');
  } else {
    const baseUrl = 'https://readnora.com';
    const shareText = `I just got my full Korean saju reading and it somehow knew everything about me 😭🔮\nwhat's yours → ${baseUrl}`;
    if (navigator.share) {
      try { await navigator.share({ text: shareText, url: baseUrl }); } catch(e) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      addMessage("Copied! Send it to someone 👀", 'nora');
    }
  }
});
                });
              },
              onError: function(err) {
                console.error('PayPal error:', err);
                addMessage("Something went wrong with payment. Please try again. 🙏", 'nora');
              }
            }).render('#paypal-button-container');
          }, false);
        };
        askForEmail();

      } else {
        await showTyping(700);
        addMessage("No pressure. 🫶<br>Before you go — want me to send you a weekly nudge based on your chart?", 'nora');

        await showTyping(500);
        showTextInput('Your email (skip if you want)', async (email) => {
          if (email && email.includes('@')) {
            const elementKeys = ['Yin Metal','Yang Metal','Yin Water','Yang Water',
              'Yin Wood','Yang Wood','Yin Fire','Yang Fire','Yin Earth','Yang Earth'];
            const userElement = elementKeys.find(k =>
              sajuResults?.bubbles?.identity?.includes(k)) || 'Unknown';

            await fetch('https://hook.us2.make.com/zkv7l1s3v1p7bwo9cc3g0ef43vfm6gtp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'email_capture',
                email: email,
                name: userData.name,
                element: userElement,
                missing_element: sajuResults?.bubbles?.pattern?.match(/missing (?:element )?(?:is )?(\w+)/i)?.[1] || 'Unknown',
                birthday: userData.birthday,
                birth_time: userData.birth_time,
                reaction: userData.reaction || 'Unknown',
                timestamp: new Date().toISOString()
              })
            });

            await showTyping(600);
            addMessage("Got it. See you next week. ✨", 'nora');
          } else {
            await showTyping(500);
            addMessage("All good. See you when you're ready! 🌙", 'nora');
          }
          hideAllInputs();
        }, true);
      }
    });
  }

  // Handle return after successful payment
  function checkPaidReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('paid') === 'true') {
    window.history.replaceState({}, '', window.location.pathname);
    coverScreen.classList.remove('active');
    dmScreen.classList.add('active');
    conversationStarted = true;
    setTimeout(async () => {
      addMessage("You're all set. 🔮", 'nora');
      await new Promise(r => setTimeout(r, 800));
      await showTyping(900);
      addMessage("Your full reading is on its way — check your email in the next few minutes. ✨", 'nora');
      await showTyping(700);
      addMessage("And if it hits different... you know what to do 👀", 'nora');
      await showTyping(800);
showChoices(['Start a new reading', '🔗 Send to a friend'], async (choice) => {
  if (choice === 'Start a new reading') {
    conversationStarted = false;
    sajuResults = null;
    viewedCategories = [];
    localStorage.removeItem('nora_last_used');
    chat.innerHTML = '<div class="typing" id="typing"><span class="typing-text">Nora is typing</span><div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>';
    typing = document.getElementById('typing');
    dmScreen.classList.remove('active');
    coverScreen.classList.add('active');
  } else {
    const baseUrl = 'https://readnora.com';
    const shareText = `I just got my full Korean saju reading and it somehow knew everything about me 😭🔮\nwhat's yours → ${baseUrl}`;
    if (navigator.share) {
      try { await navigator.share({ text: shareText, url: baseUrl }); } catch(e) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      addMessage("Copied! Send it to someone 👀", 'nora');
    }
  }
});
    }, 500);
  }
}
  console.log('✅ All event listeners attached');
  checkPaidReturn();
})();
