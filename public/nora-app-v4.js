(function() {
  console.log('🚀 Nora app v4 loaded');

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
      const yg = ec.getYearGan(), yz = ec.getYearZhi();
      const mg = ec.getMonthGan(), mz = ec.getMonthZhi();
      const dg = ec.getDayGan(), dz = ec.getDayZhi();
      const hg = ec.getTimeGan(), hz = ec.getTimeZhi();
      return {
        year:  { tg_char: yg, tg: GAN_EN[yg]||yg, dz_char: yz, dz: ZHI_EN[yz]||yz },
        month: { tg_char: mg, tg: GAN_EN[mg]||mg, dz_char: mz, dz: ZHI_EN[mz]||mz },
        day:   { tg_char: dg, tg: GAN_EN[dg]||dg, dz_char: dz, dz: ZHI_EN[dz]||dz },
        hour:  { tg_char: hg, tg: GAN_EN[hg]||hg, dz_char: hz, dz: ZHI_EN[hz]||hz }
      };
    } catch(e) { console.error('Pillar calc error:', e); return null; }
  }

  // ── 가격 상수 ──────────────────────────────────────────
  const PRICES = {
    qa:                 '2.00',
    sector:             '3.99',
    full_reading:       '9.00',
    compatibility:      '3.99',
    compatibility_full: '2.00'
  };

  // ── 구매 플래그 ────────────────────────────────────────
  function markFullReadingPurchased()  { localStorage.setItem('nora_purchased_full', 'true'); }
  function markLoveSectorPurchased()   { localStorage.setItem('nora_purchased_love', 'true'); }
  function hasFullReadingPurchase()    { return localStorage.getItem('nora_purchased_full') === 'true'; }
  function getCompatibilityPrice()     { return hasFullReadingPurchase() ? PRICES.compatibility_full : PRICES.compatibility; }
  function getFreeQAUsed()             { return localStorage.getItem('nora_free_qa_used') === 'true'; }
  function markFreeQAUsed()            { localStorage.setItem('nora_free_qa_used', 'true'); }
  function getPaidQAUsed()             { return localStorage.getItem('nora_paid_qa_used') === 'true'; }
  function markPaidQAUsed()            { localStorage.setItem('nora_paid_qa_used', 'true'); }

  // ── US State → Timezone 매핑 ───────────────────────────
  const STATE_TIMEZONE = {
    'AL':'America/Chicago','AK':'America/Anchorage','AZ':'America/Phoenix',
    'AR':'America/Chicago','CA':'America/Los_Angeles','CO':'America/Denver',
    'CT':'America/New_York','DE':'America/New_York','FL':'America/New_York',
    'GA':'America/New_York','HI':'Pacific/Honolulu','ID':'America/Denver',
    'IL':'America/Chicago','IN':'America/Indiana/Indianapolis','IA':'America/Chicago',
    'KS':'America/Chicago','KY':'America/New_York','LA':'America/Chicago',
    'ME':'America/New_York','MD':'America/New_York','MA':'America/New_York',
    'MI':'America/Detroit','MN':'America/Chicago','MS':'America/Chicago',
    'MO':'America/Chicago','MT':'America/Denver','NE':'America/Chicago',
    'NV':'America/Los_Angeles','NH':'America/New_York','NJ':'America/New_York',
    'NM':'America/Denver','NY':'America/New_York','NC':'America/New_York',
    'ND':'America/Chicago','OH':'America/New_York','OK':'America/Chicago',
    'OR':'America/Los_Angeles','PA':'America/New_York','RI':'America/New_York',
    'SC':'America/New_York','SD':'America/Chicago','TN':'America/Chicago',
    'TX':'America/Chicago','UT':'America/Denver','VT':'America/New_York',
    'VA':'America/New_York','WA':'America/Los_Angeles','WV':'America/New_York',
    'WI':'America/Chicago','WY':'America/Denver','DC':'America/New_York'
  };
  const STATE_SHORT = {
    'AL':'CST','AK':'AKST','AZ':'MST','AR':'CST','CA':'PST','CO':'MST',
    'CT':'EST','DE':'EST','FL':'EST','GA':'EST','HI':'HST','ID':'MST',
    'IL':'CST','IN':'EST','IA':'CST','KS':'CST','KY':'EST','LA':'CST',
    'ME':'EST','MD':'EST','MA':'EST','MI':'EST','MN':'CST','MS':'CST',
    'MO':'CST','MT':'MST','NE':'CST','NV':'PST','NH':'EST','NJ':'EST',
    'NM':'MST','NY':'EST','NC':'EST','ND':'CST','OH':'EST','OK':'CST',
    'OR':'PST','PA':'EST','RI':'EST','SC':'EST','SD':'CST','TN':'CST',
    'TX':'CST','UT':'MST','VT':'EST','VA':'EST','WA':'PST','WV':'EST',
    'WI':'CST','WY':'MST','DC':'EST'
  };
  const US_STATES = [
    {code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},
    {code:'AR',name:'Arkansas'},{code:'CA',name:'California'},{code:'CO',name:'Colorado'},
    {code:'CT',name:'Connecticut'},{code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},
    {code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},{code:'ID',name:'Idaho'},
    {code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},
    {code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},
    {code:'ME',name:'Maine'},{code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},
    {code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},{code:'MS',name:'Mississippi'},
    {code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},
    {code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},
    {code:'NM',name:'New Mexico'},{code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},
    {code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},{code:'OK',name:'Oklahoma'},
    {code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},
    {code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},
    {code:'TX',name:'Texas'},{code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},
    {code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},{code:'WV',name:'West Virginia'},
    {code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'},{code:'DC',name:'Washington D.C.'}
  ];

  // ── UI 엘리먼트 ────────────────────────────────────────
  const coverScreen  = document.getElementById('coverScreen');
  const dmScreen     = document.getElementById('dmScreen');
  const startBtn     = document.getElementById('startBtn');
  const backBtn      = document.getElementById('backBtn');
  const chat         = document.getElementById('chat');
  let   typing       = document.getElementById('typing');
  const inputArea    = document.getElementById('inputArea');
  const choices      = document.getElementById('choices');
  const categoryGrid = document.getElementById('categoryGrid');
  const textInput    = document.getElementById('textInput');
  const textField    = document.getElementById('textField');
  const sendBtn      = document.getElementById('sendBtn');
  const dropdowns    = document.getElementById('dropdowns');

  const WEBHOOK_URL      = "https://hook.us2.make.com/fjivuprpif5r1asrcclnp1lvelgcc1ms";
  const CHAT_WEBHOOK_URL = "https://hook.us2.make.com/oa5q85zc125iese4u31tmm88c7o6kz0g";
  const PAID_WEBHOOK_URL = "https://hook.us2.make.com/dz3pmqu48qix5rtjadzc708ar3hhzm59";

  let conversationStarted = false;
  let sajuResults = null;
  let userData = {
    name: '', birthday: '', birthday_confirmed: false,
    state: '', timezone: '', timezone_short: '',
    birth_time: 'unknown', reaction: '', user_intent: ''
  };

  // ── 아바타 로드 ────────────────────────────────────────
  function initAvatar() {
    const avatarImg         = document.getElementById('avatarImg');
    const avatarPlaceholder = document.getElementById('avatarPlaceholder');
    if (!avatarImg) return;
    avatarImg.onload = () => {
      avatarImg.style.display = 'block';
      if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
    };
    avatarImg.onerror = () => {
      avatarImg.style.display = 'none';
      if (avatarPlaceholder) avatarPlaceholder.style.display = 'flex';
    };
    const currentSrc = avatarImg.getAttribute('src');
    avatarImg.src = '';
    avatarImg.src = currentSrc || '/images/nora-avatar.jpg';
  }

  // ── 스크린 전환 ────────────────────────────────────────
  startBtn.addEventListener('click', function() {
    coverScreen.classList.remove('active');
    dmScreen.classList.add('active');
    if (!conversationStarted) {
      typing = document.getElementById('typing');
      initAvatar();
      startConversation();
      conversationStarted = true;
    }
  });
  backBtn.addEventListener('click', function() {
    dmScreen.classList.remove('active');
    coverScreen.classList.add('active');
  });

  // ── 유틸리티 ───────────────────────────────────────────
  function scrollToBottom() {
    chat.scrollTop = chat.scrollHeight + 100;
    setTimeout(() => { chat.scrollTop = chat.scrollHeight + 100; }, 50);
    setTimeout(() => { chat.scrollTop = chat.scrollHeight + 100; }, 200);
  }

  function addMessage(text, sender) {
    const now = new Date();
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerHTML = `<div class="bubble">${text}<span class="bubble-time">${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}</span></div>`;
    chat.insertBefore(msg, typing);
    scrollToBottom();
  }

  function showTyping(duration = 800) {
    typing.classList.add('show');
    scrollToBottom();
    return new Promise(resolve => { setTimeout(() => { typing.classList.remove('show'); resolve(); }, duration); });
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
      btn.onclick = () => { addMessage(opt, 'user'); hideAllInputs(); callback(opt); };
      choices.appendChild(btn);
    });
    choices.classList.add('show');
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
    textField.onkeypress = (e) => { if (e.key === 'Enter') handler(); };
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
        if (['month','day','year'].includes(item.id)) {
          const ph = document.createElement('option');
          ph.value = ''; ph.disabled = true; ph.selected = true;
          ph.textContent = item.id === 'month' ? 'Month' : item.id === 'day' ? 'Day' : 'Year';
          select.appendChild(ph);
        }
        item.options.forEach(opt => {
          const o = document.createElement('option');
          o.value = opt.value; o.textContent = opt.label;
          if (opt.selected) o.selected = true;
          select.appendChild(o);
        });
        rowDiv.appendChild(select);
      });
      dropdowns.appendChild(rowDiv);
    });
    const btn = document.createElement('button');
    btn.className = 'send-btn'; btn.textContent = 'Send';
    btn.style.cssText = 'width:100%;margin-top:10px;';
    btn.onclick = () => {
      const values = {};
      config.flat().forEach(item => { values[item.id] = document.getElementById(item.id).value; });
      if (values.month === '' || values.day === '' || values.year === '') { alert('Please select your birth date.'); return; }
      hideAllInputs(); callback(values);
    };
    dropdowns.appendChild(btn);
    dropdowns.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }

  function showStateDropdown(callback) {
    hideAllInputs();
    dropdowns.innerHTML = '';
    const rowDiv = document.createElement('div');
    rowDiv.className = 'dropdown-row';
    const select = document.createElement('select');
    select.id = 'state';
    const ph = document.createElement('option');
    ph.value = ''; ph.disabled = true; ph.selected = true; ph.textContent = 'Select state';
    select.appendChild(ph);
    US_STATES.forEach(s => {
      const o = document.createElement('option');
      o.value = s.code; o.textContent = s.name;
      select.appendChild(o);
    });
    rowDiv.appendChild(select);
    dropdowns.appendChild(rowDiv);
    const btn = document.createElement('button');
    btn.className = 'send-btn'; btn.textContent = 'Send';
    btn.style.cssText = 'width:100%;margin-top:10px;';
    btn.onclick = () => {
      const val = document.getElementById('state').value;
      if (!val) { alert('Please select a state.'); return; }
      hideAllInputs(); callback(val);
    };
    dropdowns.appendChild(btn);
    dropdowns.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }

  // ── 재방문 감지 ────────────────────────────────────────
  function isReturningUser() {
    try { const d = JSON.parse(localStorage.getItem('nora_user_data')||'{}'); return !!(d.name && d.birthday); }
    catch { return false; }
  }

  // ── 위치 자동 감지 ─────────────────────────────────────
  function detectTimezoneFromBrowser() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzToState = {
        'America/New_York':'NY','America/Chicago':'IL','America/Denver':'CO',
        'America/Los_Angeles':'CA','America/Anchorage':'AK','Pacific/Honolulu':'HI',
        'America/Phoenix':'AZ','America/Detroit':'MI','America/Indiana/Indianapolis':'IN'
      };
      const stateCode = tzToState[tz] || 'NY';
      return { state: stateCode, timezone: STATE_TIMEZONE[stateCode]||tz, timezone_short: STATE_SHORT[stateCode]||'EST' };
    } catch { return { state:'NY', timezone:'America/New_York', timezone_short:'EST' }; }
  }

  // ── KST 변환 ───────────────────────────────────────────
  function convertToKST(ud) {
    if (!ud.birthday) return ud;
    try {
      const [month, day, year] = ud.birthday.split('/').map(Number);
      if (!month || !day || !year) throw new Error('Invalid date');
      if (ud.birth_time === 'unknown') {
        const pillars = calcPillars(year, month, day, 0, 0);
        return { ...ud, pillars };
      }
      const [hour, minute] = ud.birth_time.split(':').map(Number);
      const offsets = {
        'America/New_York':-5,'America/Chicago':-6,'America/Denver':-7,
        'America/Los_Angeles':-8,'America/Anchorage':-9,'Pacific/Honolulu':-10,
        'America/Phoenix':-7,'America/Detroit':-5,'America/Indiana/Indianapolis':-5
      };
      const userOffset = offsets[ud.timezone] || -5;
      let kstDate = new Date(year, month-1, day, hour, minute);
      kstDate.setHours(kstDate.getHours() + (9 - userOffset));
      const pad = n => String(n).padStart(2,'0');
      const pillars = calcPillars(kstDate.getFullYear(), kstDate.getMonth()+1, kstDate.getDate(), kstDate.getHours(), kstDate.getMinutes());
      return {
        ...ud,
        birthday: `${pad(kstDate.getMonth()+1)}/${pad(kstDate.getDate())}/${kstDate.getFullYear()}`,
        birth_time: `${pad(kstDate.getHours())}:${pad(kstDate.getMinutes())}`,
        timezone: 'Asia/Seoul', timezone_short: 'KST',
        original_timezone: ud.timezone, original_timezone_short: ud.timezone_short,
        pillars
      };
    } catch(e) { console.error('KST error:', e); return ud; }
  }

  // ══════════════════════════════════════════════════════
  // 메인 대화 플로우
  // ══════════════════════════════════════════════════════

  async function startConversation() {
    if (isReturningUser()) { await returningUserFlow(); }
    else { await newUserFlow(); }
  }

  // ── 새 유저 — 이름 먼저 ────────────────────────────────
  async function newUserFlow() {
    await showTyping(700);
    addMessage("Hey. I'm Nora.", 'nora');
    await showTyping(600);
    addMessage("I read Korean saju — Four Pillars of Destiny. What should I call you?", 'nora');

    showTextInput('Your name', async (name) => {
      userData.name = name;
      await showTyping(600);
      addMessage(`Okay, ${name}. Something on your mind?`, 'nora');
      showChoices(['Yeah, I have a question', 'Not really, just curious'], async (choice) => {
        userData.user_intent = choice.includes('question') ? 'question' : 'curious';
        if (userData.user_intent === 'question') {
          await showTyping(700);
          addMessage("I'd love to help. First, I need your birth info — saju reads your energy from the exact moment you were born.", 'nora');
        } else {
          await showTyping(700);
          addMessage("Let's start with today. Give me your birth info and I'll show you what your chart looks like right now.", 'nora');
        }
        await collectBirthday();
      });
    });
  }

  // ── 생년월일 수집 ──────────────────────────────────────
  async function collectBirthday() {
    await showTyping(600);
    addMessage("What's your birthday?", 'nora');
    const months = Array.from({length:12},(_,i)=>({value:String(i+1).padStart(2,'0'),label:String(i+1).padStart(2,'0')}));
    const days   = Array.from({length:31},(_,i)=>({value:String(i+1).padStart(2,'0'),label:String(i+1).padStart(2,'0')}));
    const years  = [];
    for (let i = new Date().getFullYear(); i >= 1900; i--) years.push({value:String(i),label:String(i)});
    showDropdowns([
      [{id:'month',options:months},{id:'day',options:days},{id:'year',options:years}]
    ], async (values) => {
      userData.birthday = `${values.month}/${values.day}/${values.year}`;
      const mn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      addMessage(`${mn[parseInt(values.month)-1]} ${parseInt(values.day)}, ${values.year}`, 'user');
      await collectState();
    });
  }

  // ── State 수집 ─────────────────────────────────────────
  async function collectState() {
    await showTyping(600);
    addMessage("Do you know what state you were born in?", 'nora');
    showChoices(["Yes — I'll pick it", "Not sure"], async (choice) => {
      if (choice === "Yes — I'll pick it") {
        showStateDropdown(async (stateCode) => {
          userData.state = stateCode;
          userData.timezone = STATE_TIMEZONE[stateCode] || 'America/New_York';
          userData.timezone_short = STATE_SHORT[stateCode] || 'EST';
          addMessage(US_STATES.find(s=>s.code===stateCode)?.name||stateCode, 'user');
          await collectBirthTime();
        });
      } else {
        // ✅ 브라우저 timezone 자동 감지
        const detected = detectTimezoneFromBrowser();
        userData.state = detected.state;
        userData.timezone = detected.timezone;
        userData.timezone_short = detected.timezone_short;
        await showTyping(500);
        addMessage("No worries — I'll estimate based on your location.", 'nora');
        await collectBirthTime();
      }
    });
  }

  // ── 생시 수집 ──────────────────────────────────────────
  async function collectBirthTime() {
    await showTyping(600);
    addMessage("What time were you born? If you don't know, that's okay.", 'nora');
    showChoices(['I know the time', "I don't know"], async (choice) => {
      if (choice === 'I know the time') {
        const hours   = Array.from({length:12},(_,i)=>({value:String(i+1),label:String(i+1)}));
        const minutes = Array.from({length:60},(_,i)=>({value:String(i).padStart(2,'0'),label:String(i).padStart(2,'0')}));
        const ampm    = [{value:'AM',label:'AM'},{value:'PM',label:'PM'}];
        showDropdowns([[{id:'hour',options:hours},{id:'minute',options:minutes},{id:'ampm',options:ampm}]], async (values) => {
          let h = parseInt(values.hour);
          if (values.ampm === 'PM' && h !== 12) h += 12;
          if (values.ampm === 'AM' && h === 12) h = 0;
          userData.birth_time = `${String(h).padStart(2,'0')}:${values.minute}`;
          addMessage(`${values.hour}:${values.minute} ${values.ampm}`, 'user');
          await confirmBirthData();
        });
      } else {
        userData.birth_time = 'unknown';
        await confirmBirthData();
      }
    });
  }

  // ── 확인 1회 ───────────────────────────────────────────
  async function confirmBirthData() {
    await showTyping(700);
    const mn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const parts = userData.birthday.split('/');
    const prettyDate = `${mn[parseInt(parts[0])-1]} ${parseInt(parts[1])}, ${parts[2]}`;
    const timeStr = userData.birth_time === 'unknown' ? 'time unknown' : (() => {
      const h24 = parseInt(userData.birth_time.split(':')[0]);
      const min = userData.birth_time.split(':')[1];
      const h12 = h24 === 0 ? 12 : h24 > 12 ? h24-12 : h24;
      return `${h12}:${min} ${h24 >= 12 ? 'PM' : 'AM'}`;
    })();
    const stateName = userData.state ? `, ${US_STATES.find(s=>s.code===userData.state)?.name||userData.state}` : '';
    addMessage(`Got it — ${prettyDate}${stateName}, ${timeStr}. That right?`, 'nora');
    showChoices(['Yes', 'Fix it'], async (choice) => {
      if (choice === 'Yes') {
        userData.birthday_confirmed = true;
        localStorage.setItem('nora_user_data', JSON.stringify({
          name: userData.name, birthday: userData.birthday, state: userData.state,
          timezone: userData.timezone, timezone_short: userData.timezone_short, birth_time: userData.birth_time
        }));
        await loadingAndReading();
      } else {
        // ✅ 수정 항목만 선택해서 고치기
        await showTyping(500);
        addMessage("What would you like to fix?", 'nora');
        showChoices(['Birthday', 'Birth time', 'State'], async (fixChoice) => {
          if (fixChoice === 'Birthday')         await collectBirthday();
          else if (fixChoice === 'Birth time')  await collectBirthTime();
          else                                  await collectState();
        });
      }
    });
  }

  // ── 로딩 + 사주 계산 ──────────────────────────────────
  async function loadingAndReading() {
    await showTyping(800);
    addMessage('Give me a sec.', 'nora');
    await showTyping(1000);
    addMessage('Reading your chart...', 'nora');
    typing.style.display = 'flex';
    try {
      const kstData = convertToKST(userData);
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(kstData)
      });
      typing.style.display = 'none';
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.success && result.data)  sajuResults = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      else if (result.reading)            sajuResults = typeof result.reading === 'string' ? JSON.parse(result.reading) : result.reading;
      else                                sajuResults = result;
      if (kstData.pillars) sajuResults.pillars = kstData.pillars;
      localStorage.setItem('nora_saju_results', JSON.stringify(sajuResults));
    } catch(e) {
      typing.style.display = 'none';
      await showTyping(700);
      addMessage("Something didn't connect. Want to try again?", 'nora');
      showChoices(['Try again'], () => location.reload());
      return;
    }

    // Identity bubble
    await showTyping(700);
    addMessage(sajuResults.bubbles.identity, 'nora');

    if (userData.user_intent === 'question') {
      // ✅ 질문 받기
      await showTyping(700);
      addMessage("Now — what's your question?", 'nora');
      showTextInput('Ask anything...', async (question) => { await handleFreeQA(question); });
    } else {
      await showTyping(700);
      addMessage("How did that land?", 'nora');
      showChoices(["That's exactly it", 'Somewhat', 'Not really me'], async (reaction) => {
        userData.reaction = reaction;
        await showTyping(600);
        if (reaction === 'Not really me') addMessage("Fair. The overview doesn't always hit right away. Let me show you something more specific.", 'nora');
        else addMessage("I thought so. There's more.", 'nora');
        await showMainOptions(false);
      });
    }
  }

  // ══════════════════════════════════════════════════════
  // Q&A 플로우
  // ══════════════════════════════════════════════════════

  async function handleFreeQA(question) {
    markFreeQAUsed();
    typing.style.display = 'flex';
    try {
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          type: 'qa_free', user_input: question, user_name: userData.name,
          element: sajuResults?.pillars?.day?.tg || 'Unknown',
          bubble_identity: sajuResults?.bubbles?.identity || '',
          missing_element: sajuResults?.bubbles?.missing_element || ''
        })
      });
      typing.style.display = 'none';
      if (response.ok) {
        const result = await response.json();
        const answer = result.response || result.answer || "Let me think about that.";
        await showTyping(900);
        addMessage(`Hmm, that's what you're wondering about.`, 'nora');
        await showTyping(800);
        addMessage(answer, 'nora');
      }
    } catch(e) { typing.style.display = 'none'; }

    // ✅ 핑퐁 1번 — 사용자 반응 받기
    await showTyping(700);
    addMessage("Does that resonate?", 'nora');
    showTextInput('Tell me what you think...', async (userResponse) => {
      await showTyping(700);
      addMessage("I hear you.", 'nora');
      await showTyping(900);
      addMessage("Reading your chart is actually my job — so I should mention, going deeper does come with a small fee. In Korean tradition, 복채 — paying the fortune teller — is what seals the good energy in. 😌", 'nora');
      await showTyping(700);
      addMessage("Want to explore a specific area?", 'nora');
      await showMainOptions(false);
    }, true);
  }

  async function initiateQAPayment(question) {
    markPaidQAUsed();
    showPayPalButtonInline(PRICES.qa, async () => {
      typing.style.display = 'flex';
      try {
        const response = await fetch(CHAT_WEBHOOK_URL, {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            type: 'qa_paid', user_input: question, user_name: userData.name,
            element: sajuResults?.pillars?.day?.tg || 'Unknown',
            bubble_identity: sajuResults?.bubbles?.identity || '',
            missing_element: sajuResults?.bubbles?.missing_element || ''
          })
        });
        typing.style.display = 'none';
        if (response.ok) {
          const result = await response.json();
          const answer = result.response || result.answer || "Let me think about that.";
          await showTyping(900);
          addMessage("Good question.", 'nora');
          await showTyping(800);
          addMessage(answer, 'nora');
        }
      } catch(e) { typing.style.display = 'none'; }
      await showTyping(700);
      await showMainOptions(true);
    });
  }

  // ── 메인 옵션 ──────────────────────────────────────────
  async function showMainOptions(hasAskedQuestion) {
    hideAllInputs();
    choices.innerHTML = '';

    if (!hasAskedQuestion) {
      const freeUsed = getFreeQAUsed();
      const paidUsed = getPaidQAUsed();
      if (!freeUsed) {
        // 무료 Q&A 버튼 (curious 선택한 신규 유저용)
        const qaBtn = document.createElement('button');
        qaBtn.className = 'choice-btn';
        qaBtn.textContent = 'Ask a question — free';
        qaBtn.onclick = async () => {
          addMessage('Ask a question', 'user'); hideAllInputs();
          await showTyping(600);
          addMessage("What do you want to know?", 'nora');
          showTextInput('Ask anything...', async (q) => { await handleFreeQA(q); });
        };
        choices.appendChild(qaBtn);
      } else if (!paidUsed) {
        // 유료 Q&A 버튼
        const qaBtn = document.createElement('button');
        qaBtn.className = 'choice-btn';
        qaBtn.textContent = `Ask another question — $${PRICES.qa}`;
        qaBtn.onclick = async () => {
          addMessage(`Ask another question`, 'user'); hideAllInputs();
          await showTyping(600);
          addMessage("What do you want to know?", 'nora');
          showTextInput('Ask anything...', async (q) => { await initiateQAPayment(q); });
        };
        choices.appendChild(qaBtn);
      }
    }

    const sectorBtn = document.createElement('button');
    sectorBtn.className = 'choice-btn';
    sectorBtn.textContent = `Show me a specific area — $${PRICES.sector}`;
    sectorBtn.onclick = async () => { addMessage('Show me a specific area', 'user'); hideAllInputs(); await showSectorSelection(); };
    choices.appendChild(sectorBtn);

    const fullBtn = document.createElement('button');
    fullBtn.className = 'choice-btn';
    fullBtn.textContent = `Give me everything — $${PRICES.full_reading}`;
    fullBtn.style.cssText = `background:linear-gradient(135deg,rgba(201,169,233,0.25),rgba(232,180,211,0.25));border:1px solid rgba(201,169,233,0.4);`;
    fullBtn.onclick = async () => {
      addMessage('Give me everything', 'user'); hideAllInputs();
      await showTyping(700);
      addMessage("Your full reading covers who you actually are underneath all the adapting, the pattern you keep repeating and why — and one thing I can't say here.", 'nora');
      await initiatePayment(userData, PRICES.full_reading, 'paid_reading', '');
    };
    choices.appendChild(fullBtn);

    choices.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }

  async function showSectorSelection() {
    await showTyping(600);
    addMessage("Four areas. Pick one.", 'nora');
    showChoices([
      `❤️ Love — your patterns, your blindspots, and when that changes`,
      `💰 Money — why money flows the way it does, and when it shifts`,
      `💼 Work — where your energy is wasted and where it compounds`,
      `⚡ Energy — your body, your rhythm, and what drains you`
    ], async (choice) => {
      const cat = choice.includes('Love')?'Love':choice.includes('Money')?'Money':choice.includes('Work')?'Work':'Energy';
      await showTyping(600);
      addMessage(`${cat} — got it. Where should I send it?`, 'nora');
      await initiatePayment(userData, PRICES.sector, 'category_reading', cat);
    });
  }

  // ══════════════════════════════════════════════════════
  // 재방문 유저
  // ══════════════════════════════════════════════════════

  async function returningUserFlow() {
    const saved = JSON.parse(localStorage.getItem('nora_user_data')||'{}');
    userData.name = saved.name||''; userData.birthday = saved.birthday||'';
    userData.state = saved.state||''; userData.timezone = saved.timezone||'America/New_York';
    userData.timezone_short = saved.timezone_short||'EST'; userData.birth_time = saved.birth_time||'unknown';
    userData.birthday_confirmed = true;
    const sr = localStorage.getItem('nora_saju_results');
    if (sr) { try { sajuResults = JSON.parse(sr); } catch {} }

    await showTyping(650);
    addMessage(`Hey ${saved.name}.`, 'nora');
    await showTyping(600);

    // ✅ 생년월일 확인
    const mn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const parts = saved.birthday.split('/');
    const prettyDate = `${mn[parseInt(parts[0])-1]} ${parseInt(parts[1])}, ${parts[2]}`;
    const timeStr = saved.birth_time === 'unknown' ? 'time unknown' : (() => {
      const h24 = parseInt(saved.birth_time.split(':')[0]);
      const min = saved.birth_time.split(':')[1];
      const h12 = h24 === 0 ? 12 : h24 > 12 ? h24-12 : h24;
      return `${h12}:${min} ${h24 >= 12 ? 'PM' : 'AM'}`;
    })();
    addMessage(`Still ${prettyDate}, ${timeStr}?`, 'nora');

    showChoices(['Yes', 'Update it'], async (choice) => {
      if (choice === 'Update it') {
        await showTyping(500);
        addMessage("What would you like to update?", 'nora');
        showChoices(['Birthday', 'Birth time', 'State'], async (fixChoice) => {
          if (fixChoice === 'Birthday')         await collectBirthday();
          else if (fixChoice === 'Birth time')  await collectBirthTime();
          else                                  await collectState();
        });
        return;
      }

      await showTyping(600);
      addMessage("What do you want to do today?", 'nora');
      // ✅ 재방문: show me today / ask a question만
      showChoices(['Show me today', 'Ask a question'], async (mainChoice) => {
        if (mainChoice === 'Show me today') {
          const kstData = convertToKST(userData);
          userData = { ...userData, ...kstData };
          await generateTodayReading(userData);
        } else {
          // 재방문자 Q&A — 유료만 (무료 없음)
          if (getPaidQAUsed()) {
            await showTyping(600);
            addMessage("You've used your question for today. Want to explore a specific area instead?", 'nora');
            await showDeeperOptions();
            return;
          }
          await showTyping(600);
          addMessage("What do you want to know?", 'nora');
          showTextInput('Ask anything...', async (q) => { await initiateQAPayment(q); });
        }
      });
    });
  }

  // ══════════════════════════════════════════════════════
  // Daily Reading
  // ══════════════════════════════════════════════════════

  async function generateTodayReading(ud) {
    const today = new Date().toDateString();
    const cacheKey = `daily_reading_${ud.name}_${today}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      await showTyping(800);
      addMessage(JSON.parse(cached).today, 'nora');
      await showDailyReadingReaction();
      return;
    }
    await showTyping(1000);
    addMessage("Let me see what's shifting in your chart today...", 'nora');
    let element = 'Unknown', pillars = null;
    try {
      const sr = localStorage.getItem('nora_saju_results');
      if (sr) { const d = JSON.parse(sr); element = d.pillars?.day?.tg||'Unknown'; pillars = d.pillars; }
      if (!pillars && ud?.birthday) { const kd = convertToKST(ud); pillars = kd.pillars; element = pillars?.day?.tg||'Unknown'; }
    } catch {}
    typing.style.display = 'flex';
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 15000);
      const response = await fetch(WEBHOOK_URL, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ type:'daily_reading', date: new Date().toISOString().split('T')[0], name: ud.name, element, pillars }),
        signal: ctrl.signal
      });
      clearTimeout(tid);
      typing.style.display = 'none';
      if (response.ok) {
        const result = await response.json();
        let todayReading;
        if (Array.isArray(result) && result[0]?.text) todayReading = JSON.parse(result[0].text);
        else if (result.today) todayReading = result;
        else if (result.data) todayReading = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        else todayReading = result;
        localStorage.setItem(cacheKey, JSON.stringify(todayReading));
        await showTyping(800);
        addMessage(todayReading.today || "Today brings new energy to your path.", 'nora');
        await showDailyReadingReaction();
      }
    } catch(e) {
      typing.style.display = 'none';
      await showTyping(600);
      addMessage("Something's blocking today's reading. Want to go deeper instead?", 'nora');
      await showDeeperOptions();
    }
  }

  // ✅ Daily reading 후 반응 물어보고 → 자연스럽게 유도
  async function showDailyReadingReaction() {
    await showTyping(700);
    addMessage("How's that sitting with you?", 'nora');
    showChoices(['I want to know more', 'Okay, got it'], async (choice) => {
      if (choice === 'I want to know more') {
        await showTyping(600);
        addMessage("What do you want to explore? You can go area by area, or get a full reading that covers everything.", 'nora');
        await showDeeperOptions();
      } else {
        await showTyping(700);
        addMessage("Anything else on your mind?", 'nora');
        showChoices(['Actually, I want to know more', "I'm good"], async (c) => {
          if (c === 'Actually, I want to know more') { await showDeeperOptions(); }
          else {
            await showTyping(500);
            addMessage("Take care of yourself. Your chart is watching.", 'nora');
          }
        });
      }
    });
  }

  // ✅ Deeper options — 섹터 + full reading만
  async function showDeeperOptions() {
    await showTyping(600);
    addMessage("Which area do you want to explore?", 'nora');
    hideAllInputs();
    choices.innerHTML = '';
    ['Love','Money','Work','Energy'].forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = `${cat} — $${PRICES.sector}`;
      btn.onclick = async () => {
        addMessage(cat, 'user'); hideAllInputs();
        await showTyping(600);
        addMessage(`${cat} — got it. Where should I send it?`, 'nora');
        await initiatePayment(userData, PRICES.sector, 'category_reading', cat);
      };
      choices.appendChild(btn);
    });
    const fullBtn = document.createElement('button');
    fullBtn.className = 'choice-btn';
    fullBtn.textContent = `Full reading — $${PRICES.full_reading}`;
    fullBtn.style.cssText = `background:linear-gradient(135deg,rgba(201,169,233,0.25),rgba(232,180,211,0.25));border:1px solid rgba(201,169,233,0.4);width:100%;margin-top:4px;`;
    fullBtn.onclick = async () => {
      addMessage('Full reading', 'user'); hideAllInputs();
      await showTyping(700);
      addMessage("Your full reading covers who you actually are underneath all the adapting, the pattern you keep repeating and why — and one thing I can't say here.", 'nora');
      await initiatePayment(userData, PRICES.full_reading, 'paid_reading', '');
    };
    choices.appendChild(fullBtn);
    choices.classList.add('show');
    inputArea.classList.add('show');
    scrollToBottom();
  }

  // ══════════════════════════════════════════════════════
  // 결제
  // ══════════════════════════════════════════════════════

  // ✅ 이메일 입력 → Perfect → 바로 PayPal 버튼
  async function initiatePayment(ud, amount, type, category) {
    await showTyping(500);
    addMessage("Where should I send it? 📩", 'nora');
    const askEmail = async () => {
      showTextInput('Your email', async (email) => {
        if (!email || !email.includes('@')) {
          await showTyping(400); addMessage("That doesn't look right — try again?", 'nora');
          askEmail(); return;
        }
        hideAllInputs();
        await showTyping(400);
        addMessage("Perfect.", 'nora');
        showPayPalButton(email, amount, type, category);
      }, false);
    };
    askEmail();
  }

  function showPayPalButton(email, amount, type, category, onSuccessCallback) {
    const existing = document.getElementById('paypal-button-container');
    if (existing) existing.remove();
    const wrapper = document.createElement('div');
    wrapper.id = 'paypal-button-container';
    wrapper.style.cssText = 'padding:12px 0;';
    chat.insertBefore(wrapper, typing);
    scrollToBottom();
    paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{ amount: { value: amount }, custom_id: email }],
        application_context: { shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' }
      }),
      onApprove: (data, actions) => actions.order.capture().then(async (details) => {
        wrapper.remove();
        if (type === 'paid_reading') markFullReadingPurchased();
        if (type === 'category_reading' && category === 'Love') markLoveSectorPurchased();
        if (onSuccessCallback) { onSuccessCallback(); return; }
        addMessage("You're all set. 🔮", 'nora');
        if (!sajuResults) { const s = localStorage.getItem('nora_saju_results'); if (s) sajuResults = JSON.parse(s); }
        if (sajuResults && !sajuResults.pillars && userData?.birthday) {
          sajuResults.pillars = convertToKST(userData).pillars;
          localStorage.setItem('nora_saju_results', JSON.stringify(sajuResults));
        }
        const userElement = sajuResults?.pillars?.day?.tg || 'Unknown';
        try {
          const ctrl = new AbortController();
          const tid = setTimeout(() => ctrl.abort(), 30000);
          await fetch(PAID_WEBHOOK_URL, {
            method:'POST', headers:{'Content-Type':'application/json'}, signal: ctrl.signal,
            body: JSON.stringify(
              type === 'category_reading'
                ? { type:'category_reading', category, ...buildBasePayload(email, userElement) }
                : { type:'paid_reading', ...buildBasePayload(email, userElement) }
            )
          });
          clearTimeout(tid);
        } catch(e) { console.error('Webhook error:', e); }

        await showTyping(900);
        if (type === 'category_reading') {
          addMessage(`Your ${category} reading is on its way — check your email. ✨`, 'nora');
          if (category === 'Love') {
            await showTyping(700);
            addMessage("By the way — if there's someone specific, I can read you both together.", 'nora');
            showChoices(['Show me our compatibility', 'Maybe later'], async (c) => {
              if (c === 'Show me our compatibility') await showCompatibilityTeaser();
              else await postPurchaseFlow();
            });
            return;
          }
        } else {
          addMessage("Your reading is on its way.", 'nora');
          await showTyping(600);
          addMessage("Most people open it three times.", 'nora');
          await showTyping(700);
          addMessage("One more thing — if there's someone specific on your mind, I can read you both together.", 'nora');
          showChoices([`Show me our compatibility — $${PRICES.compatibility_full}`, 'Not right now'], async (nc) => {
            if (nc.includes('compatibility')) await showCompatibilityTeaser();
            else await postPurchaseFlow();
          });
          return;
        }
        await postPurchaseFlow();
      }),
      onError: (err) => {
        wrapper.remove();
        addMessage("Payment didn't go through. Let's try again.", 'nora');
        setTimeout(() => { showChoices(['Try again','Maybe later'], async (c) => { if (c==='Try again') showPayPalButton(email,amount,type,category,onSuccessCallback); }); }, 800);
      },
      onCancel: () => {
        wrapper.remove();
        addMessage("No problem — anytime. 💜", 'nora');
        setTimeout(() => { showChoices(['Try again','Maybe later'], async (c) => { if (c==='Try again') showPayPalButton(email,amount,type,category,onSuccessCallback); }); }, 800);
      }
    }).render('#paypal-button-container');
    wrapper.insertAdjacentHTML('afterbegin', `<p style="font-size:11px;color:rgba(245,243,250,0.4);text-align:center;margin-bottom:10px;line-height:1.5;">By completing your purchase, you agree to our <a href="/privacy" target="_blank" style="color:rgba(201,169,233,0.7);">Privacy Policy</a></p>`);
  }

  function showPayPalButtonInline(amount, onSuccessCallback) {
    const existing = document.getElementById('paypal-button-container');
    if (existing) existing.remove();
    const wrapper = document.createElement('div');
    wrapper.id = 'paypal-button-container';
    wrapper.style.cssText = 'padding:12px 0;';
    chat.insertBefore(wrapper, typing);
    scrollToBottom();
    paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{ amount: { value: amount } }],
        application_context: { shipping_preference:'NO_SHIPPING', user_action:'PAY_NOW' }
      }),
      onApprove: (data, actions) => actions.order.capture().then(async () => {
        wrapper.remove();
        addMessage("You're all set. 🔮", 'nora');
        if (onSuccessCallback) onSuccessCallback();
      }),
      onError: () => { wrapper.remove(); addMessage("Payment didn't go through.", 'nora'); },
      onCancel: () => { wrapper.remove(); addMessage("No problem — anytime. 💜", 'nora'); }
    }).render('#paypal-button-container');
  }

  async function postPurchaseFlow() {
    await showTyping(700);
    addMessage("Want me to check in with you? I send something worth reading once a week.", 'nora');
    showChoices(['Yes, send it', 'No thanks'], async (choice) => {
      if (choice === 'Yes, send it') {
        await showTyping(500);
        addMessage("What's your email?", 'nora');
        showTextInput('Your email', async (email) => {
          if (email && email.includes('@')) {
            try { await fetch('https://hook.us2.make.com/zkv7l1s3v1p7bwo9cc3g0ef43vfm6gtp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'weekly_subscribe', email, name: userData.name, element: sajuResults?.pillars?.day?.tg||'Unknown', timestamp: new Date().toISOString() }) }); } catch {}
            await showTyping(500);
            addMessage("Got it. I'll be in touch.", 'nora');
          }
          await showTyping(500);
          addMessage("Take care of yourself. Your chart is watching.", 'nora');
        }, false);
      } else {
        await showTyping(500);
        addMessage("Take care of yourself. Your chart is watching.", 'nora');
      }
    });
  }

  function buildBasePayload(email, userElement) {
    return {
      email, name: userData.name, element: userElement,
      missing_element: sajuResults?.bubbles?.missing_element||'',
      birthday: userData.birthday, birth_time: userData.birth_time,
      reaction: userData.reaction||'Unknown',
      element_slug: userElement.toLowerCase().replace(/ /g,'_'),
      bubble_identity: sajuResults?.bubbles?.identity||'',
      bubble_pattern:  sajuResults?.bubbles?.pattern||'',
      bubble_action:   sajuResults?.bubbles?.action||'',
      compat_1: sajuResults?.bubbles?.compatible_elements?.[0]||'',
      compat_2: sajuResults?.bubbles?.compatible_elements?.[1]||'',
      compat_3: sajuResults?.bubbles?.compatible_elements?.[2]||'',
      love_today:   sajuResults?.categories?.Love?.today||'',   love_month: sajuResults?.categories?.Love?.this_month||'',   love_year: sajuResults?.categories?.Love?.this_year||'',
      money_today:  sajuResults?.categories?.Money?.today||'',  money_month: sajuResults?.categories?.Money?.this_month||'', money_year: sajuResults?.categories?.Money?.this_year||'',
      work_today:   sajuResults?.categories?.Work?.today||'',   work_month: sajuResults?.categories?.Work?.this_month||'',   work_year: sajuResults?.categories?.Work?.this_year||'',
      energy_today: sajuResults?.categories?.Energy?.today||'', energy_month: sajuResults?.categories?.Energy?.this_month||'', energy_year: sajuResults?.categories?.Energy?.this_year||'',
      pillar_year_tg:  sajuResults?.pillars?.year?.tg||'',  pillar_year_dz:  sajuResults?.pillars?.year?.dz||'',
      pillar_month_tg: sajuResults?.pillars?.month?.tg||'', pillar_month_dz: sajuResults?.pillars?.month?.dz||'',
      pillar_day_tg:   sajuResults?.pillars?.day?.tg||'',   pillar_day_dz:   sajuResults?.pillars?.day?.dz||'',
      pillar_hour_tg:  sajuResults?.pillars?.hour?.tg||'',  pillar_hour_dz:  sajuResults?.pillars?.hour?.dz||'',
      timestamp: new Date().toISOString()
    };
  }

  // ══════════════════════════════════════════════════════
  // 궁합
  // ══════════════════════════════════════════════════════

  async function showCompatibilityTeaser() {
    await showTyping(600);
    addMessage("You give me their birthday — and state if you have it. I read both charts together. Where your energies sync, where they don't, and when things shift between you.", 'nora');
    const price = getCompatibilityPrice();
    showChoices([`Let's do it — $${price}`, 'Maybe later'], async (choice) => {
      if (choice.includes("do it")) await collectCompatibilityData();
      else await postPurchaseFlow();
    });
  }

  async function collectCompatibilityData() {
    await showTyping(600);
    addMessage("What do you call them?", 'nora');
    showTextInput("Their name or nickname", async (theirName) => {
      await showTyping(500);
      addMessage("Do you know their birthday?", 'nora');
      showChoices(['Yes, I have it', 'No'], async (choice) => {
        if (choice === 'No') { await showTyping(500); addMessage("Come back when you have it — your chart isn't going anywhere.", 'nora'); return; }
        const months = Array.from({length:12},(_,i)=>({value:String(i+1).padStart(2,'0'),label:String(i+1).padStart(2,'0')}));
        const days   = Array.from({length:31},(_,i)=>({value:String(i+1).padStart(2,'0'),label:String(i+1).padStart(2,'0')}));
        const years  = [];
        for (let i = new Date().getFullYear(); i >= 1900; i--) years.push({value:String(i),label:String(i)});
        showDropdowns([
          [{id:'month',options:months},{id:'day',options:days},{id:'year',options:years}]
        ], async (values) => {
          const theirBirthday = `${values.month}/${values.day}/${values.year}`;
          const mn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          addMessage(`${mn[parseInt(values.month)-1]} ${parseInt(values.day)}, ${values.year}`, 'user');
          await showTyping(500);
          addMessage("Do you know what state they were born in?", 'nora');
          showChoices(["Yes — I'll pick it", "Not sure"], async (stChoice) => {
            let theirTimezone = 'America/New_York';
            if (stChoice === "Yes — I'll pick it") {
              showStateDropdown(async (stateCode) => {
                theirTimezone = STATE_TIMEZONE[stateCode]||'America/New_York';
                addMessage(US_STATES.find(s=>s.code===stateCode)?.name||stateCode, 'user');
                await proceedCompatibilityPayment(theirName, theirBirthday, theirTimezone);
              });
            } else {
              await proceedCompatibilityPayment(theirName, theirBirthday, theirTimezone);
            }
          });
        });
      });
    });
  }

  async function proceedCompatibilityPayment(theirName, theirBirthday, theirTimezone) {
    await showTyping(800);
    addMessage(`Reading ${theirName}'s chart...`, 'nora');
    await showTyping(900);
    addMessage("Mapping how your energies interact...", 'nora');
    await showTyping(900);
    addMessage("Finding the pattern between you two...", 'nora');
    await showTyping(700);
    addMessage(`I can see why you're asking about ${theirName}. Your charts have a very specific dynamic — and it's not what most people would expect.`, 'nora');
    const price = getCompatibilityPrice();
    showChoices([`Get the full compatibility reading — $${price}`], async () => {
      await showTyping(500);
      addMessage("Where should I send it? 📩", 'nora');
      showTextInput('Your email', async (email) => {
        if (!email || !email.includes('@')) { addMessage("Try that again?", 'nora'); return; }
        hideAllInputs();
        await showTyping(400);
        addMessage("Perfect.", 'nora');
        showPayPalButton(email, price, 'compatibility_reading', '', async () => {
          const userElement = sajuResults?.pillars?.day?.tg||'Unknown';
          try {
            await fetch(PAID_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ type:'compatibility_reading', their_name: theirName, their_birthday: theirBirthday, their_timezone: theirTimezone, ...buildBasePayload(email, userElement) })
            });
          } catch(e) { console.error(e); }
          await showTyping(700);
          addMessage("Your compatibility reading is on its way. Check your inbox.", 'nora');
          await showTyping(500);
          addMessage("Take care of yourself. Your chart is watching.", 'nora');
        });
      }, false);
    });
  }

  // ── 상태바 / 비디오 ────────────────────────────────────
  function updateStatusTime() {
    const el = document.getElementById('statusTime');
    if (el) { const now = new Date(); el.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`; }
  }
  updateStatusTime();
  setInterval(updateStatusTime, 60000);

  const heroVideo = document.getElementById('heroVideo');
  const heroPlaceholder = document.getElementById('heroPlaceholder');
  if (heroVideo) {
    heroVideo.addEventListener('loadeddata', () => { if(heroPlaceholder) heroPlaceholder.style.display='none'; });
    heroVideo.addEventListener('error',      () => { if(heroPlaceholder) heroPlaceholder.style.display='flex'; });
  }

  console.log('✅ Nora v4 initialized');
})();
