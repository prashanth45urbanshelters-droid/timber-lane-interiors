(function () {
    function init() {
        if (window.tl_initialized) return;
        window.tl_initialized = true;

        document.body.classList.add('loaded');
        const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzh7gWJD_dC7aqlBDPKAjWvQxCYX0MZRHWe_oOvw6ie0l6aUk7Ligu4sjRKTHM8PtUR/exec';

        // Cursor
        const cursor = document.getElementById('cur2');
        if (cursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        }
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });


        // Scroll progress & Navigation
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            const progress = document.getElementById('prog');
            if (progress) progress.style.width = scrolled + '%';
            const nav = document.getElementById('nav');
            if (nav) {
                nav.classList.add('solid');
            }

            // Reveals
            document.querySelectorAll('.reveal').forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('in');
            });
        });

        // FAQ
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-q');
            if (!question) return;
            question.addEventListener('click', () => {
                const wasOpen = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!wasOpen) item.classList.add('active');
            });
        });

        window.dispatchEvent(new Event('scroll'));

        // Shared landing CTAs (popup + floating button + footer strip)
        if (!document.getElementById('tl-landing-cta-style')) {
            const style = document.createElement('style');
            style.id = 'tl-landing-cta-style';
            style.textContent = `
                .tl-floating-contact {
                    position: fixed;
                    right: 0; 
                    top: 36%;
                    transform: translateY(-50%) rotate(-90deg);
                    transform-origin: bottom right;
                    z-index: 1200;
                    background: #C85A17;
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-bottom: none;
                    border-radius: 8px 8px 0 0;
                    padding: 10px 18px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-size: 10px;
                    font-weight: 700;
                    box-shadow: 0 -4px 20px rgba(61, 43, 31, 0.2);
                    transition: all .3s ease;
                    white-space: nowrap;
                }
                .tl-floating-contact:hover {
                    background: #3D2B1F;
                    padding-top: 18px;
                }
                .tl-popup-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(26, 26, 26, 0.8);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 2100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity .45s ease;
                }
                .tl-popup-overlay.active {
                    opacity: 1 !important;
                    pointer-events: all !important;
                    display: flex !important;
                }
                .tl-popup {
                    width: min(92vw, 560px);
                    background: #F7F3EE;
                    border: 1px solid rgba(61, 43, 31, 0.15);
                    padding: 56px 30px 38px;
                    text-align: center;
                    position: relative;
                    transform: translateY(14px) scale(.98);
                    transition: transform .45s ease;
                }
                .tl-popup-overlay.active .tl-popup { transform: translateY(0) scale(1); }
                .tl-popup-close {
                    position: absolute;
                    top: 12px;
                    right: 14px;
                    border: 0;
                    background: transparent;
                    font-size: 28px;
                    color: #1A1A1A;
                    cursor: pointer;
                    line-height: 1;
                    opacity: .65;
                }
                .tl-popup-close:hover { opacity: 1; }
                .tl-popup h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 5vw, 3rem);
                    margin-bottom: 10px;
                    color: #3D2B1F;
                    line-height: 1.05;
                }
                .tl-popup p {
                    color: rgba(26, 26, 26, 0.75);
                    margin-bottom: 24px;
                    line-height: 1.5;
                    font-size: 14px;
                }
                .tl-popup-content-wrap {
                    display: grid;
                    grid-template-cols: 1fr 1fr;
                    min-height: 480px;
                }
                .tl-popup-image {
                    background-image: url('assets/enquiry_form.webp');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                .tl-popup-image::after {
                    content: '';
                    background: linear-gradient(to top, rgba(61, 43, 31, 0.6), transparent);
                    position: absolute;
                    inset: 0;
                }
                .tl-popup-body {
                    padding: 50px 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: left;
                    background: #FDFBF7;
                }
                .tl-popup h3 {
                    font-family: 'Playfair Display', serif;
                    color: #2A2C2E;
                    line-height: 1.2;
                }
                .tl-popup-field {
                    background: #fff;
                    border: 1px solid rgba(61, 43, 31, 0.1);
                    padding: 12px 16px;
                    font-size: 14px;
                    border-radius: 4px;
                    outline: none;
                    transition: border-color 0.3s;
                }
                .tl-popup-field:focus {
                    border-color: #C85A17;
                }
                .tl-popup-submit {
                    background: #2A2C2E;
                    color: #fff;
                    border: none;
                    padding: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: background 0.3s;
                    font-size: 12px;
                    border-radius: 4px;
                }
                .tl-popup-submit:hover {
                    background: #C85A17;
                }
                @media (max-width: 640px) {
                    .tl-popup-content-wrap {
                        grid-template-cols: 1fr;
                        grid-template-rows: 180px 1fr;
                    }
                    .tl-popup-body {
                        padding: 30px 24px;
                    }
                }
                .tl-popup-form {
                    display: grid;
                    gap: 12px;
                    text-align: left;
                }
                .tl-popup-field {
                    width: 100%;
                    border: 1px solid rgba(26, 26, 26, 0.15);
                    background: #fff;
                    color: #1A1A1A;
                    padding: 12px 14px;
                    font-size: 14px;
                    outline: none;
                }
                .tl-popup-field:focus {
                    border-color: #C85A17;
                }
                .tl-popup-submit {
                    border: none;
                    width: 100%;
                    cursor: pointer;
                    text-decoration: none;
                    background: #C85A17;
                    color: #fff;
                    padding: 13px 20px;
                    letter-spacing: .11em;
                    text-transform: uppercase;
                    font-size: 11px;
                    font-weight: 700;
                    transition: .25s ease;
                }
                .tl-popup-submit:hover {
                    background: #3D2B1F;
                }
                .tl-popup-note {
                    margin: 2px 0 0;
                    text-align: center;
                    font-size: 11px;
                    color: rgba(26, 26, 26, 0.6);
                }
                .tl-popup-toast {
                    margin-top: 6px;
                    text-align: center;
                    font-size: 12px;
                    color: #2f6b2f;
                    background: rgba(76, 175, 80, 0.12);
                    border: 1px solid rgba(76, 175, 80, 0.35);
                    padding: 9px 10px;
                }
                .tl-site-cta {
                    margin: 64px auto;
                    width: min(1100px, calc(100% - 32px));
                    background: linear-gradient(130deg, #3D2B1F, #C85A17);
                    color: #fff;
                    padding: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    flex-wrap: wrap;
                    border-radius: 12px;
                }
                .tl-site-cta p {
                    margin: 0;
                    letter-spacing: 0.02em;
                    font-weight: 500;
                }
                .tl-site-cta a {
                    text-decoration: none;
                    background: #fff;
                    color: #3D2B1F;
                    padding: 11px 18px;
                    text-transform: uppercase;
                    letter-spacing: .1em;
                    font-size: 11px;
                    font-weight: 700;
                    border-radius: 4px;
                }

                @media (max-width: 768px) {
                    .tl-floating-contact {
                        padding: 12px 14px;
                        font-size: 9px;
                        gap: 6px;
                    }
                    .tl-chatbot-toggle {
                        right: 20px;
                        bottom: 96px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 1) Floating right-corner contact button
        if (!document.querySelector('.tl-floating-contact')) {
            const floatingBtn = document.createElement('a');
            floatingBtn.href = 'contact';
            floatingBtn.className = 'tl-floating-contact';
            floatingBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Talk to Designer</span>
            `;
            floatingBtn.title = 'Go to Contact Page';
            document.body.appendChild(floatingBtn);
        }

        // 2) Add one more landing CTA strip before footer across pages
        const footer = document.querySelector('footer');
        const path = (window.location.pathname || '').toLowerCase();
        const skipStrip = path.includes('contact') || path.includes('thank-you');
        if (footer && !skipStrip && !document.getElementById('tl-site-cta')) {
            const strip = document.createElement('section');
            strip.id = 'tl-site-cta';
            strip.className = 'tl-site-cta reveal';
            strip.innerHTML = `
                <p>Ready to design your space with Timberlane?</p>
                <a href="contact">Book Free Consultation</a>
            `;
            footer.parentNode.insertBefore(strip, footer);
        }

        // 3) Popup landing block after 5 seconds (one-time popup)
        const popupUrlParams = new URLSearchParams(window.location.search);
        if (popupUrlParams.get('showPopup') === '1') {
            localStorage.removeItem('landingPopupShown');
        }
        if (!localStorage.getItem('landingPopupShown')) {
            const delayMs = 6000;
            setTimeout(() => {
                if (document.getElementById('tl-popup-overlay')) return;
                const popupOverlay = document.createElement('div');
                popupOverlay.className = 'tl-popup-overlay';
                popupOverlay.id = 'tl-popup-overlay';
                popupOverlay.innerHTML = `
                    <div class="tl-popup" style="width: min(92vw, 850px); padding: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);" role="dialog" aria-modal="true" aria-label="Consultation offer">
                        <button class="tl-popup-close" id="tl-popup-close" style="z-index: 10; color: #fff; background: rgba(0,0,0,0.3); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; top: 20px; right: 20px; font-size: 24px; line-height: 1;" aria-label="Close">&times;</button>
                        <div class="tl-popup-content-wrap">
                            <div class="tl-popup-image" style="background-image: url('assets/arora_living.png');"></div>
                            <div class="tl-popup-body">
                                <div style="display: inline-block; background: #C85A17; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; letter-spacing: 0.1em;">Latest Offer: Free Hob & Chimney*</div>
                                <h3 style="font-size: clamp(1.8rem, 4vw, 2.4rem); margin-bottom: 12px;">Let's Design <br><em style="color: #C85A17; font-style: italic;">Your Home</em></h3>
                                <p style="font-size: 14px; opacity: 0.8; margin-bottom: 24px;">Get a free expert consultation, personalized quote, and a <strong>Hob & Chimney worth ₹25,000 free</strong> with your interior package!</p>
                                <form id="tl-popup-form" class="tl-popup-form" style="display: grid; gap: 12px;">
                                    <input class="tl-popup-field" type="text" name="fullName" placeholder="Your Name *" required>
                                    <input class="tl-popup-field" type="tel" name="phone" placeholder="Phone Number *" required>
                                    <input class="tl-popup-field" type="email" name="email" placeholder="Email (Optional)">
                                    <button type="submit" class="tl-popup-submit" id="tl-popup-submit" style="margin-top: 8px;">Get Free Consultation</button>
                                    <p class="tl-popup-note" style="text-align: left; margin-top: 12px; font-size: 11px; opacity: 0.5;">Our team will call you back within 24 hours.</p>
                                    <p class="tl-popup-toast" id="tl-popup-toast" style="color: #C85A17; font-weight: bold; margin-top: 10px;" hidden>Thanks! We will call you shortly.</p>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(popupOverlay);

                // Show popup
                setTimeout(() => {
                    popupOverlay.classList.add('active');
                }, 100);

                // Close logic
                const closeBtn = document.getElementById('tl-popup-close');
                const popupForm = document.getElementById('tl-popup-form');
                const popupSubmit = document.getElementById('tl-popup-submit');
                const popupToast = document.getElementById('tl-popup-toast');
                const closePopup = () => {
                    localStorage.setItem('landingPopupShown', 'true');
                    popupOverlay.classList.remove('active');
                    setTimeout(() => popupOverlay.remove(), 600);
                };

                if (closeBtn) closeBtn.addEventListener('click', closePopup);
                if (popupForm && popupSubmit) {
                    popupForm.addEventListener('submit', (event) => {
                        event.preventDefault();
                        const formData = new FormData(popupForm);
                        const payload = {
                            name: (formData.get('fullName') || '').toString().trim(),
                            phone: (formData.get('phone') || '').toString().trim(),
                            email: (formData.get('email') || '').toString().trim(),
                            service: 'Popup Landing Enquiry',
                            message: '',
                            source: 'Popup Landing'
                        };
                        if (!payload.name || !payload.phone) return;

                        const originalText = popupSubmit.textContent;
                        popupSubmit.textContent = 'Sending...';
                        popupSubmit.disabled = true;

                        fetch(SHEET_ENDPOINT, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                            body: JSON.stringify(payload)
                        })
                            .then(() => {
                                popupSubmit.textContent = 'Submitted';
                                if (popupToast) popupToast.hidden = false;
                                setTimeout(closePopup, 1500);
                            })
                            .catch(() => {
                                popupSubmit.textContent = originalText;
                                popupSubmit.disabled = false;
                                alert('Something went wrong. Please call us at +91 8884651111.');
                            });
                    });
                }
                popupOverlay.addEventListener('click', (e) => {
                    if (e.target === popupOverlay) closePopup();
                });
            }, 6000);
        }

        // 4) Premium chatbot for FAQs + enquiry capture
        if (!document.getElementById('tl-chatbot-style')) {
            const chatStyle = document.createElement('style');
            chatStyle.id = 'tl-chatbot-style';
            chatStyle.textContent = `
                .tl-chatbot-toggle {
                    position: fixed;
                    right: 100px;
                    bottom: 24px;
                    z-index: 1250;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background: linear-gradient(135deg, #3D2B1F, #C85A17);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 15px 35px rgba(26, 26, 26, 0.3);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .tl-chatbot-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 20px 45px rgba(26, 26, 26, 0.4);
                }
                
                .tl-offer-btn {
                    position: fixed;
                    right: 168px;
                    bottom: 24px;
                    z-index: 1250;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    background: #de0000ff; /* Crimson/Red */
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 15px 35px rgba(225, 29, 72, 0.3);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    animation: tl-pulse-red 2s infinite;
                }
                @keyframes tl-pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(225, 29, 72, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
                }
                .tl-offer-btn:hover { transform: scale(1.1) rotate(15deg); }

                .tl-offer-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(8px);
                    z-index: 3000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }
                .tl-offer-overlay.active { display: flex; opacity: 1; }

                .tl-ribbon-card {
                    background: #fff;
                    width: min(90vw, 500px);
                    padding: 60px 40px;
                    border-radius: 24px;
                    text-align: center;
                    position: relative;
                    transform: scale(0.8);
                    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .tl-offer-overlay.active .tl-ribbon-card { transform: scale(1); }

                .tl-ribbon {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #BE123C;
                    color: #fff;
                    padding: 10px 40px;
                    font-weight: 800;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                .tl-ribbon::before, .tl-ribbon::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    width: 20px;
                    height: 100%;
                    background: #9F1239;
                    z-index: -1;
                }
                .tl-ribbon::before { left: -10px; transform: skewY(20deg); }
                .tl-ribbon::after { right: -10px; transform: skewY(-20deg); }

                .tl-confetti {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: #f00;
                    z-index: 3001;
                    pointer-events: none;
                }
                
                .tl-chatbot-panel {
                    position: fixed;
                    right: 24px;
                    bottom: 100px;
                    width: min(92vw, 380px);
                    height: 580px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(61, 43, 31, 0.1);
                    border-radius: 24px;
                    z-index: 1251;
                    display: grid;
                    grid-template-rows: auto 1fr auto;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                    pointer-events: none;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .tl-chatbot-panel.open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: all;
                }
                
                .tl-chat-head {
                    padding: 20px 24px;
                    background: #3D2B1F;
                    color: #fff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .tl-chat-info { display: flex; align-items: center; gap: 12px; }
                .tl-chat-avatar {
                    width: 36px;
                    height: 36px;
                    background: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    color: #3D2B1F;
                }
                .tl-chat-status {
                    display: flex;
                    flex-direction: column;
                }
                .tl-chat-status span:first-child { font-weight: 600; font-size: 14px; }
                .tl-chat-status span:last-child { font-size: 10px; opacity: 0.8; display: flex; align-items: center; gap: 4px; }
                .tl-chat-status span:last-child::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                }
                
                .tl-chat-close {
                    background: transparent;
                    border: 0;
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    opacity: 0.7;
                }
                .tl-chat-close:hover { opacity: 1; }
                
                .tl-chat-messages {
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: #FDFBF7;
                }
                .tl-chat-msg {
                    max-width: 85%;
                    padding: 10px 14px;
                    font-size: 13px;
                    line-height: 1.5;
                    border-radius: 12px;
                    animation: tl-fade-up 0.3s ease forwards;
                }
                @keyframes tl-fade-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .tl-chat-msg.bot {
                    background: #fff;
                    color: #2A2C2E;
                    align-self: flex-start;
                    border-bottom-left-radius: 2px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .tl-chat-msg.user {
                    background: #3D2B1F;
                    color: #fff;
                    align-self: flex-end;
                    border-bottom-right-radius: 2px;
                }
                
                .tl-chat-typing {
                    display: none;
                    gap: 4px;
                    padding: 10px 14px;
                    background: #fff;
                    border-radius: 12px;
                    width: fit-content;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .tl-chat-typing.active { display: flex; }
                .tl-chat-typing span {
                    width: 4px;
                    height: 4px;
                    background: #888;
                    border-radius: 50%;
                    animation: tl-typing 1.4s infinite ease-in-out;
                }
                .tl-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
                .tl-chat-typing span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes tl-typing {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                
                .tl-chat-actions {
                    padding: 0 20px 16px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    background: #FDFBF7;
                }
                .tl-chat-quick {
                    border: 1px solid rgba(61, 43, 31, 0.2);
                    background: #fff;
                    color: #3D2B1F;
                    font-size: 11px;
                    padding: 6px 12px;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tl-chat-quick:hover {
                    background: #3D2B1F;
                    color: #fff;
                    border-color: #3D2B1F;
                }
                
                .tl-chat-footer {
                    padding: 16px 20px;
                    background: #fff;
                    border-top: 1px solid rgba(0,0,0,0.05);
                }
                .tl-chat-form { display: grid; gap: 8px; }
                .tl-chat-input {
                    width: 100%;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    outline: none;
                }
                .tl-chat-submit {
                    background: #3D2B1F;
                    color: #fff;
                    border: 0;
                    padding: 10px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 11px;
                    text-transform: uppercase;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(chatStyle);
        }

        if (!document.getElementById('tl-chatbot-toggle')) {
            const chatToggle = document.createElement('button');
            chatToggle.type = 'button';
            chatToggle.id = 'tl-chatbot-toggle';
            chatToggle.className = 'tl-chatbot-toggle';
            chatToggle.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            `;
            document.body.appendChild(chatToggle);

            const panel = document.createElement('div');
            panel.id = 'tl-chatbot-panel';
            panel.className = 'tl-chatbot-panel';
            panel.innerHTML = `
                <div class="tl-chat-head">
                    <div class="tl-chat-info">
                        <div class="tl-chat-avatar">T</div>
                        <div class="tl-chat-status">
                            <span>Timberlane Support</span>
                            <span>Online</span>
                        </div>
                    </div>
                    <button class="tl-chat-close" id="tl-chat-close">&times;</button>
                </div>
                <div class="tl-chat-messages" id="tl-chat-messages">
                    <div class="tl-chat-typing" id="tl-chat-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="tl-chat-actions">
                    <button class="tl-chat-quick" data-q="pricing">Pricing</button>
                    <button class="tl-chat-quick" data-q="offers">Offers</button>
                    <button class="tl-chat-quick" data-q="emi">EMI Options</button>
                    <button class="tl-chat-quick" data-q="services">Services</button>
                    <button class="tl-chat-quick" data-q="call">Talk on Call</button>
                    <a href="https://wa.me/918884651111" target="_blank" class="tl-chat-quick" style="text-decoration:none; background:#25D366; color:#fff; border:0">WhatsApp</a>
                </div>
                <div class="tl-chat-footer">
                    <form class="tl-chat-form" id="tl-chat-form">
                        <input class="tl-chat-input" name="name" placeholder="Name" required>
                        <input class="tl-chat-input" name="phone" placeholder="Phone" required>
                        <input class="tl-chat-input" name="message" placeholder="Message" required>
                        <button type="submit" class="tl-chat-submit">Send</button>
                    </form>
                </div>
            `;
            document.body.appendChild(panel);

            const msgContainer = panel.querySelector('#tl-chat-messages');
            const typing = panel.querySelector('#tl-chat-typing');

            const addMsg = (text, role) => {
                const d = document.createElement('div');
                d.className = `tl-chat-msg ${role}`;
                d.textContent = text;
                msgContainer.insertBefore(d, typing);
                msgContainer.scrollTop = msgContainer.scrollHeight;
            };

            const botReplies = {
                pricing: 'Our home interior packages start from ₹2.5L for 1BHK, ₹4.5L for 2BHK, and ₹6.5L for 3BHK. We offer Basic, Premium, and Luxury finishes to suit every budget!',
                offers: 'Current Offer: Get a premium Hob & Chimney worth ₹25,000 absolutely FREE with your full home interior booking!',
                emi: 'Yes! We offer flexible EMI options to help you design your dream home without financial stress. Ask our designer for details.',
                services: 'We specialize in Residential (Kitchens, Wardrobes, Living) and Commercial Spaces (Offices, Retail, Restaurants).',
                call: 'You can reach our lead designer directly at +91 8884651111 for a quick consultation.'
            };

            chatToggle.onclick = () => panel.classList.toggle('open');
            panel.querySelector('#tl-chat-close').onclick = () => panel.classList.remove('open');

            panel.querySelectorAll('.tl-chat-quick').forEach(b => {
                b.onclick = () => {
                    const q = b.getAttribute('data-q');
                    if (!q) return;
                    addMsg(b.textContent, 'user');
                    typing.classList.add('active');
                    setTimeout(() => {
                        typing.classList.remove('active');
                        addMsg(botReplies[q], 'bot');
                    }, 1000);
                };
            });

            panel.querySelector('#tl-chat-form').onsubmit = (e) => {
                e.preventDefault();
                const f = e.target;
                const payload = {
                    name: f.name.value,
                    phone: f.phone.value,
                    message: f.message.value,
                    service: 'Chatbot Enquiry',
                    source: 'Chatbot'
                };
                const btn = f.querySelector('button');
                btn.disabled = true;
                btn.textContent = '...';

                fetch(SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })
                    .then(() => {
                        addMsg('Thank you! Our designer will contact you shortly.', 'bot');
                        f.reset();
                        btn.disabled = false;
                        btn.textContent = 'Send';
                    });
            };

            // Offer Button & Logic
            if (!document.getElementById('tl-offer-btn')) {
                const offerBtn = document.createElement('button');
                offerBtn.id = 'tl-offer-btn';
                offerBtn.className = 'tl-offer-btn';
                offerBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 12v10H4V12"></path>
                        <path d="M2 7h20v5H2z"></path>
                        <path d="M12 22V7"></path>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                `;
                document.body.appendChild(offerBtn);

                const offerOverlay = document.createElement('div');
                offerOverlay.className = 'tl-offer-overlay';
                offerOverlay.innerHTML = `
                    <div class="tl-ribbon-card">
                        <div class="tl-ribbon">Limited Offer</div>
                        <h2 style="font-family:'Playfair Display', serif; font-size: 3rem; color: #3D2B1F; margin-bottom: 15px;">Gift For You</h2>
                        <p style="font-size: 18px; color: #E11D48; font-weight: 700; margin-bottom: 20px;">FREE Elica Hob & Chimney</p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 30px; line-height: 1.6;">Book your full home interior today and get a premium <strong>Elica Hob & Chimney worth ₹25,000</strong> absolutely free!</p>
                        <a href="contact.html" class="tl-chat-submit" style="width: 200px; margin: 0 auto; text-decoration: none; display: flex; align-items: center; justify-content: center;">CLAIM NOW</a>
                    </div>
                `;
                document.body.appendChild(offerOverlay);

                offerBtn.onclick = () => {
                    offerOverlay.classList.add('active');
                    spawnConfetti();
                };
                offerOverlay.onclick = (e) => {
                    if (e.target === offerOverlay) offerOverlay.classList.remove('active');
                };
            }

            function spawnConfetti() {
                for (let i = 0; i < 150; i++) {
                    const c = document.createElement('div');
                    c.className = 'tl-confetti';
                    const colors = ['#BE123C', '#E11D48', '#FB7185', '#FBBF24', '#34D399', '#6366F1', '#A855F7'];
                    c.style.background = colors[Math.floor(Math.random() * colors.length)];
                    c.style.left = '50%';
                    c.style.top = '50%';
                    c.style.width = (4 + Math.random() * 8) + 'px';
                    c.style.height = c.style.width;
                    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                    c.style.transform = `translate(-50%, -50%)`;
                    document.body.appendChild(c);

                    const angle = Math.random() * Math.PI * 2;
                    const dist = 150 + Math.random() * 400;
                    const tx = Math.cos(angle) * dist;
                    const ty = Math.sin(angle) * dist;
                    const rot = Math.random() * 720;

                    c.animate([
                        { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 1 },
                        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg) scale(0)`, opacity: 0 }
                    ], {
                        duration: 3000 + Math.random() * 3000,
                        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                        fill: 'forwards'
                    }).onfinish = () => c.remove();
                }
            }

            // Greet
            setTimeout(() => {
                typing.classList.add('active');
                setTimeout(() => {
                    typing.classList.remove('active');
                    addMsg('Hello! How can we help you design your dream home today?', 'bot');
                }, 1500);
            }, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
