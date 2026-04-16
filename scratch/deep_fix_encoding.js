const fs = require('fs');

const filesToFix = [
    'c:\\Users\\A\\Desktop\\aiweb\\src\\app\\dashboard\\DashboardClient.tsx',
    'c:\\Users\\A\\Desktop\\aiweb\\src\\app\\[username]\\ProfileClient.tsx'
];

const replacements = [
    { from: /Ä±/g, to: 'ı' },
    { from: /ÄŸ/g, to: 'ğ' },
    { from: /Ã¼/g, to: 'ü' },
    { from: /ÅŸ/g, to: 'ş' },
    { from: /Ã¶/g, to: 'ö' },
    { from: /Ã§/g, to: 'ç' },
    { from: /Ä°/g, to: 'İ' },
    { from: /Ãœ/g, to: 'Ü' },
    { from: /Äž/g, to: 'Ğ' },
    { from: /â€“/g, to: '-' },
    { from: /â€”/g, to: '-' },
    // Emojis
    { from: /ğŸ’¼/g, to: '💼' },
    { from: /âœ¨/g, to: '✨' },
    { from: /ğŸŽ¨/g, to: '🎨' },
    { from: /ğŸ‘”/g, to: '👔' },
    { from: /ğŸ’»/g, to: '💻' },
    { from: /ğŸ’¹/g, to: '💙' },
    { from: /ğŸ’³/g, to: '💳' },
    { from: /ğŸš€/g, to: '🚀' },
    { from: /ğŸ“ˆ/g, to: '📈' },
    { from: /ğŸ’¬/g, to: '💬' }
];

filesToFix.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;
        replacements.forEach(r => {
            newContent = newContent.replace(r.from, r.to);
        });
        
        // Also fix the specific software template name if it's still weird
        newContent = newContent.replace(/Yazlm/g, 'Yazılım');
        newContent = newContent.replace(/satr/g, 'satır');
        newContent = newContent.replace(/grnm/g, 'görünüm');

        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Fixed encoding in ${file}`);
    } catch (e) {
        console.error(`Failed to fix ${file}: ${e.message}`);
    }
});
