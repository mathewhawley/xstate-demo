import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick: React.EventHandler<React.MouseEvent>;
};

function Button(props: Props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}

export default Button;
