<?php
declare(strict_types=1);
require __DIR__ . '/config.php';

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function cms_is_logged_in(): bool
{
    return !empty($_SESSION['tl_cms_logged_in']);
}

function cms_slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : 'blog-post';
}

function cms_read_posts(): array
{
    if (!is_file(TL_CMS_DATA_FILE)) {
        return [];
    }

    $posts = json_decode((string) file_get_contents(TL_CMS_DATA_FILE), true);
    if (!is_array($posts)) {
        return [];
    }

    usort($posts, static fn ($a, $b) => strcmp((string) ($b['date'] ?? ''), (string) ($a['date'] ?? '')));
    return $posts;
}

function cms_write_posts(array $posts): void
{
    if (!is_dir(dirname(TL_CMS_DATA_FILE))) {
        mkdir(dirname(TL_CMS_DATA_FILE), 0755, true);
    }

    file_put_contents(
        TL_CMS_DATA_FILE,
        json_encode(array_values($posts), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

function cms_format_date(string $date): string
{
    $time = strtotime($date);
    return $time ? date('F j, Y', $time) : $date;
}

function cms_normalize_body(string $body): string
{
    $allowed = '<p><br><strong><b><em><i><a><h2><h3><ul><ol><li><blockquote>';
    $body = trim(strip_tags($body, $allowed));
    if ($body === '') {
        return '<p>Start writing your blog content here.</p>';
    }

    if (!preg_match('/<(p|h2|h3|ul|ol|blockquote)\b/i', $body)) {
        $paragraphs = array_filter(array_map('trim', preg_split('/\R{2,}/', $body) ?: []));
        $body = implode("\n", array_map(static fn ($p) => '<p>' . nl2br(h($p)) . '</p>', $paragraphs));
    }

    $body = preg_replace('/<p>/', '<p class="text-brand-muted leading-[1.8] text-base md:text-lg mb-6">', $body) ?? $body;
    $body = preg_replace('/<h2>/', '<h2 class="font-serif text-3xl text-brand-dark mt-14 mb-6">', $body) ?? $body;
    $body = preg_replace('/<h3>/', '<h3 class="font-serif text-2xl text-brand-dark mt-10 mb-4">', $body) ?? $body;
    $body = preg_replace('/<ul>/', '<ul class="space-y-3 text-brand-muted mb-6 pl-5 list-disc">', $body) ?? $body;
    $body = preg_replace('/<ol>/', '<ol class="space-y-3 text-brand-muted mb-6 pl-5 list-decimal">', $body) ?? $body;
    $body = preg_replace('/<blockquote>/', '<blockquote class="border-l-4 border-brand-orange pl-6 text-brand-muted italic my-8">', $body) ?? $body;

    return $body;
}

function cms_upload_image(): ?string
{
    if (empty($_FILES['image_upload']['name'])) {
        return null;
    }

    if (!is_dir(TL_CMS_UPLOAD_DIR)) {
        mkdir(TL_CMS_UPLOAD_DIR, 0755, true);
    }

    $tmp = $_FILES['image_upload']['tmp_name'] ?? '';
    $name = (string) ($_FILES['image_upload']['name'] ?? '');
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!is_uploaded_file($tmp) || !in_array($ext, $allowed, true)) {
        throw new RuntimeException('Please upload a JPG, PNG, or WEBP image.');
    }

    $file = cms_slugify(pathinfo($name, PATHINFO_FILENAME)) . '-' . date('YmdHis') . '.' . $ext;
    $target = TL_CMS_UPLOAD_DIR . '/' . $file;
    if (!move_uploaded_file($tmp, $target)) {
        throw new RuntimeException('Image upload failed. Check folder permissions for assets/blog.');
    }

    return TL_CMS_UPLOAD_WEB_PATH . $file;
}

function cms_nav_html(): string
{
    return <<<'HTML'
    <nav id="nav" class="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-2">
        <a href="../index.html" class="flex-shrink-0 relative z-50"><img src="../assets/logo.png" alt="Timberlane Interiors Logo" class="h-8 md:h-14 object-contain transition-all duration-300"></a>
        <ul class="hidden lg:flex items-center gap-6 xl:gap-8">
            <li><a href="../index.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">Home</a></li>
            <li><a href="../about.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">About</a></li>
            <li><a href="../services.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">Services</a></li>
            <li><a href="../portfolio.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">Portfolio</a></li>
            <li><a href="index.html" class="text-xs uppercase tracking-widest font-semibold text-brand-orange transition-colors">Blog</a></li>
            <li><a href="../packages.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">Packages</a></li>
            <li><a href="../estimator.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">Estimator</a></li>
            <li><a href="../contact.html" class="text-xs uppercase tracking-widest font-semibold text-brand-dark/70 hover:text-brand-orange transition-colors">Contact</a></li>
        </ul>
        <div class="hidden lg:flex items-center gap-6">
            <a href="tel:+918884651111" class="flex items-center gap-2 text-sm font-semibold hover:text-brand-orange transition-colors">+91 8884651111</a>
            <a href="../contact.html" class="flex items-center gap-2 border border-brand-orange text-brand-orange px-6 py-3 text-xs uppercase tracking-[0.15em] font-bold hover:bg-brand-orange hover:text-white transition-all duration-300">Get Your Design</a>
        </div>
        <button id="ham-btn" class="lg:hidden flex flex-col justify-center items-center w-8 h-8 z-50 group"><span class="w-6 h-[1.5px] bg-brand-dark block transition-all duration-300 group-[.active]:rotate-45 group-[.active]:translate-y-[6px]"></span><span class="w-6 h-[1.5px] bg-brand-dark block my-1.5 transition-all duration-300 group-[.active]:opacity-0"></span><span class="w-6 h-[1.5px] bg-brand-dark block transition-all duration-300 group-[.active]:-rotate-45 group-[.active]:-translate-y-[6px]"></span></button>
    </nav>
    <div id="mobile-drawer" class="fixed inset-0 bg-brand-cream z-40 flex flex-col justify-center items-center gap-8 opacity-0 pointer-events-none transition-opacity duration-300 [&.open]:opacity-100 [&.open]:pointer-events-auto">
        <a href="../index.html" class="font-serif text-3xl text-brand-dark">Home</a><a href="../about.html" class="font-serif text-3xl text-brand-dark">About</a><a href="../services.html" class="font-serif text-3xl text-brand-dark">Services</a><a href="../portfolio.html" class="font-serif text-3xl text-brand-dark">Portfolio</a><a href="index.html" class="font-serif text-3xl text-brand-orange">Blog</a><a href="../packages.html" class="font-serif text-3xl text-brand-dark">Packages</a><a href="../contact.html" class="font-serif text-3xl text-brand-dark">Contact</a>
    </div>
HTML;
}

function cms_head_html(string $title, string $description, string $canonical = ''): string
{
    $canonicalTag = $canonical ? '<link rel="canonical" href="' . h($canonical) . '" />' : '';
    return '<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>' . h($title) . '</title>
    <meta name="description" content="' . h($description) . '" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon.png">
    <link rel="apple-touch-icon" href="../assets/favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { theme: { extend: { colors: { brand: { orange: "#C85A17", dark: "#2A2C2E", cream: "#FDFBF7", warm: "#F4F0EA", muted: "#8A817C" } }, fontFamily: { sans: ["Inter", "sans-serif"], serif: ["Playfair Display", "serif"] } } } }</script>
    <style>body{background-color:#FDFBF7;color:#2A2C2E}#prog{position:fixed;top:0;left:0;height:3px;z-index:1000;background:#C85A17;width:0;transition:width .1s ease-out}.reveal{opacity:0;transform:translateY(30px);transition:all .8s cubic-bezier(.5,0,0,1)}.reveal.in{opacity:1;transform:translateY(0)}#nav{background:rgba(253,251,247,.95);backdrop-filter:blur(10px);box-shadow:0 4px 30px rgba(0,0,0,.03);padding-top:.75rem;padding-bottom:.75rem}</style>
    ' . $canonicalTag . '
</head>';
}

function cms_footer_html(): string
{
    return <<<'HTML'
    <footer class="bg-brand-dark text-white pt-20 pb-10 px-6 md:px-12 border-t-[8px] border-brand-orange">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/10">
                <div class="lg:col-span-2"><a href="../index.html" class="block font-sans font-bold text-sm tracking-widest uppercase text-brand-orange mb-6">Timberlane Interiors</a><p class="text-sm text-white/50 leading-relaxed max-w-sm">We design the feeling of you - luxury interior design studio based in Bangalore, India.</p></div>
                <div><h4 class="text-[0.65rem] tracking-widest uppercase text-white/40 font-semibold mb-6">Navigate</h4><ul class="space-y-4 text-sm text-white/70"><li><a href="../index.html" class="hover:text-brand-orange transition-colors">Home</a></li><li><a href="../about.html" class="hover:text-brand-orange transition-colors">About</a></li><li><a href="../services.html" class="hover:text-brand-orange transition-colors">Services</a></li><li><a href="../portfolio.html" class="hover:text-brand-orange transition-colors">Portfolio</a></li><li><a href="index.html" class="hover:text-brand-orange transition-colors">Blog</a></li><li><a href="../contact.html" class="hover:text-brand-orange transition-colors">Contact</a></li></ul></div>
                <div><h4 class="text-[0.65rem] tracking-widest uppercase text-white/40 font-semibold mb-6">Legal</h4><ul class="space-y-4 text-sm text-white/70"><li><a href="../privacy-policy.html" class="hover:text-brand-orange transition-colors">Privacy Policy</a></li></ul></div>
                <div><h4 class="text-[0.65rem] tracking-widest uppercase text-white/40 font-semibold mb-6">Contact</h4><ul class="space-y-4 text-sm text-white/70"><li><a href="tel:+918884651111" class="hover:text-brand-orange transition-colors">+91 8884651111</a></li><li><a href="mailto:info@timberlane.co.in" class="hover:text-brand-orange transition-colors">info@timberlane.co.in</a></li><li><span>Jayanagar, Bengaluru</span></li></ul></div>
            </div>
            <div class="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-xs text-white/30"><p>&copy; 2026 Timberlane Interiors. All rights reserved.</p><a href="../privacy-policy.html" class="text-white/30 hover:text-brand-orange transition-colors">Privacy Policy</a><p class="tracking-widest uppercase">We Design The Feeling of You</p></div>
        </div>
    </footer>
    <a href="https://wa.me/918884651111" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" class="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300">WA</a>
    <script>document.addEventListener("DOMContentLoaded",()=>{window.addEventListener("scroll",()=>{const s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight,p=document.getElementById("prog");if(h>0&&p)p.style.width=s/h*100+"%";const n=document.getElementById("nav");if(n)n.classList.add("solid");document.querySelectorAll(".reveal").forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-80)el.classList.add("in")})});window.dispatchEvent(new Event("scroll"));const h=document.getElementById("ham-btn"),d=document.getElementById("mobile-drawer");if(h&&d){h.addEventListener("click",()=>{h.classList.toggle("active");d.classList.toggle("open");document.body.classList.toggle("overflow-hidden")});d.querySelectorAll("a").forEach(l=>l.addEventListener("click",()=>{h.classList.remove("active");d.classList.remove("open");document.body.classList.remove("overflow-hidden")}))}});</script>
    <script src="../main.js"></script>
</body>
</html>
HTML;
}

function cms_render_index(array $posts): void
{
    $cards = '';
    foreach ($posts as $i => $post) {
        if (($post['status'] ?? 'published') !== 'published') {
            continue;
        }

        $delay = $i % 3 === 1 ? ' delay-100' : ($i % 3 === 2 ? ' delay-200' : '');
        $image = $post['image'] ?: TL_CMS_DEFAULT_IMAGE;
        $cards .= '<a href="' . h($post['slug']) . '.html" class="group block reveal' . $delay . '">
                <div class="h-72 overflow-hidden bg-brand-warm mb-6"><img src="' . h($image) . '" alt="' . h($post['image_alt'] ?: $post['title']) . '" class="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"></div>
                <span class="text-[0.65rem] uppercase tracking-widest text-brand-muted mb-3 block">' . h(cms_format_date($post['date'])) . ' &mdash; ' . h($post['category']) . '</span>
                <h3 class="font-serif text-xl md:text-2xl text-brand-dark mb-3 group-hover:text-brand-orange transition-colors leading-snug">' . h($post['title']) . '</h3>
                <p class="text-sm text-brand-muted leading-relaxed mb-4 line-clamp-3">' . h($post['excerpt']) . '</p>
                <span class="text-xs uppercase tracking-widest text-brand-orange font-bold">Read More</span>
            </a>';
    }

    $html = cms_head_html('Timberlane Blog | Interior Design Ideas & Trends', 'Discover interior design ideas, expert tips and modern trends on Timberlane blog to help you plan and style your perfect home interiors.', 'https://timberlane.co.in/blog/') . '
<body class="overflow-x-hidden font-sans antialiased selection:bg-brand-orange selection:text-white">
    <div id="prog"></div>
' . cms_nav_html() . '
    <header class="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-brand-warm">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <p class="text-[0.65rem] tracking-[0.35em] uppercase text-brand-orange mb-4 font-semibold">Our Perspective</p>
            <h1 class="font-serif text-5xl md:text-7xl text-brand-dark">Journal</h1>
        </div>
    </header>
    <main class="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">' . $cards . '</div>
    </main>
' . cms_footer_html();

    file_put_contents(TL_CMS_BLOG_DIR . '/index.html', $html, LOCK_EX);
}

function cms_render_post(array $post, array $posts): void
{
    $recent = '';
    $count = 0;
    foreach ($posts as $item) {
        if (($item['status'] ?? 'published') !== 'published' || $item['slug'] === $post['slug']) {
            continue;
        }
        $recent .= '<li><a href="' . h($item['slug']) . '.html" class="text-sm text-brand-dark hover:text-brand-orange transition-colors leading-relaxed block">' . h($item['title']) . '</a></li>';
        $count++;
        if ($count >= 4) {
            break;
        }
    }

    $image = $post['image'] ?: TL_CMS_DEFAULT_IMAGE;
    $html = cms_head_html($post['title'] . ' - Timberlane Interiors', $post['meta_description'] ?: $post['excerpt']) . '
<body class="overflow-x-hidden font-sans antialiased selection:bg-brand-orange selection:text-white">
    <div id="prog"></div>
' . cms_nav_html() . '
    <article class="max-w-7xl mx-auto px-6 md:px-12 pt-36 md:pt-40 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        <div>
            <header class="mb-12">
                <a href="index.html" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-orange transition-colors mb-6">Back to Journal</a>
                <span class="block text-xs uppercase tracking-widest text-brand-orange font-bold mb-4">' . h($post['category']) . ' &mdash; ' . h(cms_format_date($post['date'])) . '</span>
                <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-dark leading-[1.1] mb-6">' . h($post['title']) . '</h1>
            </header>
            <img src="' . h($image) . '" alt="' . h($post['image_alt'] ?: $post['title']) . '" class="w-full h-64 md:h-[500px] object-cover mb-12">
            <div class="prose max-w-none">' . cms_normalize_body((string) $post['body']) . '
                <div class="mt-16 p-10 bg-brand-warm border border-brand-dark/5 text-center">
                    <h3 class="font-serif text-3xl text-brand-dark mb-4">Ready to Design a Home That Feels Like You?</h3>
                    <p class="text-brand-muted mb-8">Connect with Timberlane today and let us transform your vision into a beautifully designed living experience.</p>
                    <a href="../contact.html" class="inline-block bg-brand-orange text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-brand-dark transition-colors">Start Your Journey</a>
                </div>
            </div>
        </div>
        <aside class="lg:sticky lg:top-32 h-fit space-y-8">
            <div class="bg-brand-warm p-8"><h4 class="font-serif text-xl text-brand-dark mb-6">Recent Posts</h4><ul class="space-y-5">' . $recent . '</ul></div>
            <div class="bg-brand-dark text-white p-8 text-center"><h4 class="text-brand-orange font-serif text-xl mb-3">Transform Your Space</h4><p class="text-sm text-white/70 mb-6 leading-relaxed">Ready to bring refined design into your home? Let us discuss your vision.</p><a href="../contact.html" class="block bg-brand-orange text-white text-xs tracking-widest uppercase py-3 font-bold hover:bg-white hover:text-brand-dark transition-colors">Book Consultation</a></div>
        </aside>
    </article>
' . cms_footer_html();

    file_put_contents(TL_CMS_BLOG_DIR . '/' . $post['slug'] . '.html', $html, LOCK_EX);
}

function cms_publish_all(array $posts): void
{
    if (!is_dir(TL_CMS_BLOG_DIR)) {
        mkdir(TL_CMS_BLOG_DIR, 0755, true);
    }
    cms_render_index($posts);
    foreach ($posts as $post) {
        if (($post['status'] ?? 'published') === 'published') {
            cms_render_post($post, $posts);
        }
    }
}

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'login') {
    if (hash('sha256', (string) ($_POST['password'] ?? '')) === TL_CMS_PASSWORD_HASH) {
        $_SESSION['tl_cms_logged_in'] = true;
        header('Location: index.php');
        exit;
    }
    $error = 'Invalid password.';
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

if (cms_is_logged_in() && $_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'save') {
    try {
        $posts = cms_read_posts();
        $originalSlug = cms_slugify((string) ($_POST['original_slug'] ?? ''));
        $title = trim((string) ($_POST['title'] ?? ''));
        if ($title === '') {
            throw new RuntimeException('Title is required.');
        }

        $slug = cms_slugify((string) ($_POST['slug'] ?: $title));
        $uploaded = cms_upload_image();
        $post = [
            'title' => $title,
            'slug' => $slug,
            'date' => (string) ($_POST['date'] ?: date('Y-m-d')),
            'category' => trim((string) ($_POST['category'] ?: 'Ideas')),
            'status' => (string) ($_POST['status'] ?: 'published'),
            'excerpt' => trim((string) ($_POST['excerpt'] ?? '')),
            'meta_description' => trim((string) ($_POST['meta_description'] ?? '')),
            'image' => $uploaded ?: trim((string) ($_POST['image'] ?? '')),
            'image_alt' => trim((string) ($_POST['image_alt'] ?? '')),
            'body' => trim((string) ($_POST['body'] ?? '')),
            'updated_at' => date('c'),
        ];

        $found = false;
        foreach ($posts as $key => $existing) {
            if (($existing['slug'] ?? '') === $originalSlug) {
                $posts[$key] = $post;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $posts[] = $post;
        }

        cms_write_posts($posts);
        cms_publish_all($posts);
        $message = 'Blog post saved and public pages regenerated.';
    } catch (Throwable $e) {
        $error = $e->getMessage();
    }
}

if (cms_is_logged_in() && isset($_GET['delete'])) {
    $deleteSlug = cms_slugify((string) $_GET['delete']);
    $posts = array_values(array_filter(cms_read_posts(), static fn ($post) => ($post['slug'] ?? '') !== $deleteSlug));
    cms_write_posts($posts);
    cms_publish_all($posts);
    $message = 'Post removed from CMS and blog index regenerated.';
}

$posts = cms_read_posts();
$editSlug = cms_slugify((string) ($_GET['edit'] ?? ''));
$edit = [
    'title' => '',
    'slug' => '',
    'date' => date('Y-m-d'),
    'category' => 'Ideas',
    'status' => 'published',
    'excerpt' => '',
    'meta_description' => '',
    'image' => TL_CMS_DEFAULT_IMAGE,
    'image_alt' => '',
    'body' => '',
];
foreach ($posts as $post) {
    if (($post['slug'] ?? '') === $editSlug) {
        $edit = array_merge($edit, $post);
        break;
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h(TL_CMS_SITE_NAME) ?></title>
    <style>
        :root{--orange:#C85A17;--dark:#2A2C2E;--cream:#FDFBF7;--warm:#F4F0EA;--muted:#8A817C}
        *{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--dark);font-family:Inter,Arial,sans-serif}.wrap{width:min(1180px,calc(100% - 32px));margin:0 auto}.top{padding:28px 0;border-bottom:1px solid rgba(42,44,46,.1);display:flex;justify-content:space-between;gap:18px;align-items:center}.brand{font-size:14px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--orange)}.btn,a.btn{border:0;background:var(--orange);color:white;padding:12px 16px;text-decoration:none;text-transform:uppercase;font-size:11px;font-weight:800;letter-spacing:.12em;cursor:pointer}.btn.secondary{background:var(--dark)}.grid{display:grid;grid-template-columns:1fr 360px;gap:30px;padding:32px 0}.panel{background:white;border:1px solid rgba(42,44,46,.08);padding:24px}.panel h2{margin:0 0 18px;font-family:Georgia,serif;font-size:30px}.field{display:grid;gap:8px;margin-bottom:16px}.field label{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);font-weight:800}input,textarea,select{width:100%;border:1px solid rgba(42,44,46,.16);padding:12px 13px;font:inherit;background:#fff;color:var(--dark)}textarea{min-height:260px;resize:vertical}.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.notice{padding:12px 14px;margin:18px 0;background:#edf8ee;border:1px solid #a8d7ad;color:#25642e}.error{padding:12px 14px;margin:18px 0;background:#fff0ed;border:1px solid #e2aaa0;color:#9a321c}.post{padding:16px 0;border-bottom:1px solid rgba(42,44,46,.1)}.post strong{display:block;margin-bottom:6px}.post small{color:var(--muted)}.post .actions{margin-top:10px;display:flex;gap:10px}.login{min-height:100vh;display:grid;place-items:center}.login .panel{width:min(440px,calc(100% - 32px))}.hint{color:var(--muted);font-size:13px;line-height:1.5}@media(max-width:900px){.grid{grid-template-columns:1fr}.row{grid-template-columns:1fr}.top{align-items:flex-start;flex-direction:column}}
    </style>
</head>
<body>
<?php if (!cms_is_logged_in()): ?>
    <main class="login">
        <form class="panel" method="post">
            <input type="hidden" name="action" value="login">
            <p class="brand">Timberlane Interiors</p>
            <h2>Blog CMS Login</h2>
            <?php if ($error): ?><div class="error"><?= h($error) ?></div><?php endif; ?>
            <div class="field"><label>Password</label><input type="password" name="password" required autofocus></div>
            <button class="btn" type="submit">Login</button>
            <p class="hint">Default setup password: Timberlane@2026. Replace it on the server by setting TIMBERLANE_CMS_PASSWORD_HASH.</p>
        </form>
    </main>
<?php else: ?>
    <header class="wrap top">
        <div><p class="brand">Timberlane Interiors</p><h1>Blog CMS</h1></div>
        <div><a class="btn secondary" href="../blog/index.html" target="_blank">View Blog</a> <a class="btn" href="?logout=1">Logout</a></div>
    </header>
    <main class="wrap">
        <?php if ($message): ?><div class="notice"><?= h($message) ?></div><?php endif; ?>
        <?php if ($error): ?><div class="error"><?= h($error) ?></div><?php endif; ?>
        <div class="grid">
            <form class="panel" method="post" enctype="multipart/form-data">
                <input type="hidden" name="action" value="save">
                <input type="hidden" name="original_slug" value="<?= h((string) $edit['slug']) ?>">
                <h2><?= $editSlug ? 'Edit Post' : 'New Post' ?></h2>
                <div class="field"><label>Title</label><input name="title" value="<?= h((string) $edit['title']) ?>" required></div>
                <div class="row">
                    <div class="field"><label>Slug</label><input name="slug" value="<?= h((string) $edit['slug']) ?>" placeholder="auto-from-title"></div>
                    <div class="field"><label>Date</label><input type="date" name="date" value="<?= h((string) $edit['date']) ?>"></div>
                </div>
                <div class="row">
                    <div class="field"><label>Category</label><input name="category" value="<?= h((string) $edit['category']) ?>"></div>
                    <div class="field"><label>Status</label><select name="status"><option value="published" <?= $edit['status'] === 'published' ? 'selected' : '' ?>>Published</option><option value="draft" <?= $edit['status'] === 'draft' ? 'selected' : '' ?>>Draft</option></select></div>
                </div>
                <div class="field"><label>Excerpt</label><textarea name="excerpt" style="min-height:90px"><?= h((string) $edit['excerpt']) ?></textarea></div>
                <div class="field"><label>Meta Description</label><textarea name="meta_description" style="min-height:80px"><?= h((string) $edit['meta_description']) ?></textarea></div>
                <div class="field"><label>Existing Image Path</label><input name="image" value="<?= h((string) $edit['image']) ?>" placeholder="../assets/blog/example.webp"></div>
                <div class="field"><label>Upload New Image</label><input type="file" name="image_upload" accept=".jpg,.jpeg,.png,.webp"></div>
                <div class="field"><label>Image Alt Text</label><input name="image_alt" value="<?= h((string) $edit['image_alt']) ?>"></div>
                <div class="field"><label>Article Body</label><textarea name="body" placeholder="<p>Your intro...</p><h2>Section title</h2><p>More content...</p>"><?= h((string) $edit['body']) ?></textarea></div>
                <button class="btn" type="submit">Save and Publish</button>
                <a class="btn secondary" href="index.php">Clear Form</a>
                <p class="hint">Body accepts simple HTML: p, h2, h3, ul, ol, li, strong, em, a, blockquote, and br.</p>
            </form>
            <aside class="panel">
                <h2>Posts</h2>
                <?php foreach ($posts as $post): ?>
                    <div class="post">
                        <strong><?= h((string) $post['title']) ?></strong>
                        <small><?= h(cms_format_date((string) $post['date'])) ?> / <?= h((string) $post['category']) ?> / <?= h((string) $post['status']) ?></small>
                        <div class="actions"><a href="?edit=<?= h((string) $post['slug']) ?>">Edit</a><a href="../blog/<?= h((string) $post['slug']) ?>.html" target="_blank">View</a><a href="?delete=<?= h((string) $post['slug']) ?>" onclick="return confirm('Delete this post from the CMS list?')">Delete</a></div>
                    </div>
                <?php endforeach; ?>
            </aside>
        </div>
    </main>
<?php endif; ?>
</body>
</html>
