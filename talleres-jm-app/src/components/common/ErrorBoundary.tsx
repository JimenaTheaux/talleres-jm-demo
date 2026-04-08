import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-8 gap-5">
          <AlertCircle size={48} className="text-error" />
          <div className="text-center">
            <p className="font-display font-bold text-text-primary text-lg mb-1">
              Algo salió mal
            </p>
            <p className="font-body text-text-secondary text-sm max-w-xs">
              {this.state.error?.message ?? 'Ocurrió un error inesperado.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-display font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
