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
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lowerCaseWord = word.toLowerCase();

        if (amToBrDict[lowerCaseWord]) {
            const firstLetter = word[0];
            const isUpperCase = firstLetter === firstLetter.toUpperCase();
            const convertedWord = isUpperCase ? amToBrDict[lowerCaseWord].charAt(0).toUpperCase() + amToBrDict[lowerCaseWord].slice(1) : amToBrDict[lowerCaseWord];
            words[i] = convertedWord;
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