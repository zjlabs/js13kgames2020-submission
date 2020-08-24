let memoizedSocket;

export function getSocket() {
  if (memoizedSocket == null) {
    memoizedSocket = (window as any).io({ upgrade: false, transports: ['websocket'] });
  }

  return memoizedSocket;
}
