import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick: React.EventHandler<React.MouseEvent>;
};

function Button(props: Props) {
  return (
    <a href="#0" className="f6 link dim br1 ba ph3 pv2 dib dark-blue" onClick={props.onClick}>
      {props.children}
    </a>
  );
}

export default Button;
