# EvidencePanel Component

## Overview
Created `src/pages/Case/EvidencePanel.tsx` - a React component using Kendo React components that provides a dual-pane file management interface for case evidence.

## Features

### Two-Pane Design
- **Left Pane**: Available Files - Shows system files that can be attached as evidence
- **Right Pane**: Attached Evidence - Shows files currently attached to the case

### File Management Controls
- **Move Right (→)**: Move selected available files to evidence
- **Move Left (←)**: Remove selected files from evidence  
- **Move All Right (⇉)**: Move all available files to evidence
- **Move All Left (⇇)**: Remove all files from evidence

### Mock Data
- Includes 10 sample files with realistic names and metadata:
  - user_database_export.csv (2.3 MB)
  - gdpr_compliance_report.pdf (856 KB)
  - user_activity_logs.txt (1.2 MB)
  - data_processing_agreement.pdf (324 KB)
  - identity_verification.jpg (245 KB)
  - consent_records.xlsx (445 KB)
  - privacy_policy.pdf (189 KB)
  - data_retention_policy.doc (156 KB)
  - audit_trail.txt (890 KB)
  - legal_basis_documentation.pdf (672 KB)

### File Display
- File type icons (📄 for PDF, 📝 for DOC, 📋 for TXT, 🖼️ for images, 📊 for Excel, 📁 for others)
- File name, description, and size metadata
- Visual selection indication with blue highlight and border
- Hover effects for better UX

### Store Integration
- Reads existing attachments from the case request store
- Persists changes back to the store using `updateRequest()`
- Maintains sync between component state and store state
- Removes attached files from available files list to prevent duplicates

### TypeScript Strict Compliance
- Full TypeScript support with strict typing
- Proper interface definitions for `EvidenceFile`
- Type-safe event handlers and component props
- No `any` types used in production code

### Accessibility
- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly button descriptions
- Semantic HTML structure

## Integration

### CasePage Integration
- Updated `src/pages/Case/CasePage.tsx` to import and use the new `EvidencePanel`
- Replaced the existing Evidence tab content with the new component
- Fixed SLAWidget props to include required `submittedAt` parameter

### No Custom CSS
- Uses only inline styles as requested
- Follows existing design patterns from the application
- Consistent with Kendo React component styling

## Usage
The component automatically:
1. Loads on the Evidence tab of any case page
2. Shows available files that can be attached as evidence
3. Allows users to select and move files between panes
4. Persists all changes to the case store
5. Updates the UI to reflect current state

Navigate to any case (e.g., `/case/REQ-1001`) and click the Evidence tab to use the component.
