## Live Demo

* **Live App:** [Open Smart Resume Analyzer](https://smart-resume-analyzer-green.vercel.app/)
* **GitHub Repository:** [Smart Resume Analyzer](https://github.com/Rakshit-02/Smart-resume-analyzer)

# Smart Resume Analyzer

An AI-powered resume analysis and job match checker built with **React** and **Google Gemini API**. This project helps users upload a resume, compare it with a job description, and receive structured feedback such as ATS match score, missing keywords, strengths, weaknesses, and actionable improvement suggestions.

## Overview

Recruiters and Applicant Tracking Systems (ATS) often scan resumes for role-specific keywords and alignment with the job description before a human even reviews them. This project aims to simplify that process by providing an intelligent resume analysis workflow.

The user can upload a resume, provide a target job description, and receive AI-generated insights to understand how well the resume matches the role. The system is designed to be simple, fast, and useful for students and job seekers who want to improve their resumes before applying.

## Features

* Upload and parse resume content
* Paste or provide a target job description
* AI-based resume evaluation using Gemini API
* ATS-style match score estimation
* Missing keyword identification
* Resume strengths and improvement areas
* Suggestions to tailor the resume for the target role
* Clean frontend UI built with React and Vite

## Tech Stack

### Frontend

* React.js
* JavaScript
* Vite
* CSS Modules / CSS

### AI / Processing

* Google Gemini API
* Custom resume analysis logic
* PDF parsing utility for resume text extraction

## Project Structure

```bash
Smart-resume-analyzer/
│── public/
│── src/
│   ├── assets/
│   ├── component/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   ├── aiService.js
│   │   └── pdfParser.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│── .gitignore
│── package.json
│── vite.config.js
│── README.md
```

## How It Works

1. The user uploads a resume file.
2. The resume content is parsed and converted into readable text.
3. The user provides a job description for the target role.
4. The application sends the relevant input to the Gemini API.
5. The AI analyzes the resume against the job description and returns:

   * match score / compatibility insights
   * missing keywords
   * strengths in the resume
   * weak sections / gaps
   * improvement suggestions

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rakshit-02/Smart-resume-analyzer.git
cd Smart-resume-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the root directory and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. Run the project locally

```bash
npm run dev
```

The app will start on the local development server shown in the terminal.

## Use Case

This project is useful for:

* Students preparing for placements
* Job seekers optimizing resumes for a specific role
* Candidates checking ATS compatibility before applying
* Anyone wanting AI-based resume feedback quickly

## Future Improvements

* Resume history and saved reports
* Authentication and user accounts
* Multiple job description comparison
* Better ATS scoring logic with weighted sections
* Downloadable PDF analysis report
* Support for more resume formats
* Dashboard analytics and previous analysis tracking

## Learning Outcomes

Through this project, I explored and implemented:

* React-based frontend development
* File handling and PDF parsing in JavaScript
* Environment variable management
* API integration with Gemini
* Prompt-based structured analysis workflow
* Building a practical AI-powered application for resume evaluation

## Author

**Rakshit**
Built as a practical AI + frontend project focused on resume analysis and job matching.
