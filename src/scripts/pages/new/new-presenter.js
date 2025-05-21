import { NotificationHelper } from '../../utils/notification-helper.js';

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, photo, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description: description,
        photo: photo,
        lat: latitude,
        lon: longitude,
      };
      const response = await this.#model.storeNewStory(data);

      if (!response.ok) {
        console.error('postNewStory: response:', response);
        this.#view.storeFailed(response.message);
        return;
      }

      NotificationHelper.sendPushNotification('Story berhasil dikirim!', {
        body: 'Terima kasih sudah membagikan ceritamu.',
      });

      this.#view.storeSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('postNewStory: error:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
      // this.#notifyToAllUser(response.data);
  }

  // async #notifyToAllUser(storyId) {
  //   try {
  //     const response = await this.#model.sendStoryToAllUserViaNotification(storyId);

  //     if (!response.ok) {
  //       console.error('#notifyToAllUser: response:', response);
  //       return false;
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error('#notifyToAllUser: error:', error);
  //     return false;
  //   }
  // }
}
