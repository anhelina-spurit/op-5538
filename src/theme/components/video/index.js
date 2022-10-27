/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import './index.scss';

/**
 * Video types
 * @type {{YOUTUBE: string, VIMEO: string}}
 * @default
 */
const VIDEO_TYPES = {
  YOUTUBE: 'youtu',
  VIMEO: 'vimeo',
};

/**
 * API
 * @type {{YOUTUBE: string, VIMEO: string}}
 * @default
 */
const API = {
  YOUTUBE: 'https://www.youtube.com/iframe_api',
  VIMEO: '//player.vimeo.com/api/player.js',
};

/**
 * Intervals
 * @type {{DELAY: number}}
 * @default
 */
const INTERVALS = {
  DELAY: 50,
};

/**
 * Intervals limit
 * @type {number}
 * @default
 */
const INTERVALS_LIMIT = 999;

/**
 * VideoBlock
 */
class VideoBlock {
  /**
   * Constructor
   * @param {object} parameters
   */
  constructor(parameters) {
    this._initElements(parameters.video);
    this._autoplay = this.elements.video.dataset.autoplay.toLowerCase() === 'true';
    this.isMp4 = this._initSettings();
    if (!this.isMp4) {
      this._loadAPI().then(() => {
        this._initPlayer();
      });
      return;
    }
    this._initNativeVideoTag();
  }

  /**
   * @method playVideo
   */
  playVideo() {
    if (this.videoType === 'youTube') {
      this.player.mute();
      this.player.playVideo();
    } else {
      this.player.play();
    }
  }

  /**
   * @method _initElements
   * @param {HTMLElement} video
   */
  _initElements(video) {
    this.elements = {
      video,
    };
  }

  /**
   * @method _youTubeGetID
   * @returns string
   */
  _youTubeGetID(url) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }

  /**
   * @method _vimeoGetId
   * @returns string
   */
  _vimeoGetId(url) {
    const match = /vimeo.*\/(\d+)/i.exec(url);
    if (match) {
      return match[1];
    }
  }

  /**
   * @method _configurateSettingsObject
   * @param videoType string
   * @param videoId string
   */
  _configurateSettingsObject(videoType, videoId) {
    this.videoSettings = {
      requestHost: this.elements.video.dataset.host,
    };
    this.videoSettings.videoType = videoType;
    this.videoSettings.videoId = videoId;
  }

  /**
   * @method _initSettings
   * @returns boolean
   */
  _initSettings() {
    if (this.elements.video.dataset.videoSettings.includes(VIDEO_TYPES.YOUTUBE)) {
      const id = this._youTubeGetID(this.elements.video.dataset.videoSettings);
      this._configurateSettingsObject(VIDEO_TYPES.YOUTUBE, id);
      return false;
    }

    if (this.elements.video.dataset.videoSettings.includes(VIDEO_TYPES.VIMEO)) {
      const id = this._vimeoGetId(this.elements.video.dataset.videoSettings);
      this._configurateSettingsObject(VIDEO_TYPES.VIMEO, id);
      return false;
    }
    return true;
  }

  /**
   * @method _getApiUrlByVideoType
   * @param {string} videoType
   * @returns {string}
   */
  _getApiUrlByVideoType(videoType) {
    const apiByVideoType = {
      [VIDEO_TYPES.YOUTUBE]: API.YOUTUBE,
      [VIDEO_TYPES.VIMEO]: API.VIMEO,
    };

    return apiByVideoType[videoType];
  }

  /**
   * @method _getAPIInterface
   * @param {string} apiUrl
   */
  _getAPIInterface(apiUrl) {
    const apiInterface = {
      [API.YOUTUBE]: window.YT,
      [API.VIMEO]: window.Vimeo,
    };

    return apiInterface[apiUrl];
  }

  /**
   * @method _isAPILoaded
   * @param {string} videoType
   * @returns {object}
   */
  _isAPILoaded(videoType) {
    const apiUrl = this._getApiUrlByVideoType(videoType);

    return this._getAPIInterface(apiUrl) || document.querySelector(`script[src="${apiUrl}"]`);
  }

  /**
   * @method _loadAPI
   * @returns {object} promise
   */
  _loadAPI() {
    const videoType = this.videoSettings.videoType;

    return new Promise((resolve, reject) => {
      if (this._isAPILoaded(videoType)) {
        resolve();
      } else {
        const firstScriptTag = document.getElementsByTagName('script')[0];
        const script = document.createElement('script');

        script.onload = resolve;
        script.onerror = reject;
        script.src = this._getApiUrlByVideoType(videoType);

        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
      }
    });
  }

  /**
   * @method _onYouTubeStateChange
   * @param {Object} event
   */
  _onYouTubeStateChange(event) {
    if (event.data === window.YT.PlayerState.ENDED) {
      this.player.playVideo();
    }
  }

  /**
   * @method _onYouTubeReady
   */
  _onYouTubeReady() {
    this.player.mute();
    this.player.playVideo();
  }

  /**
   * @method _doInInterval
   * @param {function} callback
   */
  _doInInterval(callback) {
    let intervalsCount = 0;

    const interval = setInterval(() => {
      intervalsCount += 1;

      if (callback() || intervalsCount >= INTERVALS_LIMIT) {
        clearInterval(interval);
      }
    }, INTERVALS.DELAY);
  }

  /**
   * @method _initVimeoPlayer
   */
  _initVimeoPlayer() {
    const videoId = this.videoSettings.videoId;
    const options = {
      id: videoId,
      controls: false,
      autoplay: this._autoplay,
      autopause: false,
      muted: true,
      background: true,
      loop: true,
    };

    this._doInInterval(() => {
      if (window.Vimeo) {
        this.player = new Vimeo.Player(this.elements.video, options);
        this.videoType = 'vimeo';
        return true;
      }
    });
  }

  /**
   * @method _initYouTubePlayer
   */
  _initYouTubePlayer() {
    const videoId = this.videoSettings.videoId;
    const options = {
      videoId,
      height: '100%',
      width: '100%',
      playerVars: {
        showinfo: 0,
        controls: 0,
        fs: 0,
        rel: 0,
        iv_load_policy: 3,
        html5: 1,
        loop: 1,
        playsinline: 1,
        modestbranding: 1,
        disablekb: 1,
        origin: window.origin,
      },
      events: {
        onReady: this._autoplay ? this._onYouTubeReady.bind(this) : null,
        onStateChange: this._autoplay ? this._onYouTubeStateChange.bind(this) : null,
      },
    };

    const oldOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof oldOnYouTubeIframeAPIReady === 'function') {
        oldOnYouTubeIframeAPIReady();
      }

      if (!this.inited) {
        this.inited = true;
        this.player = new YT.Player(this.elements.video, options);
        this.videoType = 'youTube';
      }
    };
  }

  /**
   * @method _initPlayer
   */
  _initPlayer() {
    const initPlayerFunctions = {
      [VIDEO_TYPES.YOUTUBE]: this._initYouTubePlayer.bind(this),
      [VIDEO_TYPES.VIMEO]: this._initVimeoPlayer.bind(this),
    };
    const videoType = this.videoSettings.videoType;
    const initPlayer = initPlayerFunctions[videoType];

    initPlayer();
  }

  /**
   * @method _initNativeVideoTag
   */
  _initNativeVideoTag() {
    this.elements.video.insertAdjacentHTML(
      'afterBegin',
      `<video playsinline=""
                ${this._autoplay ? 'autoplay="autoplay"' : null}
                muted="muted"
                loop
                src="${this.elements.video.dataset.videoSettings}"></video>`,
    );

    this.player = this.elements.video.querySelector('video');
    this.videoType = 'mp4';
  }
}

export default VideoBlock;
