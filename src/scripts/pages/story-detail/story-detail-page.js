import {
  generateLoaderAbsoluteTemplate,
  generateRemoveStoryButtonTemplate,
  generateStoriesDetailErrorTemplate,
  generateStoriesDetailTemplate,
  generateSaveStoryButtonTemplate,
} from "../../templates.js";
import { createCarousel } from "../../utils";
import StoryDetailPresenter from "./story-detail-presenter.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import Map from "../../utils/map.js";
import * as DicodingStoryAPI from "../../data/api.js";
import Database from "../../data/database";

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
      
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: DicodingStoryAPI,
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById("story-detail").innerHTML =
      generateStoriesDetailTemplate({
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat: story.lat,
        lon: story.lon,
        location: story.location.placeName,
      });

    // Carousel images
    createCarousel(document.getElementById("images"));

    // Map
    await this.#presenter.showStoryDetailMap();
    if (this.#map) {
      const storyCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.title };
      const popupOptions = { content: story.title };

      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    // Actions buttons
    this.#presenter.showSaveButton();
    this.addNotifyMeEventListener();
  }

  populateStoryDetailError(message) {
    document.getElementById("stories-detail").innerHTML =
      generateStoriesDetailErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 15,
    });
  }

  renderSaveButton() {
      document.getElementById('save-actions-container').innerHTML =
        generateSaveStoryButtonTemplate();
  
      document.getElementById('story-detail-save').addEventListener('click', async () => {
        await this.#presenter.saveStory();
        // await this.#presenter.showSaveButton();
      });
    }
  
    saveToBookmarkSuccessfully(message) {
      console.log(message);
    }
  
    saveToBookmarkFailed(message) {
      alert(message);
    }
  
    renderRemoveButton() {
      document.getElementById('save-actions-container').innerHTML =
        generateRemoveStoryButtonTemplate();
  
      document.getElementById('story-detail-remove').addEventListener('click', async () => {
        await this.#presenter.removeStory();
        await this.#presenter.showSaveButton();
      });
    }
  
    removeFromBookmarkSuccessfully(message) {
      console.log(message);
    }
  
    removeFromBookmarkFailed(message) {
      alert(message);
    }
  
    addNotifyMeEventListener() {
      document.getElementById('story-detail-notify-me').addEventListener('click', () => {
        this.#presenter.notifyMe();
      });
    }

  showStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML = "";
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }
}