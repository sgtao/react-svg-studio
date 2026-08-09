import { SimpleGrid } from '@chakra-ui/react'
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
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="4">
        <SourcePanel />
        <PreviewPanel />
        <ExportPanel />
      </SimpleGrid>
    </SvgDocumentProvider>
  )
}
