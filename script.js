// CET-4 考试环节配置
const cet4Sections = [
  { name: "考前准备", start: 0, duration: 10, end: 10, description: "发卷、填写个人信息、贴条形码", realTime: "9:00-9:10" },
  { name: "写作", start: 10, duration: 30, end: 40, description: "作文写作（不能翻看试题册）", realTime: "9:10-9:40" },
  { name: "听力", start: 40, duration: 25, end: 65, description: "听力理解（边听边涂答题卡1）", realTime: "9:40-10:05" },
  { name: "收答题卡1", start: 65, duration: 5, end: 70, description: "听力结束后立即收答题卡1", realTime: "10:05-10:10" },
  { name: "阅读理解 + 翻译", start: 70, duration: 70, end: 140, description: "作答在答题卡2（阅读40min+翻译30min）", realTime: "10:10-11:20" },
  { name: "考试结束", start: 140, duration: 0, end: 140, description: "收答题卡2和试题册", realTime: "11:20" }
];

// CET-6 考试环节配置 
const cet6Sections = [
  { name: "考前准备", start: 0, duration: 10, end: 10, description: "发卷、填写个人信息、贴条形码", realTime: "15:00-15:10" },
  { name: "写作", start: 10, duration: 30, end: 40, description: "作文写作（不能翻看试题册）", realTime: "15:10-15:40" },
  { name: "听力", start: 40, duration: 30, end: 70, description: "听力理解（边听边涂答题卡1）", realTime: "15:40-16:10" },
  { name: "收答题卡1", start: 70, duration: 5, end: 75, description: "听力结束后立即收答题卡1", realTime: "16:10-16:15" },
  { name: "阅读理解 + 翻译", start: 75, duration: 70, end: 145, description: "作答在答题卡2（阅读40min+翻译30min）", realTime: "16:15-17:25" },
  { name: "考试结束", start: 145, duration: 0, end: 145, description: "收答题卡2和试题册", realTime: "17:25" }
];

// 当前使用的考试类型（默认为CET-4）
let currentExamType = 'cet4';
let examSections = cet4Sections;

// 总考试时间（以秒为单位）
let totalTime = 140 * 60; // CET-4总时间

let timer = null;
let timeLeft = 140 * 60;
let isRunning = false;
let currentSectionIndex = 0;
let examStartTime = new Date();
examStartTime.setHours(9, 0, 0, 0); // CET-4开始时间

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
  examStartTime.setHours(9, 0, 0, 0);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getRealTime(currentTime) {
  // 确保examStartTime是有效的日期对象
  if (!(examStartTime instanceof Date) || isNaN(examStartTime.getTime())) {
    examStartTime = new Date();
    examStartTime.setHours(currentExamType === 'cet4' ? 9 : 15, 0, 0, 0);
  }
  
  const actualTime = new Date(examStartTime.getTime() + currentTime * 1000);
  return actualTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateTimer() {
  // 检查是否结束
  if (timeLeft < 0) {
    clearInterval(timer);
    isRunning = false;
    updateButtons();
    document.getElementById('currentSection').textContent = '考试结束！';
    document.getElementById('currentTimeSpan').textContent = currentExamType === 'cet4' ? '11:20:00' : '17:20:00';
    document.querySelector('.countdown-value').textContent = '考试已结束';
    timeLeft = 0; // 确保时间不为负数
  }

  document.getElementById('timer').textContent = formatTime(timeLeft);

  // 计算剩余时间
  document.getElementById('remainingTime').textContent = Math.ceil(timeLeft / 60);

  // 更新进度条
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  document.getElementById('progressFill').style.width = `${progress}%`;

  // 更新当前环节
  const currentTime = totalTime - timeLeft;
  let currentSection = null;
  let nextSection = null;
  let nextSectionTime = 0;

  for (let i = 0; i < examSections.length; i++) {
    if (currentTime >= examSections[i].start * 60 && currentTime < examSections[i].end * 60) {
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
    document.getElementById('sectionTimer').style.display = 'block';
    document.querySelector('#sectionTimer .time-value').textContent = formatTime(timeLeftInSection);

    document.getElementById('currentSection').innerHTML = `
                <strong>当前环节：</strong>${currentSection.name}<br>
                <small style="color: #7f8c8d;">${currentSection.description}</small><br>
                <small style="color: #800080;">考场时间: ${currentSection.realTime}</small>
            `;
  } else {
    document.getElementById('currentSection').textContent = '考试已结束';
    document.getElementById('sectionTimer').style.display = 'none';
  }

  // 更新倒计时
  if (nextSection) {
    document.querySelector('.countdown-value').textContent = `"${nextSection.name}"`;
  } else if (timeLeft > 0) {
    document.querySelector('.countdown-value').textContent = '即将结束';
  }

  // 更新环节列表
  updateSectionList();

  // 更新实时时间显示
  document.getElementById('currentTimeSpan').textContent = getRealTime(totalTime - timeLeft);

  // 检查是否结束
  if (timeLeft <= 0) {
    clearInterval(timer);
    isRunning = false;
    updateButtons();
    document.getElementById('currentSection').textContent = '考试结束！';
    document.getElementById('currentTimeSpan').textContent = currentExamType === 'cet4' ? '11:20:00' : '17:20:00';
    document.querySelector('.countdown-value').textContent = '考试已结束';
  }

  if (timeLeft > 0) {
    timeLeft--;
  }
}

function updateSectionList() {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';

  examSections.forEach((section, index) => {
    const currentTime = totalTime - timeLeft;
    const sectionStart = section.start * 60;
    const sectionEnd = section.end * 60;

    let status = 'upcoming';
    let isActive = false;
    let isCompleted = false;

    // 只有在考试进行中时才计算实际状态
    if (isRunning) {
      if (currentTime >= sectionStart && currentTime < sectionEnd) {
        status = 'current';
        isActive = true;
      } else if (currentTime >= sectionEnd) {
        status = 'completed';
        isCompleted = true;
      }
    }

    // 构建基础类名
    let className = 'section';
    if (isActive) className += ' active';
    if (isCompleted) className += ' completed';

    const sectionDiv = document.createElement('div');
    sectionDiv.className = className;

    let statusText = '';
    switch (status) {
      case 'current':
        statusText = '<span class="status-current">进行中</span>';
        break;
      case 'completed':
        statusText = '<span class="status-completed">已完成</span>';
        break;
      case 'upcoming':
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
  const completed = examSections.filter(section => {
    if (isRunning) {
      return (totalTime - timeLeft) >= section.end * 60;
    }
    return false;
  }).length;

  document.getElementById('completedSections').textContent = completed;
}

function startExam() {
  // 如果考试已经结束，先重置再开始
  if (timeLeft <= 0) {
    resetExam();
  }

  isRunning = true;
  timer = setInterval(updateTimer, 1000);
  updateButtons();
  updateSectionList();
}

function pauseExam() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    updateButtons();
  }
}

function resetExam() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = totalTime;
  currentSectionIndex = 0;
  document.getElementById('timer').textContent = formatTime(timeLeft);
  document.getElementById('currentTimeSpan').textContent = currentExamType === 'cet4' ? '09:00:00' : '15:00:00';
  document.getElementById('sectionTimer').style.display = 'none';
  updateButtons();
  updateSectionList();
  document.getElementById('currentSection').textContent = '考试尚未开始，请点击开始按钮';
  document.querySelector('.countdown-value').textContent = '--';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('remainingTime').textContent = totalTime / 60;
}

function updateButtons() {
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

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
    startBtn.textContent = '再次考试';
  } else if (!isRunning && totalTime - timeLeft > 0) {
    // 暂停状态，显示"继续考试"
    startBtn.textContent = '继续考试';
  } else {
    // 默认状态，显示"开始考试"
    startBtn.textContent = '开始考试';
  }
}

function handleSectionChange() {
  const selectedValue = document.getElementById('sectionSelect').value;
  const targetTime = examSections[selectedValue].start * 60;
  timeLeft = totalTime - targetTime;
  currentSectionIndex = parseInt(selectedValue);
  document.getElementById('currentTimeSpan').textContent = getRealTime(targetTime);
  updateSectionList();
}

function skipToSelectedSection() {
  const selectedValue = document.getElementById('sectionSelect').value;
  const targetTime = examSections[selectedValue].start * 60;
  timeLeft = totalTime - targetTime;
  currentSectionIndex = parseInt(selectedValue);
  document.getElementById('currentTimeSpan').textContent = getRealTime(targetTime);
  updateSectionList();
  document.getElementById('timer').textContent = formatTime(timeLeft);

  // 更新本环节倒计时显示
  if (examSections[currentSectionIndex]) {
    const section = examSections[currentSectionIndex];
    const timeLeftInSection = (section.end - section.start) * 60;
    document.getElementById('sectionTimer').style.display = 'block';
    document.querySelector('#sectionTimer .time-value').textContent = formatTime(timeLeftInSection);
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
    if (currentTime >= examSections[i].start * 60 && currentTime < examSections[i].end * 60) {
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
  document.getElementById('currentTimeSpan').textContent = getRealTime(targetTime);
  document.getElementById('timer').textContent = formatTime(timeLeft);

  // 更新本环节倒计时显示
  if (examSections[nextSectionIndex]) {
    const section = examSections[nextSectionIndex];
    const timeLeftInSection = (section.end - section.start) * 60;
    document.getElementById('sectionTimer').style.display = 'block';
    document.querySelector('#sectionTimer .time-value').textContent = formatTime(timeLeftInSection);
  }

  updateSectionList();
}

function toggleExamType() {
  // 切换考试类型
  if (currentExamType === 'cet4') {
    currentExamType = 'cet6';
    examSections = cet6Sections;
    document.getElementById('examType').textContent = 'CET-6';
    document.getElementById('examDate').textContent = '2025年12月13日下午';
    document.getElementById('examTimeRange').textContent = '15:00 - 17:25';
    document.getElementById('toggleExamBtn').textContent = '切换为CET-4';
    document.getElementById('toggleExamBtnSmall').textContent = '切换为CET-4';
    examStartTime.setHours(15, 0, 0, 0); // CET-6开始时间
    totalTime = 145 * 60;
    timeLeft = totalTime;

    // 更新标题
    document.getElementById('examTitle').textContent = 'CET-6';
  } else {
    currentExamType = 'cet4';
    examSections = cet4Sections;
    document.getElementById('examType').textContent = 'CET-4';
    document.getElementById('examDate').textContent = '2025年12月13日上午';
    document.getElementById('examTimeRange').textContent = '9:00 - 11:20';
    document.getElementById('toggleExamBtn').textContent = '切换为CET-6';
    document.getElementById('toggleExamBtnSmall').textContent = '切换为CET-6';
    examStartTime.setHours(9, 0, 0, 0); // CET-4开始时间
    totalTime = 140 * 60;
    timeLeft = totalTime;

    // 更新标题
    document.getElementById('examTitle').textContent = 'CET-4';
  }

  // 重置考试状态
  resetExam();
  updateSectionOptions();
  document.getElementById('totalTime').textContent = totalTime / 60;

  // 更新初始时间显示
  document.getElementById('timer').textContent = formatTime(timeLeft);
  document.getElementById('currentTimeSpan').textContent = currentExamType === 'cet4' ? '09:00:00' : '15:00:00';
}

function updateSectionOptions() {
  const select = document.getElementById('sectionSelect');
  select.innerHTML = '';

  examSections.forEach((section, index) => {
    if (section.name === "考试结束") {
      select.innerHTML += `<option value="${index}">${section.name} (${section.realTime})</option>`;
    } else {
      select.innerHTML += `<option value="${index}">${section.name} (${section.realTime})</option>`;
    }
  });
}

// 计算并显示距离考试的天数
function updateExamCountdown() {
  const examDate = new Date(2025, 11, 13); // 2025年12月13日 (月份从0开始，所以11代表12月)
  const today = new Date();
  const timeDiff = examDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const countdownElement = document.getElementById('examCountdown');
  if (daysDiff > 0) {
    countdownElement.textContent = `距离考试还有 ${daysDiff} 天`;
  } else if (daysDiff === 0) {
    countdownElement.textContent = '今天考试啦！';
  } else {
    countdownElement.textContent = '考试已结束，成绩将在2026年2月底公布';
  }
}

// 关闭/显示整个标题区域功能
function toggleHeader() {
  const examHeader = document.getElementById('examTimeHeader');
  const closeHeaderBtn = document.getElementById('closeHeaderBtn');
  const restoreHintSmallScreen = document.getElementById('restoreHintSmallScreen');
  const restoreHintLargeScreen = document.getElementById('restoreHintLargeScreen');
  const toggleButtonSmallScreen = document.getElementById('toggleButtonSmallScreen');
  const toggleExamBtnContainer = document.querySelector('.toggle-exam-button-container');

  if (examHeader.style.display !== 'none') {
    // 隐藏标题区域
    examHeader.style.display = 'none';
    closeHeaderBtn.style.display = 'none'; // 隐藏关闭按钮

    // 根据屏幕宽度显示相应的恢复提示
    if (window.innerWidth > 800) {
      restoreHintLargeScreen.style.display = 'block';
    } else {
      restoreHintSmallScreen.style.display = 'block';
      toggleButtonSmallScreen.style.display = 'block';
    }
  } else {
    // 显示标题区域
    examHeader.style.display = 'block';
    closeHeaderBtn.style.display = 'flex'; // 显示关闭按钮

    // 隐藏恢复提示
    restoreHintSmallScreen.style.display = 'none';
    restoreHintLargeScreen.style.display = 'none';
    toggleButtonSmallScreen.style.display = 'none';
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
  // 确保所有变量都被正确初始化
  if (isNaN(totalTime) || totalTime <= 0) {
    totalTime = 140 * 60; // 默认为CET-4总时间
  }
  
  if (isNaN(timeLeft) || timeLeft <= 0) {
    timeLeft = totalTime;
  }
  
  // 确保examStartTime是有效日期
  if (!(examStartTime instanceof Date) || isNaN(examStartTime.getTime())) {
    examStartTime = new Date();
    examStartTime.setHours(currentExamType === 'cet4' ? 9 : 15, 0, 0, 0);
  }
  
  // 确保totalTime正确显示
  const totalTimeElement = document.getElementById('totalTime');
  if (totalTimeElement) {
    totalTimeElement.textContent = Math.floor(totalTime / 60);
  }
  
  const remainingTimeElement = document.getElementById('remainingTime');
  if (remainingTimeElement) {
    remainingTimeElement.textContent = Math.ceil(timeLeft / 60);
  }
  
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = formatTime(timeLeft);
  }
  
  const currentTimeSpanElement = document.getElementById('currentTimeSpan');
  if (currentTimeSpanElement) {
    currentTimeSpanElement.textContent = getRealTime(0);
  }
  
  updateSectionList();
  updateSectionOptions(); // 确保在初始加载时设置正确的选项

  // 计算并显示距离考试的天数
  updateExamCountdown();

  // 为选择框添加change事件监听器
  const sectionSelectElement = document.getElementById('sectionSelect');
  if (sectionSelectElement) {
    sectionSelectElement.addEventListener('change', handleSectionChange);
  }

  // 为关闭标题区域按钮添加点击事件监听器
  const closeHeaderBtn = document.getElementById('closeHeaderBtn');
  if (closeHeaderBtn) {
    closeHeaderBtn.addEventListener('click', toggleHeader);
  }

  // 为恢复提示添加点击事件监听器
  const restoreHintSmallScreen = document.getElementById('restoreHintSmallScreen');
  const restoreHintLargeScreen = document.getElementById('restoreHintLargeScreen');

  if (restoreHintSmallScreen) {
    restoreHintSmallScreen.addEventListener('click', toggleHeader);
  }

  if (restoreHintLargeScreen) {
    restoreHintLargeScreen.addEventListener('click', toggleHeader);
  }

  // 根据屏幕宽度设置初始显示状态
  const toggleButtonSmallScreen = document.getElementById('toggleButtonSmallScreen');
  if (toggleButtonSmallScreen && window.innerWidth <= 800) {
    toggleButtonSmallScreen.style.display = 'none';
  }
});
