const timezones = [
    { offset: -11, city: "中途岛" },
    { offset: -10, city: "夏威夷" },
    { offset: -9, city: "阿拉斯加州" },
    { offset: -8, city: "加利福尼亚州、俄勒冈州" },
    { offset: -7, city: "科罗拉多州、新墨西哥州、亚利桑那州、怀俄明州" },
    { offset: -6, city: "得克萨斯州、密西西比州、密苏里州、路易斯安那州" },
    { offset: -5, city: "新泽西州、马萨诸塞州、宾夕法尼亚州、多伦多" },
    { offset: -4, city: "纽约、华盛顿、佛罗里达州" },
    { offset: -3, city: "巴西、阿根廷、乌拉圭" },
    { offset: -2, city: "南乔治亚岛、亚速尔群岛" },
    { offset: -1, city: "佛得角" },
    { offset: 0, city: "伦敦、格林威治时间" },
    { offset: 1, city: "德国、法国、比利时、瑞士、奥地利" },
    { offset: 2, city: "希腊、立陶宛、乌克兰" },
    { offset: 3, city: "莫斯科、以色列、土耳其" },
    { offset: 4, city: "阿联酋、沙特、伊朗" },
    { offset: 5, city: "马尔代夫、乌兹别克斯坦、巴基斯坦" },
    { offset: 6, city: "哈萨克斯坦、孟加拉、吉尔吉斯" },
    { offset: 7, city: "泰国、柬埔寨、越南" },
    { offset: 8, city: "北京、香港、台湾" },
    { offset: 9, city: "日本、韩国" },
    { offset: 10, city: "澳大利亚" },
    { offset: 11, city: "所罗门群岛" },
    { offset: 12, city: "新西兰、斐济" }
  ];

  const slider = document.getElementById("timeSlider");
  const selectedTime = document.getElementById("selectedTime");
  const tbody = document.querySelector("#timeTable tbody");
  const toggleBtn = document.getElementById("toggleFreeze");
  const currentMode = document.getElementById("currentMode");
  let followSystem = true;

  function formatDateTime(date){
    const month = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    const hour = String(date.getHours()).padStart(2,'0');
    const min = String(date.getMinutes()).padStart(2,'0');
    return `${month}月${day}日 ${hour}:${min}`;
  }

  function parseDateTime(str){
    const match = str.match(/(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})/);
    if(!match) return null;
    const [ , m, d, h, mi ] = match.map(Number);
    if(m<1||m>12||d<1||d>31||h<0||h>23||mi<0||mi>59) return null;
    return new Date(new Date().getFullYear(), m-1, d, h, mi, 0, 0);
  }

  function enterSimulateMode(){
    followSystem = false;
    currentMode.textContent = '当前模式: 模拟模式';
    toggleBtn.textContent = '回到系统时间';
  }

  function updateSliderFill() {
    const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty('--fill', percentage + '%');
  }

  function updateTimes(baseDate){
    selectedTime.textContent = `当前时间: ${formatDateTime(baseDate)}`;
    tbody.innerHTML = "";

    timezones.forEach(zone => {
      const localDate = new Date(baseDate.getTime() + (zone.offset - 8)*60*60*1000);
      const row = document.createElement('tr');
      if(zone.offset===8) row.classList.add('highlight');

      const tzCell = document.createElement('td'); tzCell.className='utc-cell'; tzCell.textContent = `UTC${zone.offset>=0? '+'+zone.offset: zone.offset}`;
      const cityCell = document.createElement('td'); cityCell.textContent = zone.city;

      const timeCell = document.createElement('td'); timeCell.className='time-cell';
      const input = document.createElement('input');
      input.type='text';
      input.value=formatDateTime(localDate);
      input.placeholder="MM月DD日 HH:mm";

      input.addEventListener('mousedown', enterSimulateMode);
      input.addEventListener('touchstart', enterSimulateMode);
      input.addEventListener('focus', enterSimulateMode);

      input.addEventListener('keydown', e=>{if(e.key==='Enter'){input.blur();}});
      input.addEventListener('blur', ()=>{
        const edited = parseDateTime(input.value);
        if(edited){
          const mm = String(edited.getMonth()+1).padStart(2,'0');
          const dd = String(edited.getDate()).padStart(2,'0');
          const hh = String(edited.getHours()).padStart(2,'0');
          const mi = String(edited.getMinutes()).padStart(2,'0');
          input.value=`${mm}月${dd}日 ${hh}:${mi}`;

          const newBase = new Date(edited.getTime() + (8-zone.offset)*60*60*1000);
          slider.value = newBase.getHours()*60 + newBase.getMinutes();
          updateSliderFill();
          updateTimes(newBase);
        } else {
          input.value = formatDateTime(localDate);
        }
      });

      timeCell.appendChild(input);
      row.appendChild(tzCell); row.appendChild(cityCell); row.appendChild(timeCell);
      tbody.appendChild(row);
    });
  }

  slider.addEventListener('input', ()=>{
    enterSimulateMode();
    const baseDate = new Date();
    baseDate.setHours(0,0,0,0);
    baseDate.setMinutes(parseInt(slider.value,10));
    updateSliderFill();
    updateTimes(baseDate);
  });

  toggleBtn.addEventListener('click', ()=>{
    followSystem = true;
    currentMode.textContent = '当前模式: 系统时间模式';
    toggleBtn.textContent = '回到系统时间';
    syncSystemTime();
  });

  function syncSystemTime(){
    if(!followSystem) return;
    const now = new Date();
    const east8Minutes = now.getUTCHours()*60 + now.getUTCMinutes() + 8*60;
    const minutes = ((east8Minutes % 1440)+1440)%1440;
    slider.value = minutes;
    updateSliderFill();
    const baseDate = new Date();
    baseDate.setHours(0,0,0,0);
    baseDate.setMinutes(minutes);
    updateTimes(baseDate);
  }

  setInterval(syncSystemTime,1000);
  syncSystemTime();