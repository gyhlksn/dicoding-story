export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.listStoryError(response.message);
        return;
      }

      console.log(response, 'reponsee home-pres');
      

      this.#view.listStory(response.message, response.listStory);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.listStoryError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}