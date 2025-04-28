const amToBrDict = {};

async function loadWordMappings() {
    const response = await fetch('wordMappings.csv');
    const csvData = await response.text();
    const lines = csvData.split('\n');

    for (const line of lines) {
        const [american, british] = line.split(',');

        if (american && british) {
            amToBrDict[american.toLowerCase()] = british.toLowerCase();
        }
    }
}

function convertAmToBr(text) {
    // replace em-dashes with hyphens
    let result = text.replace(/—/g, '-');

    // Replace curly quotes with normal quotes
    result = result.replace(/[“”]/g, '"');

    // replace single sentence-ending space with double space
    result = result
        .replace(/\. */g, '.  ')
        .replace(/\? */g, '?  ')
        .replace(/! */g, '!  ');

    // now word-by-word American→British
    const words = result.split(' ');
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lowerCaseWord = word.toLowerCase();

        if (amToBrDict[lowerCaseWord]) {
            const firstLetter = word[0];
            const isUpperCase = firstLetter === firstLetter.toUpperCase();
            const british = amToBrDict[lowerCaseWord];
            const converted = isUpperCase
                ? british.charAt(0).toUpperCase() + british.slice(1)
                : british;
            words[i] = converted;
        }
    }

    return words.join(' ');
}

const input = document.getElementById('input');
const output = document.getElementById('output');

input.value = localStorage.getItem('inputText') || '';
output.value = localStorage.getItem('outputText') || '';

input.addEventListener('input', (e) => {
    const inputText = e.target.value;
    const outputText = convertAmToBr(inputText);
    output.value = outputText;

    localStorage.setItem('inputText', inputText);
    localStorage.setItem('outputText', outputText);
});

loadWordMappings();
