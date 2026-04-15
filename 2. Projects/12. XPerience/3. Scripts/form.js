// form.js — Overlay form logic
// Steps: 1 (path) → 2 (occasion) → 3 (names) → 4 (tier) → 5 (experiences)
//        → 6 (dynamic questions) → 7 (memory) → 8 (date/time) → 9 (contact) → success

// ─── State ────────────────────────────────────────────────────────
const TOTAL_STEPS = 9;

let stepHistory  = [];  // stack for back navigation
let currentStep  = 1;

let formData = {
  path:                '',   // 'A' or 'B'
  occasion:            '',
  guestName:           '',   // path A
  yourName:            '',   // path B
  partnerName:         '',   // path B
  tier:                null,
  maxExperiences:      1,
  selectedExperiences: [],
  experienceAnswers:   {},
  specialMemory:       '',
  preferredDate:       '',
  timeOfDay:           '',
  contactName:         '',
  contactEmail:        '',
  contactPhone:        '',
  submittedAt:         ''
};

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Open overlay buttons
  document.querySelectorAll('.open-form-btn').forEach(btn => {
    btn.addEventListener('click', openOverlay);
  });

  // Close / back / confirm
  document.getElementById('overlayClose').addEventListener('click', confirmClose);
  document.getElementById('overlayBack').addEventListener('click', goBack);
  document.getElementById('confirmLeave').addEventListener('click', leaveForm);
  document.getElementById('confirmStay').addEventListener('click', dismissConfirm);

  // Keyboard
  document.addEventListener('keydown', handleKeydown);

  // Wire up all step interactions
  setupPathButtons();
  setupOccasionButtons();
  setupNameStep();
  setupTierButtons();
  setupExperienceButtons();
  setupMemoryStep();
  setupDateStep();
  setupContactStep();
});

// ─── Overlay open / close ─────────────────────────────────────────
function openOverlay() {
  resetForm();
  const overlay = document.getElementById('formOverlay');
  overlay.classList.add('open');
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  document.body.style.overflow = 'hidden';
  goToStep(1);
}

function closeOverlay() {
  const overlay = document.getElementById('formOverlay');
  gsap.to(overlay, {
    opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function confirmClose() {
  if (currentStep <= 1) { closeOverlay(); return; }
  document.getElementById('confirmOverlay').classList.add('open');
}

function leaveForm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  closeOverlay();
}

function dismissConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
}

// ─── Step navigation ──────────────────────────────────────────────
function goToStep(stepId) {
  if (currentStep !== stepId) {
    stepHistory.push(currentStep);
  }
  currentStep = stepId;
  showStep(stepId);
  updateBackButton();
}

function goBack() {
  if (stepHistory.length === 0) return;
  const prev = stepHistory.pop();
  currentStep = prev;
  showStep(prev);
  updateBackButton();
}

function showStep(stepId) {
  // Hide all steps instantly
  document.querySelectorAll('.form-step').forEach(s => {
    gsap.set(s, { display: 'none', opacity: 0 });
    s.classList.remove('active');
  });

  const selector = stepId === 'success'
    ? '[data-step="success"]'
    : `[data-step="${stepId}"]`;

  const target = document.querySelector(selector);
  if (!target) return;

  target.classList.add('active');
  gsap.set(target, { display: 'block' });
  gsap.fromTo(target,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
  );

  // Step-specific prep
  if (stepId === 3)  prepNameStep();
  if (stepId === 5)  prepExperienceStep();
  if (stepId === 7)  prepMemoryQuestion();

  updateProgress(stepId);
}

function updateBackButton() {
  const btn = document.getElementById('overlayBack');
  if (stepHistory.length > 0 && currentStep !== 'success') {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

function updateProgress(stepId) {
  const pct = stepId === 'success'
    ? 100
    : (parseInt(stepId) / TOTAL_STEPS) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

// ─── Keyboard ─────────────────────────────────────────────────────
function handleKeydown(e) {
  const overlay = document.getElementById('formOverlay');
  if (!overlay.classList.contains('open')) return;

  if (e.key === 'Escape') {
    // If confirm modal is open, dismiss it
    if (document.getElementById('confirmOverlay').classList.contains('open')) {
      dismissConfirm(); return;
    }
    confirmClose();
    return;
  }

  // Backspace goes back only when not typing
  if (e.key === 'Backspace') {
    const tag = document.activeElement.tagName;
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      goBack();
    }
  }
}

// ─── Reset ────────────────────────────────────────────────────────
function resetForm() {
  stepHistory  = [];
  currentStep  = 1;
  formData = {
    path: '', occasion: '', guestName: '', yourName: '', partnerName: '',
    tier: null, maxExperiences: 1, selectedExperiences: [], experienceAnswers: {},
    specialMemory: '', preferredDate: '', timeOfDay: '',
    contactName: '', contactEmail: '', contactPhone: '', submittedAt: ''
  };

  // Reset visible UI
  document.querySelectorAll('.choice-btn, .tier-choice-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.form-input, .form-textarea').forEach(el => { el.value = ''; });
  document.getElementById('expNextBtn').style.display  = 'none';
  document.getElementById('dateNextBtn').style.display = 'none';
  document.getElementById('progressBar').style.width   = '0%';
}

// ─── Step 1: Path selection ───────────────────────────────────────
function setupPathButtons() {
  document.querySelectorAll('[data-step="1"] .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectSingle(btn, '[data-step="1"] .choice-grid');
      formData.path = btn.dataset.value;
      setTimeout(() => goToStep(2), 360);
    });
  });
}

// ─── Step 2: Occasion ─────────────────────────────────────────────
function setupOccasionButtons() {
  document.querySelectorAll('[data-step="2"] .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectSingle(btn, '[data-step="2"] .choice-grid');
      formData.occasion = btn.dataset.value;
      setTimeout(() => goToStep(3), 360);
    });
  });
}

// ─── Step 3: Name(s) ──────────────────────────────────────────────
function prepNameStep() {
  if (formData.path === 'A') {
    document.getElementById('namePathA').style.display = 'block';
    document.getElementById('namePathB').style.display = 'none';
  } else {
    document.getElementById('namePathA').style.display = 'none';
    document.getElementById('namePathB').style.display = 'block';
  }
}

function setupNameStep() {
  document.getElementById('nameNextBtn').addEventListener('click', submitNameStep);

  document.getElementById('guestName').addEventListener('keydown',  e => { if (e.key === 'Enter') submitNameStep(); });
  document.getElementById('yourName').addEventListener('keydown',   e => { if (e.key === 'Enter') submitNameStep(); });
  document.getElementById('partnerName').addEventListener('keydown', e => { if (e.key === 'Enter') submitNameStep(); });
}

function submitNameStep() {
  if (formData.path === 'A') {
    const val = document.getElementById('guestName').value.trim();
    if (!val) { shake('guestName'); return; }
    formData.guestName = val;
  } else {
    const yours   = document.getElementById('yourName').value.trim();
    const partner = document.getElementById('partnerName').value.trim();
    if (!yours)   { shake('yourName'); return; }
    if (!partner) { shake('partnerName'); return; }
    formData.yourName   = yours;
    formData.partnerName = partner;
  }
  goToStep(4);
}

// ─── Step 4: Tier ─────────────────────────────────────────────────
function setupTierButtons() {
  document.querySelectorAll('.tier-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tier-choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      formData.tier            = parseInt(btn.dataset.tier);
      formData.maxExperiences  = parseInt(btn.dataset.experiences);
      formData.selectedExperiences = [];
      setTimeout(() => goToStep(5), 360);
    });
  });
}

// ─── Step 5: Experience type ──────────────────────────────────────
function prepExperienceStep() {
  const q      = document.getElementById('expSelectQuestion');
  const nextBtn = document.getElementById('expNextBtn');

  document.querySelectorAll('#expChoiceGrid .choice-btn').forEach(b => b.classList.remove('selected'));
  nextBtn.style.display = 'none';
  formData.selectedExperiences = [];

  if (formData.path === 'A') {
    q.textContent = formData.maxExperiences === 1
      ? "What lights them up?"
      : formData.maxExperiences === 2
        ? "Choose two experiences for them."
        : "All three — let's go.";
  } else {
    q.textContent = formData.maxExperiences === 1
      ? "What do you both love?"
      : formData.maxExperiences === 2
        ? "Choose two experiences you'd both enjoy."
        : "All three — the full story.";
  }

  if (formData.maxExperiences === 3) {
    formData.selectedExperiences = ['sports', 'dining', 'music'];
    document.querySelectorAll('#expChoiceGrid .choice-btn').forEach(b => b.classList.add('selected'));
    nextBtn.style.display = 'block';
  }
}

function setupExperienceButtons() {
  document.querySelectorAll('#expChoiceGrid .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleExperienceClick(btn));
  });

  document.getElementById('expNextBtn').addEventListener('click', () => {
    if (formData.selectedExperiences.length === 0) return;
    buildDynamicQuestions();
    goToStep(6);
  });
}

function handleExperienceClick(btn) {
  const value   = btn.dataset.value;
  const nextBtn = document.getElementById('expNextBtn');

  if (formData.maxExperiences === 1) {
    selectSingle(btn, '#expChoiceGrid');
    formData.selectedExperiences = [value];
    setTimeout(() => { buildDynamicQuestions(); goToStep(6); }, 360);
    return;
  }

  // Multi-select
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    formData.selectedExperiences = formData.selectedExperiences.filter(e => e !== value);
  } else {
    if (formData.selectedExperiences.length >= formData.maxExperiences) return;
    btn.classList.add('selected');
    formData.selectedExperiences.push(value);
  }

  if (formData.selectedExperiences.length === formData.maxExperiences) {
    nextBtn.style.display = 'block';
    gsap.fromTo(nextBtn, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
  } else {
    nextBtn.style.display = 'none';
  }
}

// ─── Step 6: Dynamic questions ────────────────────────────────────
function buildDynamicQuestions() {
  const container = document.getElementById('dynamicQuestionsStep');
  container.innerHTML = '';

  const questions = formData.path === 'A' ? 'pathA' : 'pathB';

  formData.selectedExperiences.forEach(expKey => {
    const exp = EXPERIENCES[expKey];
    if (!exp) return;

    const label = document.createElement('span');
    label.className = 'dynamic-section-label';
    label.textContent = exp.label;
    container.appendChild(label);

    exp[questions].forEach(q => {
      const div = document.createElement('div');
      div.className = 'dynamic-q';
      div.innerHTML = `
        <label for="${q.id}">${q.label}</label>
        <input
          type="text"
          id="${q.id}"
          class="form-input"
          placeholder="${q.placeholder}"
          autocomplete="off"
        />
      `;
      container.appendChild(div);
    });
  });

  const btn = document.createElement('button');
  btn.className = 'form-next-btn';
  btn.textContent = 'Continue';
  btn.addEventListener('click', () => {
    formData.selectedExperiences.forEach(expKey => {
      EXPERIENCES[expKey][questions].forEach(q => {
        const el = document.getElementById(q.id);
        if (el) formData.experienceAnswers[q.id] = el.value.trim();
      });
    });
    goToStep(7);
  });
  container.appendChild(btn);
}

// ─── Step 7: Memory ───────────────────────────────────────────────
function prepMemoryQuestion() {
  const q = document.getElementById('memoryQuestion');
  q.textContent = formData.path === 'A'
    ? "Is there a memory that defines them?"
    : "Is there a memory you both share?";
}

function setupMemoryStep() {
  document.getElementById('memoryNextBtn').addEventListener('click', () => {
    formData.specialMemory = document.getElementById('specialMemory').value.trim();
    goToStep(8);
  });
}

// ─── Step 8: Date + time ──────────────────────────────────────────
function setupDateStep() {
  document.getElementById('preferredDate').addEventListener('change', checkDateReady);

  document.querySelectorAll('#timeGrid .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectSingle(btn, '#timeGrid');
      formData.timeOfDay = btn.dataset.value;
      checkDateReady();
    });
  });

  document.getElementById('dateNextBtn').addEventListener('click', () => {
    formData.preferredDate = document.getElementById('preferredDate').value;
    goToStep(9);
  });
}

function checkDateReady() {
  const date = document.getElementById('preferredDate').value;
  if (date && formData.timeOfDay) {
    const btn = document.getElementById('dateNextBtn');
    btn.style.display = 'block';
    gsap.fromTo(btn, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
  }
}

// ─── Step 9: Contact + submit ─────────────────────────────────────
function setupContactStep() {
  document.getElementById('submitBtn').addEventListener('click', submitForm);
}

async function submitForm() {
  const name  = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  if (!name)  { shake('contactName');  return; }
  if (!email) { shake('contactEmail'); return; }

  formData.contactName  = name;
  formData.contactEmail = email;
  formData.contactPhone = phone;
  formData.submittedAt  = new Date().toISOString();

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    await saveSubmission(formData);
    stepHistory = [];
    goToStep('success');
  } catch (err) {
    console.error('Submission error:', err);
    btn.textContent = 'Send the request';
    btn.disabled = false;
    alert('Something went wrong. Please try again.');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────
function selectSingle(btn, gridSelector) {
  document.querySelectorAll(`${gridSelector} .choice-btn`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function shake(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  gsap.fromTo(el,
    { x: -8 },
    { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)',
      keyframes: { x: [-8, 8, -5, 5, -2, 2, 0] } }
  );
}