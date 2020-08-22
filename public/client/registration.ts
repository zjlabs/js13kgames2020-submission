const usernameInput = document.getElementById('username-input');
const usernameInputLabel = document.getElementById('username-input-label');
const root = document.getElementById('root');
const startButton = document.getElementById('start-button');

export function subscribeToRegistrationForm(registeredCallback: (username: string) => void) {
  startButton.addEventListener('click', () => {
    const username = (usernameInput as HTMLInputElement).value;

    if (username == null) {
      return;
    }

    registeredCallback(username);

    usernameInput.remove();
    usernameInputLabel.remove();
    startButton.remove();
    root.classList.add('active');
  });
}
