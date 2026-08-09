import { SvgDocumentProvider } from '../state/svgDocument'
import ExportPanel from './ExportPanel'
import PreviewPanel from './PreviewPanel'
import SourcePanel from './SourcePanel'

export interface WorkbenchProps {
  initialSource: string
  initialName: string
}

export default function Workbench({ initialSource, initialName }: WorkbenchProps) {
  return (
    <SvgDocumentProvider initialSource={initialSource} initialName={initialName}>
      <div className="workbench">
        <SourcePanel />
        <PreviewPanel />
        <ExportPanel />
      </div>
    </SvgDocumentProvider>
  )
}
