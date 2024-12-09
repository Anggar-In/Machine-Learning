<h1 align="center">
<img align="center" src="https://github.com/user-attachments/assets/8a6f2ad2-2fc6-4bd4-ba68-c6674edd655b" alt="Logo Anggarin" width="500" style="border-radius: 50%;"></img>
<br>
<br>
ANGGAR.IN MACHINE LEARNING DOCUMENTATION
</h1>
<div align="center">

![Contributors](https://img.shields.io/github/contributors/Anggar-In/Machine-Learning?color=blue)
![Commit Activity](https://img.shields.io/github/commit-activity/m/Anggar-In/Machine-Learning?color=blue)
![Last Commit](https://img.shields.io/github/last-commit/Anggar-In/Machine-Learning?color=red)
![Forks](https://img.shields.io/github/forks/Anggar-In/Machine-Learning?style=flat-square)

</div>

# Team Profile

### Team ID : C242-PS048

### These Are Our Team Members in the Machine Learning Division:

* (ML) M312B4KY2530 - Mochammad Dhiya Ulhaq - Universitas Sebelas Maret
* (ML) M312B4KY2631 - Muhamad Faqih Zacky - Universitas Sebelas Maret
* (ML) M312B4KX3214 - Nadya Putri Uswatun Hasanah - Universitas Sebelas Maret

### Roles

* Stock Recommendation (Financial Freedom Calculator) - Mochammad Dhiya Ulhaq (M312B4KY2530) & Nadya Putri Uswatun Hasanah (M312B4KX3214)
* Stock Prediction (Financial Freedom Calculator) - Mochammad Dhiya Ulhaq (M312B4KY2530) & Nadya Putri Uswatun Hasanah (M312B4KX3214)
* Receipt OCR (Income and Expense Tracking) - Muhamad Faqih Zacky (M312B4KY2631)
* Audio Recognition (Income and Expense Tracking) - Muhamad Faqih Zacky (M312B4KY2631)

# Anggar.In Machine Learing Project Explanation
This project is our final project for Google Bangkit Academy 2024 Batch 2.

**Project Background:**

Financial stability is crucial for personal and societal well-being, yet many Indonesians face challenges in achieving it. Data from BPS and a 2023 DBS survey indicate a large portion of household income is spent on non-essential items without proper planning. This issue is compounded by low financial literacy, leading to unnecessary spending and limiting the ability to save. If left unaddressed, these problems may prolong financial instability and negatively affect the quality of life in Indonesia.

To tackle this issue, our team developed Anggar.In, a comprehensive financial management solution. The app helps users track income and expenses through manual input, receipt scanning, and voice commands, offering a clear view of spending patterns. Its personalized budgeting feature aids in managing spending limits, while savings goal planning supports consistent savings. Anggar.In also provides financial analysis tools, presenting spending trends and insights to help users become more aware of their finances. The investment recommendation system can also guide users towards financial freedom.

Leveraging machine learning, cloud computing, and mobile technology, Anggar.In aims to boost financial awareness, foster sustainable habits, and support informed decision-making, helping Indonesians navigate economic challenges and build long-term financial resilience.


**Machine Learning:** 

In the Machine Learning path, we developed several features, starting with our MVP [stock prediction](https://github.com/Anggar-In/Machine-Learning/tree/main/stock_price_predictions) and [recommendation models](https://github.com/Anggar-In/Machine-Learning/tree/main/stockRecommendation)  for a financial freedom calculator. These models utilize TensorFlow, are saved using TensorFlow.js for web deployment, preprocess data using Min-Max Scaler for normalization, and apply time series forecasting for stock price prediction alongside linear regression for stock recommendations. Beyond the MVP, we also building supplementary features beyond the MVP, such as [Receipt OCR](https://github.com/Anggar-In/Machine-Learning/tree/main/Receipt_OCR) and [Audio Recognition](https://github.com/Anggar-In/Machine-Learning/tree/main/AudioRecognition). The Receipt OCR leverages the Pytesseract library for extracting text from images, while the Audio Recognition feature utilizes the WebSpeech API. Both systems are tuned with preprocessing techniques for image or audio and use regex for data extraction. This feature is useful for automating expense and income tracking.

**Dataset:**
1. Stock Predictions: [Datasets](https://github.com/Anggar-In/Machine-Learning/tree/main/stock_price_predictions/trainingDataset)
2. Stock Recommendation: [Datasets](https://github.com/Anggar-In/Machine-Learning/tree/main/stockRecommendation/trainingDataset)

# How to Use The Code
## Stock Prediction & Stock Recommendation
### Requirements
Before starting, make sure you have installed:
- Anaconda or Miniconda: [Download](https://www.anaconda.com/download)
- Windows Subsystem Linux [Download](https://learn.microsoft.com/en-us/windows/wsl/install)

### How to Prepare for Anggar.In Environment Stock Predictions
1. conda create -n anggarin_stockpredictions python=3.10
2. conda activate anggarin_stockpredictions
3. pip install numpy pandas matplotlib scikit-learn tensorflow

### How to Setup Stock Recommendation Anggar.in Environment
1. Open WSL or Linux Command Prompt
2. conda create -n anggarin_stockrecommendation python=3.8
3. conda activate anggarin_stockrecommendation
4. pip install numpy pandas matplotlib scikit-learn tensorflow=2.13.0
5. pip install tensorflowjs
6. Remote connect to Visual Studio Code

## Receipt OCR & Audio Recognition (Income and Expense Tracking)
### Requirements
#### Notebook File
If you want to run notebook file via Google Colab(optimized), you can open Google Colab and download notebook file on:
- Google Colab: [Open](https://colab.research.google.com/)
- Receipt OCR Notebook: [Download](https://github.com/Anggar-In/Machine-Learning/blob/main/Receipt_OCR/ReceiptOCR_Preprocessing.ipynb)
- Receipt Sample: [Download](https://github.com/Anggar-In/Machine-Learning/tree/main/Receipt_OCR/receiptOCR-js/Receipt%20contoh)
- Audio Recognition Notebook: [Download](https://github.com/Anggar-In/Machine-Learning/blob/main/AudioRecognition/AudioRecognition.ipynb)
- Audio Sample: [Download](https://github.com/Anggar-In/Machine-Learning/tree/main/AudioRecognition/audiotest_ipynb)

But if you want to run notebook file on local you can follow the Stock Prediction & Stock Recommendation requirements.

#### Browser-Based File
Browser-based file is a Notebook file that has been converted into a Browser-Based program that is ready to use using HTML, CSS and Javascript files. To run this make sure you have installed:
- Live Server Extention (VSCode)

### How to Use Notebook File
1. Open Google Colab
2. Download Receipt OCR / Audio Recognition Notebook file
3. Upload Receipt OCR / Audio Recognition Notebook file
4. Upload Receipt / Audio Sample file
5. Change path of receipt / audio sample
6. Run every single cell

### How to Use Browser-Based File
1. Clone this repository.
2. Open Receipt_OCR/receiptOCR-js or AudioRecognition/FIle Javascript Folder
3. Select index.html file
4. Right click and select the Open with Live Server
5. For Receipt OCR you can take a photo or upload the Receipt Sample
6. For Audio OCR you can just talking with this format: [Audio OCR Format](https://github.com/Anggar-In/Machine-Learning/blob/main/AudioRecognition/README.md)

# Other Path Documentation 
**Mobile Development:**
[Anggar.In Mobile Developments Repository](https://github.com/Anggar-In/Mobile-Development)

**Cloud Computing:**
[Anggar.In Cloud Computing Repository](https://github.com/Anggar-In/Cloud-Computing)
