import React from 'react';
import cn from 'classnames';

const styleBase = 'bn dim br2 pv2 ph3 f6';
const styleStd = 'white bg-purple';
const styleFullWidth = 'w-100';

type Props = {
  children: React.ReactNode;
  variant: 'standard';
  fullWidth?: boolean;
  onClick: React.EventHandler<React.MouseEvent>;
};

function Button(props: Props) {
  const styles = cn(styleBase, {
    [styleStd]: props.variant === 'standard',
    [styleFullWidth]: props.fullWidth,
  });

  return (
    <button className={styles} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
