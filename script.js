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

// Solar System interactions
const solarPlanets = document.querySelectorAll('.planet');
const solarInfoPanel = document.getElementById('solarInfoPanel');
const solarInfoTitle = document.getElementById('solarInfoTitle');
const solarInfoCategory = document.getElementById('solarInfoCategory');
const solarInfoDesc = document.getElementById('solarInfoDesc');
const solarInfoClose = document.getElementById('solarInfoClose');

if (solarPlanets.length > 0 && solarInfoPanel) {
    solarPlanets.forEach(planet => {
        planet.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = planet.getAttribute('data-title');
            const category = planet.getAttribute('data-category');
            const desc = planet.getAttribute('data-desc');
            
            solarInfoTitle.textContent = title;
            solarInfoCategory.textContent = category;
            
            const descItems = desc.split(',').map(item => item.trim());
            solarInfoDesc.innerHTML = '';
            descItems.forEach(item => {
                if (item) {
                    const li = document.createElement('li');
                    li.textContent = item;
                    solarInfoDesc.appendChild(li);
                }
            });
            
            solarInfoPanel.classList.add('visible');
        });
    });

    solarInfoClose.addEventListener('click', () => {
        solarInfoPanel.classList.remove('visible');
    });

    document.addEventListener('click', (e) => {
        if (solarInfoPanel.classList.contains('visible') && !solarInfoPanel.contains(e.target)) {
            solarInfoPanel.classList.remove('visible');
        }
    });
}



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
