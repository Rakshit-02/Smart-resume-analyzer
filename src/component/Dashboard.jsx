import { useState } from 'react';
import styles from './Dashboard.module.css';
import Skeleton from '@mui/material/Skeleton';
import { extractTextFromFile } from '../services/pdfParser';
import { analyzeResumeWithAI } from '../services/aiService';

const Dashboard = () => {
  const [uploadFileText, setUploadFileText] = useState('Upload your resume');
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);

  const handleOnChangeFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setUploadFileText(file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert('Please select a resume file first.');
      return;
    }

    if (!jobDesc.trim()) {
      alert('Please paste a job description.');
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const resumeText = await extractTextFromFile(resumeFile);

      if (!resumeText || !resumeText.trim()) {
        throw new Error('Could not extract text from resume.');
      }

      const aiResult = await analyzeResumeWithAI(resumeText, jobDesc);
      setResult(aiResult);
    } catch (error) {
      console.error('FULL ANALYZE ERROR:', error);
      alert(error?.message || 'Something went wrong during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#16a34a';
    if (score >= 50) return '#f59e0b';
    return '#dc2626';
  };

  return (
    <div className={styles.Dashboard}>
      {/* LEFT PANEL */}
      <div className={styles.DashboardLeft}>
        <div className={styles.DashboardHeader}>
          <div className={styles.DashboardHeaderTitle}>Resume Evaluator</div>
          <div className={styles.DashboardHeaderLargeTitle}>
            Analyze how well your resume matches a Job Description
          </div>
        </div>

        <div className={styles.alertInfo}>
          <strong>How it works:</strong>
          <ol className={styles.dashboardInstruction}>
            <li>Upload your resume in PDF or TXT format.</li>
            <li>Paste the target Job Description in the text block below.</li>
            <li>Click "Analyze" to run AI-based ATS evaluation.</li>
          </ol>
        </div>

        <div className={styles.DashboardUploadResume}>
          <div className={styles.DashboardResumeBlock}>
            <div className={styles.DashboardInputField}>
              <span>{uploadFileText}</span>
            </div>
          </div>

          <label htmlFor="resume-file" className={styles.analyzeAIBtn}>
            Upload
          </label>

          <input
            id="resume-file"
            type="file"
            accept=".pdf,.txt"
            onChange={handleOnChangeFile}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.jobDesc}>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className={styles.textArea}
            placeholder="Paste your Job Description here..."
            rows={10}
            cols={50}
          />

          <div className={styles.AnalyzeBtn} onClick={handleAnalyze}>
            Analyze
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.DashboardRight}>
        {/* Loading */}
        {loading && (
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: '20px' }}
            height={600}
            className={styles.skeleton}
          />
        )}

        {/* Result */}
        {!loading && result && (
          <div className={`${styles.DashboardRightTopCard} ${styles.resultCard}`}>
            <div className={styles.resultTitle}> Match Result</div>

            {/* SCORE RING */}
            <div className={styles.scoreWrapper}>
              <div
                className={styles.scoreRing}
                style={{
                  background: `conic-gradient(${getScoreColor(result.score)} ${
                    result.score * 3.6
                  }deg, #e5e7eb 0deg)`,
                }}
              >
                <div className={styles.scoreInner}>
                  <div
                    className={styles.scoreText}
                    style={{ color: getScoreColor(result.score) }}
                  >
                    {result.score}%
                  </div>
                  <div className={styles.scoreLabel}>Match</div>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className={styles.verdictBox}>
              <strong>Final Verdict:</strong> {result.verdict}
            </div>

            {/* Summary */}
            <div className={styles.summarySection}>
              <strong className={styles.sectionHeading}>Summary</strong>
              <p className={styles.summaryText}>{result.summary}</p>
            </div>

            {/* Matched Skills */}
            {result.matchedSkills?.length > 0 && (
              <div>
                <strong className={styles.matchedHeading}>Matched Skills</strong>
                <ul className={styles.resultList}>
                  {result.matchedSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Skills */}
            {result.missingSkills?.length > 0 && (
              <div>
                <strong className={styles.missingHeading}>Missing Skills</strong>
                <ul className={styles.resultList}>
                  {result.missingSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div>
                <strong className={styles.strengthHeading}>Strengths</strong>
                <ul className={styles.resultList}>
                  {result.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {result.weaknesses?.length > 0 && (
              <div>
                <strong className={styles.weaknessHeading}>Weaknesses</strong>
                <ul className={styles.resultList}>
                  {result.weaknesses.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div>
                <strong className={styles.recommendationHeading}>
                  Recommendations
                </strong>
                <ul className={styles.resultList}>
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !result && (
          <div className={`${styles.DashboardRightTopCard} ${styles.emptyStateCard}`}>
            <div className={styles.emptyStateTitle}>No analysis yet</div>
            <div className={styles.emptyStateText}>
              Upload a resume and paste a job description to generate an ATS
              match report.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;