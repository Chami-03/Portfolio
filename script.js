// Utility function to safely get style properties
function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Theme toggle with smooth transitions and persisted preference
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

const savedTheme = localStorage.getItem('cw_theme');
if(savedTheme) body.setAttribute('data-theme', savedTheme);

function updateIcons(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}
// Initial icon update
updateIcons(body.getAttribute('data-theme'));

themeToggle.addEventListener('click', ()=>{
  const currentTheme = body.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light':'dark';
  body.setAttribute('data-theme', nextTheme);
  updateIcons(nextTheme);
  localStorage.setItem('cw_theme', nextTheme);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('menu-open');
});
// Close menu when a link is clicked
document.querySelectorAll('#mainNav nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('menu-open')) {
            mainNav.classList.remove('menu-open');
        }
    });
});

// Simple reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  for(const e of entries){ if(e.isIntersecting) e.target.classList.add('visible'); }
},{threshold:.12});
reveals.forEach(r=>io.observe(r));

// 3D rotating cube (persists original feel)
(function(){
  const canvas = document.getElementById('threejs-canvas');
  if (!canvas || typeof THREE === 'undefined') return; // Guard for script execution and THREE.js

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth/canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(window.devicePixelRatio);

  // Initial size setup
  const initialResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
  };
  initialResize();
  camera.position.z = 3.2;

  // create canvas textures for cube faces to show icons/text
  function makeFace(text){
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');

    // Create a gradient matching the requested mix (Teal to Purple)
    // 135deg equivalent in canvas from top-left to bottom-right
    const grd = ctx.createLinearGradient(0, 0, 256, 256);
    grd.addColorStop(0, '#0ea5a4'); // Teal
    grd.addColorStop(1, '#6b21a8'); // Purple

    ctx.fillStyle = grd;
    ctx.fillRect(0,0,256,256);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text,128,145);
    return new THREE.CanvasTexture(c);
  }

  const materials = [
    new THREE.MeshStandardMaterial({map: makeFace('BA'), metalness:0.2, roughness:0.5}),
    new THREE.MeshStandardMaterial({map: makeFace('DA'), metalness:0.2, roughness:0.5}),
    new THREE.MeshStandardMaterial({map: makeFace('SQL'), metalness:0.2, roughness:0.5}),
    new THREE.MeshStandardMaterial({map: makeFace('Java'), metalness:0.2, roughness:0.5}),
    new THREE.MeshStandardMaterial({map: makeFace('Sys'), metalness:0.2, roughness:0.5}),
    new THREE.MeshStandardMaterial({map: makeFace('Viz'), metalness:0.2, roughness:0.5}),
  ];

  const geometry = new THREE.BoxGeometry(1.2,1.2,1.2);
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  const light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(5,5,5); scene.add(light);
  const amb = new THREE.AmbientLight(0xffffff, .45); scene.add(amb);

  function resize(){
    // Handles canvas resizing when the window size changes
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if(canvas.width !== w || canvas.height !== h){
        renderer.setSize(w,h,false);
        camera.aspect = w/h;
        camera.updateProjectionMatrix();
    }
  }
  window.addEventListener('resize', resize);


  let t=0;
  function animate(){
    resize(); t+=0.01;
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Ensure Three.js starts after the window loads and is stable
  window.onload = animate;

  const skills = [
      'Business Analysis - Requirements elicitation, SRS, use cases, user stories.',
      'Data Analysis - SQL querying, data cleaning, aggregation, validation.',
      'Database Systems - MySQL design, normalization, ER modeling.',
      'Backend Development - Java fundamentals, Spring Boot basics, REST APIs.',
      'Systems Engineering - System architecture, integration, workflow design.',
      'Data Visualisation - Power BI dashboards, KPI design, insight storytelling.'
  ];
      // BoxGeometry material order: +X, -X, +Y, -Y, +Z, -Z
      const faceToSkillMap = [0, 1, 2, 3, 4, 5];
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

  // Custom Message Box implementation (since alert() is forbidden)
  function showMessageBox(title, message) {
      const existingBox = document.getElementById('custom-message-box');
      if (existingBox) existingBox.remove();

      const box = document.createElement('div');
      box.id = 'custom-message-box';
      box.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: var(--card); color: var(--text); padding: 20px; border-radius: 12px;
          box-shadow: var(--shadow-soft); z-index: 1000; max-width: 90vw; width: 350px;
          text-align: center; border: 1px solid var(--glass-border); backdrop-filter: blur(var(--glass-blur));
      `;
      box.innerHTML = `
          <h4 style="margin: 0 0 10px; font-size: 1.1em; color: var(--accent);">${title}</h4>
          <p style="margin: 0 0 15px; font-size: 0.9em;">${message}</p>
          <button id="msg-box-close" style="padding: 8px 16px; border: none; border-radius: 8px; background: var(--accent); color: white; cursor: pointer; font-weight: 600;">Close</button>
      `;
      document.body.appendChild(box);

      document.getElementById('msg-box-close').addEventListener('click', () => {
          box.remove();
      });
  }


// Click on a specific cube face and show the related skill.
canvas.addEventListener('click', (e)=>{
  if (wasDragging) {
    wasDragging = false;
    return;
  }

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(cube, false);
  if (!hits.length) return;

  const faceMaterialIndex = hits[0].face && typeof hits[0].face.materialIndex === 'number'
    ? hits[0].face.materialIndex
    : 0;
  const skillIndex = faceToSkillMap[faceMaterialIndex] ?? 0;
  showMessageBox('Skill Focus', skills[skillIndex]);
  });

  // drag rotation logic
  let isDown=false, lastX=0, lastY=0, startX=0, startY=0;
let wasDragging = false;
  const DRAG_THRESHOLD = 5; // Pixels threshold to consider it a drag vs click

  const handlePointerDown = (e) => {
      // Get coordinates from mouse or first touch
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      isDown = true;
      startX = lastX = clientX;
      startY = lastY = clientY;
        wasDragging = false;
      if(e.setPointerCapture) e.setPointerCapture(e.pointerId);
  };
  const handlePointerUp = (e) => {
      isDown=false;
      // Check if it was a drag or a click
      const dx = Math.abs(lastX - startX);
      const dy = Math.abs(lastY - startY);
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
          wasDragging = true;
      }
  };
  const handlePointerMove = (e) => {
      if(!isDown) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const dx=(clientX-lastX)/200;
      const dy=(clientY-lastY)/200;

      cube.rotation.y += dx;
      cube.rotation.x += dy;

      lastX=clientX;
      lastY=clientY;

      // Mark as dragging while moving
      const totalDx = Math.abs(clientX - startX);
      const totalDy = Math.abs(clientY - startY);
      if (totalDx > DRAG_THRESHOLD || totalDy > DRAG_THRESHOLD) {
          wasDragging = true;
      }
  };

  // Add mouse/touch events for rotation
  canvas.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mouseup', handlePointerUp);
  canvas.addEventListener('mousemove', handlePointerMove);

  // Use non-passive touch events to ensure handlePointerUp fires correctly after touchmove
  canvas.addEventListener('touchstart', (e) => handlePointerDown(e), { passive: false });
  window.addEventListener('touchend', handlePointerUp);
  canvas.addEventListener('touchmove', handlePointerMove, { passive: false });

})();

// Hero contact CTA
document.getElementById('contactMeBtn').addEventListener('click', ()=>{
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Download resume
document.getElementById('downloadResume').addEventListener('click', ()=>{

  const pdfPath = './Chamikara_Wijerathne_Resume.pdf';
  const a = document.createElement('a');
  a.href = pdfPath; // Link to the local PDF file
  a.download = 'Chamikara_Wijerathne_Resume.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

});

const profilePhoto = document.querySelector('.logo-photo');
if (profilePhoto) {
  profilePhoto.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'photo-lightbox';
    overlay.innerHTML = `<img src="${profilePhoto.getAttribute('src')}" alt="${profilePhoto.getAttribute('alt') || 'Profile photo'}">`;
    document.body.appendChild(overlay);

    const closeOverlay = () => {
      overlay.remove();
      document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeOverlay();
    };

    overlay.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', onKeyDown);
  });
}
