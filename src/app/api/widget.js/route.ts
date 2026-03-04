// Last Updated: 2026-03-04 11:06
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
        // Clear container first to avoid duplicates
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
        // Floating Button Mode (only if not already present)
        if (document.getElementById('kardly-floating-trigger')) return;

        const button = document.createElement('div');
        button.id = 'kardly-floating-trigger';
        button.innerHTML = type === 'booking' ? '📅' : '💬';
        
        const styles = {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            backgroundColor: '#6366f1',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: '9999',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '4px solid white',
            color: 'white'
        };
        
        Object.assign(button.style, styles);
        
        button.onmouseover = () => {
            button.style.transform = 'scale(1.1) rotate(5deg)';
            button.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'scale(1) rotate(0deg)';
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
        modalContainer.style.transition = 'all 0.4s ease';
        modalContainer.style.opacity = '0';
        modalContainer.style.transform = 'translateY(20px)';

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
                    modalContainer.style.transform = 'translateY(0)';
                }, 10);
                button.innerHTML = '✕';
                button.style.backgroundColor = '#f43f5e';
            } else {
                modalContainer.style.opacity = '0';
                modalContainer.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    modalContainer.style.display = 'none';
                }, 400);
                button.innerHTML = type === 'booking' ? '📅' : '💬';
                button.style.backgroundColor = '#6366f1';
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
