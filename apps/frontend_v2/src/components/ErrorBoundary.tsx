import React from "react";
import { logger } from "../utils/logger";

class ErrorPresenter extends React.Component<{
  error?: string;
  info?: string;
}> {
  render() {
    return (
      <div className="w-full h-full grid place-content-center bg-gray-100">
        <div className="flex flex-col items-center">
          <h1 className="text-gray-900 text-2xl">
            Oops, developer was sloppy and the page you requested is under
            effect of Shardfall token.
          </h1>
          <img
            src="/assets/icons/error-fallback.png"
            alt="error"
            width="50%"
            height="50%"
          />
          Worry not though! Help is on its way. Or you can ask on Discord :)
          <a
            href="/"
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
}

interface ErrorBoundaryState {
  hasError: boolean;
  info: string;
  error: string;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false, info: "", error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: String(error) };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error(error.message, error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPresenter error={this.state.error} info={this.state.info} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
