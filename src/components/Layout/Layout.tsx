import React from 'react';

type Props = {
  children?: React.ReactNode;
};

function Layout(props: Props) {
  if (!props.children) {
    return null;
  }

  return <div className="mw8 center ph3">{props.children}</div>;
}

export default Layout;
