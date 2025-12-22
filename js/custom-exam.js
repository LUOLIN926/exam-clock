// 全局变量
let customExams = [];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
  // 设置默认日期为今天
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  document.getElementById('customExamDate').value = dateString;

  // 添加第一个默认环节
  addSection();

  // 绑定事件监听器
  document.getElementById('addSectionBtn').addEventListener('click', addSection);
  document.getElementById('saveCustomExamBtn').addEventListener('click', saveCustomExam);
  document.getElementById('applyCustomExamBtn').addEventListener('click', applyCustomExam);
  document.getElementById('backToMainBtn').addEventListener('click', function () {
    window.location.href = 'index.html';
  });

  // 加载已保存的配置
  loadSavedExams();
});

// 添加考试环节
function addSection() {
  const container = document.getElementById('sectionsContainer');

  const sectionRow = document.createElement('div');
  sectionRow.className = 'section-row';
  sectionRow.innerHTML = `
    <div class="section-item">
      <input type="text" class="section-name" placeholder="环节名称" required>
      <input type="number" class="section-duration" placeholder="时长(分钟)" min="1" value="30" required>
      <input type="text" class="section-description" placeholder="环节描述（可选）">
      <div class="section-actions">
        <button type="button" class="remove-section-btn">删除</button>
      </div>
    </div>
  `;

  container.appendChild(sectionRow);

  // 为新添加的删除按钮绑定事件
  sectionRow.querySelector('.remove-section-btn').addEventListener('click', function () {
    removeSection(this);
  });
}

// 删除考试环节
function removeSection(button) {
  const sectionRow = button.closest('.section-row');
  if (document.querySelectorAll('.section-row').length > 1) {
    sectionRow.remove();
  } else {
    alert('至少需要保留一个环节');
  }
}

// 保存自定义考试配置
function saveCustomExam() {
  const examName = document.getElementById('customExamName').value;
  const examStartTime = document.getElementById('customExamStartTime').value;
  const examDate = document.getElementById('customExamDate').value;

  if (!examName) {
    alert('请输入考试名称');
    return;
  }

  const sections = [];
  const sectionRows = document.querySelectorAll('.section-row');
  let totalMinutes = 0;

  for (let i = 0; i < sectionRows.length; i++) {
    const row = sectionRows[i];
    const name = row.querySelector('.section-name').value;
    const duration = parseInt(row.querySelector('.section-duration').value);
    let description = row.querySelector('.section-description').value;

    // 如果没有填写描述，则使用环节名称作为描述
    if (!description) {
      description = name;
    }

    if (!name || !duration) {
      alert(`请完整填写第${i + 1}个环节的信息`);
      return;
    }

    sections.push({
      name: name,
      duration: duration,
      description: description
    });

    totalMinutes += duration;
  }

  // 构造考试时间段字符串
  const startTime = examStartTime;
  const [hours, minutes] = startTime.split(':').map(Number);
  const endTime = new Date(2000, 0, 1, hours, minutes);
  endTime.setMinutes(endTime.getMinutes() + totalMinutes);

  // 检查是否跨日期
  let endTimeString;
  if (endTime.getDate() > 1 || (endTime.getHours() < hours)) {
    // 跨日期情况，显示第二天的时间
    endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  } else {
    endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  }

  const timeRange = `${startTime} - ${endTimeString}`;

  const customExam = {
    id: Date.now(), // 用时间戳作为唯一ID
    name: examName,
    startTime: examStartTime,
    date: examDate,
    timeRange: timeRange,
    sections: sections,
    totalMinutes: totalMinutes
  };

  // 检查是否已存在同名考试
  const existingIndex = customExams.findIndex(exam => exam.name === examName);
  if (existingIndex >= 0) {
    if (confirm(`已存在名为"${examName}"的考试配置，是否覆盖？`)) {
      customExams[existingIndex] = customExam;
    } else {
      return;
    }
  } else {
    customExams.push(customExam);
  }

  // 保存到localStorage
  localStorage.setItem('customExams', JSON.stringify(customExams));

  alert(`考试"${examName}"配置已保存！`);

  // 重新加载已保存的配置列表
  loadSavedExams();
}

// 加载已保存的配置
function loadSavedExams() {
  // 从localStorage加载
  const savedExams = localStorage.getItem('customExams');
  if (savedExams) {
    customExams = JSON.parse(savedExams);
  }

  // 更新配置列表显示
  const listContainer = document.getElementById('savedExamsList');
  listContainer.innerHTML = '';

  if (customExams.length === 0) {
    listContainer.innerHTML = '<p class="no-exams">暂无保存的配置</p>';
    return;
  }

  customExams.forEach(exam => {
    const examItem = document.createElement('div');
    examItem.className = 'exam-item';
    examItem.innerHTML = `
      <h3>${exam.name}</h3>
      <p>时间: ${exam.timeRange}</p>
      <p>总时长: ${exam.totalMinutes}分钟</p>
      <p>环节数: ${exam.sections.length}个</p>
      <div class="exam-actions">
        <button class="apply-exam-btn" data-id="${exam.id}">应用</button>
        <button class="delete-exam-btn" data-id="${exam.id}">删除</button>
      </div>
    `;

    listContainer.appendChild(examItem);
  });

  // 为新添加的应用和删除按钮绑定事件
  document.querySelectorAll('.apply-exam-btn').forEach(button => {
    button.removeEventListener('click', handleApplyClick); // 先移除可能存在的旧监听器
    button.addEventListener('click', handleApplyClick);
  });

  document.querySelectorAll('.delete-exam-btn').forEach(button => {
    button.removeEventListener('click', handleDeleteClick); // 先移除可能存在的旧监听器
    button.addEventListener('click', handleDeleteClick);
  });
}

// 处理应用按钮点击事件
function handleApplyClick() {
  const examId = parseInt(this.getAttribute('data-id'));
  applySavedExam(examId);
}

// 处理删除按钮点击事件
function handleDeleteClick() {
  const examId = parseInt(this.getAttribute('data-id'));
  deleteSavedExam(examId);
}

// 应用已保存的考试配置
function applySavedExam(examId) {
  const exam = customExams.find(exam => exam.id === examId);
  if (!exam) {
    alert('未找到选定的考试配置');
    return;
  }

  // 保存选中的考试配置到localStorage，供主页面使用
  localStorage.setItem('selectedCustomExam', JSON.stringify(exam));

  // 跳转到主页面
  window.location.href = 'index.html';
}

// 删除已保存的考试配置
function deleteSavedExam(examId) {
  if (!confirm('确定要删除这个考试配置吗？')) {
    return;
  }

  customExams = customExams.filter(exam => exam.id !== examId);
  localStorage.setItem('customExams', JSON.stringify(customExams));
  loadSavedExams();
}

// 应用当前表单中的自定义考试配置
function applyCustomExam() {
  const examName = document.getElementById('customExamName').value;
  const examStartTimeValue = document.getElementById('customExamStartTime').value;
  const examDate = document.getElementById('customExamDate').value;

  if (!examName) {
    alert('请输入考试名称');
    return;
  }

  const sections = [];
  const sectionRows = document.querySelectorAll('.section-row');
  let totalMinutes = 0;

  // 验证并收集环节信息
  for (let i = 0; i < sectionRows.length; i++) {
    const row = sectionRows[i];
    const name = row.querySelector('.section-name').value;
    const duration = parseInt(row.querySelector('.section-duration').value);
    let description = row.querySelector('.section-description').value;

    // 如果没有填写描述，则使用环节名称作为描述
    if (!description) {
      description = name;
    }

    if (!name || !duration) {
      alert(`请完整填写第${i + 1}个环节的信息`);
      return;
    }

    sections.push({
      name: name,
      duration: duration,
      description: description
    });

    totalMinutes += duration;
  }

  // 构造考试时间段字符串
  const startTime = examStartTimeValue;
  const [hours, minutes] = startTime.split(':').map(Number);
  const endTime = new Date(2000, 0, 1, hours, minutes);
  endTime.setMinutes(endTime.getMinutes() + totalMinutes);

  // 检查是否跨日期
  let endTimeString;
  if (endTime.getDate() > 1 || (endTime.getHours() < hours)) {
    // 跨日期情况，显示第二天的时间
    endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  } else {
    endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  }

  const timeRange = `${startTime} - ${endTimeString}`;

  // 构造考试配置
  const customExam = {
    id: Date.now(), // 添加ID以便在主页面识别
    name: examName,
    startTime: examStartTimeValue,
    date: examDate,
    timeRange: timeRange,
    sections: sections,
    totalMinutes: totalMinutes
  };

  // 保存选中的考试配置到localStorage，供主页面使用
  localStorage.setItem('selectedCustomExam', JSON.stringify(customExam));

  // 跳转到主页面
  window.location.href = 'index.html';
}