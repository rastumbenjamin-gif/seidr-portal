// Define your pages - matching your actual HTML files
const pages = [
    { name: 'Home', file: 'index.html' },
    { name: 'Create Project', file: 'create_ptx_project.html' },
    { name: 'Portfolio Board', file: 'comparison.html' },
    { name: 'Screening R2', file: 'Screening_Result2.html' },
    { name: 'Screening R3', file: 'Screening_Result3.html' },
    { name: 'Project Builder', file: 'projectbuilder.html' },
    { name: 'Electrolyzer', file: 'electrolyzer_config.html' },
    { name: 'OEM Comparison', file: 'OEMcomparison.html' },
    { name: 'HAZID', file: 'hazid.html' },
    { name: 'CAPEX', file: 'CAPEX.html' },
    { name: 'Long Lead Items', file: 'LLI5.html' },
    { name: 'Schedule', file: 'schedule.html' },
    { name: 'Impact Screening', file: 'ESIA3.html' },
    { name: 'Offtake', file: 'offtake.html' },
    { name: 'Board Pack', file: 'decision_board.html' }
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