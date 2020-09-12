const usernameInput = document.getElementById('username-input');
const root = document.getElementById('root');
const startButton = document.getElementById('start-button');
const registrationForm = document.getElementById('sign-in-form');

export function subscribeToRegistrationForm(registeredCallback: (username: string) => void) {
  startButton.addEventListener('click', () => {
    const username = (usernameInput as HTMLInputElement).value;

    if (username == null || username === '' || username === 'username') {
      alert('Please enter a username.');
      return;
    }

    registrationForm.remove();
    document.documentElement.style.cssText = 'overflow: hidden';
    document.body.style.cssText = 'overflow: hidden';
    root.classList.add('active');

    setTimeout(() => {
      registeredCallback(username);
    }, 100);
  });
}
