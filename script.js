const UTC_MIN = -11;
const UTC_MAX = 12;

const representativeGroups = {
  "-11": [
    [{ id: "Pacific/Pago_Pago", label: "中途岛" }]
  ],
  "-10": [
    [{ id: "Pacific/Honolulu", label: "夏威夷" }]
  ],
  "-9": [
    [{ id: "America/Anchorage", label: "阿拉斯加州" }],
    [
      { id: "America/Adak", label: "阿拉斯加西部" },
      { id: "America/Adak", label: "阿留申群岛" }
    ]
  ],
  "-8": [
    [
      { id: "America/Los_Angeles", label: "加利福尼亚州" },
      { id: "America/Los_Angeles", label: "俄勒冈州" }
    ],
    [{ id: "America/Anchorage", label: "阿拉斯加州" }],
    [{ id: "Pacific/Pitcairn", label: "皮特凯恩群岛" }]
  ],
  "-7": [
    [
      { id: "America/Los_Angeles", label: "加利福尼亚州" },
      { id: "America/Los_Angeles", label: "俄勒冈州" }
    ],
    [
      { id: "America/Denver", label: "科罗拉多州" },
      { id: "America/Denver", label: "新墨西哥州" }
    ],
    [{ id: "America/Phoenix", label: "亚利桑那州" }]
  ],
  "-6": [
    [
      { id: "America/Chicago", label: "得克萨斯州" },
      { id: "America/Chicago", label: "密西西比州" }
    ],
    [
      { id: "America/Denver", label: "科罗拉多州" },
      { id: "America/Denver", label: "新墨西哥州" }
    ],
    [
      { id: "America/Mexico_City", label: "墨西哥中部" },
      { id: "America/Guatemala", label: "中美洲" }
    ]
  ],
  "-5": [
    [
      { id: "America/New_York", label: "纽约" },
      { id: "America/New_York", label: "新泽西州" },
      { id: "America/New_York", label: "宾夕法尼亚州" }
    ],
    [
      { id: "America/Chicago", label: "得克萨斯州" },
      { id: "America/Chicago", label: "密西西比州" }
    ],
    [
      { id: "America/Bogota", label: "哥伦比亚" },
      { id: "America/Lima", label: "秘鲁" }
    ]
  ],
  "-4": [
    [
      { id: "America/New_York", label: "纽约" },
      { id: "America/New_York", label: "华盛顿" },
      { id: "America/New_York", label: "佛罗里达州东部" }
    ],
    [{ id: "America/Toronto", label: "多伦多" }],
    [{ id: "America/Santo_Domingo", label: "加勒比地区" }]
  ],
  "-3": [
    [
      { id: "America/Sao_Paulo", label: "巴西" },
      { id: "America/Argentina/Buenos_Aires", label: "阿根廷" },
      { id: "America/Montevideo", label: "乌拉圭" }
    ]
  ],
  "-2": [
    [{ id: "Atlantic/South_Georgia", label: "南乔治亚岛" }]
  ],
  "-1": [
    [{ id: "Atlantic/Cape_Verde", label: "佛得角" }],
    [{ id: "Atlantic/Azores", label: "亚速尔群岛" }]
  ],
  "0": [
    [
      { id: "Atlantic/Reykjavik", label: "冰岛" },
      { id: "Etc/GMT", label: "格林威治标准时间" }
    ],
    [{ id: "Africa/Accra", label: "西非" }]
  ],
  "1": [
    [
      { id: "Europe/Berlin", label: "德国" },
      { id: "Europe/Paris", label: "法国" },
      { id: "Europe/Brussels", label: "比利时" }
    ],
    [{ id: "Europe/London", label: "伦敦" }],
    [{ id: "Africa/Lagos", label: "西非" }]
  ],
  "2": [
    [
      { id: "Europe/Athens", label: "希腊" },
      { id: "Europe/Vilnius", label: "立陶宛" },
      { id: "Europe/Kyiv", label: "乌克兰" }
    ],
    [
      { id: "Europe/Berlin", label: "德国" },
      { id: "Europe/Paris", label: "法国" },
      { id: "Europe/Brussels", label: "比利时" }
    ],
    [{ id: "Africa/Johannesburg", label: "南非" }]
  ],
  "3": [
    [
      { id: "Europe/Moscow", label: "莫斯科" },
      { id: "Europe/Istanbul", label: "土耳其" },
      { id: "Asia/Riyadh", label: "沙特阿拉伯" }
    ],
    [
      { id: "Europe/Athens", label: "希腊" },
      { id: "Europe/Kyiv", label: "乌克兰" }
    ],
    [{ id: "Asia/Jerusalem", label: "以色列" }]
  ],
  "4": [
    [
      { id: "Asia/Dubai", label: "阿联酋" },
      { id: "Asia/Muscat", label: "阿曼" }
    ]
  ],
  "5": [
    [
      { id: "Indian/Maldives", label: "马尔代夫" },
      { id: "Asia/Tashkent", label: "乌兹别克斯坦" },
      { id: "Asia/Karachi", label: "巴基斯坦" }
    ]
  ],
  "6": [
    [
      { id: "Asia/Dhaka", label: "孟加拉国" },
      { id: "Asia/Bishkek", label: "吉尔吉斯斯坦" }
    ]
  ],
  "7": [
    [
      { id: "Asia/Bangkok", label: "泰国" },
      { id: "Asia/Phnom_Penh", label: "柬埔寨" },
      { id: "Asia/Ho_Chi_Minh", label: "越南" }
    ]
  ],
  "8": [
    [
      { id: "Asia/Shanghai", label: "北京" },
      { id: "Asia/Hong_Kong", label: "香港" },
      { id: "Asia/Taipei", label: "台湾" }
    ],
    [
      { id: "Asia/Singapore", label: "新加坡" },
      { id: "Asia/Kuala_Lumpur", label: "马来西亚" }
    ]
  ],
  "9": [
    [
      { id: "Asia/Tokyo", label: "日本" },
      { id: "Asia/Seoul", label: "韩国" }
    ]
  ],
  "10": [
    [
      { id: "Australia/Sydney", label: "悉尼" },
      { id: "Australia/Melbourne", label: "墨尔本" },
      { id: "Australia/Brisbane", label: "布里斯班" }
    ]
  ],
  "11": [
    [
      { id: "Australia/Sydney", label: "悉尼" },
      { id: "Australia/Melbourne", label: "墨尔本" }
    ],
    [{ id: "Pacific/Guadalcanal", label: "所罗门群岛" }]
  ],
  "12": [
    [
      { id: "Pacific/Auckland", label: "新西兰" },
      { id: "Pacific/Fiji", label: "斐济" }
    ],
    [{ id: "Pacific/Tarawa", label: "太平洋岛屿" }]
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

let deviceTimeZone = getDeviceTimeZone();
let followSystem = true;
let currentInstant = new Date();
let selectedMode = "auto";
let selectedFixedOffset = 8;
let lastRepresentativeMinute = null;
let minuteTimer = null;

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
    if (resolved) {
      return resolved;
    }
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
  const match = value.match(/^(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

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

function getRepresentativeRegion(offsetHours, instant) {
  const groups = representativeGroups[String(offsetHours)] || [];

  for (const group of groups) {
    const matches = group.filter(entry => {
      if (!isValidTimeZone(entry.id)) {
        return false;
      }

      return getOffsetMinutes(instant, entry.id) === offsetHours * 60;
    });

    if (matches.length > 0) {
      return {
        full: matches.map(entry => entry.label).join("、"),
        mobile: matches[0].label
      };
    }
  }

  return { full: "—", mobile: "—" };
}

function enterSimulateMode() {
  followSystem = false;
  currentMode.textContent = "当前模式: 模拟模式";
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
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.placeholder = "MM月DD日 HH:mm";
  input.setAttribute("aria-label", `自定义${formatOffset(offsetHours)}时间`);

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      input.blur();
    }
  });

  input.addEventListener("blur", () => {
    const editedInstant = parseFixedDateTime(input.value.trim(), offsetHours);

    if (!editedInstant) {
      input.value = formatFixedDateTime(currentInstant, offsetHours);
      return;
    }

    enterSimulateMode();
    currentInstant = editedInstant;
    renderAll({ forceRegions: true });
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

function updateRepresentativeRegions(force = false) {
  const minuteKey = Math.floor(currentInstant.getTime() / 60000);

  if (!force && minuteKey === lastRepresentativeMinute) {
    return;
  }

  utcRows.forEach(zone => {
    const { fullCity, shortCity } = rowCache.get(zone.offset);
    const representative = getRepresentativeRegion(zone.offset, currentInstant);

    fullCity.textContent = representative.full;
    shortCity.textContent = representative.mobile;
  });

  lastRepresentativeMinute = minuteKey;
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
    const { row, input } = rowCache.get(zone.offset);

    row.classList.toggle("highlight", zone.offset === highlightedOffset);

    if (document.activeElement !== input) {
      input.value = formatFixedDateTime(currentInstant, zone.offset);
    }
  });
}

function renderAll({ forceRegions = false } = {}) {
  updateSliderFromInstant();
  updateTimes();
  updateRepresentativeRegions(forceRegions);
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
    renderAll({ forceRegions: true });
  }
});

timezoneSelect.addEventListener("change", () => {
  if (timezoneSelect.value === "auto") {
    selectedMode = "auto";
  } else {
    selectedMode = "fixed";
    selectedFixedOffset = Number(timezoneSelect.value);
  }

  renderAll();
});

toggleBtn.addEventListener("click", () => {
  deviceTimeZone = getDeviceTimeZone();
  selectedMode = "auto";
  timezoneSelect.value = "auto";
  followSystem = true;
  currentMode.textContent = "当前模式: 系统时间模式";
  currentInstant = new Date();
  renderAll({ forceRegions: true });
});

function syncSystemTime() {
  if (!followSystem) {
    return;
  }

  currentInstant = new Date();
  renderAll();
}

function scheduleNextMinuteUpdate() {
  window.clearTimeout(minuteTimer);

  const now = Date.now();
  const delay = 60000 - (now % 60000) + 50;

  minuteTimer = window.setTimeout(() => {
    syncSystemTime();
    scheduleNextMinuteUpdate();
  }, delay);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    syncSystemTime();
    scheduleNextMinuteUpdate();
  }
});

populateTimezoneSelect();
buildTable();
syncSystemTime();
scheduleNextMinuteUpdate();
