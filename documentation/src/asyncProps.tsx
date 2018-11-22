import React, { Component } from 'react';

type State = { props: null | AnyProps };
type AnyProps = { [k: string]: any };

function asyncProps<Props, AsyncProps extends { [k in keyof Partial<Props>]: Promise<Props[k]> }>(
  WrappedComponent: React.ComponentType<Props>,
  propsFromImports: AsyncProps
) {
  class AsyncComponent extends Component<Partial<Props>, State> {
    static displayName = WrappedComponent.displayName;
    constructor(props: Props) {
      super(props);

      this.state = {
        props: null
      };
    }

    async componentDidMount() {
      const keys = Object.keys(propsFromImports) as (keyof Partial<Props>)[];
      // there is no [[k, v]] => {k: v} conversion natively
      const collector = {} as Partial<Props>;
      await Promise.all(
        keys.map(k => propsFromImports[k]
                       .then(res => { collector[k] = res }))
      );

      this.setState({
        props: collector
      });
    }

    render() {
      return this.state.props ? <WrappedComponent {...this.props} {...this.state.props} /> : null;
    }
  }

  return AsyncComponent;
}

export default asyncProps;
