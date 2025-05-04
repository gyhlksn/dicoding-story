import {
  generateLoaderAbsoluteTemplate,
  generateStoriesItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from "../../templates";
import HomePresenter from "./home-presenter";
import * as DicodingStoryAPI from "../../data/api";
import Map from "../../utils/map.js";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">DicodingStory</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: DicodingStoryAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  listStory(message, stories) {
    if (stories.length <= 0) {
      this.listStoryEmpty();
      return;
    }

    const html = stories
    .filter(story => story.lat != null && story.lon != null)
    .reduce((accumulator, story) => {
      const coordinate = [story.lat, story.lon];
      this.#map.addMarker(coordinate, { alt: story.name }, { content: story.name });
  
      return accumulator.concat(
        generateStoriesItemTemplate({
          ...story,
          storyName: story.name,
          location: coordinate,
        }),
      );
    }, '');

    // console.log(html, 'htmlll');
    

    document.getElementById("stories-list").innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  listStoryEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  listStoryError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}