// Define your pages - matching your actual HTML files
const pages = [
    { name: 'Home', file: 'index.html' },
    { name: 'Comparison', file: 'comparison.html' },
    { name: 'Screening R2', file: 'Screening_Result2.html' },
    { name: 'Screening R3', file: 'Screening_Result3.html' },
    { name: 'Project Builder', file: 'projectbuilder.html' },
    { name: 'OEM Comparison', file: 'OEMcomparison.html' },
    { name: 'CAPEX', file: 'CAPEX.html' },
    { name: 'LLI5', file: 'LLI5.html' },
    { name: 'Schedule', file: 'schedule.html' },
    { name: 'ESIA3', file: 'ESIA3.html' },
    { name: 'Offtake', file: 'offtake.html' }
];

// Function to insert navigation into nav container
function insertNavigation() {
    const nav = document.getElementById('main-nav');
    if (nav) {
        // Clear existing content and add nav links with new styling
        nav.innerHTML = '';
        nav.className = 'seidr-nav';
        
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('Current page:', currentPage, 'at', new Date().toISOString()); // Debug log
        
        pages.forEach(page => {
            const link = document.createElement('a');
            link.href = page.file;
            link.textContent = page.name;
            link.className = 'nav-link';
            
            // Add active class to current page
            if (page.file === currentPage) {
                link.classList.add('active');
                console.log('Active page:', page.name); // Debug log
            }
            
            nav.appendChild(link);
        });
    }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', insertNavigation);