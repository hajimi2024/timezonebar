const UTC_MIN = -11;
const UTC_MAX = 12;

// 每个整数 UTC 区间只展示一个代表城市/地区。
// 候选名称按中国用户熟悉程度和跨境广告市场常用程度排序。
// 当某个地区因季节规则移动到其他 UTC 区间时，自动使用后备地区补位。
const representativeCandidates = {
  "-11": [
    { id: "Pacific/Pago_Pago", city: "中途岛、萨摩亚" }
  ],
  "-10": [
    { id: "Pacific/Honolulu", city: "夏威夷" }
  ],
  "-9": [
    { id: "America/Anchorage", city: "阿拉斯加州" },
    { id: "America/Adak", city: "阿拉斯加西部、阿留申群岛" }
  ],
  "-8": [
    { id: "America/Los_Angeles", city: "加利福尼亚州、俄勒冈州" },
    { id: "America/Anchorage", city: "阿拉斯加州" },
    { id: "Pacific/Pitcairn", city: "皮特凯恩群岛" }
  ],
  "-7": [
    { id: "America/Los_Angeles", city: "加利福尼亚州、俄勒冈州" },
    { id: "America/Denver", city: "科罗拉多州、新墨西哥州" },
    { id: "America/Phoenix", city: "亚利桑那州" }
  ],
  "-6": [
    { id: "America/Chicago", city: "得克萨斯州、密西西比州" },
    { id: "America/Denver", city: "科罗拉多州、新墨西哥州" },
    { id: "America/Guatemala", city: "墨西哥中部、中美洲" }
  ],
  "-5": [
    { id: "America/New_York", city: "纽约、新泽西州、宾夕法尼亚州" },
    { id: "America/Chicago", city: "得克萨斯州、密西西比州" },
    { id: "America/Bogota", city: "哥伦比亚、秘鲁" }
  ],
  "-4": [
    { id: "America/New_York", city: "纽约、华盛顿、佛罗里达州" },
    { id: "America/Toronto", city: "多伦多" },
    { id: "America/Santo_Domingo", city: "加勒比地区" }
  ],
  "-3": [
    { id: "America/Sao_Paulo", city: "巴西、阿根廷、乌拉圭" },
    { id: "America/Argentina/Buenos_Aires", city: "阿根廷、乌拉圭" }
  ],
  "-2": [
    { id: "Atlantic/South_Georgia", city: "南乔治亚岛" }
  ],
  "-1": [
    { id: "Atlantic/Cape_Verde", city: "佛得角" },
    { id: "Atlantic/Azores", city: "亚速尔群岛" }
  ],
  "0": [
    { id: "Europe/London", city: "伦敦、格林威治时间" },
    { id: "Atlantic/Azores", city: "亚速尔群岛" },
    { id: "Africa/Accra", city: "格林威治时间、西非" }
  ],
  "1": [
    { id: "Europe/Paris", city: "德国、法国、比利时" },
    { id: "Europe/London", city: "伦敦" },
    { id: "Africa/Lagos", city: "西非" }
  ],
  "2": [
    { id: "Europe/Athens", city: "希腊、立陶宛、乌克兰" },
    { id: "Europe/Paris", city: "德国、法国、比利时" },
    { id: "Africa/Johannesburg", city: "南非" }
  ],
  "3": [
    { id: "Europe/Moscow", city: "莫斯科、土耳其、沙特阿拉伯" },
    { id: "Europe/Athens", city: "希腊、乌克兰" },
    { id: "Asia/Jerusalem", city: "以色列" }
  ],
  "4": [
    { id: "Asia/Dubai", city: "阿联酋、阿曼" }
  ],
  "5": [
    { id: "Asia/Karachi", city: "马尔代夫、乌兹别克斯坦、巴基斯坦" }
  ],
  "6": [
    { id: "Asia/Dhaka", city: "孟加拉国、吉尔吉斯斯坦" }
  ],
  "7": [
    { id: "Asia/Bangkok", city: "泰国、柬埔寨、越南" }
  ],
  "8": [
    { id: "Asia/Shanghai", city: "北京、香港、台湾" },
    { id: "Asia/Singapore", city: "新加坡、马来西亚" }
  ],
  "9": [
    { id: "Asia/Tokyo", city: "日本、韩国" }
  ],
  "10": [
    { id: "Australia/Sydney", city: "悉尼、墨尔本" },
    { id: "Australia/Brisbane", city: "澳大利亚东部" }
  ],
  "11": [
    { id: "Australia/Sydney", city: "悉尼、墨尔本" },
    { id: "Pacific/Guadalcanal", city: "所罗门群岛" }
  ],
  "12": [
    { id: "Pacific/Auckland", city: "新西兰、斐济" },
    { id: "Pacific/Fiji", city: "斐济" },
    { id: "Pacific/Tarawa", city: "太平洋岛屿" }
  ]
};

const utcRows = Array.from(
  { length: UTC_MAX - UTC_MIN + 1 },
  (_, index) => ({ offset: UTC_MIN + index })
);

const slider = document.getElementById("timeSlider");
const selectedTime = document.getElementById("selectedTime");
const tbody = document.querySelector("#timeTable tbody");
const toggleBtn = document.getElementById("toggleFreeze");
const currentMode = document.getElementById("currentMode");
const timezoneSelect = document.getElementById("timezoneSelect");

const formatterCache = new Map();
const validTimeZoneCache = new Map();
const rowCache = new Map();
const deviceTimeZone = getDeviceTimeZone();

let followSystem = true;
let currentInstant = new Date();
let selectedMode = "auto";
let selectedFixedOffset = 8;

function isValidTimeZone(timeZone) {
  if (validTimeZoneCache.has(timeZone)) {
    return validTimeZoneCache.get(timeZone);
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    validTimeZoneCache.set(timeZone, true);
    return true;
  } catch {
    validTimeZoneCache.set(timeZone, false);
    return false;
  }
}

function getDeviceTimeZone() {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return isValidTimeZone(detected) ? detected : "UTC";
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

function getFixedOffsetParts(instant, offsetHours) {
  const shifted = new Date(instant.getTime() + offsetHours * 60 * 60 * 1000);

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds()
  };
}

function getSelectedParts(instant) {
  return selectedMode === "auto"
    ? getZonedParts(instant, deviceTimeZone)
    : getFixedOffsetParts(instant, selectedFixedOffset);
}

function getSelectedOffsetMinutes(instant) {
  return selectedMode === "auto"
    ? getOffsetMinutes(instant, deviceTimeZone)
    : selectedFixedOffset * 60;
}

function formatOffset(offsetHours) {
  return `UTC ${offsetHours >= 0 ? `+${offsetHours}` : offsetHours}`;
}

function formatParts(parts, withYear = false) {
  const dateText = `${String(parts.month).padStart(2, "0")}月${String(parts.day).padStart(2, "0")}日 ` +
    `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;

  return withYear ? `${parts.year}年${dateText}` : dateText;
}

function formatFixedDateTime(instant, offsetHours) {
  return formatParts(getFixedOffsetParts(instant, offsetHours));
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

function resolveAutoLocalTime(target) {
  for (let extraMinutes = 0; extraMinutes <= 180; extraMinutes += 1) {
    const cursor = new Date(Date.UTC(
      target.year,
      target.month - 1,
      target.day,
      target.hour,
      target.minute + extraMinutes
    ));

    const adjusted = {
      year: cursor.getUTCFullYear(),
      month: cursor.getUTCMonth() + 1,
      day: cursor.getUTCDate(),
      hour: cursor.getUTCHours(),
      minute: cursor.getUTCMinutes()
    };

    const resolved = zonedLocalDateTimeToInstant(adjusted, deviceTimeZone);
    if (resolved) return resolved;
  }

  return null;
}

function fixedLocalDateTimeToInstant(target, offsetHours) {
  return new Date(
    Date.UTC(
      target.year,
      target.month - 1,
      target.day,
      target.hour,
      target.minute,
      0,
      0
    ) - offsetHours * 60 * 60 * 1000
  );
}

function parseFixedDateTime(value, offsetHours) {
  const match = value.match(/(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})/);
  if (!match) return null;

  const [, month, day, hour, minute] = match.map(Number);
  const currentYear = getFixedOffsetParts(currentInstant, offsetHours).year;

  if (
    !isValidCalendarDate(currentYear, month, day) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return fixedLocalDateTimeToInstant({
    year: currentYear,
    month,
    day,
    hour,
    minute
  }, offsetHours);
}

function getRepresentativeCity(offsetHours, instant) {
  const candidates = representativeCandidates[String(offsetHours)] || [];

  for (const candidate of candidates) {
    if (!isValidTimeZone(candidate.id)) continue;

    if (getOffsetMinutes(instant, candidate.id) === offsetHours * 60) {
      return candidate.city;
    }
  }

  return candidates.at(-1)?.city || "—";
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
  const parts = getSelectedParts(currentInstant);
  slider.value = parts.hour * 60 + parts.minute;
  updateSliderFill();
}

function populateTimezoneSelect() {
  timezoneSelect.innerHTML = "";

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = "自动识别";
  timezoneSelect.appendChild(autoOption);

  utcRows.forEach(zone => {
    const option = document.createElement("option");
    option.value = String(zone.offset);
    option.textContent = formatOffset(zone.offset);
    timezoneSelect.appendChild(option);
  });

  timezoneSelect.value = "auto";
}

function createUtcRow(offsetHours) {
  const row = document.createElement("tr");

  const utcCell = document.createElement("td");
  utcCell.className = "utc-cell";
  utcCell.textContent = formatOffset(offsetHours);

  const cityCell = document.createElement("td");
  cityCell.className = "city-cell";

  const fullCity = document.createElement("span");
  fullCity.className = "city-full";

  const shortCity = document.createElement("span");
  shortCity.className = "city-short";

  cityCell.appendChild(fullCity);
  cityCell.appendChild(shortCity);

  const timeCell = document.createElement("td");
  timeCell.className = "time-cell";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "MM月DD日 HH:mm";
  input.setAttribute("aria-label", `自定义${formatOffset(offsetHours)}时间`);

  input.addEventListener("mousedown", enterSimulateMode);
  input.addEventListener("touchstart", enterSimulateMode, { passive: true });
  input.addEventListener("focus", enterSimulateMode);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") input.blur();
  });

  input.addEventListener("blur", () => {
    const editedInstant = parseFixedDateTime(input.value, offsetHours);

    if (editedInstant) {
      currentInstant = editedInstant;
      updateSliderFromInstant();
      updateTimes();
    } else {
      input.value = formatFixedDateTime(currentInstant, offsetHours);
    }
  });

  timeCell.appendChild(input);
  row.appendChild(utcCell);
  row.appendChild(cityCell);
  row.appendChild(timeCell);

  return { row, fullCity, shortCity, input };
}

function buildTable() {
  const fragment = document.createDocumentFragment();

  utcRows.forEach(zone => {
    const elements = createUtcRow(zone.offset);
    rowCache.set(zone.offset, elements);
    fragment.appendChild(elements.row);
  });

  tbody.appendChild(fragment);
}

function updateTimes() {
  selectedTime.textContent = `当前时间: ${formatParts(getSelectedParts(currentInstant), true)}`;

  const selectedOffsetMinutes = getSelectedOffsetMinutes(currentInstant);
  const highlightedOffset = Number.isInteger(selectedOffsetMinutes / 60) &&
    selectedOffsetMinutes / 60 >= UTC_MIN &&
    selectedOffsetMinutes / 60 <= UTC_MAX
      ? selectedOffsetMinutes / 60
      : null;

  utcRows.forEach(zone => {
    const { row, fullCity, shortCity, input } = rowCache.get(zone.offset);
    const city = getRepresentativeCity(zone.offset, currentInstant);

    row.classList.toggle("highlight", zone.offset === highlightedOffset);
    fullCity.textContent = city;
    shortCity.textContent = city;

    if (document.activeElement !== input) {
      input.value = formatFixedDateTime(currentInstant, zone.offset);
    }
  });
}

slider.addEventListener("input", () => {
  enterSimulateMode();

  const selectedParts = getSelectedParts(currentInstant);
  const minutes = Number.parseInt(slider.value, 10);
  const target = {
    year: selectedParts.year,
    month: selectedParts.month,
    day: selectedParts.day,
    hour: Math.floor(minutes / 60),
    minute: minutes % 60
  };

  const resolved = selectedMode === "auto"
    ? resolveAutoLocalTime(target)
    : fixedLocalDateTimeToInstant(target, selectedFixedOffset);

  if (resolved) {
    currentInstant = resolved;
    updateSliderFromInstant();
    updateTimes();
  }
});

timezoneSelect.addEventListener("change", () => {
  if (timezoneSelect.value === "auto") {
    selectedMode = "auto";
  } else {
    selectedMode = "fixed";
    selectedFixedOffset = Number(timezoneSelect.value);
  }

  updateSliderFromInstant();
  updateTimes();
});

toggleBtn.addEventListener("click", () => {
  selectedMode = "auto";
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
buildTable();
syncSystemTime();
setInterval(syncSystemTime, 1000);
