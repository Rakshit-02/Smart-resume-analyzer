import * as pdfjsLib from 'pdfjs-dist';

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

async function extractTextFromTxt(file) {
  return await file.text();
}

export async function extractTextFromFile(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return await extractTextFromPdf(file);
  }

  if (fileName.endsWith('.txt')) {
    return await extractTextFromTxt(file);
  }

  throw new Error('Only PDF and TXT files are supported right now.');
}