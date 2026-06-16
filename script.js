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
const timezoneSelect = document.getElementById("timezoneSelect");

let followSystem = true;
let currentInstant = new Date();
let selectedOffset = detectSupportedSystemOffset();

function formatOffset(offset) {
  return `UTC ${offset >= 0 ? `+${offset}` : offset}`;
}

function detectSupportedSystemOffset() {
  const systemOffset = -new Date().getTimezoneOffset() / 60;
  return timezones.reduce((nearest, zone) => {
    return Math.abs(zone.offset - systemOffset) < Math.abs(nearest - systemOffset)
      ? zone.offset
      : nearest;
  }, timezones[0].offset);
}

function getZone(offset) {
  return timezones.find(zone => zone.offset === offset) || timezones[0];
}

function getDateAtOffset(instant, offset) {
  return new Date(instant.getTime() + offset * 60 * 60 * 1000);
}

function formatDateTime(instant, offset) {
  const shifted = getDateAtOffset(instant, offset);
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  const hour = String(shifted.getUTCHours()).padStart(2, "0");
  const min = String(shifted.getUTCMinutes()).padStart(2, "0");
  return `${month}月${day}日 ${hour}:${min}`;
}

function formatDateTimeWithYear(instant, offset) {
  const shifted = getDateAtOffset(instant, offset);
  const year = shifted.getUTCFullYear();
  return `${year}年${formatDateTime(instant, offset)}`;
}

function parseDateTime(str, zoneOffset) {
  const match = str.match(/(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})/);
  if (!match) return null;

  const [, m, d, h, mi] = match.map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23 || mi < 0 || mi > 59) {
    return null;
  }

  const currentYearAtZone = getDateAtOffset(currentInstant, zoneOffset).getUTCFullYear();
  const utcTime = Date.UTC(currentYearAtZone, m - 1, d, h, mi, 0, 0) - zoneOffset * 60 * 60 * 1000;
  return new Date(utcTime);
}

function enterSimulateMode() {
  followSystem = false;
  currentMode.textContent = "当前模式: 模拟模式";
  toggleBtn.textContent = "回到系统时间";
}

function updateSliderFill() {
  const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.setProperty("--fill", `${percentage}%`);
}

function updateSliderFromInstant() {
  const selectedDate = getDateAtOffset(currentInstant, selectedOffset);
  slider.value = selectedDate.getUTCHours() * 60 + selectedDate.getUTCMinutes();
  updateSliderFill();
}

function populateTimezoneSelect() {
  const detectedOffset = detectSupportedSystemOffset();

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = `自动识别（${formatOffset(detectedOffset)}）`;
  timezoneSelect.appendChild(autoOption);

  timezones.forEach(zone => {
    const option = document.createElement("option");
    option.value = String(zone.offset);
    option.textContent = formatOffset(zone.offset);
    timezoneSelect.appendChild(option);
  });

  selectedOffset = detectedOffset;
  timezoneSelect.value = "auto";
}

function updateTimes() {
  selectedTime.textContent = `当前时间: ${formatDateTimeWithYear(currentInstant, selectedOffset)}`;
  tbody.innerHTML = "";

  timezones.forEach(zone => {
    const row = document.createElement("tr");
    if (zone.offset === selectedOffset) row.classList.add("highlight");

    const tzCell = document.createElement("td");
    tzCell.className = "utc-cell";
    tzCell.textContent = formatOffset(zone.offset);

    const cityCell = document.createElement("td");
    cityCell.textContent = zone.city;

    const timeCell = document.createElement("td");
    timeCell.className = "time-cell";

    const input = document.createElement("input");
    input.type = "text";
    input.value = formatDateTime(currentInstant, zone.offset);
    input.placeholder = "MM月DD日 HH:mm";

    input.addEventListener("mousedown", enterSimulateMode);
    input.addEventListener("touchstart", enterSimulateMode, { passive: true });
    input.addEventListener("focus", enterSimulateMode);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") input.blur();
    });

    input.addEventListener("blur", () => {
      const editedInstant = parseDateTime(input.value, zone.offset);
      if (editedInstant) {
        currentInstant = editedInstant;
        updateSliderFromInstant();
        updateTimes();
      } else {
        input.value = formatDateTime(currentInstant, zone.offset);
      }
    });

    timeCell.appendChild(input);
    row.appendChild(tzCell);
    row.appendChild(cityCell);
    row.appendChild(timeCell);
    tbody.appendChild(row);
  });
}

slider.addEventListener("input", () => {
  enterSimulateMode();

  const selectedDate = getDateAtOffset(currentInstant, selectedOffset);
  const year = selectedDate.getUTCFullYear();
  const month = selectedDate.getUTCMonth();
  const day = selectedDate.getUTCDate();
  const minutes = Number.parseInt(slider.value, 10);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  currentInstant = new Date(
    Date.UTC(year, month, day, hour, minute, 0, 0) - selectedOffset * 60 * 60 * 1000
  );

  updateSliderFill();
  updateTimes();
});

timezoneSelect.addEventListener("change", () => {
  selectedOffset = timezoneSelect.value === "auto"
    ? detectSupportedSystemOffset()
    : Number(timezoneSelect.value);

  updateSliderFromInstant();
  updateTimes();
});

toggleBtn.addEventListener("click", () => {
  selectedOffset = detectSupportedSystemOffset();
  timezoneSelect.value = "auto";
  followSystem = true;
  currentMode.textContent = "当前模式: 系统时间模式";
  toggleBtn.textContent = "回到系统时间";
  currentInstant = new Date();
  updateSliderFromInstant();
  updateTimes();
});

function syncSystemTime() {
  if (!followSystem) return;
  currentInstant = new Date();
  updateSliderFromInstant();
  updateTimes();
}

populateTimezoneSelect();
syncSystemTime();
setInterval(syncSystemTime, 1000);
