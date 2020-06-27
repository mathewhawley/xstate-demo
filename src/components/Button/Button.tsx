import React from 'react';
import cn from 'classnames';

const styleBase = 'bg-animate bn br2 f5';
const stylePrimary = 'white bg-blue hover-bg-dark-blue';
const styleStd = 'bg-white hover-bg-black-10 blue';
const styleNew = 'white bg-green hover-bg-dark-green';
const styleError = 'white bg-red hover-bg-dark-red';
const styleSizeStd = 'pv2 ph3';
const styleSizeLrg = 'pv3 ph4';
const styleFullWidth = 'w-100';

type Props = {
  children: React.ReactNode;
  variant: 'standard' | 'primary' | 'error' | 'new';
  size?: 'standard' | 'large';
  onClick: React.EventHandler<React.MouseEvent>;
  fullWidth?: boolean;
  qaHook?: string;
};

function Button(props: Props) {
  const size = props.size || 'standard';

  const styles = cn(styleBase, {
    [styleStd]: props.variant === 'standard',
    [stylePrimary]: props.variant === 'primary',
    [styleError]: props.variant === 'error',
    [styleNew]: props.variant === 'new',
    [styleSizeStd]: size === 'standard',
    [styleSizeLrg]: size === 'large',
    [styleFullWidth]: props.fullWidth,
  });

  return (
    <button className={styles} onClick={props.onClick} data-testid={props.qaHook}>
      {props.children}
    </button>
  );
}

export default Button;
