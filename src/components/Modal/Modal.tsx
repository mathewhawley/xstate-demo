import React from 'react';
import ReactDOM from 'react-dom';
import useBodyScrollLock from 'hooks/useBodyScrollLock';

const PORTAL_ID = 'modal';
const container = document.getElementById(PORTAL_ID);

type Props = {
  trigger: React.ReactElement;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

function Modal(props: Props) {
  useBodyScrollLock(props.isOpen);

  const overlay = <div className="fixed top-0 left-0 right-0 bottom-0 o-70 bg-black" />;

  const panel = (
    <div className="u-center-abs w-third mw7 fixed bg-white br1 shadow-1">{props.children}</div>
  );

  const portal =
    container &&
    ReactDOM.createPortal(
      <>
        {overlay}
        {panel}
      </>,
      container
    );

  return (
    <>
      {props.trigger}
      {props.isOpen && portal}
    </>
  );
}

type HeaderProps = {
  children: React.ReactNode;
};

export function ModalHeader(props: HeaderProps) {
  return <div className="bb b--black-10 pa4">{props.children}</div>;
}

type BodyProps = {
  children: React.ReactNode;
};

export function ModalBody(props: BodyProps) {
  return <div className="pa4">{props.children}</div>;
}

type FooterProps = {
  children: React.ReactNode;
};

export function ModalFooter(props: FooterProps) {
  return <div className="bt b--black-10 pa4">{props.children}</div>;
}

export default Modal;
