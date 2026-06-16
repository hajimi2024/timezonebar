const baseTimeZones = [
  { id: "Pacific/Pago_Pago", city: "帕果帕果", region: "美属萨摩亚" },
  { id: "Pacific/Honolulu", city: "檀香山", region: "夏威夷" },
  { id: "America/Anchorage", city: "安克雷奇", region: "阿拉斯加" },
  { id: "America/Los_Angeles", city: "洛杉矶", region: "美国西部" },
  { id: "America/Phoenix", city: "凤凰城", region: "亚利桑那" },
  { id: "America/Denver", city: "丹佛", region: "美国山地" },
  { id: "America/Chicago", city: "芝加哥", region: "美国中部" },
  { id: "America/New_York", city: "纽约", region: "美国东部" },
  { id: "America/St_Johns", city: "圣约翰斯", region: "加拿大纽芬兰" },
  { id: "America/Sao_Paulo", city: "圣保罗", region: "巴西" },
  { id: "America/Argentina/Buenos_Aires", city: "布宜诺斯艾利斯", region: "阿根廷" },
  { id: "Atlantic/South_Georgia", city: "南乔治亚岛", region: "南大西洋" },
  { id: "Atlantic/Azores", city: "亚速尔群岛", region: "葡萄牙" },
  { id: "Atlantic/Cape_Verde", city: "普拉亚", region: "佛得角" },
  { id: "Europe/London", city: "伦敦", region: "英国" },
  { id: "Europe/Paris", city: "巴黎", region: "中欧" },
  { id: "Europe/Athens", city: "雅典", region: "东欧" },
  { id: "Europe/Moscow", city: "莫斯科", region: "俄罗斯" },
  { id: "Asia/Jerusalem", city: "耶路撒冷", region: "以色列" },
  { id: "Europe/Istanbul", city: "伊斯坦布尔", region: "土耳其" },
  { id: "Asia/Riyadh", city: "利雅得", region: "沙特阿拉伯" },
  { id: "Asia/Tehran", city: "德黑兰", region: "伊朗" },
  { id: "Asia/Dubai", city: "迪拜", region: "阿联酋" },
  { id: "Asia/Kabul", city: "喀布尔", region: "阿富汗" },
  { id: "Asia/Karachi", city: "卡拉奇", region: "巴基斯坦" },
  { id: "Asia/Kolkata", city: "新德里", region: "印度" },
  { id: "Asia/Kathmandu", city: "加德满都", region: "尼泊尔" },
  { id: "Asia/Dhaka", city: "达卡", region: "孟加拉国" },
  { id: "Asia/Yangon", city: "仰光", region: "缅甸" },
  { id: "Asia/Bangkok", city: "曼谷", region: "泰国" },
  { id: "Asia/Shanghai", city: "北京", region: "中国" },
  { id: "Asia/Singapore", city: "新加坡", region: "新加坡" },
  { id: "Asia/Tokyo", city: "东京", region: "日本" },
  { id: "Australia/Perth", city: "珀斯", region: "澳大利亚西部" },
  { id: "Australia/Darwin", city: "达尔文", region: "澳大利亚北部" },
  { id: "Australia/Adelaide", city: "阿德莱德", region: "澳大利亚南部" },
  { id: "Australia/Brisbane", city: "布里斯班", region: "澳大利亚昆士兰" },
  { id: "Australia/Sydney", city: "悉尼", region: "澳大利亚东部" },
  { id: "Pacific/Guadalcanal", city: "霍尼亚拉", region: "所罗门群岛" },
  { id: "Pacific/Auckland", city: "奥克兰", region: "新西兰" },
  { id: "Pacific/Chatham", city: "查塔姆群岛", region: "新西兰" },
  { id: "Pacific/Kiritimati", city: "基里蒂马蒂", region: "基里巴斯" }
];

const slider = document.getElementById("timeSlider");
const selectedTime = document.getElementById("selectedTime");
const tbody = document.querySelector("#timeTable tbody");
const toggleBtn = document.getElementById("toggleFreeze");
const currentMode = document.getElementById("currentMode");
const timezoneSelect = document.getElementById("timezoneSelect");

const formatterCache = new Map();
const timezoneOptionMap = new Map();
const rowCache = new Map();
const deviceTimeZone = getDeviceTimeZone();
const timeZones = buildTimeZoneList(deviceTimeZone);

let followSystem = true;
let currentInstant = new Date();
let selectedTimeZone = deviceTimeZone;
let lastOrderKey = "";

function getDeviceTimeZone() {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return isValidTimeZone(detected) ? detected : "UTC";
}

function isValidTimeZone(timeZone) {
  if (!timeZone) return false;

  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

function buildTimeZoneList(detectedZone) {
  const zones = baseTimeZones.filter(zone => isValidTimeZone(zone.id));

  if (!zones.some(zone => zone.id === detectedZone)) {
    zones.unshift({
      id: detectedZone,
      city: "设备时区",
      region: formatTimeZoneId(detectedZone),
      isDevice: true
    });
  }

  return zones;
}

function formatTimeZoneId(timeZone) {
  return timeZone.replace(/_/g, " ").replace("/", " / ");
}

function getFormatter(timeZone) {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(
      timeZone,
      new Intl.DateTimeFormat("en-CA-u-ca-gregory-nu-latn", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      })
    );
  }

  return formatterCache.get(timeZone);
}

function getZonedParts(instant, timeZone) {
  const parts = {};

  getFormatter(timeZone).formatToParts(instant).forEach(part => {
    if (part.type !== "literal") {
      parts[part.type] = Number(part.value);
    }
  });

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second
  };
}

function getOffsetMinutes(instant, timeZone) {
  const exactInstant = new Date(Math.floor(instant.getTime() / 1000) * 1000);
  const parts = getZonedParts(exactInstant, timeZone);
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return Math.round((localAsUtc - exactInstant.getTime()) / 60000);
}

function formatOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;

  return minutes === 0
    ? `UTC ${sign}${hours}`
    : `UTC ${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

function formatDateTime(instant, timeZone) {
  const parts = getZonedParts(instant, timeZone);

  return `${String(parts.month).padStart(2, "0")}月${String(parts.day).padStart(2, "0")}日 ` +
    `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

function formatDateTimeWithYear(instant, timeZone) {
  const parts = getZonedParts(instant, timeZone);
  return `${parts.year}年${formatDateTime(instant, timeZone)}`;
}

function isValidCalendarDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function partsMatch(parts, target) {
  return parts.year === target.year &&
    parts.month === target.month &&
    parts.day === target.day &&
    parts.hour === target.hour &&
    parts.minute === target.minute;
}

function zonedLocalDateTimeToInstant(target, timeZone) {
  const localAsUtc = Date.UTC(
    target.year,
    target.month - 1,
    target.day,
    target.hour,
    target.minute,
    0,
    0
  );

  let guess = localAsUtc;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const offset = getOffsetMinutes(new Date(guess), timeZone);
    const nextGuess = localAsUtc - offset * 60000;

    if (Math.abs(nextGuess - guess) < 1000) {
      guess = nextGuess;
      break;
    }

    guess = nextGuess;
  }

  const candidateOffsets = new Set([
    getOffsetMinutes(new Date(guess), timeZone)
  ]);

  [-720, -360, -180, -120, -60, 0, 60, 120, 180, 360, 720].forEach(delta => {
    candidateOffsets.add(
      getOffsetMinutes(new Date(localAsUtc + delta * 60000), timeZone)
    );
  });

  for (const offset of candidateOffsets) {
    const candidate = new Date(localAsUtc - offset * 60000);

    if (partsMatch(getZonedParts(candidate, timeZone), target)) {
      return candidate;
    }
  }

  return null;
}

function resolveSliderInstant(target, timeZone) {
  for (let extraMinutes = 0; extraMinutes <= 180; extraMinutes += 1) {
    const localCursor = new Date(Date.UTC(
      target.year,
      target.month - 1,
      target.day,
      target.hour,
      target.minute + extraMinutes
    ));

    const adjustedTarget = {
      year: localCursor.getUTCFullYear(),
      month: localCursor.getUTCMonth() + 1,
      day: localCursor.getUTCDate(),
      hour: localCursor.getUTCHours(),
      minute: localCursor.getUTCMinutes()
    };

    const resolved = zonedLocalDateTimeToInstant(adjustedTarget, timeZone);
    if (resolved) return resolved;
  }

  return null;
}

function parseDateTime(value, timeZone) {
  const match = value.match(/(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})/);
  if (!match) return null;

  const [, month, day, hour, minute] = match.map(Number);
  const currentYear = getZonedParts(currentInstant, timeZone).year;

  if (
    !isValidCalendarDate(currentYear, month, day) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return zonedLocalDateTimeToInstant({
    year: currentYear,
    month,
    day,
    hour,
    minute
  }, timeZone);
}

function getZoneFullLabel(zone) {
  return zone.region ? `${zone.city}（${zone.region}）` : zone.city;
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
  const parts = getZonedParts(currentInstant, selectedTimeZone);
  slider.value = parts.hour * 60 + parts.minute;
  updateSliderFill();
}

function populateTimezoneSelect() {
  timezoneSelect.innerHTML = "";

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  timezoneSelect.appendChild(autoOption);

  timeZones.forEach(zone => {
    const option = document.createElement("option");
    option.value = zone.id;
    timezoneOptionMap.set(zone.id, option);
    timezoneSelect.appendChild(option);
  });

  timezoneSelect.value = "auto";
  refreshTimezoneSelectLabels();
}

function refreshTimezoneSelectLabels() {
  const autoOption = timezoneSelect.querySelector('option[value="auto"]');
  autoOption.textContent = `自动识别 · ${formatOffset(getOffsetMinutes(currentInstant, deviceTimeZone))}`;

  timeZones.forEach(zone => {
    const option = timezoneOptionMap.get(zone.id);
    if (!option) return;

    option.textContent = `${zone.city} · ${formatOffset(getOffsetMinutes(currentInstant, zone.id))}`;
  });
}

function createZoneRow(zone) {
  const row = document.createElement("tr");

  const tzCell = document.createElement("td");
  tzCell.className = "utc-cell";

  const cityCell = document.createElement("td");
  cityCell.className = "city-cell";
  cityCell.title = zone.id;

  const fullCity = document.createElement("span");
  fullCity.className = "city-full";
  fullCity.textContent = getZoneFullLabel(zone);

  const shortCity = document.createElement("span");
  shortCity.className = "city-short";
  shortCity.textContent = zone.city;

  cityCell.appendChild(fullCity);
  cityCell.appendChild(shortCity);

  const timeCell = document.createElement("td");
  timeCell.className = "time-cell";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "MM月DD日 HH:mm";
  input.setAttribute("aria-label", `自定义${zone.city}时间`);

  input.addEventListener("mousedown", enterSimulateMode);
  input.addEventListener("touchstart", enterSimulateMode, { passive: true });
  input.addEventListener("focus", enterSimulateMode);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") input.blur();
  });

  input.addEventListener("blur", () => {
    const editedInstant = parseDateTime(input.value, zone.id);

    if (editedInstant) {
      currentInstant = editedInstant;
      updateSliderFromInstant();
      updateTimes();
    } else {
      input.value = formatDateTime(currentInstant, zone.id);
    }
  });

  timeCell.appendChild(input);
  row.appendChild(tzCell);
  row.appendChild(cityCell);
  row.appendChild(timeCell);

  return { row, tzCell, input };
}

function getRowElements(zone) {
  if (!rowCache.has(zone.id)) {
    rowCache.set(zone.id, createZoneRow(zone));
  }

  return rowCache.get(zone.id);
}

function updateTimes() {
  selectedTime.textContent = `当前时间: ${formatDateTimeWithYear(currentInstant, selectedTimeZone)}`;
  refreshTimezoneSelectLabels();

  const zonesForDisplay = timeZones
    .map(zone => ({
      ...zone,
      offsetMinutes: getOffsetMinutes(currentInstant, zone.id)
    }))
    .sort((a, b) => {
      if (a.offsetMinutes !== b.offsetMinutes) {
        return a.offsetMinutes - b.offsetMinutes;
      }

      return a.city.localeCompare(b.city, "zh-CN");
    });

  const orderKey = zonesForDisplay.map(zone => zone.id).join("|");

  if (orderKey !== lastOrderKey) {
    const fragment = document.createDocumentFragment();

    zonesForDisplay.forEach(zone => {
      fragment.appendChild(getRowElements(zone).row);
    });

    tbody.appendChild(fragment);
    lastOrderKey = orderKey;
  }

  zonesForDisplay.forEach(zone => {
    const { row, tzCell, input } = getRowElements(zone);

    row.classList.toggle("highlight", zone.id === selectedTimeZone);
    tzCell.textContent = formatOffset(zone.offsetMinutes);

    if (document.activeElement !== input) {
      input.value = formatDateTime(currentInstant, zone.id);
    }
  });
}

slider.addEventListener("input", () => {
  enterSimulateMode();

  const selectedParts = getZonedParts(currentInstant, selectedTimeZone);
  const minutes = Number.parseInt(slider.value, 10);

  const resolved = resolveSliderInstant({
    year: selectedParts.year,
    month: selectedParts.month,
    day: selectedParts.day,
    hour: Math.floor(minutes / 60),
    minute: minutes % 60
  }, selectedTimeZone);

  if (resolved) {
    currentInstant = resolved;
    updateSliderFromInstant();
    updateTimes();
  }
});

timezoneSelect.addEventListener("change", () => {
  selectedTimeZone = timezoneSelect.value === "auto"
    ? deviceTimeZone
    : timezoneSelect.value;

  updateSliderFromInstant();
  updateTimes();
});

toggleBtn.addEventListener("click", () => {
  selectedTimeZone = deviceTimeZone;
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
