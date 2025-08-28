# Modern Portfolio Website 

A stunning, responsive portfolio website inspired by Google Gemini's design aesthetics, featuring smooth animations, interactive elements, and a modern UI.

## Features

- **Modern UI Design**: Clean, modern interface inspired by Google Gemini's aesthetics
- **Responsive Layout**: Works perfectly on all devices from mobile to desktop
- **Dark/Light Mode**: Toggle between color schemes with a single click
- **Smooth Animations**: Beautiful page transitions and scroll animations
- **Interactive Elements**: Hover effects, floating animations, and particle effects
- **Timeline Layout**: Elegant display of education and experience
- **Contact Form**: Integrated contact form to receive messages
- **Optimized Performance**: Fast loading times and smooth scrolling

## Sections

1. **Hero Section**: Eye-catching introduction with animated elements
2. **About Me**: Summary of skills and background
3. **Projects**: Showcase of work with visual cards
4. **Education**: Timeline of educational background
5. **Experience**: Timeline of work experience
6. **Contact**: Form and social links for connecting

## Usage

1. Clone the repository
2. Open `index.html` in your browser
3. Customize the content in the HTML file to match your personal information
4. Update the images in the project cards
5. Modify the color scheme in CSS variables if desired
6. Deploy to your preferred hosting service

## Customization

### Changing Colors

Edit the CSS variables at the top of the `style.css` file:

```css
:root {
    --color-primary: #4f46e5;
    --color-accent: #0ea5e9;
    /* More variables... */
}
```

### Adding Projects

Duplicate the project card structure in the HTML:

```html
<div class="project-card">
    <div class="project-image"></div>
    <h3>Project Title</h3>
    <p>Project description goes here...</p>
    <div class="project-links">
        <a href="#" class="btn small">View Demo</a>
        <a href="#" class="btn small secondary">Source Code</a>
    </div>
</div>
```

## Credits

- Fonts: [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- Icons: [Font Awesome](https://fontawesome.com/)
- Inspiration: Google Gemini's UI design

## License

MIT License 