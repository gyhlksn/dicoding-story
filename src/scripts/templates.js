import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="stories-list-button" class="stories-list-button" href="#/">Dicoding Story</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/new">New Story <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>No stories available</h2>
      <p>Currently, there are no reports of public facility damage to display.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>An error occurred while fetching the list of stories</h2>
      <p>${message ? message : 'Try a different network or report this error.'}</p>
    </div>
  `;
}

export function generateStoriesDetailErrorTemplate(message) {
  return `
    <div id="stories-detail-error" class="stories-detail__error">
      <h2>An error occurred while fetching the story details</h2>
      <p>${message ? message : 'Try a different network or report this error.'}</p>
    </div>
  `;
}

export function generateStoriesItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  location,
}) {
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="${name}">
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 id="story-title" class="story-item__title">${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
            </div>
            <div class="story-item__location">
               <i class="fas fa-map"></i> ${Array.isArray(location) ? location.join(', ') : '-'}
            </div>
          </div>
        </div>
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <div class="story-item__more-info"></div>
        <a class="btn story-item__read-more" href="#/stories/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateStoriesDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
  location,
}) {
  console.log(location, 'locccc');
  
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const imageUrl = photoUrl || 'default-image.jpg';
  const locationDisplay = location;

  return `
    <div class="story-detail__header">
      <h1 id="title" class="story-detail__title">${name}</h1>

      <div class="story-detail__more-info">
        <div class="story-detail__more-info__inline">
          <div class="story-detail__createdat"><i class="fas fa-calendar-alt"></i> ${createdAtFormatted}</div>
          <div class="story-detail__location__place-name"><i class="fas fa-map"></i> ${locationDisplay}</div>
        </div>
        <div class="story-detail__more-info__inline">
          <div class="story-detail__location__latitude">Latitude:  ${lat}</div>
          <div class="story-detail__location__longitude">Longitude:  ${lon}</div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__images__container">
        <div class="story-detail__images">
          <img class="story-detail__image" src="${imageUrl}" alt="${name}">
        </div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h2 class="story-detail__description__title">Description</h2>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
      </div>
      <div class="story-detail__body__map__container">
          <h2 class="story-detail__map__title">Location Map</h2>
          <div class="story-detail__map__container">
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
    </div>
  `;
}