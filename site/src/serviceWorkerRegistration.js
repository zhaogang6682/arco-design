import React from 'react';
import { Notification, Button } from '@arco-design/web-react';

let refreshing;

export function registerServiceWorker(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `./serviceWorker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.addEventListener('statechange', () => {
              // has service worker state changed
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  const id = `${Date.now()}`;
                  // there is a new service worker available, show the notification
                  Notification.info({
                    id,
                    closable: true,
                    duration: 0,
                    content: config.content,
                    btn: (
                      <span>
                        <Button
                          type="secondary"
                          size="small"
                          onClick={() => Notification.remove(id)}
                          style={{ marginRight: 12 }}
                        >
                          {config.cancelText}
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => {
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            Notification.remove(id);
                          }}
                        >
                          {config.okText}
                        </Button>
                      </span>
                    ),
                    position: 'bottomRight',
                  });
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });

      // reload on controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
