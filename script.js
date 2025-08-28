// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
const mainTitle = document.querySelector('.main-title');
const orbits = document.querySelector('.orbit-animation');
const projectCards = document.querySelectorAll('.project-card');
const modalContainer = document.querySelector('.modal-container');
const modalClose = document.querySelector('.modal-close');
const hero = document.querySelector('.hero');

// Initialize star background
function initStarBackground() {
    // Create canvas element for stars
    const canvas = document.createElement('canvas');
    canvas.classList.add('stars-canvas');
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -2;';
    hero.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let starsArray = [];
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;
    let interactionRadius = 150; // Increased from 100
    let ripples = [];
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Track mouse position and calculate speed
    canvas.addEventListener('mousemove', (e) => {
        // Calculate mouse speed
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        mouseSpeed = Math.sqrt(dx*dx + dy*dy) * 0.1; // Scale down for more reasonable values
        
        // Update mouse position
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create ripple on mouse move if speed is high enough
        if (mouseSpeed > 5) {
            createRipple(mouseX, mouseY, mouseSpeed * 0.5);
        }
    });
    
    // Create ripple on click
    canvas.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY, 20);
    });
    
    // Ripple effect class
    class Ripple {
        constructor(x, y, maxRadius = 50) {
            this.x = x;
            this.y = y;
            this.radius = 0;
            this.maxRadius = maxRadius;
            this.opacity = 0.5;
            // Random color for ripple
            const colors = [
                {r: 66, g: 135, b: 245},  // Blue
                {r: 255, g: 215, b: 0},   // Gold
                {r: 147, g: 51, b: 234},  // Purple
                {r: 14, g: 165, b: 233},  // Teal
                {r: 255, g: 255, b: 255}  // White
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.radius += 2;
            this.opacity -= 0.01;
            return this.radius < this.maxRadius && this.opacity > 0;
        }
        
        draw() {
            ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Function to create a new ripple
    function createRipple(x, y, maxRadius) {
        ripples.push(new Ripple(x, y, maxRadius));
    }
    
    // Star class
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1; // Larger stars (1-4px)
            this.baseSize = this.size;
            this.speedX = (Math.random() * 0.2 - 0.1) * 0.5; // Slower base movement
            this.speedY = (Math.random() * 0.2 - 0.1) * 0.5;
            this.jiggleAmount = Math.random() * 0.5 + 0.2; // Random jiggle intensity
            this.jiggleSpeed = Math.random() * 0.02 + 0.01; // Random jiggle speed
            this.jiggleOffset = Math.random() * Math.PI * 2; // Random starting phase
            
            // Create multicolored stars
            this.colorType = Math.floor(Math.random() * 5);
            
            switch(this.colorType) {
                case 0: // Blue
                    this.baseColor = {r: 66, g: 135, b: 245};
                    break;
                case 1: // Gold/Yellow
                    this.baseColor = {r: 255, g: 215, b: 0};
                    break;
                case 2: // Purple
                    this.baseColor = {r: 147, g: 51, b: 234};
                    break;
                case 3: // Teal
                    this.baseColor = {r: 14, g: 165, b: 233};
                    break;
                case 4: // White (default)
                default:
                    this.baseColor = {r: 255, g: 255, b: 255};
                    break;
            }
            
            this.brightness = Math.random() * 0.5 + 0.5; // Value between 0.5 and 1 for brightness
            this.color = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.brightness})`;
            this.blinkSpeed = Math.random() * 0.01;
            this.blinkDirection = Math.random() > 0.5 ? 1 : -1;
            
            // For interaction and water effect
            this.originalX = this.x;
            this.originalY = this.y;
            this.interacting = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.targetOffsetX = 0;
            this.targetOffsetY = 0;
            this.dampingFactor = 0.08; // How quickly stars move toward the target (lower = more watery feel)
        }
        
        update(time) {
            // Apply jiggle effect - subtle random movement
            const jiggleX = Math.sin(time * this.jiggleSpeed + this.jiggleOffset) * this.jiggleAmount;
            const jiggleY = Math.cos(time * this.jiggleSpeed + this.jiggleOffset + Math.PI/2) * this.jiggleAmount;
            
            // Regular movement
            this.x += this.speedX + jiggleX;
            this.y += this.speedY + jiggleY;
            
            // Make stars twinkle by changing brightness
            this.brightness += this.blinkSpeed * this.blinkDirection;
            
            // Reverse direction when reaching brightness limits
            if (this.brightness >= 1 || this.brightness <= 0.2) {
                this.blinkDirection *= -1;
            }
            
            // Mouse interaction - ripple effect and follow
            const distanceToMouse = Math.hypot(mouseX - this.x, mouseY - this.y);
            const maxDistance = interactionRadius * 2;
            
            if (distanceToMouse < maxDistance) {
                // Calculate interaction strength (closer = stronger)
                const strength = 1 - distanceToMouse / maxDistance;
                
                // Calculate angle to mouse
                const angle = Math.atan2(this.y - mouseY, this.x - mouseX);
                
                // Effect is a mix of:
                // 1. Push away from mouse if very close
                // 2. Get pulled towards mouse wake if medium distance
                const pushFactor = distanceToMouse < interactionRadius ? 3 : -0.5;
                
                // Set target offset based on mouse movement and speed
                this.targetOffsetX = Math.cos(angle) * strength * pushFactor * (1 + mouseSpeed * 0.1);
                this.targetOffsetY = Math.sin(angle) * strength * pushFactor * (1 + mouseSpeed * 0.1);
                
                // Increase size and brightness when mouse is near
                this.size = Math.min(this.baseSize * 2, this.baseSize + (strength * 3));
                this.brightness = Math.min(1, this.brightness + strength * 0.3);
                this.interacting = true;
            } else {
                // Gradually return to original position when not interacting
                this.targetOffsetX *= 0.95;
                this.targetOffsetY *= 0.95;
                
                // Return size to normal
                if (this.interacting) {
                    this.size = this.baseSize;
                    this.interacting = false;
                }
            }
            
            // Apply damping for smooth, water-like movement
            this.offsetX += (this.targetOffsetX - this.offsetX) * this.dampingFactor;
            this.offsetY += (this.targetOffsetY - this.offsetY) * this.dampingFactor;
            
            // Apply offsets to position
            const actualX = this.x + this.offsetX;
            const actualY = this.y + this.offsetY;
            
            // Update displayed position
            this.displayX = actualX;
            this.displayY = actualY;
            
            this.color = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.brightness})`;
            
            // Wrap around screen edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.displayX, this.displayY, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${this.brightness})`;
            ctx.shadowBlur = this.size * 2 * this.brightness;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Initialize stars
    function init() {
        starsArray = [];
        for (let i = 0; i < 200; i++) { // Increased from 150 to 200 stars
            starsArray.push(new Star());
        }
    }
    
    // Animation loop
    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw a gradient background to make it look like space
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
        gradient.addColorStop(1, 'rgba(10, 10, 30, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update ripples
        ripples = ripples.filter(ripple => {
            ripple.draw();
            return ripple.update();
        });
        
        // Draw occasional shooting stars
        if (Math.random() < 0.03) {
            drawShootingStar();
        }
        
        // Update and draw stars
        for (let i = 0; i < starsArray.length; i++) {
            starsArray[i].update(timestamp * 0.001); // Pass time in seconds
            starsArray[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Draw a shooting star
    function drawShootingStar() {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height/3;
        const length = 50 + Math.random() * 50;
        const angle = Math.PI/4 + Math.random() * Math.PI/4;
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        // Random color for shooting star
        const colors = [
            {r: 66, g: 135, b: 245},  // Blue
            {r: 255, g: 215, b: 0},   // Gold
            {r: 147, g: 51, b: 234},  // Purple
            {r: 14, g: 165, b: 233},  // Teal
            {r: 255, g: 255, b: 255}  // White
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create gradient for the shooting star
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Add particle trail
        const particleCount = Math.floor(length / 5);
        for (let i = 0; i < particleCount; i++) {
            const ratio = i / particleCount;
            const x = startX + (endX - startX) * ratio;
            const y = startY + (endY - startY) * ratio;
            const size = Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(
                x + (Math.random() * 6 - 3), 
                y + (Math.random() * 6 - 3), 
                size, 0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 + Math.random() * 0.4})`;
            ctx.fill();
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    init();
    animate(0);
}

// Initialize particles animation in the background
function initParticles() {
    // Create canvas element for particles
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    orbits.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = 'rgba(79, 70, 229, 0.3)';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.size > 0.2) this.size -= 0.01;
            
            // Wrap around screen
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        particlesArray = [];
        for (let i = 0; i < 100; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    
    init();
    animate();
}

// Toggle theme between light and dark mode
function toggleTheme() {
    body.classList.toggle('light-theme');
    
    // Toggle icon
    if (body.classList.contains('light-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Text typing effect for main title
function typingEffect() {
    const text = mainTitle.textContent;
    mainTitle.textContent = '';
    
    let i = 0;
    const speed = 100;
    
    function type() {
        if (i < text.length) {
            mainTitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 500);
}

// Animate elements when they come into view
function animateOnScroll() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    
    function checkPosition() {
        elementsToAnimate.forEach((element) => {
            const position = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            if (position < screenHeight * 0.8) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check on page load
    checkPosition();
    
    // Check on scroll
    window.addEventListener('scroll', checkPosition);
}

// Smooth scrolling for navigation links
function smoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Add animation classes to sections
function addAnimationClasses() {
    sections.forEach(section => {
        section.querySelectorAll('h2, p, .skill, .project-card, .timeline-item').forEach(element => {
            element.classList.add('animate-on-scroll');
        });
    });
}

// Add floating effect to orbit animation
function floatingEffect() {
    // Create glowing planets/orbs that float in the background
    const numberOfOrbs = 5; // Increased from 3 to 5
    
    for (let i = 0; i < numberOfOrbs; i++) {
        const orb = document.createElement('div');
        orb.classList.add('floating-orb');
        
        // Random size between 80px and 200px (larger orbs)
        const size = 80 + Math.random() * 120;
        
        // Random position
        const posX = 10 + Math.random() * 80; // percentage
        const posY = 10 + Math.random() * 80; // percentage
        
        // Random color gradients - expanded palette to match our star colors
        const colors = [
            'radial-gradient(circle, rgba(66, 135, 245, 0.3) 0%, rgba(14, 165, 233, 0.1) 70%)',
            'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(234, 179, 8, 0.1) 70%)',
            'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(124, 58, 237, 0.1) 70%)',
            'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(37, 99, 235, 0.1) 70%)',
            'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.1) 70%)'
        ];
        
        // Random animation duration between 20s and 40s (slower, more celestial movement)
        const duration = 20 + Math.random() * 20;
        
        // Random rotation for more natural movement
        const rotation = Math.random() * 360;
        const rotationDuration = 40 + Math.random() * 40;
        const rotationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
        
        // Set styles with more fluid animations
        orb.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            filter: blur(${size/10}px);
            z-index: -1;
            opacity: 0.6;
            box-shadow: 0 0 ${size/2}px rgba(14, 165, 233, 0.3);
            transform: rotate(${rotation}deg);
            animation: 
                float ${duration}s ease-in-out infinite,
                rotate ${rotationDuration}s linear infinite ${rotationDirection};
            animation-delay: ${Math.random() * 5}s;
        `;
        
        // Add a subtle pulse animation
        const pulse = document.createElement('div');
        pulse.classList.add('orb-pulse');
        pulse.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 50%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            opacity: 0.3;
            animation: pulse ${8 + Math.random() * 7}s ease-in-out infinite;
        `;
        
        orb.appendChild(pulse);
        orbits.appendChild(orb);
    }
    
    // Keep the existing orbit lines but make them more celestial
    const orbitLines = document.createElement('div');
    orbitLines.classList.add('orbit-lines');
    orbitLines.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 500px;
        border: 1px solid rgba(79, 70, 229, 0.1);
        border-radius: 50%;
        animation: orbit 30s linear infinite;
    `;
    
    const orbitLines2 = document.createElement('div');
    orbitLines2.classList.add('orbit-lines');
    orbitLines2.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 700px;
        height: 700px;
        border: 1px solid rgba(14, 165, 233, 0.1);
        border-radius: 50%;
        animation: orbit 40s linear infinite reverse;
    `;
    
    orbits.appendChild(orbitLines);
    orbits.appendChild(orbitLines2);
    
    // Add water-ripple effect to other sections when scrolling
    initWaterRippleEffects();
}

// Initialize water ripple effects on other sections
function initWaterRippleEffects() {
    // Add ripple effect to project cards
    addWaterEffect('.project-card', 'project-water-effect');
    
    // Add ripple effect to skills
    addWaterEffect('.skill', 'skill-water-effect');
    
    // Add ripple effect to timeline dots
    addWaterEffect('.timeline-dot', 'timeline-water-effect');
}

// Function to add water ripple effect to elements
function addWaterEffect(selector, className) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        // Add water effect class
        element.classList.add(className);
        
        // Add mouse interaction
        element.addEventListener('mousemove', (e) => {
            // Get position relative to element
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS variables for water effect position
            element.style.setProperty('--water-x', `${x}px`);
            element.style.setProperty('--water-y', `${y}px`);
            element.style.setProperty('--water-active', '1');
            
            // Add ripple for more interactive elements
            if (selector === '.project-card' || selector === '.skill') {
                createElementRipple(element, x, y);
            }
        });
        
        // Reset water effect when mouse leaves
        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--water-active', '0');
        });
    });
}

// Create ripple effect on elements
function createElementRipple(element, x, y) {
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.classList.add('element-ripple');
    
    // Position ripple at mouse position
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add ripple to element
    element.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// Initialize dynamic year in footer
function initFooterYear() {
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        const year = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', year);
    }
}

// Initialize project modals
function initProjectModals() {
    // Get all project cards again to ensure we have the latest references
    const projectCards = document.querySelectorAll('.project-card');
    
    // Create modal container if it doesn't exist
    if (!document.querySelector('.modal-container')) {
        const modalHTML = `
            <div class="modal-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; perspective: 1500px;">
                <div class="modal-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 21, 33, 0.9); backdrop-filter: blur(5px); z-index: -1; cursor: pointer;"></div>
                <div class="modal-content" style="width: 90%; max-width: 1000px; height: 90vh; max-height: 600px; background-color: #1e293b; border-radius: 8px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3); overflow: hidden; display: flex; flex-direction: column; position: relative; transform-style: preserve-3d; transition: transform 0.5s ease;">
                    <button class="modal-close" style="position: absolute; top: 15px; right: 15px; width: 40px; height: 40px; border-radius: 50%; background-color: rgba(15, 21, 33, 0.5); border: none; color: #f1f5f9; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 2; transition: all 0.3s ease;"><i class="fas fa-times"></i></button>
                    <div class="modal-header" style="padding: 2rem; position: relative;">
                        <h2 class="modal-title" style="font-size: 2rem; margin: 0; background: linear-gradient(to right, #0ea5e9, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Project Title</h2>
                    </div>
                    <div class="modal-body" style="flex: 1; display: flex; overflow: hidden;">
                        <div class="modal-gallery" style="width: 55%; display: flex; flex-direction: column; padding: 0 2rem 2rem;">
                            <div class="modal-image-main" style="flex: 1; background-size: cover; background-position: center; background-repeat: no-repeat; border-radius: 8px; margin-bottom: 1rem; position: relative; overflow: hidden; transition: all 0.3s ease;"></div>
                            <div class="modal-image-thumbnails" style="display: flex; gap: 0.5rem; height: 80px;">
                                <div class="modal-thumb active" style="flex: 1; background-size: cover; background-position: center; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;"></div>
                                <div class="modal-thumb" style="flex: 1; background-size: cover; background-position: center; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;"></div>
                                <div class="modal-thumb" style="flex: 1; background-size: cover; background-position: center; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;"></div>
                            </div>
                        </div>
                        <div class="modal-info" style="width: 45%; padding: 0 2rem 2rem; overflow-y: auto;">
                            <div class="modal-description" style="margin-bottom: 2rem;">
                                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #0ea5e9;">Description</h3>
                                <p></p>
                            </div>
                            <div class="modal-tech" style="margin-bottom: 2rem;">
                                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #0ea5e9;">Technologies</h3>
                                <div class="modal-tech-list" style="display: flex; flex-wrap: wrap; gap: 0.5rem;"></div>
                            </div>
                            <div class="modal-links" style="display: flex; gap: 1rem;">
                                <a href="#" class="btn primary modal-live-link" style="display: inline-block; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; cursor: pointer; background-color: #4f46e5; color: #f1f5f9;" target="_blank">
                                    <i class="fas fa-globe"></i> Live Demo
                                </a>
                                <a href="#" class="btn secondary modal-code-link" style="display: inline-block; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; cursor: pointer; background-color: transparent; color: #f1f5f9; border: 2px solid #0ea5e9;" target="_blank">
                                    <i class="fas fa-code"></i> Source Code
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append modal container to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Get newly created modal elements
    const modalContainer = document.querySelector('.modal-container');
    const modalClose = document.querySelector('.modal-close');
    const modalBg = document.querySelector('.modal-bg');
    
    // Close modal when clicking close button or outside
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBg) {
        modalBg.addEventListener('click', closeModal);
    }
    
    // Close modal when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    // Add click event to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectTitle = card.querySelector('h3').textContent;
            const projectDescription = card.querySelector('p').textContent;
            const projectReadme = card.getAttribute('data-readme') || projectDescription;
            const projectTechnologies = card.getAttribute('data-technologies')?.split(',') || [];
            const demoLink = card.querySelector('.project-links a:first-child').getAttribute('href');
            const codeLink = card.querySelector('.project-links a:last-child').getAttribute('href');
            const projectImageUrl = card.querySelector('.project-image').style.backgroundImage;
            
            // Generate thumbnail images (in a real project, you would have actual thumbnails)
            const images = [
                projectImageUrl, // Main image
                projectImageUrl, // Just duplicating the main image for thumbnails for demo purposes
                projectImageUrl,
                projectImageUrl
            ];
            
            const projectData = {
                title: projectTitle,
                description: projectReadme,
                technologies: projectTechnologies,
                demoLink: demoLink,
                codeLink: codeLink,
                images: images
            };
            
            openModal(projectData);
        });
    });
    
    // Open modal with project data
    function openModal(data) {
        const modalContainer = document.querySelector('.modal-container');
        const modalTitle = document.querySelector('.modal-title');
        const modalDescription = document.querySelector('.modal-description p');
        const modalMainImage = document.querySelector('.modal-image-main');
        const modalThumbs = document.querySelectorAll('.modal-thumb');
        const modalTechList = document.querySelector('.modal-tech-list');
        const modalLiveLink = document.querySelector('.modal-live-link');
        const modalCodeLink = document.querySelector('.modal-code-link');
        
        if (!modalContainer || !modalTitle || !modalDescription || !modalMainImage || 
            !modalThumbs.length || !modalTechList || !modalLiveLink || !modalCodeLink) {
            console.error('Modal elements not found');
            return;
        }
        
        // Set modal content
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        modalMainImage.style.backgroundImage = data.images[0];
        
        // Set thumbnails
        modalThumbs.forEach((thumb, i) => {
            if (data.images[i]) {
                thumb.style.backgroundImage = data.images[i];
                thumb.style.display = 'block';
            } else {
                thumb.style.display = 'none';
            }
        });
        
        // Set technology list
        modalTechList.innerHTML = '';
        data.technologies.forEach(tech => {
            const techSpan = document.createElement('span');
            techSpan.className = 'modal-tech-item';
            techSpan.style.cssText = 'background: linear-gradient(to right, #4f46e5, #0ea5e9); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.875rem; font-weight: 500; color: #f1f5f9; transition: all 0.3s ease;';
            techSpan.textContent = tech;
            modalTechList.appendChild(techSpan);
        });
        
        // Set links
        modalLiveLink.href = data.demoLink;
        modalCodeLink.href = data.codeLink;
        
        // Show modal with animation
        modalContainer.style.opacity = '1';
        modalContainer.style.pointerEvents = 'all';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add click events to thumbnails
        modalThumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => {
                // Update main image
                modalMainImage.style.backgroundImage = data.images[i];
                
                // Update active thumb
                modalThumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
    
    // Close modal
    function closeModal() {
        const modalContainer = document.querySelector('.modal-container');
        
        if (!modalContainer) return;
        
        // Hide modal
        modalContainer.style.opacity = '0';
        modalContainer.style.pointerEvents = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes before initializing other functions
    if (typeof addAnimationClasses === 'function') {
        addAnimationClasses();
    }
    
    // Initialize star background
    if (typeof initStarBackground === 'function') {
        initStarBackground();
    }
    
    // Initialize particles
    initParticles();
    
    // Call floatingEffect function
    floatingEffect();
    
    // Theme toggler setup
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            // Save theme preference to localStorage
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    } else if (typeof toggleTheme === 'function') {
        // Fallback to previous implementation
        const themeToggleOld = document.querySelector('.theme-toggle');
        if (themeToggleOld) {
            themeToggleOld.addEventListener('click', toggleTheme);
        }
    }
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
    
    // Setup smooth scrolling
    if (typeof smoothScroll === 'function') {
        smoothScroll();
    }
    
    // Initialize animations
    if (typeof typingEffect === 'function') {
        typingEffect();
    }
    
    if (typeof animateOnScroll === 'function') {
        animateOnScroll();
    }
    
    // Initialize project modals
    if (typeof initProjectModals === 'function') {
        initProjectModals();
    }
    
    // Update footer year
    if (typeof initFooterYear === 'function') {
        initFooterYear();
    }
    
    // Track mouse for global water effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth * 100;
        const mouseY = e.clientY / window.innerHeight * 100;
        
        // Set CSS variables for global water effect
        document.body.style.setProperty('--mouse-x', `${mouseX}%`);
        document.body.style.setProperty('--mouse-y', `${mouseY}%`);
        document.body.style.setProperty('--mouse-active', '1');
        
        // Fade out effect when mouse stops moving
        clearTimeout(window.mouseTimeout);
        window.mouseTimeout = setTimeout(() => {
            document.body.style.setProperty('--mouse-active', '0');
        }, 3000);
    });
}); 