const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const heroMatch = html.match(/<!-- HERO -->(.*?)<!-- ABOUT -->/s);
const aboutMatch = html.match(/<!-- ABOUT -->(.*?)<!-- PROCESS -->/s);
const processMatch = html.match(/<!-- PROCESS -->(.*?)<!-- PORTFOLIO -->/s);
const portfolioMatch = html.match(/<!-- PORTFOLIO -->(.*?)<!-- PACKAGES -->/s);
const packagesMatch = html.match(/<!-- PACKAGES -->(.*?)<!-- TESTIMONIALS -->/s);
const testimonialsMatch = html.match(/<!-- TESTIMONIALS -->(.*?)<!-- CONTACT -->/s);
const contactMatch = html.match(/<!-- CONTACT -->(.*?)<!-- FOOTER -->/s);

const hero = heroMatch ? heroMatch[0] : '';
const about = aboutMatch ? aboutMatch[0].replace('<!-- PROCESS -->', '') : '';
const process = processMatch ? processMatch[0].replace('<!-- PORTFOLIO -->', '') : '';
const portfolio = portfolioMatch ? portfolioMatch[0].replace('<!-- PACKAGES -->', '') : '';
const packages = packagesMatch ? packagesMatch[0].replace('<!-- TESTIMONIALS -->', '') : '';
const testimonials = testimonialsMatch ? testimonialsMatch[0].replace('<!-- CONTACT -->', '') : '';
const contact = contactMatch ? contactMatch[0].replace('<!-- FOOTER -->', '') : '';

let before = html.substring(0, html.indexOf('<!-- HERO -->'));
const after = html.substring(html.indexOf('<!-- FOOTER -->'));

let navUpdated = before.replace(/href="#about"/g, 'href="about.html"')
    .replace(/href="#process"/g, 'href="services.html"')
    .replace(/href="#portfolio"/g, 'href="portfolio.html"')
    .replace(/href="#packages"/g, 'href="packages.html"')
    .replace(/href="#contact"/g, 'href="contact.html"')
    .replace(/href="#"/g, 'href="index.html"');

const writePage = (name, content) => {
    fs.writeFileSync(name, navUpdated + content + after);
}

writePage('index.html', hero + '\n' + testimonials);
writePage('about.html', about);
writePage('services.html', process);
writePage('portfolio.html', portfolio);
writePage('packages.html', packages);
writePage('contact.html', contact);

console.log('Pages built successfully!');
