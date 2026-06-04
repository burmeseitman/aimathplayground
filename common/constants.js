/**
 * constants.js — Shared constants for AI Math Playground
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
  calculus: { main: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)', hex: 0x8b5cf6 },
  probability: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.3)', hex: 0x10b981 },
  optimization: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', hex: 0xf59e0b },
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
    description: `Neural Network Layer တိုင်းဟာ အခြေခံအားဖြင့် Matrix-Vector Multiplication ကို သုံးပြီး Input Features တွေကို ပိုမိုနက်ရှိုင်းတဲ့ Feature Representations အဖြစ် အသွင်ပြောင်းပေးတာဖြစ်ပါတယ်။ ဒီနေရာမှာ Vector Transformation တွေရဲ့ သဘောတရားကို နားလည်ဖို့ Eigenvalues နဲ့ Eigenvectors က အရေးကြီးပါတယ်။ Eigenvector က Linear Transformation တစ်ခုအတွင်း လားရာမပြောင်းလဲတဲ့ ဦးတည်ချက်ကို ပြသပြီး၊ Eigenvalue ကတော့ အဲဒီဦးတည်ချက်အတိုင်း Vector မည်မျှ ဆန့်ထုတ်ခံရလဲ (သို့မဟုတ်) ဖိသိပ်ခံရလဲဆိုတဲ့ ပမာဏ (Scalar) ကို တိုင်းတာပေးတာပါ။
ဒီ Linear Algebra သဘောတရားတွေကို အခြေခံထားတဲ့ SVD နဲ့ PCA လို နည်းပညာတွေကို Recommendation Systems တွေမှာ Data ရဲ့ ပမာဏကို လျှော့ချဖို့ (Dimensionality Reduction) နဲ့ ပုံစံတူအကြံပြုချက်တွေ ထုတ်ပေးဖို့ သုံးပါတယ်။ ဒါကြောင့် 3D မှာ မြင်တွေ့ရတဲ့ Geometric Transformations ဟာ Deep Neural Network ရဲ့ Layer တစ်ခုချင်းစီအတွင်းမှာ အမှန်တကယ်ဖြစ်ပျက်နေတဲ့ သဘောတရားပဲဖြစ်ပါတယ်။`,
    keywords: ['Weight Matrices', 'PCA', 'SVD', 'Embeddings', 'Attention Mechanism'],
  },
  calculus: {
    title: 'AI တွင် Calculus ၏ အခန်းကဏ္ဍ',
    icon: '📐',
    description: `Backpropagation ဆိုတာ အခြေခံအားဖြင့် Calculus ရဲ့ Chain Rule ကို ကွန်ရက်တစ်ခုလုံးမှာ ထပ်ခါတလဲလဲ အသုံးချပြီး Neural Network အတွင်းရှိ Weight တစ်ခုစီအတွက် Loss Function ၏ Gradient (Partial Derivatives) ကို နောက်ပြန်တွက်ချက်ပေးတဲ့ လုပ်ငန်းစဉ်ဖြစ်ပါတယ်။
Loss Surface ပေါ်မှာ မြင်တွေ့ရတဲ့ Gradient Vectors တွေဟာ အမှားအများဆုံး (သို့မဟုတ်) အမတ်စောက်ဆုံး တက်လှမ်းရာ ဦးတည်ချက်ကို ညွှန်ပြနေတာပါ။ ဒါကြောင့် Neural Networks တွေဟာ အမှား (Loss) ကို အနည်းဆုံးဖြစ်စေမယ့် လမ်းကြောင်းကို ရှာဖွေဖို့ Gradient ရဲ့ ဆန့်ကျင်ဘက် လားရာဖြစ်တဲ့ Negative Gradient အတိုင်း (Gradient Descent နည်းလမ်းဖြင့်) လိုက်နာဆင်းသက်ပြီး၊ Data တွေထဲကနေ Pattern တွေကို တစ်ဆင့်ချင်းစီ အကောင်းဆုံး သင်ယူသွားကြတာ ဖြစ်ပါတယ်။`,
    keywords: ['Backpropagation', 'Chain Rule', 'Gradient', 'Partial Derivatives', 'Jacobian'],
  },
  probability: {
    title: 'AI တွင် Probability & Statistics ၏ အခန်းကဏ္ဍ',
    icon: '🎲',
    description: `Gaussian Distributions Theory ဟာ AI ရဲ့ နေရာတိုင်းမှာ အရေးပါတဲ့ အခန်းကဏ္ဍကရှိနေပါတယ်။ ကွန်ရက်ရဲ့ Latent Spaces ကို Probability Distributions အဖြစ် သင်ယူရယူတဲ့ Variational Autoencoders (VAEs) ကနေစလို့၊ ခန့်မှန်းချက်တွေရဲ့ မရေရာမှု (Uncertainty) ကို တိတိကျကျ တိုင်းတာပေးတဲ့ Bayesian Neural Networks အထိ တွင်တွင်ကျယ်ကျယ် အသုံးပြုကြပါတယ်။ အခုမြင်တွေ့ရတဲ့ ခေါင်းလောင်းပုံစံ Bell Curve ဟာ AI က Data ရဲ့ တကယ့်သဘာဝ ပျံ့နှံ့မှုပုံစံ (Data Distribution) ကို ဘယ်လိုပုံဖော် တွက်ချက်ရမလဲဆိုတာကို ကိုယ်စားပြုတာပါ။ ဒါ့အပြင် VAEs တွေမှာ မရှိမဖြစ်လိုအပ်တဲ့ Reparameterization Trick က Random Sampling လုပ်ငန်းစဉ်အတွင်း ကွန်ရက်ရဲ့ Gradient တွေ ရှေ့နောက် တိုက်ရိုက်စီးဆင်းနိုင်အောင် (Differentiable ဖြစ်အောင်) သင်္ချာနည်းအရ လမ်းဖွင့်ပေးပြီး Data ကနေ ဆက်တိုက်သင်ယူမှုကို ဖြစ်ပေါ်စေတာဖြစ်ပါတယ်။`,
    keywords: ['Bayesian Inference', 'VAE', 'GMM', 'Maximum Likelihood', 'Prior/Posterior'],
  },
  optimization: {
    title: 'AI တွင် Optimization ၏ အခန်းကဏ္ဍ',
    icon: '🎯',
    description: `Neural Network တစ်ခုကို Train ခြင်းဟာ အခြေခံအားဖြင့် Non-convex Optimization Problem တစ်ခုဖြစ်ပြီး၊ ၎င်းရဲ့ ရည်ရွယ်ချက်ကတော့ Loss Function ကို အနည်းဆုံးဖြစ်စေမယ့် Parameters (Weights & Biases) တွေကို ရှာဖွေဖို့ဖြစ်ပါတယ်။ ရှုပ်ထွေးလှတဲ့ Loss Landscape ပေါ်မှာ လိမ့်ဆင်းနေတဲ့ ဘောလုံးလေးတွေရဲ့ ပုံရိပ်ဟာ SGD with Momentum နဲ့ Adam လိုမျိုး ခေတ်မီ Optimizers တွေက ပိုမိုကောင်းမွန်တဲ့ Global Minimum ကို ရှာဖွေဖို့အတွက် လမ်းခုလတ်က Local Minima နဲ့ Saddle Points ရဲ့ ထောင်ချောက်တွေထဲကနေ အရှိန်အဟုန်နဲ့ မည်သို့ ရုန်းထွက်ကျော်ဖြတ်ကြသည်ကို ကောင်းစွာကိုယ်စားပြုပါတယ်။ ထို့ကြောင့် စနစ်တစ်ခုလုံး အောင်မြင်စွာ သင်ယူနိုင်ဖို့အတွက် သင့်တော်တဲ့ Optimizer ကို ရွေးချယ်မှုနဲ့ ကွန်ရက်ရဲ့ ခြေလှမ်းအကျဉ်းအကျယ်ကို ထိန်းချုပ်တဲ့ Learning Rate ကို စနစ်တကျ ချိန်ညှိမှု (Hyperparameter Tuning) တို့ဟာ Training လုပ်ငန်းစဉ် အောင်မြင်မှုအပေါ် သော့ချက်ကျကျ သက်ရောက်မှု ရှိနေတာဖြစ်ပါတယ်။`,
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
    desc: 'Matrix Transformations များမှ Neural Network Layers များ၊ PCA နှင့် Data Embeddings များ၏ အခြေခံဖြစ်ပေါ်ပုံကို လေ့လာခြင်း။',
    href: './linear-algebra/index.html',
  },
  {
    id: 'calculus',
    name: 'Calculus',
    icon: '📐',
    subtitle: 'Gradients, Derivatives & Chain Rule',
    desc: '3D Surfaces ပေါ်ရှိ Gradient Vectors များကို ပုံဖော်ကြည့်ရှုပြီး Backpropagation မည်သို့ အလုပ်လုပ်သည်ကို နားလည်သဘောပေါက်စေရန် လေ့လာခြင်း။',
    href: './calculus/index.html',
  },
  {
    id: 'probability',
    name: 'Probability & Statistics',
    icon: '🎲',
    subtitle: 'Distributions, Bayes & Sampling',
    desc: 'Multivariate Gaussian Distributions များကို ပုံဖော်ပြီး AI က မရေရာမှု (Uncertainty) များကို မည်သို့ ပုံဖော်တွက်ချက်သည်ကို လေ့လာခြင်း။',
    href: './probability/index.html',
  },
  {
    id: 'optimization',
    name: 'Optimization',
    icon: '🎯',
    subtitle: 'Gradient Descent, Momentum & Adam',
    desc: '3D Loss Landscapes ပေါ်တွင် Optimizers များကို လုပ်ဆောင်စေပြီး Neural Networks များ မည်သို့သင်ယူလေ့လာသည်ကို လေ့လာခြင်း။',
    href: './optimization/index.html',
  },
];
