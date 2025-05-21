import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API is not supported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Notification permission was denied.');
    return false;
  }

  if (status === 'default') {
    alert('Notification permission was dismissed or ignored.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    alert('You are already subscribed to push notifications.');
    return;
  }

  console.log('Starting push notification subscription...');
  const failureSubscribeMessage = 'Failed to activate push notification subscription.';
  const successSubscribeMessage = 'Push notification subscription activated successfully.';

  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.ready;
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error('subscribe: response:', response);
      alert(failureSubscribeMessage);
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
      return;
    }
    alert(successSubscribeMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureSubscribeMessage);
    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Failed to unsubscribe from push notifications.';
  const successUnsubscribeMessage = 'Successfully unsubscribed from push notifications.';

  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Cannot unsubscribe because there is no active push notification subscription.');
      return;
    }

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      alert(failureUnsubscribeMessage);
      console.error('unsubscribe: response:', response);
      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      alert(failureUnsubscribeMessage);
      await subscribePushNotification({ endpoint, keys });
      return;
    }

    alert(successUnsubscribeMessage);
  } catch (error) {
    alert(failureUnsubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}

export const NotificationHelper = {
  sendPushNotification(title, options = {}) {
    if (!('Notification' in window)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        ...options,
        icon: '/images/icon-192x192.png',
        badge: '/images/icon-512x512.png',
        vibrate: [100, 50, 100],
      });
    });
  },
};
