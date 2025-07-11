const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'photobook-admin-template/html');
const files = fs.readdirSync(htmlDir);

const frontendHead = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnapStory – Complete Photobook Web App Admin & Frontend Template</title>
    <meta name="description" content="SnapStory is a complete Bootstrap 5 template with fully integrated frontend and admin panel workflows for photobook web applications. It includes 14 core admin pages—Dashboard, User & Order Management, Album Moderation, Analytics & Reports, Notifications, Support & Logs, System Settings—plus 5 optional modules (Roles & Permissions, 2FA Login, System Health Monitoring, Announcements, Help Documentation), along with modern frontend pages to launch your photobook business quickly. Built with clean, semantic HTML5, utility-first Bootstrap classes, and Font Awesome icons, SnapStory accelerates your development workflow with pixel-perfect consistency across devices.">
    <meta name="keywords" content="photobook app, frontend, backend, admin panel, Bootstrap 5, responsive, dashboard, user management, order management, analytics, moderation, notifications, system settings, web app template, SnapStory">
    <meta name="author" content="SnapStory Team">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#9381ff">

    <link rel="apple-touch-icon" sizes="180x180" href="../assets/img/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/img/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../assets/img/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="SnapStory – Complete Photobook Web App Admin & Frontend Template">
<meta property="og:description" content="SnapStory is a complete Bootstrap 5 template with fully integrated frontend and admin panel workflows for photobook web applications. Launch your photobook business with ready-made pages, clean code, and seamless UI/UX design.">
<meta property="og:image" content="../assets/img/placeholder-og-1200x630.png">
<meta property="og:url" content="https://yourdomain.com/">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="SnapStory – Complete Photobook Web App Admin & Frontend Template">
<meta name="twitter:description" content="SnapStory is a complete Bootstrap 5 template with fully integrated frontend and admin panel workflows for photobook web applications. Launch your photobook business with ready-made pages, clean code, and seamless UI/UX design.">
<meta name="twitter:image" content="../assets/img/placeholder-og-1200x630.png">

    <link href="../assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css" rel="stylesheet">
`;

const frontendScripts = `
    <script src="../assets/js/jquery.min.js"></script>
    <script src="../assets/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/frontend.js"></script>
`;

const footerHtml = `
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4">
                    <h5 class="fw-bold mb-3 d-flex align-items-center">
                        <i class="fas fa-book-open me-2"></i>SnapStory
                    </h5>
                    <p class="mb-3">Create beautiful photo books online with our professional templates and easy-to-use editor.</p>
                    <div class="social-links">
                        <a href="#" class="text-white me-3" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="text-white me-3" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="text-white me-3" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="text-white" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
                    </div>
                </div>
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold mb-3">Product</h6>
                    <ul class="list-unstyled">
                        <li><a href="templates.html" class="text-decoration-none">Templates</a></li>
                        <li><a href="pricing.html" class="text-decoration-none">Pricing</a></li>
                        <li><a href="features.html" class="text-decoration-none">Features</a></li>
                        <li><a href="samples.html" class="text-decoration-none">Samples</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold mb-3">Support</h6>
                    <ul class="list-unstyled">
                        <li><a href="help.html" class="text-decoration-none">Help Center</a></li>
                        <li><a href="contact.html" class="text-decoration-none">Contact Us</a></li>
                        <li><a href="live-chat.html" class="text-decoration-none">Live Chat</a></li>
                        <li><a href="faq.html" class="text-decoration-none">FAQ</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold mb-3">Company</h6>
                    <ul class="list-unstyled">
                        <li><a href="about.html" class="text-decoration-none">About</a></li>
                        <li><a href="blog.html" class="text-decoration-none">Blog</a></li>
                        <li><a href="careers.html" class="text-decoration-none">Careers</a></li>
                        <li><a href="press.html" class="text-decoration-none">Press</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold mb-3">Legal</h6>
                    <ul class="list-unstyled">
                        <li><a href="privacy.html" class="text-decoration-none">Privacy</a></li>
                        <li><a href="terms.html" class="text-decoration-none">Terms</a></li>
                        <li><a href="cookies.html" class="text-decoration-none">Cookies</a></li>
                        <li><a href="gdpr.html" class="text-decoration-none">GDPR</a></li>
                    </ul>
                </div>
            </div>
            <hr class="my-4">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0">&copy; 2024 SnapStory. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <img src="../assets/img/placeholder-secure-payment-200x30.png" alt="Secure Payment" class="img-fluid">
                </div>
            </div>
        </div>
    </footer>
`;

files.forEach(file => {
    if (!file.endsWith('.html')) return;
    if (file.startsWith('admin-')) return; // Skip admin pages
    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace <head> section
    content = content.replace(
        /<head>[\s\S]*?<body/,
        `<head>\n${frontendHead}\n</head>\n<body`
    );

    // Replace scripts before </body>
    content = content.replace(
        /<script[^<]*?src="[^"]*?jquery\.min\.js"[^<]*?<\/script>[\s\S]*?<\/body>/,
        frontendScripts + '\n</body>'
    );

    // Remove any existing <footer>...</footer>
    content = content.replace(/<footer[\s\S]*?<\/footer>/, '');
    // Insert the new footer before </body>
    content = content.replace(/<\/body>/, `${footerHtml}\n</body>`);
    // Insert scripts after the footer, just before </body>
    content = content.replace(/(<\/footer>)(\s*)<\/body>/, `$1\n${frontendScripts}\n</body>`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated: ${file}`);
});

console.log('Migration complete!'); 