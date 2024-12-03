const MONTHS = {
    "januari": "01",
    "februari": "02",
    "maret": "03",
    "april": "04",
    "mei": "05",
    "juni": "06",
    "juli": "07",
    "agustus": "08",
    "september": "09",
    "oktober": "10",
    "november": "11",
    "desember": "12"
};

class SpeechToTextExtractor {
    constructor() {
        this.recognition = null;
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.outputDiv = document.getElementById('output');
        this.extractedDataDiv = document.getElementById('extractedData');
        this.fullTranscriptText = '';
        this.lastFinalTranscript = '';
        this.pauseTimer = null;

        this.initializeRecognition();
        this.setupEventListeners();
    }

    initializeRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Web Speech API tidak didukung di browser Anda');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'id-ID';

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (this.pauseTimer) {
                clearTimeout(this.pauseTimer);
            }

            if (/[a-zA-Z0-9]/.test(finalTranscript)) {
                this.pauseTimer = setTimeout(() => {
                    if (finalTranscript !== this.lastFinalTranscript) {
                        this.fullTranscriptText += ', ';
                        this.lastFinalTranscript = finalTranscript;
                    }
                }, 1000);
            }

            this.fullTranscriptText = (this.fullTranscriptText + ' ' + finalTranscript).trim();
            this.outputDiv.textContent = this.fullTranscriptText + interimTranscript;

            const extractedData = this.extractData(this.fullTranscriptText);
            this.displayExtractedData(extractedData);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startRecognition());
        this.stopBtn.addEventListener('click', () => this.stopRecognition());
        this.restartBtn.addEventListener('click', () => this.restartRecognition());
    }

    startRecognition() {
        if (this.recognition) {
            this.recognition.start();
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
        }
    }

    stopRecognition() {
        if (this.recognition) {
            this.recognition.stop();
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
        }
    }

    restartRecognition() {
        this.fullTranscriptText = '';
        this.lastFinalTranscript = '';
        this.outputDiv.textContent = '';
        this.extractedDataDiv.textContent = '';

        if (this.pauseTimer) {
            clearTimeout(this.pauseTimer);
            this.pauseTimer = null;
        }

        if (this.recognition) {
            this.recognition.stop();
        }
        this.initializeRecognition();

        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
    }

    displayExtractedData(data) {
        if (!data) {
            this.extractedDataDiv.textContent = 'Kalimat tidak sesuai format.';
            return;
        }
    
        let formattedData = `Company: ${data.Company}\nDate: ${data.Date}`;
        
        if (data.Items && data.Items.length > 0) {
            formattedData += `\nItems:\n- ${data.Items.join('\n- ')}`;
        }
    
        formattedData += `\nTotal: ${data.Total}\nType: ${data.Type}`;

        this.extractedDataDiv.textContent = formattedData.trim();
    }

    parseDate(phrase) {
        const today = new Date();

        if (phrase.includes('hari ini')) return this.formatDate(today);
        if (phrase.includes('kemarin')) {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            return this.formatDate(yesterday);
        }

        const daysAgoMatch = phrase.match(/(\d+)\s*hari(?:\s+yang)?\s+lalu/);
        if (daysAgoMatch) {
            const daysAgo = parseInt(daysAgoMatch[1]);
            const calculatedDate = new Date(today);
            calculatedDate.setDate(today.getDate() - daysAgo);
            return this.formatDate(calculatedDate);
        }

        const patterns = [
            /(\d{1,2})\s+(\w+)\s+(\d{4})/,
            /(\d{1,2})\s+(\w+)/
        ];

        for (const pattern of patterns) {
            const match = phrase.match(pattern);
            if (match) {
                if (match.length === 4) {
                    const [, day, monthStr, year] = match;
                    const month = MONTHS[monthStr.toLowerCase()] || '01';
                    return `${day.padStart(2, '0')}-${month}-${year}`;
                } else if (match.length === 3) {
                    const [, day, monthStr] = match;
                    const month = MONTHS[monthStr.toLowerCase()] || '01';
                    return `${day.padStart(2, '0')}-${month}-${today.getFullYear()}`;
                }
            }
        }

        return null;
    }

    formatDate(date) {
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }

    parseTotalAmount(totalStr) {
        totalStr = totalStr.toLowerCase().replace(/rp\s*/, '').replace(/\./g, '').replace(/,/g, '');

        const multipliers = {
            'ribu': 1000,
            'juta': 1000000,
            'miliar': 1000000000,
            'triliun': 1000000000000
        };

        for (const [word, multiplier] of Object.entries(multipliers)) {
            if (totalStr.includes(word)) {
                return parseInt(totalStr.replace(word, '').trim()) * multiplier;
            }
        }

        return parseInt(totalStr);
    }

    extractData(text) {
        const expensePattern = /(?:\w+)\s+(hari ini|kemarin|\d+\s*hari(?:\s+yang)?\s+lalu|tanggal\s*\d{1,2}-\d{1,2}-\d{4}|\d{1,2}\s+\w+\s+\d{4}|\d{1,2}\s+\w+)\s+(?:membeli|beli|dibeli|membayar)\s+(.+?)\s+di\s+(.+?)\s+dengan total\w*\s+([\w\s,.]+)/i;

        const incomePattern = /(?:\w+)\s+(hari ini|kemarin|\d+\s*hari(?:\s+yang)?\s+lalu|tanggal\s*\d{1,2}-\d{1,2}-\d{4}|\d{1,2}\s+\w+\s+\d{4}|\d{1,2}\s+\w+)\s+mendapatkan\s+(?:pemasukan|pendapatan)\s+dari\s+(.+?)\s+dengan total\w*\s+([\w\s,.]+)/i;

        let match = text.match(expensePattern);
        if (match) {
            const [, rawDate, items, company, rawTotal] = match;

            const date = this.parseDate(rawDate);
            const total = this.parseTotalAmount(rawTotal);

            const itemsList = items.split(/,\s*(?=dan)|,\s*|dan\s*/).map(item => item.trim()).filter(Boolean);

            return {
                Company: company,
                Date: date,
                Items: itemsList,
                Total: total,
                Type: 'Pengeluaran'
            };
        }

        match = text.match(incomePattern);
        if (match) {
            const [, rawDate, company, rawTotal] = match;

            const date = this.parseDate(rawDate);
            const total = this.parseTotalAmount(rawTotal);

            return {
                Company: company,
                Date: date,
                Total: total,
                Type: 'Pemasukan'
            };
        }

        return null;
    }
}

new SpeechToTextExtractor();

