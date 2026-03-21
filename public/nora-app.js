(function() {
  console.log('🚀 Nora app loaded');

  // ── lunar-javascript 로드 ──────────────────────────────
  if (!window._lunarLoaded) {
    window._lunarLoaded = true;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js';
    document.head.appendChild(s);
  }

  // ── 사주 계산 함수 ────────────────────────────────────
  const GAN_EN = {
    '甲':'Yang Wood','乙':'Yin Wood','丙':'Yang Fire','丁':'Yin Fire','戊':'Yang Earth',
    '己':'Yin Earth','庚':'Yang Metal','辛':'Yin Metal','壬':'Yang Water','癸':'Yin Water'
  };
  const ZHI_EN = {
    '子':'Yang Water','丑':'Yin Earth','寅':'Yang Wood','卯':'Yin Wood','辰':'Yang Earth','巳':'Yin Fire',
    '午':'Yang Fire','未':'Yin Earth','申':'Yang Metal','酉':'Yin Metal','戌':'Yang Earth','亥':'Yin Water'
  };

  function calcPillars(kstYear, kstMonth, kstDay, kstHour, kstMinute) {
    try {
      if (typeof Solar === 'undefined') return null;
      const solar = Solar.fromYmdHms(kstYear, kstMonth, kstDay, kstHour, kstMinute, 0);
      const ec = solar.getLunar().getEightChar();
      const yg = ec.getYearGan(),  yz = ec.getYearZhi();
      const mg = ec.getMonthGan(), mz = ec.getMonthZhi();
      const dg = ec.getDayGan(),   dz = ec.getDayZhi();
      const hg = ec.getTimeGan(),  hz = ec.getTimeZhi();
      return {
        year:  { tg_char: yg, tg: GAN_EN[yg]||yg, dz_char: yz, dz: ZHI_EN[yz]||yz },
        month: { tg_char: mg, tg: GAN_EN[mg]||mg, dz_char: mz, dz: ZHI_EN[mz]||mz },
        day:   { tg_char: dg, tg: GAN_EN[dg]||dg, dz_char: dz, dz: ZHI_EN[dz]||dz },
        hour:  { tg_char: hg, tg: GAN_EN[hg]||hg, dz_char: hz, dz: ZHI_EN[hz]||hz }
      };
    } catch(e) {
      console.error('Pillar calc error:', e);
      return null;
    }
  }

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
  const CHAT_WEBHOOK_URL = "https://hook.us2.make.com/oa5q85zc125iese4u31tmm88c7o6kz0g";

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

  // ──────────────────────────────────────────────────────────
  // 🔧 IMPROVED USER EXPERIENCE FLOWS
  // ──────────────────────────────────────────────────────────

  function isReturningUser() {
    const savedData = localStorage.getItem('nora_user_data');
    if (!savedData) return false;
    
    try {
      const parsed = JSON.parse(savedData);
      return parsed.name && parsed.birthday && parsed.timezone_short;
    } catch (e) {
      return false;
    }
  }

  function hasCompleteSajuReading() {
    const savedResults = localStorage.getItem('nora_saju_results');
    if (!savedResults) return false;
    
    try {
      const results = JSON.parse(savedResults);
      return results.bubbles && results.categories;
    } catch (e) {
      return false;
    }
  }

  // Unified payment flow
// Unified payment flow
async function initiatePayment(userData) {
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
      await showTyping(400);
      addMessage("Changed your mind? That's totally okay too.", 'nora');
      
      showChoices(['Complete payment', 'Actually, maybe later'], async (choice) => {
        if (choice === 'Complete payment') {
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
          showPayPalButton(email);
        } else {
          // 뒤로가기 플로우
          await showTyping(600);
          addMessage("No worries at all. Want to just chat instead?", 'nora');
          
          showChoices(['Sure, let\'s chat', 'Show me today\'s reading', 'I should go'], async (backChoice) => {
            if (backChoice === 'Sure, let\'s chat') {
              await startAdvancedChat(userData);
            } else if (backChoice === 'Show me today\'s reading') {
              const kstData = convertToKST(userData);
              userData = kstData;
              await generateTodayReading(userData);
            } else {
              addMessage("All good. See you when you're ready! 🌙", 'nora');
            }
          });
        }
      });
      
    }, false);
  };
  askForEmail();
}

  // Conversation flow
  async function startConversation() {
    const isReturning = isReturningUser();
    const hasFullReading = hasCompleteSajuReading();
    
    if (isReturning) {
      const savedData = JSON.parse(localStorage.getItem('nora_user_data'));
      
      await showTyping(650);
      addMessage(`Hey ${savedData.name}!`, 'nora');
      
      await showTyping(700);
      
      // Build info message with birth time if available
      let infoMessage = `I have you as ${savedData.birthday}`;
      if (savedData.birth_time && savedData.birth_time !== 'unknown') {
        // Convert 24h to 12h format for display
        const hour24 = parseInt(savedData.birth_time.split(':')[0]);
        const minute = savedData.birth_time.split(':')[1];
        const hour12 = hour24 === 0 ? 12 : (hour24 > 12 ? hour24 - 12 : hour24);
        const ampm = hour24 >= 12 ? 'PM' : 'AM';
        infoMessage += `, ${hour12}:${minute} ${ampm}`;
      }
      infoMessage += `, ${savedData.timezone_short}.<br>Still accurate?`;
      
      addMessage(infoMessage, 'nora');
      
      showChoices(['Yes', 'Update info'], async (choice) => {
        if (choice === 'Yes') {
          // Use saved data
          userData.name = savedData.name;
          userData.birthday = savedData.birthday;
          userData.timezone = savedData.timezone;
          userData.timezone_short = savedData.timezone_short;
          userData.birth_time = savedData.birth_time || 'unknown';
          userData.birthday_confirmed = true;

          const hasMemory = await checkPreviousConversation();
          if (hasMemory) {
            return; // 메모리 대화가 진행되므로 여기서 종료
          }

          await showTyping(700);
          addMessage(`Welcome back, ${savedData.name}. 🔮`, 'nora');
          
          if (hasFullReading) {
            // Has complete reading - offer daily or full
            await showTyping(800);
            addMessage("Want to see what today has in store for you?", 'nora');
            
            showChoices(['Show me today', 'Get full reading'], async (choice) => {
              if (choice === 'Show me today') {
                const kstData = convertToKST(userData);
                userData = kstData;
                await generateTodayReading(userData);
              } else {
                await initiatePayment(userData);
              }
            });
          } else {
            // Incomplete data - continue from where left off
            await step8_sendWebhook();
          }
        } else {
          // Update info - ask what to update
          await showTyping(600);
          addMessage("What would you like to update?", 'nora');
          
          showChoices(['Birthday', 'Birth time'], async (updateChoice) => {
            if (updateChoice === 'Birthday') {
              const savedBirthTime = savedData.birth_time; // Save birth time
              userData = {
                name: savedData.name, // Keep name
                birthday: '',
                birthday_confirmed: false,
                timezone: '',
                timezone_short: '',
                extras_opt_in: 'no',
                birth_time: savedBirthTime || 'unknown', // Keep birth time
                note: ''
              };
              await showTyping(600);
              addMessage("What's your new birthday?", 'nora');
              // 기존 드롭다운 코드 사용
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

              const timezones = [
                { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST)', short: 'PST' },
                { value: 'America/Denver', label: 'Mountain Standard Time (MST)', short: 'MST' },
                { value: 'America/Chicago', label: 'Central Standard Time (CST)', short: 'CST' },
                { value: 'America/New_York', label: 'Eastern Standard Time (EST)', short: 'EST' },
                { value: 'America/Anchorage', label: 'Alaska Standard Time (AST)', short: 'AST' },
                { value: 'Pacific/Honolulu', label: 'Hawaii-Aleutian Standard Time (HST)', short: 'HST' }
              ];
              
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
                const newBirthday = `${values.month}/${values.day}/${values.year}`;
                const selectedTz = timezones.find(tz => tz.value === values.timezone);
                const newTimezoneShort = selectedTz ? selectedTz.short : 'ET';
                
                const savedData = JSON.parse(localStorage.getItem('nora_user_data'));
                savedData.birthday = newBirthday;
                savedData.timezone = values.timezone;
                savedData.timezone_short = newTimezoneShort;
                localStorage.setItem('nora_user_data', JSON.stringify(savedData));
                
                // userData도 업데이트
                userData.birthday = newBirthday;
                userData.timezone = values.timezone;
                userData.timezone_short = newTimezoneShort;
                userData.name = savedData.name;
                userData.birth_time = savedData.birth_time;
                userData.birthday_confirmed = true;
                
                await showTyping(700);
                addMessage("Updated! Want to see what today has in store for you?", 'nora');
                showChoices(['Show me today', 'Get full reading'], async (choice) => {
                  if (choice === 'Show me today') {
                    const kstData = convertToKST(userData);
                    userData = kstData;
                    await generateTodayReading(userData);
                  } else {
                    await initiatePayment(userData);
                  }
                });
              });              
            } else {
              // Go to birth time input
              userData.name = savedData.name;
              userData.birthday = savedData.birthday;
              userData.timezone = savedData.timezone;
              userData.timezone_short = savedData.timezone_short;
              userData.birthday_confirmed = true;
              // Birth time 업데이트
              await showTyping(600);
              addMessage("What's your birth time?", 'nora');
              const hours = [];
              for (let i = 1; i <= 12; i++) {
                hours.push({ value: String(i), label: String(i) });
              }
              const minutes = [];
              for (let i = 0; i < 60; i++) {
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
                const newBirthTime = `${String(hour).padStart(2, '0')}:${values.minute}`;
                // localStorage 업데이트
                const savedData = JSON.parse(localStorage.getItem('nora_user_data'));
                savedData.birth_time = newBirthTime;
                localStorage.setItem('nora_user_data', JSON.stringify(savedData));
                // userData도 업데이트
                userData.birth_time = newBirthTime;
                userData.name = savedData.name;
                userData.birthday = savedData.birthday;
                userData.timezone = savedData.timezone;
                userData.timezone_short = savedData.timezone_short;
                userData.birthday_confirmed = true;
                await showTyping(700);
                addMessage("Updated! Want to see what today has in store for you?", 'nora');
                showChoices(['Show me today', 'Get full reading'], async (choice) => {
                  if (choice === 'Show me today') {
                    const kstData = convertToKST(userData);
                    userData = kstData;
                    await generateTodayReading(userData);
                  } else {
                    await initiatePayment(userData);
                  }
                });
              });
            }
          });
        }
      });
      return;
    }
    
    // New user - start fresh
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
    
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        existingBirthTime = parsed.birth_time || 'unknown';
      } catch (e) {
        console.error('Error parsing existing data:', e);
      }
    }
    
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

  // ──────────────────────────────────────────────────────────
  // 🌟 DAILY READING FUNCTIONS
  // ──────────────────────────────────────────────────────────
  
  async function generateTodayReading(userData) {
    await showTyping(1000);
    addMessage("Let me see what's shifting in your chart today...", 'nora');
    
    // 저장된 사주 결과에서 element와 pillars 가져오기
    let element = 'Unknown';
    let pillars = null;
    
    try {
      const savedResults = localStorage.getItem('nora_saju_results');
      if (savedResults) {
        const sajuData = JSON.parse(savedResults);
        // element 추출
        if (sajuData.bubbles?.identity) {
          const elementMatch = sajuData.bubbles.identity.match(/(Yin|Yang) (Metal|Water|Wood|Fire|Earth)/);
          if (elementMatch) element = elementMatch[0];
        }
        pillars = sajuData.pillars;
      }
      
      if (!element || element === 'Unknown') {
        console.log('Element not found in saju results, trying user data...');
        const savedUserData = localStorage.getItem('nora_user_data');
        if (savedUserData) {
          const parsed = JSON.parse(savedUserData);
          if (parsed.birthday) {
            // 생년월일로 대략적인 day master element 추정
            element = estimateElementFromBirthday(parsed.birthday);
            console.log('Estimated element from birthday:', element);
          }
        }
      }
      
    } catch(e) {
      console.error('Error reading saju data:', e);
    }
    
    const todayData = {
      type: 'daily_reading',
      date: new Date().toISOString().split('T')[0],
      name: userData.name,
      element: element,
      pillars: pillars
    };
    
    console.log('Sending today data:', todayData);
    
    typing.style.display = 'flex';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todayData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      typing.style.display = 'none';
      
      if (response.ok) {
        const result = await response.json();
        console.log('Raw result:', result); 
        
        let todayReading;
        if (Array.isArray(result) && result[0]?.text) {
          const textContent = result[0].text;
          todayReading = JSON.parse(textContent);
        } else if (result.today) {
          todayReading = result;
        } else if (result.data) {
          todayReading = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        } else {
          todayReading = result;
        }
        
        await showTyping(800);
        addMessage(todayReading.today || "Today brings new energy to your path.", 'nora');
        await showTyping(600);
        addMessage("Want the full deep-dive reading?", 'nora');
     
        showChoices(['Get full reading ($8.99)', 'Maybe later'], async (choice) => {
          if (choice.includes('full reading')) {
            await initiatePayment(userData);
          } else {
            // Maybe later → 수다 플로우 시작
            await showTyping(700);
            addMessage("That's cool. Want to just chat for a bit?", 'nora');
      
            showChoices(['Sure, let\'s chat', 'Actually, I should go'], async (chatChoice) => {
              if (chatChoice === 'Sure, let\'s chat') {
                await startAdvancedChat(userData);  // ← 새 함수 호출
              } else {
                addMessage("All good. See you when you're ready! 🌙", 'nora');
              }
            });      
          }
        });
      }        
    } catch(e) {
      typing.style.display = 'none';
      if (e.name === 'AbortError') {
        await showTyping(600);
        addMessage("Reading is taking longer than expected. Let's try the full version?", 'nora');
      } else {
        await showTyping(600);
        addMessage("Something's blocking the reading today. Try the full version?", 'nora');
      }
      
      showChoices(['Try full reading', 'Start over'], async (choice) => {
        if (choice === 'Try full reading') {
          await initiatePayment(userData);
        } else {
          conversationStarted = false;
          sajuResults = null;
          localStorage.removeItem('nora_user_data');
          location.reload();
        }
      });
    }
  }

  
  function saveConversationMemory(topic, details, resolution) {

    const memory = {
       date: new Date().toDateString(),
      topic: topic,
      details: details || '',
      resolution: resolution || '',
      timestamp: Date.now(),
      category: identifyCategory(topic),
      specific_issue: extractSpecificIssue(topic)
    };
    
    localStorage.setItem('nora_conversation_memory', JSON.stringify(memory));
  }

  function extractSpecificIssue(topic) {
    const message = topic.toLowerCase();
    if (message.includes('husband') || message.includes('boyfriend')) return 'relationship';
    if (message.includes('work') || message.includes('job')) return 'work stress';
    if (message.includes('family')) return 'family issues';
    if (message.includes('tired') || message.includes('stressed')) return 'feeling overwhelmed';
    return 'personal stuff';
  }

  function identifyCategory(topic) {
    const message = topic.toLowerCase();
    if (message.includes('work') || message.includes('job')) return 'work';
    if (message.includes('relationship') || message.includes('love')) return 'relationship';
    if (message.includes('family') || message.includes('parents')) return 'family';
    if (message.includes('money') || message.includes('broke')) return 'money';
    if (message.includes('friend')) return 'friends';
    if (message.includes('stress') || message.includes('tired')) return 'stress';
    return 'general';
  }

function getConversationMemory() {
  const saved = localStorage.getItem('nora_conversation_memory');
  return saved ? JSON.parse(saved) : null;
}

function isRecentMemory(memory) {
  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  return memory.timestamp > weekAgo;
}
    
  function estimateElementFromBirthday(birthday) {
    // 간단한 연도 기반 추정 (정확하지는 않지만 fallback용)
    const year = parseInt(birthday.split('/')[2]);
    const lastDigit = year % 10;
    
    const elements = {
      0: 'Yang Metal', 1: 'Yin Metal', 
      2: 'Yang Water', 3: 'Yin Water',
      4: 'Yang Wood', 5: 'Yin Wood',
      6: 'Yang Fire', 7: 'Yin Fire',
      8: 'Yang Earth', 9: 'Yin Earth'
    };
    
    return elements[lastDigit] || 'Unknown';
  }

function convertToKST(userData) {
  // 입력 데이터 검증
  if (!userData.birthday) {
    console.error('Missing birthday data');
    return userData;
  }

  try {
    const [month, day, year] = userData.birthday.split('/').map(Number);
    
    // 유효성 검증
    if (!month || !day || !year || month > 12 || day > 31) {
      throw new Error('Invalid date format');
    }

    if (userData.birth_time === 'unknown') {
      // 시간 모를 때: 날짜만으로 pillars 계산 (00:00 KST 기준)
      const pillars = calcPillars(year, month, day, 0, 0);
      if (pillars) console.log('🀄 Pillars (no time):', pillars);
      return { ...userData, pillars };
    }
    
    // 시간 있을 때 KST 변환
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
    const hoursToAdd = kstOffset - userOffset;
    
    // Create date and add hours
    let kstDate = new Date(year, month - 1, day, hour, minute);
    kstDate.setHours(kstDate.getHours() + hoursToAdd);
    
    const kstMonth = String(kstDate.getMonth() + 1).padStart(2, '0');
    const kstDay = String(kstDate.getDate()).padStart(2, '0');
    const kstYear = kstDate.getFullYear();
    const kstHour = String(kstDate.getHours()).padStart(2, '0');
    const kstMinute = String(kstDate.getMinutes()).padStart(2, '0');
    
    console.log(`🌍 ${userData.birthday} ${userData.birth_time} ${userData.timezone_short} → ${kstMonth}/${kstDay}/${kstYear} ${kstHour}:${kstMinute} KST`);

    // pillars 계산 (KST 기준)
    const pillars = calcPillars(kstDate.getFullYear(), kstDate.getMonth()+1, kstDate.getDate(), kstDate.getHours(), kstDate.getMinutes());
    if (pillars) console.log('🀄 Pillars:', pillars);

    return {
      ...userData,
      birthday: `${kstMonth}/${kstDay}/${kstYear}`,
      birth_time: `${kstHour}:${kstMinute}`,
      timezone: 'Asia/Seoul',
      timezone_short: 'KST',
      original_timezone: userData.timezone,
      original_timezone_short: userData.timezone_short,
      pillars: pillars
    };

  } catch(e) {
    console.error('KST conversion error:', e);
    return userData; // 원본 데이터 반환
  }
}

  // PayPal 버튼 표시 함수
  function showPayPalButton(email) {
    const existingContainer = document.getElementById('paypal-button-container');
    if (existingContainer) {
      existingContainer.remove();
    }
        
    const paypalWrapper = document.createElement('div');
    paypalWrapper.id = 'paypal-button-container';
    paypalWrapper.style.cssText = 'padding: 12px 0;';
    chat.insertBefore(paypalWrapper, typing);
    scrollToBottom();

    paypal.Buttons({
      createOrder: function(data, actions) {
        console.log('🔵 Creating PayPal order...', { email, amount: '8.99' });
        return actions.order.create({
          purchase_units: [{
            amount: { value: '8.99' },
            custom_id: email
          }],
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW'
          }
        });
      },
      onApprove: function(data, actions) {
        console.log('🟢 PayPal onApprove triggered', data);
        return actions.order.capture().then(async function(details) {
          console.log('🟢 Order captured', details);
          paypalWrapper.remove();
          
          if (!sajuResults) {
            const saved = localStorage.getItem('nora_saju_results');
            if (saved) sajuResults = JSON.parse(saved);
          }
         
          // localStorage 버그 해결: pillars 없으면 다시 계산
          if (sajuResults && !sajuResults.pillars && userData?.birthday) {
            console.log('Fixing missing pillars for returning user');
            const kstData = convertToKST(userData);
            sajuResults.pillars = kstData.pillars;
            localStorage.setItem('nora_saju_results', JSON.stringify(sajuResults));
          }

          addMessage("You're all set. 🔮", 'nora');

          const elementKeys = ['Yin Metal','Yang Metal','Yin Water','Yang Water',
            'Yin Wood','Yang Wood','Yin Fire','Yang Fire','Yin Earth','Yang Earth'];
          const userElement = elementKeys.find(k =>
            sajuResults?.bubbles?.identity?.includes(k)) || 'Unknown';

          try {
            // 30초 타임아웃 설정
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            await fetch('https://hook.us2.make.com/dz3pmqu48qix5rtjadzc708ar3hhzm59', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                type: 'paid_reading',
                email: email,
                name: userData.name,
                element: userElement,
                missing_element: sajuResults?.bubbles?.missing_element
                  || sajuResults?.bubbles?.pattern?.match(/missing (?:element )?(?:is )?(\w+)/i)?.[1]
                  || sajuResults?.bubbles?.identity?.match(/lacking (\w+)|without (\w+)|no (\w+) element/i)?.slice(1).find(Boolean)
                  || '',
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
                pillar_year_tg_char: sajuResults?.pillars?.year?.tg_char || '',
                pillar_year_tg: sajuResults?.pillars?.year?.tg || '',
                pillar_year_dz_char: sajuResults?.pillars?.year?.dz_char || '',
                pillar_year_dz: sajuResults?.pillars?.year?.dz || '',
                pillar_month_tg_char: sajuResults?.pillars?.month?.tg_char || '',
                pillar_month_tg: sajuResults?.pillars?.month?.tg || '',
                pillar_month_dz_char: sajuResults?.pillars?.month?.dz_char || '',
                pillar_month_dz: sajuResults?.pillars?.month?.dz || '',
                pillar_day_tg_char: sajuResults?.pillars?.day?.tg_char || '',
                pillar_day_tg: sajuResults?.pillars?.day?.tg || '',
                pillar_day_dz_char: sajuResults?.pillars?.day?.dz_char || '',
                pillar_day_dz: sajuResults?.pillars?.day?.dz || '',
                pillar_hour_tg_char: sajuResults?.pillars?.hour?.tg_char || '',
                pillar_hour_tg: sajuResults?.pillars?.hour?.tg || '',
                pillar_hour_dz_char: sajuResults?.pillars?.hour?.dz_char || '',
                pillar_hour_dz: sajuResults?.pillars?.hour?.dz || '',
                timestamp: new Date().toISOString()
              })
            });
            
            clearTimeout(timeoutId);
            
          } catch(e) { 
            console.error('Webhook error', e);
            
            if (e.name === 'AbortError') {
              addMessage("Processing is taking longer than expected, but your payment went through. You'll get your reading soon! 📧", 'nora');
            } else {
              addMessage("Payment successful! There was a small hiccup sending your reading, but we'll get it to you shortly. 📧", 'nora');
            }
          }
          
          // Google Ads 전환추적
          gtag('event', 'purchase', {
            'transaction_id': new Date().getTime(),
            'value': 8.99,
            'currency': 'USD'
          });

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
        console.log('🔴 PayPal onError', err);
        paypalWrapper.remove();
        addMessage("Payment failed. Let's try again.", 'nora');
        setTimeout(() => {
          showChoices(['Try payment again', 'Contact support'], async (choice) => {
            if (choice === 'Try payment again') {
              showPayPalButton(email);
            } else {
              addMessage("No worries — reach out to hi@readnora.com and we'll sort this out! ✨", 'nora');
            }
          });
        }, 1000);
      },
      onCancel: function(data) {
        console.log('🟡 PayPal onCancel', data);
        paypalWrapper.remove();
        addMessage("No problem — you can try again anytime. 💜", 'nora');
        setTimeout(() => {
          showChoices(['Try payment again', 'Maybe later'], async (choice) => {
            if (choice === 'Try payment again') {
              showPayPalButton(email);
            }
          });
        }, 1000);
      }
    }).render('#paypal-button-container');

    paypalWrapper.insertAdjacentHTML('afterbegin', `
      <p style="font-size:11px;color:rgba(245,243,250,0.4);text-align:center;margin-bottom:10px;line-height:1.5;">
        By completing your purchase, you agree to our 
        <a href="/privacy" target="_blank" style="color:rgba(201,169,233,0.7);">Privacy Policy</a>
      </p>
    `);
  }

  // ──────────────────────────────────────────────────────────
  // 🔄 IMPROVED STEP8_SENDWEBHOOK - NO DAILY LIMITS FOR NEW USERS
  // ──────────────────────────────────────────────────────────

  async function step8_sendWebhook() {
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === '1';
    
    // NEW USERS: No daily limit restrictions at all
    // They get their free reading immediately
    
    await showTyping(800);
    addMessage('Give me a sec.', 'nora');

    typing.style.display = 'flex';
    scrollToBottom();

    const loadingMessages = [
      "Mapping your four pillars...",
      "Almost there..."
    ];

    let msgIndex = 0;
    const loadingInterval = setInterval(() => {
      if (msgIndex < loadingMessages.length) {
        addMessage(loadingMessages[msgIndex], 'nora');
        msgIndex++;
      }
    }, 3000);
    
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

      clearInterval(loadingInterval);
      const messages = chat.querySelectorAll('.message.nora');
      messages.forEach(msg => {
        if (msg.querySelector('.bubble')?.textContent.includes('...')) {
          msg.remove();
        }
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

      // pillars는 JS에서 계산한 값 사용 (OpenAI 계산값 덮어쓰기)
      if (kstData.pillars) {
        sajuResults.pillars = kstData.pillars;
      }

      console.log('Parsed sajuResults:', sajuResults);
      localStorage.setItem('nora_saju_results', JSON.stringify(sajuResults));
      
    } catch (error) {
      console.error('Webhook error:', error);
      
      clearInterval(loadingInterval);
      const messages = chat.querySelectorAll('.message.nora');
      messages.forEach(msg => {
        if (msg.querySelector('.bubble')?.textContent.includes('...')) {
          msg.remove();
        }
      });
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
    
    // Set last used date only AFTER successful reading
    const today = new Date().toDateString();
    if (!isTestMode) {
      localStorage.setItem('nora_last_used', today);
    }
    
    await show3Bubbles();
  }

  async function show3Bubbles() {
    if (!sajuResults || !sajuResults.bubbles) {
      await showTyping(700);
      addMessage("Sorry, I couldn't read your fortune right now.<br>Please try again.", 'nora');
      return;
    }

    const name = userData.name;

    await showTyping(700);
    addMessage(sajuResults.bubbles.identity, 'nora');

    await showTyping(800);
    addMessage("Does that sound like you?", 'nora');

    showChoices(["😮 That's exactly it", "🤔 Somewhat", "😐 Not me"], async (reaction) => {
      userData.reaction = reaction;

      if (reaction === "😐 Not me") {
        await showTyping(800);
        addMessage("Hmm, interesting. Maybe the surface description isn't landing — but your chart still has something to say.", 'nora');
        await showTyping(700);
        addMessage(sajuResults.bubbles.pattern, 'nora');
        await showTyping(700);
        addMessage(sajuResults.bubbles.action, 'nora');
        await showTyping(800);
        addMessage("Recognize any of that? Sometimes it shows up in ways we don't immediately label as 'us.'", 'nora');
        await showTyping(700);
        addMessage(`What's been sitting heaviest lately, ${name}?`, 'nora');
        showCategories(['Love', 'Money', 'Work', 'Energy'], showAreaReading);
      } else {
        await showTyping(600);
        if (reaction === "😮 That's exactly it") {
          addMessage("Your chart is unusually clear. That's rare. 🔮", 'nora');
        } else {
          addMessage("That's normal — the full reading usually fills in the gaps.", 'nora');
        }
        await proceedToPhase2(name);
      }
    });
  }

  async function proceedToPhase2(name) {
    await showTyping(800);
    addMessage(sajuResults.bubbles.pattern, 'nora');
    await showTyping(800);
    addMessage(sajuResults.bubbles.action, 'nora');
    await showTyping(800);
    addMessage("I can show you one area for free.<br>Which one speaks to you right now?", 'nora');
    showCategories(['Love', 'Money', 'Work', 'Energy'], showAreaReading);
  }

  async function showAreaReading(category) {
    await showTyping(700);
    const reading = sajuResults.categories[category];
    addMessage(reading.today, 'nora');
    await showTyping(900);
    addMessage("That's what I see for today.", 'nora');
    await showTyping(600);
    await showUpsell(userData.name);
  }

  async function checkPreviousConversation() {
    const memory = getConversationMemory();
    if (memory && isRecentMemory(memory)) {
      await showTyping(800);
      addMessage(`Hey! Last time you mentioned ${memory.specific_issue || 'personal stuff'}. How's that going?`, 'nora');
    
    showChoices(['Much better', 'Still tough', 'Let\'s talk about today'], async (choice) => {
      if (choice === 'Let\'s talk about today') {
        localStorage.removeItem('nora_conversation_memory');
        await showTyping(800);
        addMessage("Want to see what today has in store for you?", 'nora');
        
        showChoices(['Show me today', 'Get full reading'], async (choice) => {
          if (choice === 'Show me today') {
            const kstData = convertToKST(userData);
            userData = kstData;
            await generateTodayReading(userData);
          } else {
            await initiatePayment(userData);
          }
        });
      } else {
        await startAdvancedChat(userData);  // GPT가 알아서 처리
      }
    });   
    return true;
  }
  return false;
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

    await showTyping(600);
    await showUpsell(userData.name);
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

  async function startAdvancedChat(userData) {
    await showTyping(800);
    addMessage("So... what's really on your mind lately?", 'nora');
    await showTyping(500);
    addMessage("(By the way, if you want your full reading anytime, just type 'reading')", 'nora');
    showTextInput('Tell me anything...', async (userInput) => {
      if (userInput && userInput.trim()) {
        await handleAdvancedChat(userInput, userData, []);
      } else {
        await showTyping(600);
        addMessage("That's okay. Sometimes silence says enough too. 💜", 'nora');
      }
    }, true);
  }

async function handleAdvancedChat(userInput, userData, conversationHistory) {
  typing.style.display = 'flex';
  
  try {
    // 먼저 키워드 체크 (API 호출 전에)
    const readingKeywords = ['reading', 'read me', 'chart', 'saju', 'fortune', 'full reading'];
    const userMessage = userInput.toLowerCase();
    if (readingKeywords.some(keyword => userMessage.includes(keyword))) {
      typing.style.display = 'none';
      await showTyping(600);
      addMessage("Ready for your full reading? That's $8.99.", 'nora');
      
      showChoices(['Yes, show me', 'Maybe later'], async (choice) => {
        if (choice === 'Yes, show me') {
          await initiatePayment(userData);
        } else {
          await showTyping(600);
          addMessage("No worries. I'm here when you're ready! 💜", 'nora');
        }
      });
      return; // API 호출 안 함
    }

    // 🔥 키워드 없을 때만 API 호출 (try 하나로 통합)
    const chatData = {
      type: 'advanced_chat',
      user_input: userInput,
      user_name: userData.name,
      conversation_history: conversationHistory,
      nora_persona: {
        voice: "Precise, direct, unexpectedly warm Korean saju reader",
        background: "Can read people clearly, names patterns, doesn't just reflect back"
      }
    };
    
    const response = await fetch(CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatData)
    });
    
    typing.style.display = 'none';
    
    if (response.ok) {
      const result = await response.json();
      const noraResponse = result.response || "Something's not connecting right now."; // 🔥 개선된 fallback

      // 대화 히스토리 업데이트
      const newHistory = [...conversationHistory, 
        { role: 'user', content: userInput },
        { role: 'nora', content: noraResponse }
      ].slice(-20);
      
      await showTyping(800);
      
      // 🔥 8턴 후 강제 유도 (먼저 체크)
      if (newHistory.length >= 8) {
        addMessage(noraResponse, 'nora');
        await showTyping(1000);
        addMessage("You know what? Let me actually read your chart for this. Want me to show you what I see?", 'nora');
        
        showChoices(['Yes, read my chart', 'Keep talking'], async (choice) => {
          if (choice === 'Yes, read my chart') {
            await initiatePayment(userData);
          } else {
            // 🔥 개선: 재귀 대신 직접 마무리
            await showTyping(800);
            addMessage("I think your chart would give us better answers than just talking. Ready for your reading?", 'nora');
            
            showChoices(['Get my reading ($8.99)', 'Maybe later'], async (finalChoice) => {
              if (finalChoice.includes('reading')) {
                await initiatePayment(userData);
              } else {
                addMessage("All good. I'm here when you're ready! 🔮", 'nora');
              }
            });
          }
        });
        return; // 여기서 확실히 종료
      }
      
      // 6턴부터 힌트 추가
      if (newHistory.length >= 6) {
        addMessage(noraResponse + " (Want your chart? Just type 'reading')", 'nora');
      } else {
        addMessage(noraResponse, 'nora');
      }
      
      // 자유 입력 (8턴 미만에서만)
      showTextInput('Type anything...', async (nextInput) => {
        if (nextInput && nextInput.trim()) {
          const readingKeywords = ['reading', 'read me', 'chart', 'saju', 'fortune', 'full reading'];
          const userMessage = nextInput.toLowerCase();
          
          if (readingKeywords.some(keyword => userMessage.includes(keyword))) {
            await showTyping(600);
            addMessage("Ready for your full reading? That's $8.99.", 'nora');
            
            showChoices(['Yes, show me', 'Maybe later'], async (choice) => {
              if (choice === 'Yes, show me') {
                await initiatePayment(userData);
              } else {
                // 🔥 개선: 간단한 메시지로 마무리
                await showTyping(600);
                addMessage("No worries. I'm here when you're ready! 💜", 'nora');
              }
            });
          } else {
            // 대화 계속
            await handleAdvancedChat(nextInput, userData, newHistory);
          }
        } else {
          await showTyping(600);
          addMessage("I'm here when you're ready to talk. 💜", 'nora');
        }
      }, true);
      
    } else {
      throw new Error('Chat API failed');
    }
    
  } catch(e) {
    typing.style.display = 'none';
    console.error('Advanced chat error:', e);
    await showTyping(600);
    addMessage("Something's not working right now, but I'm still here.", 'nora');
  }
}
  
async function showUpsell(name) {
    await showTyping(900);
    addMessage("Over 2,400 people have read theirs this month.", 'nora');
    await showTyping(700);
    addMessage("Most say the same thing after. 'I wish I saw this sooner.' 🔮", 'nora');
    await showTyping(700);
    addMessage(`Your reading is ready, ${name}. ✨`, 'nora');
    await showTyping(800);
    addMessage("$8.99 🔮 Worth it?", 'nora');
    
    showChoices(['Yes, show me', 'Not now'], async (choice) => {
      if (choice === 'Yes, show me') {
        gtag('event', 'upsell_clicked', {
          event_category: 'conversion',
          event_label: 'yes_show_me'
        });
        await initiatePayment(userData);

      } else {
        await showTyping(700);
        addMessage("No pressure. 🫶<br>Before you go — want me to send you a weekly nudge based on your chart?<br><span style='font-size:11px;opacity:0.5;line-height:2;'>By submitting your email, you agree to our <a href='/privacy' target='_blank' style='color:#C9A9E9;'>Privacy Policy</a></span>", 'nora');
        await showTyping(500);
        showTextInput('Your email (skip if you want)', async (email) => {
          if (email && email.includes('@')) {
            const elementKeys = ['Yin Metal','Yang Metal','Yin Water','Yang Water',
              'Yin Wood','Yang Wood','Yin Fire','Yang Fire','Yin Earth','Yang Earth'];
            const userElement = elementKeys.find(k =>
              sajuResults?.bubbles?.identity?.includes(k)) || 'Unknown';

            try {
              await fetch('https://hook.us2.make.com/zkv7l1s3v1p7bwo9cc3g0ef43vfm6gtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'email_capture',
                  email: email,
                  name: userData.name,
                  element: userElement,
                  missing_element: sajuResults?.bubbles?.missing_element
                    || sajuResults?.bubbles?.pattern?.match(/missing (?:element )?(?:is )?(\w+)/i)?.[1]
                    || sajuResults?.bubbles?.identity?.match(/lacking (\w+)|without (\w+)|no (\w+) element/i)?.slice(1).find(Boolean)
                    || '',
                  birthday: userData.birthday,
                  birth_time: userData.birth_time,
                  reaction: userData.reaction || 'Unknown',
                  timestamp: new Date().toISOString()
                })
              });
            } catch(e) {
              console.error('Email capture error:', e);
            }

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

  function extractSpecificIssue(topic) {
    if (!topic) return 'general stuff';
  
    const message = topic.toLowerCase();
    if (message.includes('husband') || message.includes('boyfriend')) return 'relationship issues';
    if (message.includes('work') || message.includes('job')) return 'work stress';
    if (message.includes('family')) return 'family problems';
    if (message.includes('tired') || message.includes('stressed')) return 'feeling overwhelmed';
    return 'personal stuff';
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
