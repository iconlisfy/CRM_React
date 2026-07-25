import { showDialogAction } from "../Actions";

let timeout;

const IDLE_TIME = 20 * 60 * 1000;

export const startIdleTimer = (store) => {
    const resetTimer = () => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            store.dispatch({ type: 'Logout' });
            store.dispatch(showDialogAction());

            // Dispatch custom event instead of alert
            window.dispatchEvent(
                new CustomEvent('session-expired', {
                    detail: {
                        message: 'Your session expired due to inactivity.',
                    },
                })
            );
        }, IDLE_TIME);
    };


    const events = [
        'mousemove',
        'mousedown',
        'keypress',
        'scroll',
        'touchstart',
    ];

    events.forEach((event) => {
        window.addEventListener(event, resetTimer);
    });

    // Start timer initially
    resetTimer();


    return () => {
        clearTimeout(timeout);

        events.forEach((event) => {
            window.removeEventListener(event, resetTimer);
        });
    };
};