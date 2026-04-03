import React from "react";

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

  componentDidCatch(_error: Error, _info: React.ErrorInfo) {
    //this.setState({ error: error, info: info });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPresenter error={this.state.error} info={this.state.info} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
