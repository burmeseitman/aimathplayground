/**
 * constants.js — Shared constants for AI Math Toolkits
 */

// ── Color Palettes ──────────────────────────────────────────
export const COLORS = {
  primary: '#00d4ff',
  secondary: '#8b5cf6',
  accent: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',

  bgDark: '#0a0a0f',
  bgMid: '#1a1a2e',
  bgCard: 'rgba(255, 255, 255, 0.04)',
  bgGlass: 'rgba(255, 255, 255, 0.06)',
  borderGlass: 'rgba(255, 255, 255, 0.1)',

  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
};

export const PILLAR_COLORS = {
  'linear-algebra': { main: '#00d4ff', glow: 'rgba(0, 212, 255, 0.3)', hex: 0x00d4ff },
  calculus:         { main: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)', hex: 0x8b5cf6 },
  probability:     { main: '#10b981', glow: 'rgba(16, 185, 129, 0.3)', hex: 0x10b981 },
  optimization:    { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', hex: 0xf59e0b },
};

// ── 3D Camera Defaults ──────────────────────────────────────
export const CAMERA_DEFAULTS = {
  fov: 55,
  near: 0.1,
  far: 1000,
  position: { x: 4, y: 3, z: 5 },
};

export const CONTROLS_DEFAULTS = {
  enableDamping: true,
  dampingFactor: 0.08,
  rotateSpeed: 0.6,
  zoomSpeed: 0.8,
  autoRotate: false,
  autoRotateSpeed: 1.0,
  minDistance: 2,
  maxDistance: 20,
};

// ── Animation ───────────────────────────────────────────────
export const ANIMATION = {
  transitionMs: 400,
  morphDuration: 1.0,
  trailFadeMs: 2000,
  particleCount: 200,
};

// ── AI Context Descriptions ─────────────────────────────────
export const AI_CONTEXT = {
  'linear-algebra': {
    title: 'AI တွင် Linear Algebra ၏ အခန်းကဏ္ဍ',
    icon: '🔢',
    description: `Neural Network layer တိုင်းသည် <strong>Matrix-Vector Multiplication</strong> ကို လုပ်ဆောင်သည် - 
      Weight Matrix က Input Features များကို ကိုယ်စားပြုမှုအသစ်များအဖြစ်သို့ အသွင်ပြောင်းပေးသည်။ 
      Eigenvalues များသည် မည်သည့် ဦးတည်ချက်များက အပြောင်းလဲဆုံးအခြေအနေကို သယ်ဆောင်သည်ကို ဖော်ပြပေးပြီး (PCA)၊ 
      SVD သည် Recommendation Systems များကို စွမ်းအားပေးသည်။ သင် 3D တွင် မြင်တွေ့ရသော အသွင်ပြောင်းမှု (Transformation) သည် 
      Deep Neural Network ၏ Layer တစ်ခုချင်းစီအတွင်း၌ <em>အမှန်တကယ်</em> ဖြစ်ပျက်နေသော အရာပင် ဖြစ်သည်။`,
    keywords: ['Weight Matrices', 'PCA', 'SVD', 'Embeddings', 'Attention Mechanism'],
  },
  calculus: {
    title: 'AI တွင် Calculus ၏ အခန်းကဏ္ဍ',
    icon: '📐',
    description: `<strong>Backpropagation</strong> ဆိုသည်မှာ Chain Rule ကို ထပ်ခါတလဲလဲ အသုံးပြုထားခြင်းဖြစ်သည် - 
      ၎င်းသည် ကွန်ရက်အတွင်းရှိ Weight တစ်ခုစီအတွက် Loss Function ၏ Gradient ကို တွက်ချက်ပေးသည်။ 
      Surface ပေါ်တွင် သင်မြင်ရသော Gradient Vectors များသည် မတ်စောက်ဆုံး တက်လှမ်းရာ ဦးတည်ချက်ကို ပြသသည်။ 
      Neural Networks များသည် Loss ကို အနည်းဆုံးဖြစ်စေရန် <em>Negative</em> Gradient အတိုင်း လိုက်နာပြီး 
      ဒေတာများမှတစ်ဆင့် တစ်ဆင့်ချင်း သင်ယူကြသည်။`,
    keywords: ['Backpropagation', 'Chain Rule', 'Gradient', 'Partial Derivatives', 'Jacobian'],
  },
  probability: {
    title: 'AI တွင် Probability & Statistics ၏ အခန်းကဏ္ဍ',
    icon: '🎲',
    description: `Gaussian Distributions သည် AI ၏ နေရာတိုင်းတွင် ရှိနေသည် - 
      Latent Spaces များကို သင်ယူသော <strong>Variational Autoencoders</strong> (VAEs) မှစ၍ 
      မရေရာမှု (Uncertainty) ကို တိုင်းတာသော <strong>Bayesian Neural Networks</strong> အထိ ဖြစ်သည်။ 
      သင်မြင်ရသော ခေါင်းလောင်းပုံဆွဲချက် (Bell Curve) သည် AI က ဒေတာပျံ့နှံ့မှုကို မည်သို့ ပုံဖော်တွက်ချက်သည်ကို ကိုယ်စားပြုပြီး 
      Reparameterization Trick သည် Random Sampling မှတစ်ဆင့် Gradients စီးဆင်းမှုကို ခွင့်ပြုပေးသည်။`,
    keywords: ['Bayesian Inference', 'VAE', 'GMM', 'Maximum Likelihood', 'Prior/Posterior'],
  },
  optimization: {
    title: 'AI တွင် Optimization ၏ အခန်းကဏ္ဍ',
    icon: '🎯',
    description: `Neural Network တစ်ခုကို Train ခြင်းသည် <strong>Optimization Problem</strong> တစ်ခုဖြစ်သည် - 
      ၎င်းမှာ Loss Function ကို အနည်းဆုံးဖြစ်စေမည့် Parameters များကို ရှာဖွေခြင်းဖြစ်သည်။ 
      Loss Landscape ပေါ်တွင် ရွေ့လျားနေသော ဘောလုံးလေးသည် <strong>Adam</strong> နှင့် <strong>SGD 
      with Momentum</strong> ကဲ့သို့သော Optimizers များက ပိုမိုကောင်းမွန်သော အဖြေများကို ရှာဖွေရန် 
      Local Minima နှင့် Saddle Points များမှ မည်သို့ ရုန်းထွက်သည်ကို ပြသပေးသည်။ 
      Optimizer ရွေးချယ်မှုနှင့် Learning Rate သည် Training အောင်မြင်မှုအပေါ် များစွာ သက်ရောက်မှုရှိသည်။`,
    keywords: ['SGD', 'Adam', 'Momentum', 'Learning Rate', 'Loss Landscape'],
  },
};

// ── Pillar metadata ─────────────────────────────────────────
export const PILLARS = [
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    icon: '🔢',
    subtitle: 'Vectors, Matrices & Transformations',
    desc: 'Matrix transformations များက Neural Network layers များ၊ PCA နှင့် Data Embeddings များကို မည်သို့ စွမ်းအားပေးသည်ကို လေ့လာစူးစမ်းပါ။',
    href: './linear-algebra/index.html',
  },
  {
    id: 'calculus',
    name: 'Calculus',
    icon: '📐',
    subtitle: 'Gradients, Derivatives & Chain Rule',
    desc: '3D surfaces ပေါ်ရှိ Gradient Vectors များကို ပုံဖော်ကြည့်ရှုပြီး Backpropagation ကို နားလည်သဘောပေါက်စေရန် လေ့လာပါ။',
    href: './calculus/index.html',
  },
  {
    id: 'probability',
    name: 'Probability & Statistics',
    icon: '🎲',
    subtitle: 'Distributions, Bayes & Sampling',
    desc: 'Multivariate Gaussian Distributions များကို ပုံဖော်ပြီး AI က မရေရာမှု (Uncertainty) များကို မည်သို့ ပုံဖော်တွက်ချက်သည်ကို ကြည့်ရှုပါ။',
    href: './probability/index.html',
  },
  {
    id: 'optimization',
    name: 'Optimization',
    icon: '🎯',
    subtitle: 'Gradient Descent, Momentum & Adam',
    desc: '3D Loss Landscapes ပေါ်တွင် Optimizers များကို ယှဉ်ပြိုင်ပြေးစေပြီး Neural Networks များ မည်သို့ သင်ယူလေ့လာသည်ကို ရှာဖွေပါ။',
    href: './optimization/index.html',
  },
];
