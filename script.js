
/*function checkPassword() {
    const password = document.getElementById('pass-input').value;
    const errMsg = document.getElementById('err-msg');
    
    const secureHash = "a310f1a29b3965c7bafc0451ba005fb6d24cf27d3080991e797973334ebb70c4"; 


    const inputHash = CryptoJS.SHA256(password).toString();

    if (inputHash === secureHash) {
    
        document.getElementById('password-overlay').style.display = 'none';
        document.body.style.overflow = 'auto'; 
    
        updateTimelinePath();
    } else {
        errMsg.style.display = 'block';
        errMsg.textContent = "Invalid password";
    }
}


document.getElementById('pass-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});
document.body.style.overflow = 'hidden';
*/

window.onload = function() {
    // On attend un tout petit délai pour s'assurer que le rendu est fini
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant' // 'instant' évite de voir la page défiler vers le haut
        });
    }, 10);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function toggleExpand(btn) {
    const content = btn.parentElement;
    
    
    content.classList.toggle('expanded');

    
    
    let duration = 500;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        updateTimelinePath(); 
        if (timestamp - start < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function toggleZoom(media) {
    const isZoomed = media.classList.contains('zoomed');
    
    if (isZoomed) {
        media.classList.remove('zoomed');
        document.body.style.overflow = '';
    } else {
        
        document.querySelectorAll('.zoomed').forEach(el => el.classList.remove('zoomed'));
        
        media.classList.add('zoomed');
        document.body.style.overflow = 'hidden';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const vObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            const container = video.parentElement;

            if (entry.isIntersecting) {
                // 1. Si la source n'est pas encore mise, on l'injecte (Lazy Loading)
                if (!video.src) {
                    video.src = video.dataset.src;
                    video.load();
                }

                // 2. Lancer la lecture
                video.play().catch(() => {});

                // 3. Masquer le spinner quand la vidéo est prête à jouer
                video.oncanplay = () => {
                    video.classList.add('ready');
                    container.classList.add('loaded');
                };
            } else {
                // Hors écran : on met en pause (sauf si zoomée, pour ton cas précis)
                if (!video.classList.contains('zoomed')) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.2 }); // Se déclenche quand 20% de la vidéo est visible

    // On applique l'observateur à toutes les vidéos concernées
    document.querySelectorAll('.lazy-video').forEach(v => vObserver.observe(v));
});

function updateTimelinePath() {
    const path = document.querySelector('.timeline-path');
    const ribbon = document.querySelector('.timeline-ribbon');
    const svg = document.querySelector('.timeline-svg');
    const hero = document.getElementById('hero');
    
    
    const sections = document.querySelectorAll('.step');
    
    if(!path || !ribbon || !hero || sections.length === 0) return;

    const totalHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    );
    const width = window.innerWidth;
    
    svg.setAttribute('width', width);
    svg.setAttribute('height', totalHeight);
    svg.setAttribute('viewBox', `0 0 ${width} ${totalHeight}`);

    let currentY = hero.offsetHeight * 0.5;
    
    
    let lineData = `M ${width / 2} 0 L ${width / 2} ${currentY}`;
    
    
    
    
    let ribbonData = `M ${width / 2} 0 L ${width} 0 L ${width} ${currentY} L ${width / 2} ${currentY} Z`;
    
    
    ribbonData += ` M ${width / 2} ${currentY}`;

    sections.forEach((section, index) => {
        const sectionY = section.offsetTop + (section.offsetHeight / 2);
        
        
        const isTextLeft = (index % 2 === 0);
        const targetX = isTextLeft ? (width * 0.75) : (width * 0.25);
        const edgeX = isTextLeft ? width : 0;
        
        const midY = currentY + (sectionY - currentY) / 2;
        
        
        const segment = ` C ${width / 2} ${midY}, ${targetX} ${midY}, ${targetX} ${sectionY}`;
        
        lineData += segment;

        
        ribbonData += segment;
        ribbonData += ` L ${edgeX} ${sectionY} L ${edgeX} ${currentY} Z`;
        ribbonData += ` M ${targetX} ${sectionY}`;
        
        currentY = sectionY;
    });

    
    lineData += ` L ${width / 2} ${totalHeight}`;

    path.setAttribute('d', lineData);
    ribbon.setAttribute('d', ribbonData);
}


window.addEventListener('load', updateTimelinePath);
window.addEventListener('resize', updateTimelinePath);


setTimeout(updateTimelinePath, 1000);