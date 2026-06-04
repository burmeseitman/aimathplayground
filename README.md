# 🎭 AI Math Playground

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://burmeseitman.github.io/aimathplayground/index.html)

An interactive, responsive 3D simulation suite built to visualize the **4 foundational mathematical pillars of Artificial Intelligence**:
1. **Linear Algebra**: 3D matrix transformations, basis vectors, and eigenvalues.
2. **Calculus**: Dynamic gradient descent tracking on a 3D loss surface with step parameter control.
3. **Probability & Statistics**: Normal Gaussian distributions and Central Limit Theorem sampling.
4. **Optimization**: A real-time visual "race" between key optimization algorithms (SGD vs. Adam) on a multi-modal loss landscape.

The application features a modern dark-mode aesthetic with **glassmorphism UI components**, responsive layouts, and full **Burmese language localization** (preserving core math terms).

---

## 📂 Project Structure

The project is structured modularly to separate individual math simulation playgrounds while reusing core styles and Three.js canvas routines:

```text
aimathplayground/
├── index.html                   # Landing page (4 pillar navigation grid)
├── .gitignore                   # Git ignore files
├── README.md                    # Project documentation & deployment guide
├── common/                      # Shared design tokens, assets, and JS modules
│   ├── components.css           # Glassmorphism panels, sliders, and button systems
│   ├── constants.js             # Shared math constants and simulator configs
│   ├── math-utils.js            # Shared matrix transformations & numerical routines
│   ├── styles.css               # Global HSL colors, typography variables, layout resets
│   ├── three-setup.js           # Shared modular Three.js scene/camera/renderer builder
│   └── ui-utils.js              # Injectable navigation headers and branding utilities
├── linear-algebra/              # Matrix transform simulation files
│   ├── index.html
│   ├── styles.css
│   └── visualizer.js
├── calculus/                    # Gradient Descent simulator files
│   ├── index.html
│   ├── styles.css
│   └── visualizer.js
├── probability/                 # Normal distribution and sampling simulator files
│   ├── index.html
│   ├── styles.css
│   └── visualizer.js
└── optimization/                # Optimizers race simulation files
    ├── index.html
    ├── styles.css
    └── visualizer.js
```

---

## 🛠️ Technical Stack

- **Core Structure**: HTML5 Semantic markup.
- **Styling**: Modern CSS3 using CSS variables, flexbox/grid layouts, responsive media queries, and `Noto Sans Myanmar` font integration.
- **Graphics**: [Three.js](https://threejs.org/) via CDN (using modern ES modules import-maps) for GPU-accelerated 3D renderings.
- **Logic**: Vanilla ES6+ JavaScript modules. No build tool, bundler, or third-party package dependencies required, ensuring maximum security and security vulnerability immunity.

---

## 💻 Local Development

To run the application locally, start any static file HTTP server in the root directory:

### Python 3
```bash
python -m http.server 8080
```

### Node.js (`npx`)
```bash
npx serve -l 8080
```

Once running, navigate to `http://localhost:8080` in your web browser.

---

## 🚀 Deployment Guide

Since **AI Math Playground** is built entirely of static files (HTML, CSS, and JS), it can be deployed to any web server or static hosting provider instantly for free.

---

### Option A: GitHub Pages (Recommended)
Excellent for quick, free hosting directly from your GitHub repository.

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AI Math Playground"
   # Create a repo on GitHub, then link and push:
   git remote add origin https://github.com/YOUR_USERNAME/aimathplayground.git
   git branch -M main
   git push -u origin main
   ```
2. **Configure Pages Settings**:
   - Go to your repository settings page on GitHub.
   - Click on the **Pages** tab on the left sidebar.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Under **Branch**, select `main` (or the branch you pushed) and set the folder to `/ (root)`.
   - Click **Save**.
3. **Access URL**: Your site will be live at `https://YOUR_USERNAME.github.io/aimathplayground/` within a couple of minutes.

---

### Option B: Vercel
Perfect for zero-config deployments with built-in SSL.

1. **Via CLI**:
   Install the Vercel CLI and run the deployment command:
   ```bash
   npm install -g vercel
   vercel
   ```
   Follow the prompts to link to your account. Select defaults when prompted.
2. **Via Git Integration**:
   - Link your GitHub account to [Vercel Dashboard](https://vercel.com).
   - Click **Add New** -> **Project**.
   - Import your `aimathplayground` repository.
   - Leave build and output settings blank (Vercel automatically detects static projects).
   - Click **Deploy**.

---

### Option C: Netlify
Extremely fast deployment using drag-and-drop or continuous git integration.

- **Drag and Drop**:
  - Open the [Netlify App Dashboard](https://app.netlify.com/).
  - Drag and drop your local `aimathplayground` folder directly into the upload area on Netlify.
- **Git Integration**:
  - Connect Netlify to your GitHub account.
  - Select your repository and choose default build/publish configurations (leave build command blank, set publish directory to `.`).
  - Click **Deploy Site**.

---

### Option D: Docker & Nginx (For VPS/Self-Hosting)
For deploying to your own cloud instance (AWS, DigitalOcean, Linode) using a lightweight Nginx web server.

1. **Create a `Dockerfile`** in the root directory:
   ```dockerfile
   FROM nginx:alpine
   # Copy static assets to default Nginx serving directory
   COPY . /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run the Container**:
   ```bash
   # Build the docker image
   docker build -t aimathplayground:latest .

   # Run container mapping port 80 to host port 80
   docker run -d -p 80:80 --name aimathplayground aimathplayground:latest
   ```

3. **Production SSL Setup**:
   To secure it with SSL/TLS in production, configure a reverse proxy using Let's Encrypt Certbot with Nginx.
