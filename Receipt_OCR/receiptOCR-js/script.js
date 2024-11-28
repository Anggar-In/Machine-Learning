let cameraStream = null;

        function startUpload() {
            if (cameraStream) {
                alert("Please close the camera before uploading a photo.");
                return;
            }
            document.getElementById('fileInput').click();
        }

        function clearUpload() {
            const fileInput = document.getElementById('fileInput');
            const preview = document.getElementById('preview');
            const result = document.getElementById('result');
            fileInput.value = '';
            preview.src = '';
            result.innerHTML = '';
            document.getElementById('clearUploadButton').style.display = 'none';
        }

        async function startCamera() {
            const fileInput = document.getElementById('fileInput');
            if (fileInput.value) {
                alert("Please clear the uploaded photo before using the camera.");
                return;
            }
            const video = document.getElementById('camera');
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = cameraStream;
            video.style.display = 'block';
            document.getElementById('cameraButton').style.display = 'none';
            document.getElementById('captureButton').style.display = 'inline-block';
            document.getElementById('closeCameraButton').style.display = 'inline-block';
        }

        function closeCamera() {
            const video = document.getElementById('camera');
            if (cameraStream) {
                const tracks = cameraStream.getTracks();
                tracks.forEach(track => track.stop());
                cameraStream = null;
            }
            video.style.display = 'none';
            document.getElementById('cameraButton').style.display = 'inline-block';
            document.getElementById('captureButton').style.display = 'none';
            document.getElementById('closeCameraButton').style.display = 'none';
        }

        function capturePhoto() {
            const video = document.getElementById('camera');
            const canvas = document.getElementById('canvas');
            const preview = document.getElementById('preview');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
                const fileURL = URL.createObjectURL(file);
                preview.src = fileURL;
                await processImage(preview);
            }, 'image/jpeg');
        }

        function handleFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const preview = document.getElementById('preview');
            preview.src = URL.createObjectURL(file);
            document.getElementById('clearUploadButton').style.display = 'inline-block';
            processImage(preview);
        }

        async function processImage(image) {
            const result = await Tesseract.recognize(image, 'eng+ind');
            displayResults(result.data.text);
        }

        function displayResults(text) {
            const resultDiv = document.getElementById('result');
            const receipt = extractReceiptInfo(text);
            resultDiv.innerHTML = `
                <h2>Results:</h2>
                <p><strong>Company:</strong> ${receipt.company || 'Not found'}</p>
                <p><strong>Date:</strong> ${receipt.date || 'Not found'}</p>
                <p><strong>Items:</strong></p>
                <ul>${receipt.items.map(item => `<li>${item}</li>`).join('')}</ul>
                <p><strong>Total:</strong> ${receipt.total || 'Not found'}</p>
            `;
        }

        function extractReceiptInfo(text) {
            const companyPattern = /^\s*(\S[^\n]*)/;
            const companyMatch = text.match(companyPattern);
            const company = companyMatch ? companyMatch[1] : null;

            const datePattern = /\b((?:\d{4}|\d{2})[-/.]\d{2}[-/.]\d{2}|\d{2}[-/.]\d{2}[-/.](?:\d{4}|\d{2})|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+\d{4})\b/i;
            const dateMatch = text.match(datePattern);
            let date = null;
            if (dateMatch) {
                const rawDate = dateMatch[1];
                try {
                    if (rawDate.includes("-")) {
                        date = rawDate.split("-")[0].length === 4
                            ? new Date(rawDate).toLocaleDateString("en-GB").replace(/\//g, "-") // yyyy-mm-dd
                            : rawDate; // dd-mm-yyyy
                    } else if (rawDate.includes("/")) {
                        const [d1, d2, d3] = rawDate.split("/");
                        date = d1.length === 4
                            ? `${d3.padStart(2, '0')}-${d2.padStart(2, '0')}-${d1}` // yyyy/mm/dd
                            : `${d1.padStart(2, '0')}-${d2.padStart(2, '0')}-${d3}`; // dd/mm/yyyy
                    } else if (rawDate.includes(".")) {
                        const [day, month, year] = rawDate.split(".");
                        date = year.length === 2
                            ? `${day.padStart(2, '0')}-${month.padStart(2, '0')}-20${year}` // dd.mm.yy
                            : `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`; // dd.mm.yyyy
                    } else {
                        // Handle formats like 27 nov 2024
                        const monthMap = {
                            jan: "01", januari: "01", january: "01",
                            feb: "02", februari: "02", february: "02",
                            mar: "03", maret: "03", march: "03",
                            apr: "04", april: "04", april: "04",
                            may: "05", mei: "05", may: "05",
                            jun: "06", juni: "06", june: "06",
                            jul: "07", juli: "07", july: "07",
                            aug: "08", agustus: "08", august: "08",
                            sep: "09", september: "09", september: "09",
                            oct: "10", oktober: "10", october: "10",
                            nov: "11", november: "11", november: "11",
                            dec: "12", desember: "12", december: "12"
                        };
                        const dateParts = rawDate.toLowerCase().split(/\s+/);
                        const day = dateParts[0].padStart(2, '0');
                        const month = monthMap[dateParts[1].substring(0, 3)] || monthMap[dateParts[1]];
                        const year = dateParts[2];
                        date = `${day}-${month}-${year}`;
                    }
                } catch {
                    date = rawDate;
                }
            }

            const itemPattern = /(\d+ .+? \d{1,3},\s*\d{3})|([^\n]+)\s+(\d+\s*[Xx]\s*[\d.,]+)\s+Rp\s*([\d.,]+)/g;
            const items = [];
            let match;
            while ((match = itemPattern.exec(text)) !== null) {
                if (match[1]) {
                    items.push(match[1]);
                } else {
                    const itemDetail = `${match[2].trim()} ${match[3].trim()} Rp ${match[4].trim()}`;
                    items.push(itemDetail);
                }
            }

            const totalPattern = /total.*?(\d{1,3}[.,]\s?\d{3}(?:[.,]\s?\d{3})*)/i;
            const totalMatch = text.match(totalPattern);
            const total = totalMatch ? totalMatch[1].replace(/,/g, '.').replace(/\s/g, '').replace(/(\.\d{3})\./g, '$1') : null;

            return { company, date, items, total };
        }