document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar-custom');
    const topBar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scroll class to body for content margin adjustment
        if (currentScroll > 50) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        
        // Handle navbar appearance
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.classList.add('navbar-scroll');
            topBar.classList.add('top-bar-hidden');
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            if (currentScroll < 100) {
                navbar.classList.remove('navbar-scroll');
                topBar.classList.remove('top-bar-hidden');
            }
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll to footer when clicking Contact
    document.querySelector('a[href="#contact"]').addEventListener('click', function(e) {
        e.preventDefault();
        const footer = document.querySelector('#contact');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    });
});