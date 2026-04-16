const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\Users\\A\\Desktop\\aiweb\\src\\app\\dashboard\\DashboardClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// The corrupted versions seen in the log
const fixes = [
    { from: /id: "profesyonel", name: `.* \${t\('vibeProfessional'\)}`/, to: 'id: "profesyonel", name: `💼 ${t(\'vibeProfessional\')}`' },
    { from: /id: "samimi", name: `.* \${t\('vibeSincere'\)}`/, to: 'id: "samimi", name: `✨ ${t(\'vibeSincere\')}`' },
    { from: /id: "yarat.*", name: `.* \${t\('vibeCreative'\)}`/, to: 'id: "yaratıcı", name: `🎨 ${t(\'vibeCreative\')}`' },
    { from: /id: "l.*ks", name: `.* \${t\('vibeLuxury'\)}`/, to: 'id: "lüks", name: `👔 ${t(\'vibeLuxury\')}`' }
];

// However, regex might fail if characters are really weird. 
// A better way: replace by line numbers or very specific context.

let lines = content.split('\n');
// We know from view_file:
// 4189: { id: "profesyonel", name: `...`, ... }
// Array indices are line - 1
lines[4188] = '                                            { id: "profesyonel", name: `💼 ${t(\'vibeProfessional\')}`, desc: t(\'vibeProfessionalDesc\') },';
lines[4189] = '                                            { id: "samimi", name: `✨ ${t(\'vibeSincere\')}`, desc: t(\'vibeSincereDesc\') },';
lines[4190] = '                                            { id: "yaratıcı", name: `🎨 ${t(\'vibeCreative\')}`, desc: t(\'vibeCreativeDesc\') },';
lines[4191] = '                                            { id: "lüks", name: `👔 ${t(\'vibeLuxury\')}`, desc: t(\'vibeLuxuryDesc\') }';

fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
console.log('Fixed encoding in DashboardClient.tsx');
