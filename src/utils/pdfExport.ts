import { jsPDF } from 'jspdf';
import { GeneratedProposal, ClientCompany, AutomationOpportunity } from '../types';

export const exportProposalToPdf = (
  proposal: GeneratedProposal,
  client: ClientCompany,
  opportunities: AutomationOpportunity[]
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Helper to manage page breaks cleanly
  const checkPageBreak = (neededHeight: number): void => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin + 10;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = (): void => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('NEXUSAI ENTERPRISE SOLUTIONS', margin, 12);
    doc.setFont('helvetica', 'normal');
    doc.text(`CLIENT PROPOSAL: ${proposal.targetClient.toUpperCase()}`, pageWidth - margin, 12, { align: 'right' });
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);
  };

  // --- TOP HEADER / BRANDING ---
  // Dark header block
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NEXUS', margin + 6, y + 11);
  doc.setTextColor(96, 165, 250); // blue-400
  doc.text('AI', margin + 30, y + 11);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('ENTERPRISE PROCESS AUTOMATION & AI AGENT OPERATING SYSTEM', margin + 38, y + 10.5);

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`CONFIDENTIAL CLIENT STRATEGY & ARCHITECTURE SPECIFICATION`, margin + 6, y + 18.5);
  doc.text(`ID: #${proposal.id || 'NEXUS-PROP'}`, pageWidth - margin - 6, y + 18.5, { align: 'right' });

  y += 30;

  // --- PROPOSAL TITLE & TARGET METADATA ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(proposal.proposalTitle || `Enterprise AI Strategy Proposal: ${client.name}`, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Metadata Subtitle Bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Client: `, margin + 4, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(proposal.targetClient || client.name, margin + 14, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Valid Through: `, margin + 75, y + 7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(proposal.validUntilDate || '30 Days', margin + 96, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Status: `, margin + 130, y + 7.5);
  
  if (proposal.status === 'ACCEPTED') {
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.setFont('helvetica', 'bold');
    doc.text('ACCEPTED & EXECUTED', margin + 141, y + 7.5);
  } else {
    doc.setTextColor(37, 99, 235); // blue-600
    doc.setFont('helvetica', 'bold');
    doc.text(proposal.status || 'OFFICIAL DRAFT', margin + 141, y + 7.5);
  }

  y += 18;

  // Execution stamp if accepted
  if (proposal.status === 'ACCEPTED' && proposal.signedBy) {
    checkPageBreak(16);
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text('[x] DIGITALLY EXECUTED AGREEMENT', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(4, 120, 87);
    doc.text(`Signed by: ${proposal.signedBy}  |  Timestamp: ${proposal.signedAt || 'Authorized Execution'}`, margin + 4, y + 10.5);

    y += 19;
  }

  // Helper to draw section titles
  const drawSectionTitle = (number: string, title: string) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235);
    doc.text(`${number}. SECTION`, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 7;
  };

  // --- SECTION 1: EXECUTIVE SUMMARY ---
  drawSectionTitle('01', 'Executive Summary & Vision');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(proposal.executiveSummary || 'Comprehensive enterprise strategy proposal.', contentWidth);
  checkPageBreak(summaryLines.length * 4.5 + 4);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 8;

  // --- SECTION 2: FINANCIAL ROI & VALUE IMPACT ---
  drawSectionTitle('02', 'Financial Payback & Reclaimed Operational Value');
  checkPageBreak(24);

  const cardWidth = (contentWidth - 6) / 3;
  const metrics = [
    {
      label: 'COST OF INACTION',
      val: `$${(proposal.costOfInactionAnnual || 0).toLocaleString()}/yr`,
      sub: 'Wasted manual employee hours',
      color: [225, 29, 72] as [number, number, number] // rose-600
    },
    {
      label: 'ANNUAL AI BENEFIT',
      val: `$${(proposal.projectedAnnualBenefit || 0).toLocaleString()}/yr`,
      sub: 'Direct operational capacity created',
      color: [5, 150, 105] as [number, number, number] // emerald-600
    },
    {
      label: 'NET 1ST-YEAR GAIN',
      val: `$${(proposal.netFirstYearBenefit || 0).toLocaleString()}`,
      sub: 'After all setup fees & retainers',
      color: [30, 41, 59] as [number, number, number] // slate-800
    }
  ];

  metrics.forEach((m, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, y, cardWidth, 20, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, cardX + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...m.color);
    doc.text(m.val, cardX + 3, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.sub, cardX + 3, y + 17);
  });

  y += 26;

  // --- SECTION 3: TARGET AUTOMATION MODULES ---
  const selectedOpps = opportunities.filter(o => o.selectedForProposal);
  const oppsToRender = selectedOpps.length > 0 ? selectedOpps : opportunities.slice(0, 3);

  drawSectionTitle('03', 'Target Automation Architecture & Scope');

  oppsToRender.forEach((opp, i) => {
    checkPageBreak(30);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);

    // Estimate box height
    const archLines = doc.splitTextToSize(`Architecture: ${opp.solutionArchitecture}`, contentWidth - 8);
    const boxHeight = 16 + archLines.length * 4 + 7;

    checkPageBreak(boxHeight + 2);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    // Title and savings
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${i + 1}. ${opp.title}`, margin + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105);
    doc.text(`+${opp.estimatedHoursSavedPerWeek} hrs/wk saved`, pageWidth - margin - 4, y + 6, { align: 'right' });

    // Architecture description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(archLines, margin + 4, y + 11);

    // Deliverables tags
    const delivY = y + 11 + archLines.length * 4 + 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const deliverablesText = opp.keyDeliverables.slice(0, 4).map(d => `[x] ${d}`).join('    ');
    doc.text(deliverablesText, margin + 4, delivY);

    y += boxHeight + 4;
  });

  y += 4;

  // --- SECTION 4: 90-DAY IMPLEMENTATION PLAN ---
  drawSectionTitle('04', '90-Day Implementation Plan & Milestone Gates');

  const phases = proposal.solutionPhases && proposal.solutionPhases.length > 0
    ? proposal.solutionPhases
    : [
        {
          phaseNumber: 1,
          phaseName: 'Ingestion & API Pipeline Staging',
          durationWeeks: 3,
          keyDeliverables: ['Knowledge base vector indexing', 'API connectors', 'Staging sandbox'],
          acceptanceCriteria: '99% data synchronization between source ERP and vector store'
        },
        {
          phaseNumber: 2,
          phaseName: 'Core Agent Automation & Workflow Execution',
          durationWeeks: 4,
          keyDeliverables: ['Custom LLM tool-calling', 'Human-in-the-loop review queues', 'Audit log framework'],
          acceptanceCriteria: 'Accuracy benchmarks verified across sample batches'
        },
        {
          phaseNumber: 3,
          phaseName: 'Production Cutover & Managed Retainer SLA',
          durationWeeks: 5,
          keyDeliverables: ['Live production deployment', 'Staff training', 'Continuous monitoring'],
          acceptanceCriteria: 'End-to-end SLA signoff from executive sponsor'
        }
      ];

  phases.forEach((phase) => {
    checkPageBreak(24);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);

    const deliverableLines = phase.keyDeliverables.map(d => `- ${d}`).join('  |  ');
    const delivWrapped = doc.splitTextToSize(`Deliverables: ${deliverableLines}`, contentWidth - 8);
    const critWrapped = doc.splitTextToSize(`Acceptance Criteria: ${phase.acceptanceCriteria}`, contentWidth - 8);
    const phaseBoxHeight = 13 + delivWrapped.length * 3.5 + critWrapped.length * 3.5;

    checkPageBreak(phaseBoxHeight + 2);
    doc.roundedRect(margin, y, contentWidth, phaseBoxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Phase ${phase.phaseNumber}: ${phase.phaseName}`, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${phase.durationWeeks} Weeks Duration`, pageWidth - margin - 4, y + 5.5, { align: 'right' });

    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(delivWrapped, margin + 4, y + 10.5);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    doc.text(critWrapped, margin + 4, y + 10.5 + delivWrapped.length * 3.5 + 1);

    y += phaseBoxHeight + 4;
  });

  y += 4;

  // --- SECTION 5: COMMERCIAL TERMS ---
  drawSectionTitle('05', 'Commercial Terms & Investment Schedule');
  checkPageBreak(38);

  const setupFee = proposal.commercialTerms?.setupInvestment ?? 16500;
  const retainerFee = proposal.commercialTerms?.monthlyRetainer ?? 4250;
  const contractMonths = proposal.commercialTerms?.contractTermMonths ?? 12;

  const halfWidth = (contentWidth - 4) / 2;

  // Setup Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, halfWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PHASE 1 ENGINEERING & DEPLOYMENT', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${setupFee.toLocaleString()}`, margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Fixed implementation & architecture fee', margin + 4, y + 18);

  // Retainer Box
  doc.roundedRect(margin + halfWidth + 4, y, halfWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('MANAGED OPERATIONS RETAINER', margin + halfWidth + 8, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${retainerFee.toLocaleString()}/mo`, margin + halfWidth + 8, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${contractMonths}-Month agreement with 99.9% uptime SLA`, margin + halfWidth + 8, y + 18);

  y += 26;

  // Milestones List
  const milestones = proposal.commercialTerms?.paymentMilestones || [
    { milestoneName: 'Contract Initiation & Discovery Intake', percentage: 40, trigger: 'Upon mutual agreement execution' },
    { milestoneName: 'Staging Environment & Model UAT Approval', percentage: 40, trigger: 'Successful test batch accuracy signoff' },
    { milestoneName: 'Production Cutover & Retainer Kickoff', percentage: 20, trigger: 'Live deployment to production' }
  ];

  checkPageBreak(milestones.length * 6 + 10);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, milestones.length * 6 + 8, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Milestone Billing Schedule:', margin + 4, y + 5);

  milestones.forEach((m, idx) => {
    const rowY = y + 10 + idx * 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`${m.milestoneName} (${m.percentage}%)`, margin + 4, rowY);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(m.trigger, pageWidth - margin - 4, rowY, { align: 'right' });
  });

  y += milestones.length * 6 + 13;

  // --- SECTION 6: GUARANTEES & COMPLIANCE ---
  drawSectionTitle('06', 'Security, Data Governance & SLA Guarantees');
  checkPageBreak(24);

  // Two guarantee cards
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, halfWidth, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('[x] Enterprise Data Privacy Guarantee', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const privLines = doc.splitTextToSize('Zero customer data retention for public model training. Isolated client vector embeddings.', halfWidth - 8);
  doc.text(privLines, margin + 4, y + 10.5);

  doc.roundedRect(margin + halfWidth + 4, y, halfWidth, 20, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('[x] 30-Day Milestone Guarantee', margin + halfWidth + 8, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const refundLines = doc.splitTextToSize('Full refund of setup fees if automated pipeline fails acceptance criteria during UAT staging.', halfWidth - 8);
  doc.text(refundLines, margin + halfWidth + 8, y + 10.5);

  y += 26;

  // --- SECTION 7: SIGNATURE EXECUTION BLOCK ---
  drawSectionTitle('07', 'Mutual Execution & Authorized Signatures');
  checkPageBreak(36);

  // Agency signature
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, halfWidth, 30, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('FOR AGENCY: NEXUSAI SOLUTIONS', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Alex Vance', margin + 4, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Alex Vance, Principal AI Architect', margin + 4, y + 19);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin + 4, y + 24);

  // Client signature
  doc.roundedRect(margin + halfWidth + 4, y, halfWidth, 30, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`FOR CLIENT: ${proposal.targetClient.toUpperCase()}`, margin + halfWidth + 8, y + 5.5);

  if (proposal.status === 'ACCEPTED' && proposal.signedBy) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(5, 150, 105);
    doc.text(proposal.signedBy, margin + halfWidth + 8, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(4, 120, 87);
    doc.text('Authorized Digital Electronic Signature', margin + halfWidth + 8, y + 19);
    doc.text(`Executed: ${proposal.signedAt || new Date().toLocaleDateString()}`, margin + halfWidth + 8, y + 24);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Pending electronic signature from', margin + halfWidth + 8, y + 14);
    doc.text('authorized corporate sponsor', margin + halfWidth + 8, y + 19);
  }

  // --- FOOTERS ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);

    // Bottom rule
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(`NexusAI Enterprise Operating System - Confidential - Prepared for ${proposal.targetClient}`, margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Sanitize filename
  const cleanClientName = (proposal.targetClient || client.name || 'Client')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const filename = `nexusai-proposal-${cleanClientName}-${new Date().toISOString().split('T')[0]}.pdf`;

  // Trigger download
  doc.save(filename);
};
