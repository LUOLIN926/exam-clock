// CET-4 考试环节配置
const cet4Sections = [
  {
    name: "考前准备",
    start: 0,
    duration: 10,
    end: 10,
    description: "发卷、填写个人信息、贴条形码",
    realTime: "9:00-9:10",
  },
  {
    name: "写作",
    start: 10,
    duration: 30,
    end: 40,
    description: "作文写作（不能翻看试题册）",
    realTime: "9:10-9:40",
  },
  {
    name: "听力",
    start: 40,
    duration: 25,
    end: 65,
    description: "听力理解（边听边涂答题卡1）",
    realTime: "9:40-10:05",
  },
  {
    name: "收答题卡1",
    start: 65,
    duration: 5,
    end: 70,
    description: "听力结束后立即收答题卡1",
    realTime: "10:05-10:10",
  },
  {
    name: "阅读理解 + 翻译",
    start: 70,
    duration: 70,
    end: 140,
    description: "作答在答题卡2（阅读40min+翻译30min）",
    realTime: "10:10-11:20",
  },
  {
    name: "考试结束",
    start: 140,
    duration: 0,
    end: 140,
    description: "收答题卡2和试题册",
    realTime: "11:20",
  },
];

// CET-6 考试环节配置
const cet6Sections = [
  {
    name: "考前准备",
    start: 0,
    duration: 10,
    end: 10,
    description: "发卷、填写个人信息、贴条形码",
    realTime: "15:00-15:10",
  },
  {
    name: "写作",
    start: 10,
    duration: 30,
    end: 40,
    description: "作文写作（不能翻看试题册）",
    realTime: "15:10-15:40",
  },
  {
    name: "听力",
    start: 40,
    duration: 30,
    end: 70,
    description: "听力理解（边听边涂答题卡1）",
    realTime: "15:40-16:10",
  },
  {
    name: "收答题卡1",
    start: 70,
    duration: 5,
    end: 75,
    description: "听力结束后立即收答题卡1",
    realTime: "16:10-16:15",
  },
  {
    name: "阅读理解 + 翻译",
    start: 75,
    duration: 70,
    end: 145,
    description: "作答在答题卡2（阅读40min+翻译30min）",
    realTime: "16:15-17:25",
  },
  {
    name: "考试结束",
    start: 145,
    duration: 0,
    end: 145,
    description: "收答题卡2和试题册",
    realTime: "17:25",
  },
];

// 官方考试预设
const officialExams = {
  cet4: {
    name: "CET-4",
    sections: cet4Sections,
    totalTime: 140 * 60,
    examDate: "2026年6月13日上午",
    examTimeRange: "9:00 - 11:20",
    examStartTime: { hours: 9, minutes: 0 },
  },
  cet6: {
    name: "CET-6",
    sections: cet6Sections,
    totalTime: 145 * 60,
    examDate: "2026年6月13日下午",
    examTimeRange: "15:00 - 17:25",
    examStartTime: { hours: 15, minutes: 0 },
  },
};

// 加载自定义考试配置到 window.customExams
function loadCustomExams() {
  const savedExams = localStorage.getItem("customExams");
  if (savedExams) {
    try {
      window.customExams = JSON.parse(savedExams);
    } catch (e) {
      console.error("解析自定义考试数据失败，已重置为默认值", e);
      setDefaultCustomExams();
    }
  } else {
    setDefaultCustomExams();
  }
}

function setDefaultCustomExams() {
  // 如果没有保存的自定义考试，或者解析失败，设置默认预设
  window.customExams = [
    {
      id: 1,
      name: "参考预设：中期模拟考试",
      startTime: "09:00",
      date: "2026-06-20",
      timeRange: "09:00 - 11:30",
      totalMinutes: 150,
      displaySettings: {
        showCurrentTime: false,
        showCountdownTimer: true,
        showSectionTimer: true,
      },
      sections: [
        {
          name: "考前准备",
          duration: 10,
          description: "发卷及填写信息",
          countInTotal: true,
        },
        {
          name: "第一部分",
          duration: 60,
          description: "选择题模块",
          countInTotal: true,
        },
        {
          name: "第二部分",
          duration: 80,
          description: "主观题模块",
          countInTotal: true,
        },
        {
          name: "考试结束",
          duration: 0,
          description: "收起试卷",
          countInTotal: false,
        },
      ],
    },
  ];
  // 保存默认预设到 localStorage
  localStorage.setItem("customExams", JSON.stringify(window.customExams));
}

// 在脚本加载时立即加载自定义考试配置
loadCustomExams();

// 当前使用的考试类型（默认为CET-4）
let currentExamType = "cet4";
let examSections = cet4Sections;

// 总考试时间（以秒为单位）
let totalTime = 140 * 60; // CET-4总时间

let timer = null;
let timeLeft = 140 * 60;
let isRunning = false;
let currentSectionIndex = 0;
let examStartTime = new Date();
examStartTime.setHours(9, 0, 0, 0); // CET-4开始时间

let startTimeStamp = null; // 计时器最近一次启动或恢复时的系统时间戳
let elapsedBeforeLastStart = 0; // 最近一次启动或恢复前，考试已经累计消耗的秒数

// 添加变量跟踪倒计时显示状态
let isCountdownVisible = true;

// 确保所有全局变量都有初始值
if (isNaN(totalTime) || totalTime <= 0) {
  totalTime = 140 * 60; // 默认为CET-4总时间
}

if (isNaN(timeLeft) || timeLeft <= 0) {
  timeLeft = totalTime;
}

// 确保examStartTime是有效日期
if (!(examStartTime instanceof Date) || isNaN(examStartTime.getTime())) {
  examStartTime = new Date();
  examStartTime.setHours(currentExamType === "cet4" ? 9 : 15, 0, 0, 0);
}

// 初始化全局变量
function initializeGlobals() {
  // 设置默认为CET-4
  currentExamType = "cet4";
  examSections = cet4Sections;
  totalTime = officialExams.cet4.totalTime;
  timeLeft = totalTime;
  examStartTime = new Date();
  examStartTime.setHours(9, 0, 0, 0);

  // 更新UI元素
  document.getElementById("examType").textContent = officialExams.cet4.name;
  document.getElementById("examTitle").textContent = officialExams.cet4.name;
  document.getElementById("examDate").textContent = officialExams.cet4.examDate;
  document.getElementById("examTimeRange").textContent =
    officialExams.cet4.examTimeRange;

  // Calculate days left
  const targetDate = new Date("2026-06-13T09:00:00");
  const now = new Date();
  const diffTime = targetDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("examCountdown").textContent =
    `距离考试还有 ${diffDays > 0 ? diffDays : 0} 天`;
  document.getElementById("totalTime").textContent = totalTime / 60;
  document.getElementById("remainingTime").textContent = totalTime / 60;
  document.getElementById("timer").textContent = formatTime(timeLeft);
  document.getElementById("currentTimeSpan").textContent = "09:00:00";

  // 重置考试状态
  resetExam();
  updateSectionOptions();
  updateSectionList();

  // 更新切换按钮文本 - 不再需要，因为按钮已移除
  // const toggleBtn = document.getElementById('toggleExamBtn');
  // const toggleBtnSmall = document.getElementById('toggleExamBtnSmall');
  // if (toggleBtn) toggleBtn.textContent = '切换为CET-6';
  // if (toggleBtnSmall) toggleBtnSmall.textContent = '切换为CET-6';

  // 设置预设选择器的默认显示值
  if (document.getElementById("selectedPreset")) {
    document.getElementById("selectedPreset").innerHTML =
      '<span>CET-4 (大学英语四级)</span><span class="dropdown-arrow">▼</span>';
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function getRealTime(currentTime) {
  // 确保examStartTime是有效的日期对象
  if (!(examStartTime instanceof Date) || isNaN(examStartTime.getTime())) {
    examStartTime = new Date();
    examStartTime.setHours(currentExamType === "cet4" ? 9 : 15, 0, 0, 0);
  }

  const actualTime = new Date(examStartTime.getTime() + currentTime * 1000);
  return actualTime.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function updateTimer() {
  // 基于系统时间戳计算准确的 timeLeft
  if (isRunning && startTimeStamp) {
    const elapsedSeconds = Math.floor((Date.now() - startTimeStamp) / 1000);
    timeLeft = Math.max(
      0,
      totalTime - (elapsedBeforeLastStart + elapsedSeconds),
    );
  }

  // 检查是否结束
  if (timeLeft <= 0) {
    timeLeft = 0; // 确保时间不为负数
    clearInterval(timer);
    isRunning = false;
    updateButtons();

    // 更新 UI 为结束状态
    document.getElementById("timer").textContent = formatTime(0);
    document.getElementById("remainingTime").textContent = 0;
    document.getElementById("progressFill").style.width = "100%";
    document.getElementById("currentSection").textContent = "考试结束！";
    document.getElementById("sectionTimer").style.display = "none";
    document.getElementById("currentTimeSpan").textContent =
      getRealTime(totalTime);
    document.querySelector(".countdown-value").textContent = "考试已结束";
    updateSectionList();
    return;
  }

  document.getElementById("timer").textContent = formatTime(timeLeft);

  // 计算剩余时间
  document.getElementById("remainingTime").textContent = Math.ceil(
    timeLeft / 60,
  );

  // 更新进度条
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;

  // 更新当前环节
  const currentTime = totalTime - timeLeft;
  let currentSection = null;
  let nextSection = null;
  let nextSectionTime = 0;

  for (let i = 0; i < examSections.length; i++) {
    if (
      currentTime >= examSections[i].start * 60 &&
      currentTime < examSections[i].end * 60
    ) {
      currentSection = examSections[i];
      currentSectionIndex = i;

      // 找到下一环节
      if (i < examSections.length - 1) {
        nextSection = examSections[i + 1];
        nextSectionTime = examSections[i + 1].start * 60 - currentTime;
      }
      break;
    }
  }

  // 更新当前环节显示
  if (currentSection) {
    const sectionEndTime = currentSection.end * 60;
    const sectionStartTime = currentSection.start * 60;
    const timeInCurrentSection = currentTime - sectionStartTime;
    const timeLeftInSection = Math.max(0, sectionEndTime - currentTime);

    // 更新本环节倒计时显示
    document.getElementById("sectionTimer").style.display = "block";
    document.querySelector("#sectionTimer .time-value").textContent =
      formatTime(timeLeftInSection);

    document.getElementById("currentSection").innerHTML = `
                <strong>当前环节：</strong>${currentSection.name}<br>
                <small style="color: var(--color-text-muted);">${currentSection.description}</small><br>
                <small style="color: var(--color-text-light);">考场时间: ${currentSection.realTime}</small>
            `;
  } else if (timeLeft > 0) {
    // 考试还没开始
    document.getElementById("currentSection").textContent =
      "考试尚未开始，请点击开始按钮";
    document.getElementById("sectionTimer").style.display = "none";
  } else {
    // 考试已结束
    document.getElementById("currentSection").textContent = "考试结束！";
    document.getElementById("sectionTimer").style.display = "none";
  }

  // 更新倒计时
  if (nextSection) {
    document.querySelector(".countdown-value").textContent =
      `"${nextSection.name}"`;
  } else if (timeLeft > 0) {
    document.querySelector(".countdown-value").textContent = "即将结束";
  }

  // 更新环节列表
  updateSectionList();

  // 更新实时时间显示
  document.getElementById("currentTimeSpan").textContent = getRealTime(
    totalTime - timeLeft,
  );
}

function updateSectionList() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  examSections.forEach((section, index) => {
    const currentTime = totalTime - timeLeft;
    const sectionStart = section.start * 60;
    const sectionEnd = section.end * 60;

    let status = "upcoming";
    let isActive = false;
    let isCompleted = false;

    // 只有在考试进行中时才计算实际状态
    if (isRunning) {
      if (currentTime >= sectionStart && currentTime < sectionEnd) {
        status = "current";
        isActive = true;
      } else if (currentTime >= sectionEnd) {
        status = "completed";
        isCompleted = true;
      }
    }

    // 构建基础类名
    let className = "section";
    if (isActive) className += " active";
    if (isCompleted) className += " completed";

    const sectionDiv = document.createElement("div");
    sectionDiv.className = className;

    let statusText = "";
    switch (status) {
      case "current":
        statusText = '<span class="status-current">进行中</span>';
        break;
      case "completed":
        statusText = '<span class="status-completed">已完成</span>';
        break;
      case "upcoming":
        statusText = '<span class="status-upcoming">待开始</span>';
        break;
    }

    sectionDiv.innerHTML = `
                <div class="section-title">${section.name} (${section.duration}min)</div>
                <div class="section-time">${section.description}</div>
                <div class="section-real-time">考场时间: ${section.realTime}</div>
                ${statusText}
            `;

    timeline.appendChild(sectionDiv);
  });

  // 更新已完成环节统计
  const completed = examSections.filter((section) => {
    if (isRunning) {
      return totalTime - timeLeft >= section.end * 60;
    }
    return false;
  }).length;

  document.getElementById("completedSections").textContent = completed;
}

function startExam() {
  // 如果考试已经结束，先重置再开始
  if (timeLeft <= 0) {
    resetExam();
  }

  isRunning = true;
  startTimeStamp = Date.now();
  elapsedBeforeLastStart = totalTime - timeLeft;
  timer = setInterval(updateTimer, 1000);
  updateButtons();
  updateSectionList();
}

function pauseExam() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    if (startTimeStamp) {
      const elapsedSeconds = Math.floor((Date.now() - startTimeStamp) / 1000);
      elapsedBeforeLastStart += elapsedSeconds;
      timeLeft = Math.max(0, totalTime - elapsedBeforeLastStart);
    }
    updateButtons();
  }
}

function resetExam() {
  clearInterval(timer);
  isRunning = false;
  startTimeStamp = null;
  elapsedBeforeLastStart = 0;
  timeLeft = totalTime;
  currentSectionIndex = 0;
  document.getElementById("timer").textContent = formatTime(timeLeft);
  // 使用getRealTime函数获取正确的时间显示
  document.getElementById("currentTimeSpan").textContent = getRealTime(0);
  document.getElementById("sectionTimer").style.display = "none";
  updateButtons();
  updateSectionList();
  document.getElementById("currentSection").textContent =
    "考试尚未开始，请点击开始按钮";
  document.querySelector(".countdown-value").textContent = "--";
  document.getElementById("progressFill").style.width = "0%";
  document.getElementById("remainingTime").textContent = totalTime / 60;
}

function syncTimeOnManualChange() {
  elapsedBeforeLastStart = totalTime - timeLeft;
  if (isRunning) {
    startTimeStamp = Date.now();
  }
}

function updateButtons() {
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (isRunning) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  // 根据考试状态更新开始按钮的文本
  if (timeLeft <= 0) {
    // 考试结束，显示"再次考试"
    startBtn.textContent = "再次考试";
  } else if (!isRunning && totalTime - timeLeft > 0) {
    // 暂停状态，显示"继续考试"
    startBtn.textContent = "继续考试";
  } else {
    // 默认状态，显示"开始考试"
    startBtn.textContent = "开始考试";
  }
}

function handleSectionChange() {
  const selectedValue = document.getElementById("sectionSelect").value;
  const targetTime = examSections[selectedValue].start * 60;
  timeLeft = totalTime - targetTime;
  syncTimeOnManualChange();
  currentSectionIndex = parseInt(selectedValue);
  document.getElementById("currentTimeSpan").textContent =
    getRealTime(targetTime);
  updateSectionList();
}

function skipToSelectedSection() {
  const selectedValue = document.getElementById("sectionSelect").value;
  const targetTime = examSections[selectedValue].start * 60;
  timeLeft = totalTime - targetTime;
  syncTimeOnManualChange();
  currentSectionIndex = parseInt(selectedValue);
  document.getElementById("currentTimeSpan").textContent =
    getRealTime(targetTime);
  updateSectionList();
  document.getElementById("timer").textContent = formatTime(timeLeft);

  // 更新本环节倒计时显示
  if (examSections[currentSectionIndex]) {
    const section = examSections[currentSectionIndex];
    const timeLeftInSection = (section.end - section.start) * 60;
    document.getElementById("sectionTimer").style.display = "block";
    document.querySelector("#sectionTimer .time-value").textContent =
      formatTime(timeLeftInSection);
  }
}

// 函数：跳转到下一个环节
function nextSection() {
  // 如果考试尚未开始，先启动考试
  if (!isRunning) {
    startExam();
    return;
  }

  // 如果考试已经结束，重置考试
  if (timeLeft <= 0) {
    resetExam();
    return;
  }

  // 获取当前时间
  const currentTime = totalTime - timeLeft;

  // 查找当前环节
  let currentSectionIndex = 0;
  for (let i = 0; i < examSections.length; i++) {
    if (
      currentTime >= examSections[i].start * 60 &&
      currentTime < examSections[i].end * 60
    ) {
      currentSectionIndex = i;
      break;
    }
  }

  // 如果已经是最后一个环节，重置考试
  if (currentSectionIndex >= examSections.length - 1) {
    resetExam();
    return;
  }

  // 如果不是最后一个环节，则跳转到下一个环节
  const nextSectionIndex = currentSectionIndex + 1;
  const targetTime = examSections[nextSectionIndex].start * 60;
  timeLeft = totalTime - targetTime;
  syncTimeOnManualChange();
  document.getElementById("currentTimeSpan").textContent =
    getRealTime(targetTime);
  document.getElementById("timer").textContent = formatTime(timeLeft);

  // 更新本环节倒计时显示
  if (examSections[nextSectionIndex]) {
    const section = examSections[nextSectionIndex];
    const timeLeftInSection = (section.end - section.start) * 60;
    document.getElementById("sectionTimer").style.display = "block";
    document.querySelector("#sectionTimer .time-value").textContent =
      formatTime(timeLeftInSection);
  }

  updateSectionList();
}

function toggleExamType() {
  // 切换考试类型
  if (currentExamType === "cet4") {
    currentExamType = "cet6";
  } else {
    currentExamType = "cet4";
  }

  // 更新考试配置
  updateExamConfig(officialExams[currentExamType]);
}

function updateExamConfig(examConfig) {
  // 更新全局变量
  examSections = examConfig.sections;
  totalTime = examConfig.totalTime;
  timeLeft = totalTime;

  // 设置考试开始时间
  const hours = examConfig.examStartTime.hours;
  const minutes = examConfig.examStartTime.minutes;
  examStartTime = new Date();
  examStartTime.setHours(hours, minutes, 0, 0);

  // 重置当前环节索引
  currentSectionIndex = 0;

  // 更新UI
  document.getElementById("examType").textContent = examConfig.name;
  document.getElementById("examTitle").textContent = examConfig.name;
  document.getElementById("examDate").textContent = examConfig.examDate;
  document.getElementById("examTimeRange").textContent =
    examConfig.examTimeRange;

  // Calculate days left
  const targetDateStr =
    examConfig.name === "CET-6" ? "2026-06-13T15:00:00" : "2026-06-13T09:00:00";
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  const diffTime = targetDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("examCountdown").textContent =
    `距离考试还有 ${diffDays > 0 ? diffDays : 0} 天`;
  document.getElementById("totalTime").textContent = totalTime / 60;
  document.getElementById("remainingTime").textContent = totalTime / 60;
  document.getElementById("timer").textContent = formatTime(timeLeft);

  // 更新当前时间显示
  document.getElementById("currentTimeSpan").textContent =
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

  // 重置考试状态
  resetExam();
  updateSectionOptions();
  updateSectionList();

  // 如果考试正在进行，需要重新启动计时器
  if (isRunning) {
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
  }

  // 重新加载显示设置，确保复选框状态与当前设置一致
  initializeDisplaySettings();

  console.log(`已更新为${examConfig.name}的配置`);
}

function updateSectionOptions() {
  const select = document.getElementById("sectionSelect");
  select.innerHTML = "";

  examSections.forEach((section, index) => {
    if (section.name === "考试结束") {
      select.innerHTML += `<option value="${index}">${section.name} (${section.realTime})</option>`;
    } else {
      select.innerHTML += `<option value="${index}">${section.name} (${section.realTime})</option>`;
    }
  });
}

// 关闭/显示整个标题区域功能
function toggleHeader() {
  const examHeader = document.getElementById("examTimeHeader");
  const closeHeaderBtn = document.getElementById("closeHeaderBtn");
  const restoreHintSmallScreen = document.getElementById(
    "restoreHintSmallScreen",
  );
  const restoreHintLargeScreen = document.getElementById(
    "restoreHintLargeScreen",
  );
  const toggleButtonSmallScreen = document.getElementById(
    "toggleButtonSmallScreen",
  );
  const toggleExamBtnContainer = document.querySelector(
    ".toggle-exam-button-container",
  );

  if (examHeader.style.display !== "none") {
    // 隐藏标题区域
    examHeader.style.display = "none";
    closeHeaderBtn.style.display = "none"; // 隐藏关闭按钮

    // 根据屏幕宽度显示相应的恢复提示
    if (window.innerWidth > 800) {
      restoreHintLargeScreen.style.display = "block";
    } else {
      restoreHintSmallScreen.style.display = "block";
      toggleButtonSmallScreen.style.display = "block";
    }
  } else {
    // 显示标题区域
    examHeader.style.display = "block";
    closeHeaderBtn.style.display = "flex"; // 显示关闭按钮

    // 隐藏恢复提示
    restoreHintSmallScreen.style.display = "none";
    restoreHintLargeScreen.style.display = "none";
    toggleButtonSmallScreen.style.display = "none";
  }
}

// 在DOMContentLoaded事件监听器中添加检查自定义考试配置的代码
document.addEventListener("DOMContentLoaded", function () {
  // 检查是否有从自定义考试页面传递过来的配置
  const selectedCustomExam = localStorage.getItem("selectedCustomExam");
  if (selectedCustomExam) {
    try {
      applyCustomExamConfig(JSON.parse(selectedCustomExam));
    } catch (e) {
      console.error("解析选择的自定义考试配置失败", e);
    }
    // 清除已应用的配置，避免重复应用
    localStorage.removeItem("selectedCustomExam");
  }

  // 在加载完所有配置后，初始化全局变量
  initializeGlobals();

  // 为选择框添加change事件监听器
  const sectionSelectElement = document.getElementById("sectionSelect");
  if (sectionSelectElement) {
    sectionSelectElement.addEventListener("change", handleSectionChange);
  }

  // 为关闭标题区域按钮添加点击事件监听器
  const closeHeaderBtn = document.getElementById("closeHeaderBtn");
  if (closeHeaderBtn) {
    closeHeaderBtn.addEventListener("click", toggleHeader);
  }

  // 为恢复提示添加点击事件监听器
  const restoreHintSmallScreen = document.getElementById(
    "restoreHintSmallScreen",
  );
  const restoreHintLargeScreen = document.getElementById(
    "restoreHintLargeScreen",
  );

  if (restoreHintSmallScreen) {
    restoreHintSmallScreen.addEventListener("click", toggleHeader);
  }

  if (restoreHintLargeScreen) {
    restoreHintLargeScreen.addEventListener("click", toggleHeader);
  }

  // 根据屏幕宽度设置初始显示状态
  const toggleButtonSmallScreen = document.getElementById(
    "toggleButtonSmallScreen",
  );
  const customExamButtonSmallScreen = document.getElementById(
    "customExamButtonSmallScreen",
  );
  if (window.innerWidth <= 800) {
    if (customExamButtonSmallScreen) {
      customExamButtonSmallScreen.style.display = "block";
    }
  } else {
    if (customExamButtonSmallScreen) {
      customExamButtonSmallScreen.style.display = "none";
    }
  }

  // 监听窗口大小变化
  window.addEventListener("resize", function () {
    const customExamButtonSmallScreen = document.getElementById(
      "customExamButtonSmallScreen",
    );
    const restoreHintSmallScreen = document.getElementById(
      "restoreHintSmallScreen",
    );

    if (window.innerWidth <= 800) {
      // 小屏幕显示小屏幕按钮
      if (customExamButtonSmallScreen) {
        customExamButtonSmallScreen.style.display = "block";
      }

      // 如果标题区域被隐藏，显示小屏幕恢复提示
      const examHeader = document.getElementById("examTimeHeader");
      if (
        examHeader &&
        examHeader.style.display === "none" &&
        restoreHintSmallScreen
      ) {
        restoreHintSmallScreen.style.display = "block";
      }
    } else {
      // 大屏幕隐藏小屏幕按钮
      if (customExamButtonSmallScreen) {
        customExamButtonSmallScreen.style.display = "none";
      }
      if (restoreHintSmallScreen) {
        restoreHintSmallScreen.style.display = "none";
      }
    }
  });
});

// 应用自定义考试配置
function applyCustomExamConfig(customExam) {
  // 构造考试配置
  const customSections = [];
  let currentTime = 0;

  customExam.sections.forEach((section, index) => {
    const start = currentTime;
    const duration = section.duration;
    const end = start + duration;

    // 构造时间段字符串
    const [startHours, startMinutes] = customExam.startTime
      .split(":")
      .map(Number);
    const realStartTime = new Date(2000, 0, 1, startHours, startMinutes);
    realStartTime.setMinutes(realStartTime.getMinutes() + start);

    const realEndTime = new Date(2000, 0, 1, startHours, startMinutes);
    realEndTime.setMinutes(realEndTime.getMinutes() + end);

    const realTime =
      `${realStartTime.getHours().toString().padStart(2, "0")}:${realStartTime.getMinutes().toString().padStart(2, "0")}-` +
      `${realEndTime.getHours().toString().padStart(2, "0")}:${realEndTime.getMinutes().toString().padStart(2, "0")}`;

    customSections.push({
      name: section.name,
      start: start,
      duration: duration,
      end: end,
      description: section.description,
      realTime: realTime,
    });

    currentTime = end;
  });

  // 添加考试结束环节
  if (customSections.length > 0) {
    const lastSection = customSections[customSections.length - 1];
    customSections.push({
      name: "考试结束",
      start: lastSection.end,
      duration: 0,
      end: lastSection.end,
      description: "考试结束",
      realTime: lastSection.realTime.split("-")[1],
    });
  }

  // 更新全局变量
  currentExamType = "custom";
  examSections = customSections;
  totalTime = customExam.totalMinutes * 60;
  timeLeft = totalTime;

  // 设置考试开始时间
  const [hours, minutes] = customExam.startTime.split(":").map(Number);
  examStartTime = new Date();
  examStartTime.setHours(hours, minutes, 0, 0);

  // 更新UI
  document.getElementById("examType").textContent = customExam.name;
  document.getElementById("examTitle").textContent = customExam.name;
  document.getElementById("examDate").textContent = formatDate(customExam.date);
  document.getElementById("examTimeRange").textContent =
    `${customExam.startTime} - ${calculateEndTime(customExam.startTime, customExam.totalMinutes)}`;
  document.getElementById("totalTime").textContent = customExam.totalMinutes;
  document.getElementById("remainingTime").textContent =
    customExam.totalMinutes;
  document.getElementById("timer").textContent = formatTime(timeLeft);
  document.getElementById("currentTimeSpan").textContent =
    `${customExam.startTime}:00`;

  // 重置考试状态
  resetExam();
  updateSectionOptions();
  updateSectionList();

  // 如果有自定义的显示设置，则应用它们
  if (customExam.displaySettings) {
    applyDisplaySettings(customExam.displaySettings);
  }

  // 更新切换按钮文本 - 不再需要，因为按钮已移除
  console.log(`已应用自定义考试"${customExam.name}"的配置`);
}

// 格式化日期显示
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 判断上午还是下午
  const hour = date.getHours();
  const period = hour < 12 ? "上午" : "下午";

  return `${year}年${month}月${day}日${period}`;
}

// 计算结束时间（处理跨日期的情况）
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endTime = new Date(2000, 0, 1, hours, minutes);

  // 如果开始时间加上持续时间超过了24小时，则需要处理跨日期的情况
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);

  const timeStr = `${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;
  const isNextDay = endTime.getDate() > 1 || endTime.getHours() < hours;
  return isNextDay ? `${timeStr} (次日)` : timeStr;
}

// 显示设置相关功能
// 添加显示设置的全局变量
let showCurrentTime = true;
let showCountdownTimer = true;
let showSectionTimer = true;

// 初始化显示设置
function initializeDisplaySettings() {
  // 从localStorage加载设置
  const savedSettings = localStorage.getItem("displaySettings");
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      showCurrentTime =
        settings.showCurrentTime !== undefined
          ? settings.showCurrentTime
          : true;
      showCountdownTimer =
        settings.showCountdownTimer !== undefined
          ? settings.showCountdownTimer
          : true;
      showSectionTimer =
        settings.showSectionTimer !== undefined
          ? settings.showSectionTimer
          : true;
    } catch (e) {
      console.error("解析显示设置失败，恢复默认值", e);
      showCurrentTime = true;
      showCountdownTimer = true;
      showSectionTimer = true;
    }
  } else {
    // 默认设置
    showCurrentTime = true;
    showCountdownTimer = true;
    showSectionTimer = true;
  }

  // 更新UI和复选框状态
  updateDisplaySettings();
}

// 应用特定的显示设置
function applyDisplaySettings(displaySettings) {
  // 更新全局变量
  showCurrentTime =
    displaySettings.showCurrentTime !== undefined
      ? displaySettings.showCurrentTime
      : true;
  showCountdownTimer =
    displaySettings.showCountdownTimer !== undefined
      ? displaySettings.showCountdownTimer
      : true;
  showSectionTimer =
    displaySettings.showSectionTimer !== undefined
      ? displaySettings.showSectionTimer
      : true;

  // 保存设置到localStorage
  const settings = {
    showCurrentTime,
    showCountdownTimer,
    showSectionTimer,
  };
  localStorage.setItem("displaySettings", JSON.stringify(settings));

  // 更新UI
  updateDisplaySettings();
}

// 切换显示设置
function toggleDisplaySetting(settingName, value) {
  // 更新变量
  switch (settingName) {
    case "showCurrentTime":
      showCurrentTime = value;
      break;
    case "showCountdownTimer":
      showCountdownTimer = value;
      break;
    case "showSectionTimer":
      showSectionTimer = value;
      break;
  }

  // 保存设置到localStorage
  const settings = {
    showCurrentTime,
    showCountdownTimer,
    showSectionTimer,
  };
  localStorage.setItem("displaySettings", JSON.stringify(settings));

  // 更新UI
  updateDisplaySettings();
}

// 重置显示设置为默认值
function resetDisplaySettings() {
  // 检查当前是否选择了自定义考试，并且它有自定义显示设置
  const selectedCustomExam = localStorage.getItem("selectedCustomExam");
  if (selectedCustomExam) {
    try {
      const exam = JSON.parse(selectedCustomExam);
      if (exam.displaySettings) {
        applyDisplaySettings(exam.displaySettings);
        return;
      }
    } catch (e) {
      console.error("解析选中自定义考试的显示设置失败", e);
    }
  }

  // 如果当前是官方预设或自定义考试没有显示设置，则恢复为全部显示
  applyDisplaySettings({
    showCurrentTime: true,
    showCountdownTimer: true,
    showSectionTimer: true,
  });
}

// 更新显示设置的UI
function updateDisplaySettings() {
  // 更新复选框状态
  const currentTimeCheckbox = document.getElementById("inlineShowCurrentTime");
  const countdownTimerCheckbox = document.getElementById(
    "inlineShowCountdownTimer",
  );
  const sectionTimerCheckbox = document.getElementById(
    "inlineShowSectionTimer",
  );

  if (currentTimeCheckbox) currentTimeCheckbox.checked = showCurrentTime;
  if (countdownTimerCheckbox)
    countdownTimerCheckbox.checked = showCountdownTimer;
  if (sectionTimerCheckbox) sectionTimerCheckbox.checked = showSectionTimer;

  // 控制元素显示/隐藏
  const currentTimeSpan = document.getElementById("currentTimeSpan");
  const timerDisplay = document.querySelector(".timer-display");
  const sectionTimerDisplay = document.getElementById("sectionTimer");

  if (currentTimeSpan) {
    const realTimeDisplay = document.querySelector(".real-time-display");
    if (realTimeDisplay) {
      realTimeDisplay.style.display = showCurrentTime ? "block" : "none";
    }
  }

  if (timerDisplay) {
    timerDisplay.style.display = showCountdownTimer ? "block" : "none";
  }

  if (sectionTimerDisplay) {
    // 根据用户设置和当前考试状态决定显示
    if (showSectionTimer) {
      // 如果用户希望显示，我们只改变它的CSS display属性而不影响其原本的显示状态
      sectionTimerDisplay.style.display = ""; // 重置为默认值
    } else {
      // 如果用户不希望显示，则强制隐藏
      sectionTimerDisplay.style.display = "none";
    }
  }

  // 特别处理本环节倒计时的内部元素
  if (sectionTimerDisplay && !showSectionTimer) {
    // 如果用户不希望显示本环节倒计时，则隐藏内部元素
    const timeValue = sectionTimerDisplay.querySelector(".time-value");
    if (timeValue) {
      timeValue.style.display = "none";
    }
  } else if (sectionTimerDisplay && showSectionTimer) {
    const timeValue = sectionTimerDisplay.querySelector(".time-value");
    if (timeValue) {
      timeValue.style.display = "";
    }
  }
}

// 在DOM加载完成后初始化显示设置
document.addEventListener("DOMContentLoaded", function () {
  initializeDisplaySettings();
});
