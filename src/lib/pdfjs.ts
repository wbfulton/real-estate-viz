// lib/pdfjs.ts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

// Required: disable worker for server-side use
// eslint-disable-next-line @typescript-eslint/no-require-imports
pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.mjs");

module.exports = pdfjsLib;
