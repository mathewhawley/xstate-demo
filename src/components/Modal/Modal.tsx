import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useBodyScrollLock from 'hooks/useBodyScrollLock';

const PORTAL_ID = 'modal';

type Props = {
  trigger: React.ReactElement;
  children?: React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  onOpen?: () => void;
};

function Modal(props: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useBodyScrollLock(props.isOpen);

  useEffect(() => {
    ref.current = document.getElementById(PORTAL_ID);
  }, []);

  const overlay = (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 o-70 bg-black"
      onClick={() => props.onClose()}
      data-testid="modal-overlay"
    />
  );

  const panel = (
    <div className="u-center-abs h-100 h-auto-ns w-100 pa3-ns mw6 fixed">
      <div
        className="br1-ns flex flex-column bg-white h-100 w-100 shadow-1"
        data-testid="modal-panel"
      >
        {props.children}
      </div>
    </div>
  );

  const portal =
    ref.current &&
    ReactDOM.createPortal(
      <>
        {overlay}
        {panel}
      </>,
      ref.current
    );

  return (
    <>
      {props.trigger}
      {props.isOpen && portal}
    </>
  );
}

type HeaderProps = {
  children?: React.ReactNode;
};

export function ModalHeader(props: HeaderProps) {
  return (
    <div className="bb b--black-10 ph3 pv4" data-testid="modal-header">
      {props.children}
    </div>
  );
}

type BodyProps = {
  children?: React.ReactNode;
};

export function ModalBody(props: BodyProps) {
  return (
    <div className="flex-auto pa3" data-testid="modal-body">
      {props.children}
    </div>
  );
}

type FooterProps = {
  children?: React.ReactNode;
};

export function ModalFooter(props: FooterProps) {
  return (
    <div className="bt b--black-10 pa3" data-testid="modal-footer">
      {props.children}
    </div>
  );
}

export default Modal;
