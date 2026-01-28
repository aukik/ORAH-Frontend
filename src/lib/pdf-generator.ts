/**
 * PDF Report Generator
 *
 * Generates a clean, modern PDF report from assessment data.
 * Design: Simple, professional, and slick - distinct from brutalist web UI.
 */

import jsPDF from 'jspdf';
import type { Report, AssessmentFormData } from '@/types';
import { RISK_LEVELS, DATA_TYPES } from '@/lib/constants';

// Colors for PDF (simpler palette)
const COLORS = {
  primary: [8, 145, 178] as [number, number, number],    // Teal accent
  black: [10, 10, 10] as [number, number, number],
  gray: [82, 82, 82] as [number, number, number],
  lightGray: [180, 180, 180] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [13, 125, 77] as [number, number, number],
  yellow: [194, 117, 21] as [number, number, number],
  red: [196, 30, 30] as [number, number, number],
};

function getRiskColor(level: string): [number, number, number] {
  switch (level) {
    case 'LOW': return COLORS.green;
    case 'MEDIUM': return COLORS.yellow;
    case 'HIGH': return COLORS.red;
    case 'CRITICAL': return [124, 29, 29];
    default: return COLORS.gray;
  }
}

function getDataTypeLabel(dataType: string): string {
  const found = DATA_TYPES.find((d) => d.value === dataType);
  return found?.label || dataType;
}

export function generatePDFReport(
  report: Report,
  assessmentData: AssessmentFormData | null
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Helper functions
  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      addPage();
      return true;
    }
    return false;
  };

  // ============================================
  // HEADER
  // ============================================
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('RESPONSIBLY', margin, 22);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Risk Assessment Report', margin, 32);

  if (assessmentData?.businessName) {
    doc.setFontSize(10);
    doc.text(assessmentData.businessName, margin, 40);
  }

  y = 55;

  // ============================================
  // RISK SCORE SECTION
  // ============================================
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OVERALL RISK SCORE', margin, y);
  y += 8;

  const riskLevel = report.riskLevel;
  const riskColor = getRiskColor(riskLevel);
  const riskInfo = RISK_LEVELS[riskLevel as keyof typeof RISK_LEVELS];

  // Score box
  doc.setFillColor(...riskColor);
  doc.roundedRect(margin, y, 50, 25, 3, 3, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${report.riskScore}`, margin + 25, y + 16, { align: 'center' });

  // Risk label
  doc.setTextColor(...riskColor);
  doc.setFontSize(14);
  doc.text(riskInfo.label.toUpperCase(), margin + 58, y + 10);
  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(riskInfo.description, margin + 58, y + 18);

  y += 35;

  // ============================================
  // EXECUTIVE SUMMARY
  // ============================================
  checkPageBreak(60);
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUMMARY', margin, y);
  y += 8;

  // Top Risks
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.red);
  doc.text('Top Risks:', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(10);

  report.executiveSummary.topRisks.forEach((risk, i) => {
    checkPageBreak(12);
    const lines = doc.splitTextToSize(`${i + 1}. ${risk}`, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  });

  y += 5;

  // Quick Wins
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.green);
  doc.text('Quick Wins:', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(10);

  report.executiveSummary.quickWins.forEach((win, i) => {
    checkPageBreak(12);
    const lines = doc.splitTextToSize(`${i + 1}. ${win}`, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  });

  y += 10;

  // ============================================
  // COMPLIANCE STATUS
  // ============================================
  checkPageBreak(50);
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLIANCE STATUS', margin, y);
  y += 10;

  // PIPEDA
  const pipedaStatus = report.legalCompliance.pipedaStatus.compliant;
  const pipedaColor = pipedaStatus ? COLORS.green : COLORS.red;
  doc.setFillColor(...pipedaColor);
  doc.circle(margin + 4, y + 2, 3, 'F');
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PIPEDA', margin + 12, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(pipedaStatus ? 'Compliant' : 'Non-Compliant', margin + 45, y + 4);
  y += 10;

  // Bill C-27
  const billStatus = report.legalCompliance.billC27Status.prepared;
  const billColor = billStatus ? COLORS.green : COLORS.yellow;
  doc.setFillColor(...billColor);
  doc.circle(margin + 4, y + 2, 3, 'F');
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill C-27', margin + 12, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(billStatus ? 'Prepared' : 'Action Needed', margin + 45, y + 4);
  y += 10;

  // Provincial
  const provStatus = report.legalCompliance.provincialStatus.compliant;
  const provColor = provStatus ? COLORS.green : COLORS.red;
  doc.setFillColor(...provColor);
  doc.circle(margin + 4, y + 2, 3, 'F');
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(report.legalCompliance.provincialStatus.law, margin + 12, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(provStatus ? 'Compliant' : 'Non-Compliant', margin + 60, y + 4);
  y += 15;

  // ============================================
  // DATA RISK
  // ============================================
  checkPageBreak(40);
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA RISK ASSESSMENT', margin, y);
  y += 10;

  report.dataRiskAssessment.dataFlows.forEach((flow) => {
    checkPageBreak(15);
    const flowRiskColor = getRiskColor(flow.riskLevel);

    doc.setFillColor(...flowRiskColor);
    doc.rect(margin, y, 3, 10, 'F');

    doc.setTextColor(...COLORS.black);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(getDataTypeLabel(flow.dataType), margin + 6, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...flowRiskColor);
    doc.text(flow.riskLevel, margin + 6, y + 9);

    if (flow.crossBorder) {
      doc.setTextColor(...COLORS.yellow);
      doc.text('Cross-border', margin + 40, y + 9);
    }

    y += 14;
  });

  y += 10;

  // ============================================
  // ACTION PLAN
  // ============================================
  checkPageBreak(50);
  doc.setTextColor(...COLORS.black);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ACTION PLAN', margin, y);
  y += 10;

  const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  priorities.forEach((priority) => {
    const items = report.actionPlan.filter((item) => item.priority === priority);
    if (items.length === 0) return;

    checkPageBreak(20);
    const priorityColor = priority === 'CRITICAL' || priority === 'HIGH'
      ? COLORS.red
      : priority === 'MEDIUM'
        ? COLORS.yellow
        : COLORS.green;

    doc.setFillColor(...priorityColor);
    doc.setTextColor(...priorityColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${priority} PRIORITY`, margin, y);
    y += 6;

    doc.setTextColor(...COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    items.forEach((item) => {
      checkPageBreak(12);
      const lines = doc.splitTextToSize(`• ${item.title}: ${item.description}`, contentWidth - 10);
      doc.text(lines, margin + 5, y);
      y += lines.length * 4 + 3;
    });

    y += 5;
  });

  // ============================================
  // FOOTER
  // ============================================
  const addFooter = (pageNum: number) => {
    doc.setPage(pageNum);
    doc.setDrawColor(...COLORS.lightGray);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated by Responsibly | ${new Date().toLocaleDateString('en-CA')}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Page ${pageNum} of ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
    doc.text(
      'This report is for informational purposes only and does not constitute legal advice.',
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  };

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    addFooter(i);
  }

  // Download
  const fileName = assessmentData?.businessName
    ? `${assessmentData.businessName.replace(/[^a-zA-Z0-9]/g, '-')}-risk-report.pdf`
    : 'risk-assessment-report.pdf';

  doc.save(fileName);
}
