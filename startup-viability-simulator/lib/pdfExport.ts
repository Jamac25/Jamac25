import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResults, StartupData } from './analysisEngine';

export async function generatePDFReport(analysis: AnalysisResults, data: StartupData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      checkPageBreak(10);
      pdf.text(line, margin, yPos);
      yPos += 7;
    });
  };

  // Cover Page
  pdf.setFillColor(102, 126, 234); // Primary color
  pdf.rect(0, 0, pageWidth, 80, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Startup Viability Report', pageWidth / 2, 40, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('AI-Powered Business Analysis', pageWidth / 2, 55, { align: 'center' });

  pdf.setTextColor(0, 0, 0);
  yPos = 100;

  // Business Information
  addText('BUSINESS OVERVIEW', 16, true);
  yPos += 5;
  addText(`Business Idea: ${data.basics?.businessIdea || 'N/A'}`, 10, false);
  addText(`Industry: ${data.basics?.industry || 'N/A'}`, 10, false);
  addText(`Market: ${data.basics?.country || 'N/A'}`, 10, false);
  addText(`Stage: ${data.basics?.stage || 'N/A'}`, 10, false);
  yPos += 10;

  // Executive Summary
  checkPageBreak(40);
  addText('EXECUTIVE SUMMARY', 16, true);
  yPos += 5;

  // Viability Score Box
  pdf.setFillColor(240, 240, 240);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Viability Score:', margin + 5, yPos + 10);

  const scoreColor = analysis.viabilityScore >= 70 ? [16, 185, 129] :
                     analysis.viabilityScore >= 40 ? [245, 158, 11] : [239, 68, 68];
  pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.setFontSize(24);
  pdf.text(`${analysis.viabilityScore.toFixed(0)}/100`, margin + 60, yPos + 12);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Decision:', margin + 5, yPos + 25);

  const decisionColor = analysis.goNoGo === 'GO' ? [16, 185, 129] :
                        analysis.goNoGo === 'WAIT' ? [245, 158, 11] : [239, 68, 68];
  pdf.setTextColor(decisionColor[0], decisionColor[1], decisionColor[2]);
  pdf.text(analysis.goNoGo, margin + 60, yPos + 25);

  pdf.setTextColor(0, 0, 0);
  yPos += 40;

  // Financial Metrics
  checkPageBreak(60);
  addText('KEY FINANCIAL METRICS', 16, true);
  yPos += 5;

  const metrics = [
    { label: 'Monthly Recurring Revenue', value: `€${analysis.financialMetrics.currentMRR.toLocaleString()}` },
    { label: 'Projected Annual Revenue', value: `€${analysis.financialMetrics.projectedARR.toLocaleString()}` },
    { label: 'CLV:CAC Ratio', value: analysis.financialMetrics.clvCacRatio.toFixed(2) },
    { label: 'Gross Margin', value: `${analysis.financialMetrics.grossMargin.toFixed(1)}%` },
    { label: 'Net Margin', value: `${analysis.financialMetrics.netMargin.toFixed(1)}%` },
    { label: 'Monthly Burn Rate', value: `€${analysis.financialMetrics.monthlyBurn.toLocaleString()}` },
    { label: 'Runway', value: `${analysis.financialMetrics.runway.toFixed(1)} months` },
    { label: 'Break-even Revenue', value: `€${analysis.financialMetrics.breakEvenRevenue.toLocaleString()}` },
  ];

  metrics.forEach(metric => {
    checkPageBreak(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`• ${metric.label}:`, margin + 5, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(metric.value, pageWidth - margin - 50, yPos);
    yPos += 7;
  });
  yPos += 10;

  // Monte Carlo Results
  checkPageBreak(50);
  addText('MONTE CARLO SIMULATION (1,000 ITERATIONS)', 16, true);
  yPos += 5;

  addText(`Average 12-Month Profit: €${analysis.monteCarlo.avgProfit.toLocaleString()}`, 10, false);
  addText(`Best Case (95th %ile): €${analysis.monteCarlo.bestCase.toLocaleString()}`, 10, false);
  addText(`Worst Case (5th %ile): €${analysis.monteCarlo.worstCase.toLocaleString()}`, 10, false);
  addText(`Probability of Loss: ${(analysis.monteCarlo.probabilityOfLoss * 100).toFixed(1)}%`, 10, false);
  yPos += 10;

  // Risk Assessment
  checkPageBreak(60);
  addText('RISK ASSESSMENT', 16, true);
  yPos += 5;

  const risks = [
    { label: 'Overall Risk', value: analysis.riskScores.overall },
    { label: 'Market Risk', value: analysis.riskScores.market },
    { label: 'Financial Risk', value: analysis.riskScores.financial },
    { label: 'Operational Risk', value: analysis.riskScores.operational },
    { label: 'Regulatory Risk', value: analysis.riskScores.regulatory },
    { label: 'Team Risk', value: analysis.riskScores.team },
    { label: 'ESG Risk', value: analysis.riskScores.esg },
  ];

  risks.forEach(risk => {
    checkPageBreak(15);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`${risk.label}:`, margin + 5, yPos);

    // Draw risk bar
    const barWidth = 60;
    const barHeight = 6;
    const barX = pageWidth - margin - barWidth - 35;
    const barY = yPos - 4;

    pdf.setFillColor(240, 240, 240);
    pdf.rect(barX, barY, barWidth, barHeight, 'F');

    const riskColor = risk.value < 30 ? [16, 185, 129] :
                      risk.value < 60 ? [245, 158, 11] : [239, 68, 68];
    pdf.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
    pdf.rect(barX, barY, (risk.value / 100) * barWidth, barHeight, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.text(`${risk.value.toFixed(0)}%`, pageWidth - margin - 25, yPos);

    yPos += 10;
  });
  yPos += 10;

  // Top Recommendations
  if (analysis.recommendations.length > 0) {
    checkPageBreak(80);
    addText('TOP RECOMMENDATIONS', 16, true);
    yPos += 5;

    analysis.recommendations.slice(0, 5).forEach((rec, idx) => {
      checkPageBreak(25);

      pdf.setFillColor(250, 250, 250);
      const recHeight = 20;
      pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, recHeight, 2, 2, 'F');

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${idx + 1}. ${rec.title}`, margin + 3, yPos + 7);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(rec.description, pageWidth - 2 * margin - 10);
      pdf.text(descLines[0], margin + 3, yPos + 13);

      // Priority badge
      const priorityColors = {
        critical: [239, 68, 68],
        high: [245, 158, 11],
        medium: [59, 130, 246],
        low: [107, 114, 128],
      };
      const color = priorityColors[rec.priority as keyof typeof priorityColors];
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.setTextColor(255, 255, 255);
      pdf.roundedRect(pageWidth - margin - 30, yPos + 2, 28, 6, 2, 2, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(rec.priority.toUpperCase(), pageWidth - margin - 29, yPos + 6);
      pdf.setTextColor(0, 0, 0);

      yPos += recHeight + 5;
    });
  }

  // Footer
  const totalPages = (pdf as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated by Startup Viability Simulator • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    pdf.text(
      new Date().toLocaleDateString(),
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Save PDF
  const businessName = data.basics?.businessIdea?.slice(0, 30) || 'Business';
  pdf.save(`${businessName.replace(/[^a-z0-9]/gi, '_')}_Viability_Report.pdf`);
}

export async function exportDashboardAsPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  // Temporarily show all content
  const originalOverflow = element.style.overflow;
  element.style.overflow = 'visible';

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  // Restore original overflow
  element.style.overflow = originalOverflow;

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
