// Last Updated: 2026-03-04 11:25
import { NextResponse } from "next/server";

export async function GET() {
    const script = `
(function() {
    // Robust way to find the script element
    let scriptTag = document.currentScript;
    if (!scriptTag) {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('/api/widget.js')) {
                scriptTag = scripts[i];
                break;
            }
        }
    }

    if (!scriptTag) return;

    const username = scriptTag.getAttribute('data-user');
    if (!username) return;

    const type = scriptTag.getAttribute('data-type') || 'booking';
    const style = scriptTag.getAttribute('data-style') || 'floating';
    
    // Dynamic baseUrl
    let baseUrl = 'https://www.kardly.site';
    if (scriptTag.src) {
        try {
            const url = new URL(scriptTag.src);
            baseUrl = url.origin;
        } catch(e) {}
    }

    // Container Check
    const containerId = 'kardly-widget-' + type;
    const container = document.getElementById(containerId);

    if (style === 'embedded' && container) {
        // Create Iframe for Inline/Embedded
        container.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = baseUrl + '/' + username + '?widget=' + type + '&embed=true';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '24px';
        iframe.style.overflow = 'hidden';
        container.appendChild(iframe);
    } else if (style === 'floating') {
        const triggerId = 'kardly-floating-trigger-' + type;
        if (document.getElementById(triggerId)) return;

        const button = document.createElement('div');
        button.id = triggerId;
        
        // SVG Icons
        const icons = {
            booking: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
            lead: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            chat: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>'
        };

        button.innerHTML = icons[type] || icons.lead;
        
        const styles = {
            position: 'fixed',
            bottom: '24px',
            right: type === 'booking' ? '24px' : '100px', // Offset if multiple
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4), 0 0 0 4px white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '9999',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            color: 'white'
        };
        
        Object.assign(button.style, styles);
        
        button.onmouseover = () => {
            button.style.transform = 'scale(1.1) rotate(5deg) translateY(-5px)';
            button.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.5), 0 0 0 4px white';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'scale(1) rotate(0deg) translateY(0)';
            button.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.4), 0 0 0 4px white';
        };

        // Modal/Iframe container
        const modalContainer = document.createElement('div');
        modalContainer.style.display = 'none';
        modalContainer.style.position = 'fixed';
        modalContainer.style.bottom = '100px';
        modalContainer.style.right = '24px';
        modalContainer.style.width = 'min(400px, 90vw)';
        modalContainer.style.height = 'min(600px, 80vh)';
        modalContainer.style.backgroundColor = 'white';
        modalContainer.style.borderRadius = '32px';
        modalContainer.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        modalContainer.style.zIndex = '9998';
        modalContainer.style.overflow = 'hidden';
        modalContainer.style.border = '1px solid #f1f5f9';
        modalContainer.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        modalContainer.style.opacity = '0';
        modalContainer.style.transform = 'translateY(30px) scale(0.9)';

        const iframe = document.createElement('iframe');
        iframe.src = baseUrl + '/' + username + '?widget=' + type + '&embed=true';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        modalContainer.appendChild(iframe);
        document.body.appendChild(modalContainer);
        document.body.appendChild(button);

        let isOpen = false;
        button.onclick = () => {
            isOpen = !isOpen;
            if (isOpen) {
                modalContainer.style.display = 'block';
                setTimeout(() => {
                    modalContainer.style.opacity = '1';
                    modalContainer.style.transform = 'translateY(0) scale(1)';
                }, 10);
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
                button.style.background = 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)';
                button.style.boxShadow = '0 10px 25px rgba(244, 63, 94, 0.4), 0 0 0 4px white';
            } else {
                modalContainer.style.opacity = '0';
                modalContainer.style.transform = 'translateY(30px) scale(0.9)';
                setTimeout(() => {
                    modalContainer.style.display = 'none';
                }, 400);
                button.innerHTML = icons[type] || icons.lead;
                button.style.background = 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
                button.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.4), 0 0 0 4px white';
            }
        };
    }
})();
    `;

    return new NextResponse(script, {
        headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
