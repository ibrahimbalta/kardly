const fs = require('fs');
const f = 'c:\\Users\\A\\Desktop\\aiweb\\src\\app\\[username]\\ProfileClient.tsx';
let c = fs.readFileSync(f, 'utf8');

const funcName = 'function ArticlesSection';
const firstIndex = c.indexOf(funcName);

if (firstIndex === -1) {
    console.log('Function not found');
    process.exit(1);
}

// Find the end of the first occurrence using brace counting
let braceCount = 0;
let firstEnd = -1;
let started = false;

for (let i = firstIndex; i < c.length; i++) {
    if (c[i] === '{') {
        braceCount++;
        started = true;
    } else if (c[i] === '}') {
        braceCount--;
        if (started && braceCount === 0) {
            firstEnd = i + 1;
            break;
        }
    }
}

if (firstEnd === -1) {
    console.log('Could not find end of first function');
    process.exit(1);
}

console.log('First function ends at:', firstEnd);

// The next function starts after this.
// In this case, the script likely appended the duplicate immediately after.
// We need to keep everything up to firstEnd, AND keep everything that was AFTER the OLD ArticlesSection.

// Wait, where did the old ArticlesSection end?
// The script was: c.substring(0, startIdx) + newArticlesSection + c.substring(endIdx)
// So if endIdx was found correctly, there's no duplicate UNLESS the file already had issues.

// Actually, looking at the view_file:
// 9645:    );
// 9646: }: any) {
// This indicates 9646 starts a mangled SECOND ArticlesSection.

// Find the next 'function' after firstEnd or the end of the file.
const nextPossibleFunc = c.indexOf('function', firstEnd);

if (nextPossibleFunc !== -1) {
    const cleaned = c.substring(0, firstEnd) + '\n\n' + c.substring(nextPossibleFunc);
    fs.writeFileSync(f, cleaned, 'utf8');
    console.log('Cleaned duplicate correctly');
} else {
    // If it was the last one, just keep up to firstEnd
    fs.writeFileSync(f, c.substring(0, firstEnd) + '\n', 'utf8');
    console.log('Cleaned as last function');
}
