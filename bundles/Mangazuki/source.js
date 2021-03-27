(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
class Source {
    constructor(cheerio) {
        // <-----------        OPTIONAL METHODS        -----------> //
        /**
         * Manages the ratelimits and the number of requests that can be done per second
         * This is also used to fetch pages when a chapter is downloading
         */
        this.requestManager = createRequestManager({
            requestsPerSecond: 2.5,
            requestTimeout: 5000
        });
        this.cheerio = cheerio;
    }
    /**
     * (OPTIONAL METHOD) This function is called when ANY request is made by the Paperback Application out to the internet.
     * By modifying the parameter and returning it, the user can inject any additional headers, cookies, or anything else
     * a source may need to load correctly.
     * The most common use of this function is to add headers to image requests, since you cannot directly access these requests through
     * the source implementation itself.
     *
     * NOTE: This does **NOT** influence any requests defined in the source implementation. This function will only influence requests
     * which happen behind the scenes and are not defined in your source.
     */
    globalRequestHeaders() { return {}; }
    globalRequestCookies() { return []; }
    /**
     * A stateful source may require user input.
     * By supplying this value to the Source, the app will render your form to the user
     * in the application settings.
     */
    getAppStatefulForm() { return createUserForm({ formElements: [] }); }
    /**
     * When the Advanced Search is rendered to the user, this skeleton defines what
     * fields which will show up to the user, and returned back to the source
     * when the request is made.
     */
    getAdvancedSearchForm() { return createUserForm({ formElements: [] }); }
    /**
     * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
     * @param mangaId
     */
    getMangaShareUrl(mangaId) { return null; }
    /**
     * If a source is secured by Cloudflare, this method should be filled out.
     * By returning a request to the website, this source will attempt to create a session
     * so that the source can load correctly.
     * Usually the {@link Request} url can simply be the base URL to the source.
     */
    getCloudflareBypassRequest() { return null; }
    /**
     * (OPTIONAL METHOD) A function which communicates with a given source, and returns a list of all possible tags which the source supports.
     * These tags are generic and depend on the source. They could be genres such as 'Isekai, Action, Drama', or they can be
     * listings such as 'Completed, Ongoing'
     * These tags must be tags which can be used in the {@link searchRequest} function to augment the searching capability of the application
     */
    getTags() { return Promise.resolve(null); }
    /**
     * (OPTIONAL METHOD) A function which should scan through the latest updates section of a website, and report back with a list of IDs which have been
     * updated BEFORE the supplied timeframe.
     * This function may have to scan through multiple pages in order to discover the full list of updated manga.
     * Because of this, each batch of IDs should be returned with the mangaUpdatesFoundCallback. The IDs which have been reported for
     * one page, should not be reported again on another page, unless the relevent ID has been detected again. You do not want to persist
     * this internal list between {@link Request} calls
     * @param mangaUpdatesFoundCallback A callback which is used to report a list of manga IDs back to the API
     * @param time This function should find all manga which has been updated between the current time, and this parameter's reported time.
     *             After this time has been passed, the system should stop parsing and return
     */
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) { return Promise.resolve(); }
    /**
     * (OPTIONAL METHOD) A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
     * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
     * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
     * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
     * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
     * @param sectionCallback A callback which is run for each independant HomeSection.
     */
    getHomePageSections(sectionCallback) { return Promise.resolve(); }
    /**
     * (OPTIONAL METHOD) This function will take a given homepageSectionId and metadata value, and with this information, should return
     * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
     * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
     * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about
     * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
     * function. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified, the modified version
     * will be supplied to this function instead of the origional {@link getHomePageSections}'s version.
     * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
     */
    getViewMoreItems(homepageSectionId, metadata) { return Promise.resolve(null); }
    /**
     * (OPTIONAL METHOD) This function is to return the entire library of a manga website, page by page.
     * If there is an additional page which needs to be called, the {@link PagedResults} value should have it's metadata filled out
     * with information needed to continue pulling information from this website.
     * Note that if the metadata value of {@link PagedResults} is undefined, this method will not continue to run when the user
     * attempts to readonly morenformation
     * @param metadata Identifying information as to what the source needs to call in order to readonly theext batch of data
     * of the directory. Usually this is a page counter.
     */
    getWebsiteMangaDirectory(metadata) { return Promise.resolve(null); }
    // <-----------        PROTECTED METHODS        -----------> //
    // Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
    convertTime(timeAgo) {
        var _a;
        let time;
        let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
        trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
        if (timeAgo.includes('minutes')) {
            time = new Date(Date.now() - trimmed * 60000);
        }
        else if (timeAgo.includes('hours')) {
            time = new Date(Date.now() - trimmed * 3600000);
        }
        else if (timeAgo.includes('days')) {
            time = new Date(Date.now() - trimmed * 86400000);
        }
        else if (timeAgo.includes('year') || timeAgo.includes('years')) {
            time = new Date(Date.now() - trimmed * 31556952000);
        }
        else {
            time = new Date(Date.now());
        }
        return time;
    }
    /**
     * When a function requires a POST body, it always should be defined as a JsonObject
     * and then passed through this function to ensure that it's encoded properly.
     * @param obj
     */
    urlEncodeObject(obj) {
        let ret = {};
        for (const entry of Object.entries(obj)) {
            ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
        }
        return ret;
    }
}
exports.Source = Source;

},{}],3:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);

},{"./Source":2}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":3,"./models":25}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],6:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],7:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],8:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],15:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],16:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],19:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],20:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],22:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],23:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],24:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],25:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./TrackObject"), exports);
__exportStar(require("./OAuth"), exports);
__exportStar(require("./UserForm"), exports);

},{"./Chapter":5,"./ChapterDetails":6,"./Constants":7,"./HomeSection":8,"./Languages":9,"./Manga":10,"./MangaTile":11,"./MangaUpdate":12,"./OAuth":13,"./PagedResults":14,"./RequestHeaders":15,"./RequestManager":16,"./RequestObject":17,"./ResponseObject":18,"./SearchRequest":19,"./SourceInfo":20,"./SourceTag":21,"./TagSection":22,"./TrackObject":23,"./UserForm":24}],26:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mmrcms = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MmrcmsParser_1 = require("./MmrcmsParser");
class Mmrcms extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        /**
         * Array of corresponding ids and categories for this mMRCMS source.
         */
        this.sourceCategories = [];
        /**
         * Array of corresponding ids and tags for this mMRCMS source.
         */
        this.sourceTags = [];
        /**
         * Helps with CloudFlare for some sources, makes it worse for others; override with empty string if the latter is true
         */
        this.userAgentRandomizer = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/78.0${Math.floor(Math.random() * 100000)}`;
        this.parser = new MmrcmsParser_1.Parser();
    }
    getMangaShareUrl(mangaId) {
        return `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`;
    }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
                method: "GET",
                headers: this.constructHeaders({}),
            });
            const data = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(data.status);
            const $ = this.cheerio.load(data.data);
            return this.parser.parseMangaDetails($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${this.baseUrl}/wp-admin/admin-ajax.php`,
                method: "POST",
                headers: this.constructHeaders({
                    "content-type": "application/x-www-form-urlencoded",
                }),
                data: this.urlEncodeObject({
                    action: "manga_get_chapters",
                    manga: mangaId,
                }),
            });
            let data = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(data.status);
            let $ = this.cheerio.load(data.data);
            return this.parser.parseChapterList($, mangaId, this);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${this.baseUrl}/${this.sourceTraversalPathName}/${chapterId}/`,
                method: "GET",
                headers: this.constructHeaders({}),
                cookies: [createCookie({ name: "wpmanga-adault", value: "1", domain: this.baseUrl })],
            });
            let data = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(data.status);
            let $ = this.cheerio.load(data.data);
            return this.parser.parseChapterDetails($, mangaId, chapterId);
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            let request;
            request = createRequestObject({
                url: `${this.baseUrl}/`,
                method: "GET",
                headers: this.constructHeaders({}),
            });
            let data = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(data.status);
            let $ = this.cheerio.load(data.data);
            return this.parser.parseTags($);
        });
    }
    searchRequest(query, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // If we're supplied a page that we should be on, set our internal reference to that page. Otherwise, we start from page 0.
            let page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 0;
            const request = createRequestObject({
                url: `${this.baseUrl}/`,
                method: "GET",
                headers: this.constructHeaders({}),
            });
            let data = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(data.status);
            let $ = this.cheerio.load(data.data);
            let manga = this.parser.parseSearchResults($, this);
            let mData = { page: page + 1 };
            if (manga.length < 50) {
                mData = undefined;
            }
            return createPagedResults({
                results: manga,
                metadata: typeof (mData === null || mData === void 0 ? void 0 : mData.page) === "undefined" ? undefined : mData,
            });
        });
    }
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we're supplied a page that we should be on, set our internal reference to that page. Otherwise, we start from page 0.
            let page = 0;
            let loadNextPage = true;
            while (loadNextPage) {
                const request = createRequestObject({
                    url: `${this.baseUrl}/`,
                    method: "GET",
                    headers: this.constructHeaders({}),
                });
                let data = yield this.requestManager.schedule(request, 1);
                this.CloudFlareError(data.status);
                let $ = this.cheerio.load(data.data);
                let updatedManga = this.parser.filterUpdatedManga($, time, ids, this);
                loadNextPage = updatedManga.loadNextPage;
                if (loadNextPage) {
                    page++;
                }
                if (updatedManga.updates.length > 0) {
                    mangaUpdatesFoundCallback(createMangaUpdates({
                        ids: updatedManga.updates,
                    }));
                }
            }
        });
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const sections = [
                {
                    request: createRequestObject({
                        url: `${this.baseUrl}/latest-release`,
                        method: "GET",
                        headers: this.constructHeaders({}),
                    }),
                    section: createHomeSection({
                        id: "1_recently_updated",
                        title: "RECENTLY UPDATED",
                        view_more: true,
                    }),
                },
                {
                    request: createRequestObject({
                        url: `${this.baseUrl}/filterList?page=1&sortBy=views&asc=false`,
                        method: "GET",
                        headers: this.constructHeaders({}),
                    }),
                    section: createHomeSection({
                        id: "2_currenty_trending",
                        title: "CURRENTLY TRENDING",
                        view_more: true,
                    }),
                },
            ];
            const promises = [];
            for (const section of sections) {
                // Loading empty sections
                sectionCallback(section.section);
                // Populating section data
                promises.push(this.requestManager.schedule(section.request, 1).then((response) => {
                    this.CloudFlareError(response.status);
                    const $ = this.cheerio.load(response.data);
                    switch (section.section.id) {
                        case "1_recently_updated": {
                            section.section.items = this.parser.parseLatestRelease($, this);
                            break;
                        }
                        case "2_currenty_trending": {
                            section.section.items = this.parser.parseFilterList($, this);
                            break;
                        }
                        default:
                            console.log('getHomePageSections(): Invalid section ID');
                    }
                    sectionCallback(section.section);
                }));
            }
            // Make sure the function completes
            yield Promise.all(promises);
        });
    }
    getViewMoreItems(homepageSectionId, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.page) !== null && _a !== void 0 ? _a : 1;
            let param = "";
            switch (homepageSectionId) {
                case "1_recently_updated": {
                    param = `/latest-release?page=${page}`;
                    break;
                }
                case "2_currenty_trending": {
                    param = `/filterList?page=${page}&sortBy=views&asc=false`;
                    break;
                }
                default:
                    return Promise.resolve(null);
            }
            const request = createRequestObject({
                url: `${this.baseUrl}`,
                method: "GET",
                headers: this.constructHeaders({}),
                param,
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            let mangaTiles = [];
            switch (homepageSectionId) {
                case "1_recently_updated": {
                    mangaTiles = this.parser.parseLatestRelease($, this);
                    break;
                }
                case "2_currenty_trending": {
                    mangaTiles = this.parser.parseFilterList($, this);
                    break;
                }
                default:
                    return Promise.resolve(null);
            }
            // TODO isLastPage
            return createPagedResults({
                results: mangaTiles,
                metadata,
            });
        });
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${this.baseUrl}`,
            method: "GET",
            headers: this.constructHeaders({}),
        });
    }
    /**
     * Parses a time string from a Madara source into a Date object.
     */
    convertTime(timeAgo) {
        var _a;
        let time;
        let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
        trimmed = trimmed == 0 && timeAgo.includes("a") ? 1 : trimmed;
        if (timeAgo.includes("mins") || timeAgo.includes("minutes") || timeAgo.includes("minute")) {
            time = new Date(Date.now() - trimmed * 60000);
        }
        else if (timeAgo.includes("hours") || timeAgo.includes("hour")) {
            time = new Date(Date.now() - trimmed * 3600000);
        }
        else if (timeAgo.includes("days") || timeAgo.includes("day")) {
            time = new Date(Date.now() - trimmed * 86400000);
        }
        else if (timeAgo.includes("year") || timeAgo.includes("years")) {
            time = new Date(Date.now() - trimmed * 31556952000);
        }
        else {
            time = new Date(timeAgo);
        }
        return time;
    }
    constructHeaders(headers, refererPath) {
        if (this.userAgentRandomizer !== "") {
            headers["user-agent"] = this.userAgentRandomizer;
        }
        headers["referer"] = `${this.baseUrl}${refererPath !== null && refererPath !== void 0 ? refererPath : ""}`;
        return headers;
    }
    globalRequestHeaders() {
        if (this.userAgentRandomizer !== "") {
            return {
                referer: `${this.baseUrl}/`,
                "user-agent": this.userAgentRandomizer,
                accept: "image/avif,image/apng,image/jpeg;q=0.9,image/png;q=0.9,image/*;q=0.8",
            };
        }
        else {
            return {
                referer: `${this.baseUrl}/`,
                accept: "image/avif,image/apng,image/jpeg;q=0.9,image/png;q=0.9,image/*;q=0.8",
            };
        }
    }
    CloudFlareError(status) {
        if (status == 503) {
            throw new Error("CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass");
        }
    }
}
exports.Mmrcms = Mmrcms;

},{"./MmrcmsParser":27,"paperback-extensions-common":4}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
class Parser {
    parseMangaDetails($, mangaId) {
        var _a, _b;
        let numericId = $("a.wp-manga-action-button").attr("data-post");
        let title = this.decodeHTMLEntity($("div.post-title h1").first().text().replace(/NEW/, "").replace(/HOT/, "").replace("\\n", "").trim());
        let author = this.decodeHTMLEntity($("div.author-content").first().text().replace("\\n", "").trim()).replace("Updating", "Unknown");
        let artist = this.decodeHTMLEntity($("div.artist-content").first().text().replace("\\n", "").trim()).replace("Updating", "Unknown");
        let summary = this.decodeHTMLEntity($("div.description-summary").first().text()).replace("Show more", "").trim();
        let image = encodeURI(this.getImageSrc($("div.summary_image img").first()));
        let rating = $("span.total_votes").text().replace("Your Rating", "");
        let isOngoing = $("div.summary-content", $("div.post-content_item").last()).text().toLowerCase().trim() == "ongoing";
        let genres = [];
        let hentai = $(".manga-title-badges.adult").length > 0;
        // Grab genres and check for smut tag
        for (let obj of $("div.genres-content a").toArray()) {
            let label = $(obj).text();
            let id = (_b = (_a = $(obj).attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")[4]) !== null && _b !== void 0 ? _b : label;
            if (label.toLowerCase().includes("smut"))
                hentai = true;
            genres.push(createTag({ label: label, id: id }));
        }
        let tagSections = [createTagSection({ id: "0", label: "genres", tags: genres })];
        // If we cannot parse out the data-id for this title, we cannot complete subsequent requests
        if (!numericId) {
            throw `Could not parse out the data-id for ${mangaId} - This method might need overridden in the implementing source`;
        }
        // If we do not have a valid image, something is wrong with the generic parsing logic. A source should always remedy this with
        // a custom implementation.
        if (!image) {
            throw `Could not parse out a valid image while parsing manga details for manga: ${mangaId}`;
        }
        return createManga({
            id: numericId,
            titles: [title],
            image: image,
            author: author,
            artist: artist,
            tags: tagSections,
            desc: summary,
            status: isOngoing ? paperback_extensions_common_1.MangaStatus.ONGOING : paperback_extensions_common_1.MangaStatus.COMPLETED,
            rating: Number(rating),
            hentai: hentai,
        });
    }
    parseChapterList($, mangaId, source) {
        var _a, _b, _c, _d, _e, _f;
        let chapters = [];
        // Capture the manga title, as this differs from the ID which this function is fed
        let realTitle = (_a = $("a", $("li.wp-manga-chapter  ").first())
            .attr("href")) === null || _a === void 0 ? void 0 : _a.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").toLowerCase().replace(/\/chapter.*/, "");
        if (!realTitle) {
            throw `Failed to parse the human-readable title for ${mangaId}`;
        }
        // For each available chapter..
        for (let obj of $("li.wp-manga-chapter  ").toArray()) {
            let id = ($("a", $(obj)).first().attr("href") || "").replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").replace(/\/$/, "");
            let chapNum = Number((_d = (_c = (_b = $("a", $(obj))
                .first()
                .attr("href")) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === null || _c === void 0 ? void 0 : _c.match(/chapter-\D*(\d*\.?\d*)/)) === null || _d === void 0 ? void 0 : _d.pop());
            let chapName = $("a", $(obj)).first().text();
            let releaseDate = $("i", $(obj)).length > 0 ? $("i", $(obj)).text() : (_e = $(".c-new-tag a", $(obj)).attr("title")) !== null && _e !== void 0 ? _e : "";
            if (typeof id === "undefined") {
                throw `Could not parse out ID when getting chapters for ${mangaId}`;
            }
            chapters.push(createChapter({
                id: id,
                mangaId: mangaId,
                langCode: (_f = source.languageCode) !== null && _f !== void 0 ? _f : paperback_extensions_common_1.LanguageCode.UNKNOWN,
                chapNum: Number.isNaN(chapNum) ? 0 : chapNum,
                name: Number.isNaN(chapNum) ? chapName : undefined,
                time: source.convertTime(releaseDate),
            }));
        }
        return this.sortChapters(chapters);
    }
    parseChapterDetails($, mangaId, chapterId) {
        let pages = [];
        return createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
            longStrip: false,
        });
    }
    parseTags($) {
        var _a, _b;
        let genres = [];
        for (let obj of $(".menu-item-object-wp-manga-genre a", $(".second-menu")).toArray()) {
            let label = $(obj).text().trim();
            let id = (_b = (_a = $(obj).attr("href")) === null || _a === void 0 ? void 0 : _a.split("/")[4]) !== null && _b !== void 0 ? _b : label;
            genres.push(createTag({ label: label, id: id }));
        }
        return [createTagSection({ id: "0", label: "genres", tags: genres })];
    }
    parseSearchResults($, source) {
        var _a, _b;
        let results = [];
        for (let obj of $(source.searchMangaSelector).toArray()) {
            let id = ((_a = $("a", $(obj)).attr("href")) !== null && _a !== void 0 ? _a : "").replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").replace(/\/$/, "");
            let title = createIconText({ text: this.decodeHTMLEntity((_b = $("a", $(obj)).attr("title")) !== null && _b !== void 0 ? _b : "") });
            let image = encodeURI(this.getImageSrc($("img", $(obj))));
            if (!id || !image || !title.text) {
                if (id.includes(source.baseUrl.replace(/\/$/, "")))
                    continue;
                // Something went wrong with our parsing, return a detailed error
                throw `Failed to parse searchResult for ${source.baseUrl} using ${source.searchMangaSelector} as a loop selector`;
            }
            results.push(createMangaTile({
                id: id,
                title: title,
                image: image,
            }));
        }
        return results;
    }
    filterUpdatedManga($, time, ids, source) {
        var _a, _b, _c, _d;
        let passedReferenceTime = false;
        let updatedManga = [];
        for (let obj of $("div.page-item-detail").toArray()) {
            let id = (_b = (_a = $("a", $("h3.h5", obj)).attr("href")) === null || _a === void 0 ? void 0 : _a.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").replace(/\/$/, "")) !== null && _b !== void 0 ? _b : "";
            let mangaTime;
            if ($(".c-new-tag a", obj).length > 0) {
                // Use blinking red NEW tag
                mangaTime = source.convertTime((_c = $(".c-new-tag a", obj).attr("title")) !== null && _c !== void 0 ? _c : "");
            }
            else {
                // Use span
                mangaTime = source.convertTime((_d = $("span", $(".chapter-item", obj).first()).last().text()) !== null && _d !== void 0 ? _d : "");
            }
            passedReferenceTime = mangaTime <= time;
            if (!passedReferenceTime) {
                if (ids.includes(id)) {
                    updatedManga.push(id);
                }
            }
            else
                break;
            if (typeof id === "undefined") {
                throw `Failed to parse homepage sections for ${source.baseUrl}/${source.homePage}/`;
            }
        }
        if (!passedReferenceTime) {
            return { updates: updatedManga, loadNextPage: true };
        }
        else {
            return { updates: updatedManga, loadNextPage: false };
        }
    }
    parseLatestRelease($, source) {
        var _a, _b;
        const mangaTiles = [];
        const collectedIds = [];
        const context = $("div.mangalist");
        let id = "";
        let image = "";
        let title = "";
        let chapter = "";
        for (const element of $("div.manga-item", context).toArray()) {
            id = (_b = ((_a = $("a", element).first().attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $("a", element).first().text().trim();
            chapter = "Chapter " + $(".manga-chapter a", element).text().trim();
            if (!collectedIds.includes(id)) {
                mangaTiles.push(createMangaTile({
                    id,
                    image,
                    title: createIconText({ text: title }),
                    subtitleText: createIconText({ text: chapter }),
                }));
                collectedIds.push(id);
            }
        }
        return mangaTiles;
    }
    parseFilterList($, source) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const mangaTiles = [];
        const collectedIds = [];
        let id = "";
        let image = "";
        let title = "";
        let views = "";
        const elementsWrapperNode = (source.name === "Utsukushii") ? $("div.content div.col-sm-6") : $("div[class^=col-sm], div.col-xs-6"); // Check for Utsukushii
        for (const element of elementsWrapperNode.toArray()) {
            // Id
            const idNode = $(".chart-title", element);
            if (idNode.length > 0) {
                id = (_b = ((_a = idNode.attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
                title = source.name; //this.decodeHTMLEntity(idNode.text().replace(/\s+/g, " ").trim());
            }
            else {
                id = (_d = ((_c = $("a").attr("href")) !== null && _c !== void 0 ? _c : "").split("/").pop()) !== null && _d !== void 0 ? _d : "";
                const captionNode = $("div.caption", element);
                const captionNodeH3 = $("h3", captionNode);
                if (captionNodeH3.length > 0) {
                    title = this.decodeHTMLEntity(captionNodeH3.text()); // Submanga
                }
                else {
                    title = this.decodeHTMLEntity(captionNode.text().replace(/\s+/g, " ").trim()); // HentaiShark
                }
            }
            // Image
            const imageNode = $("img", element);
            if (((_e = imageNode.attr("data-background-image")) !== null && _e !== void 0 ? _e : "").length > 0) {
                image = (_f = imageNode.attr("data-background-image")) !== null && _f !== void 0 ? _f : ""; // Utsukushii
            }
            else if (((_g = imageNode.attr("data-src")) !== null && _g !== void 0 ? _g : "").length > 0) {
                image = this.coverGuess((_h = imageNode.attr("data-src")) !== null && _h !== void 0 ? _h : "", id, source);
            }
            else {
                image = this.coverGuess((_j = imageNode.attr("src")) !== null && _j !== void 0 ? _j : "", id, source);
            }
            // Subtitle
            if (((_k = $("i.fa-eye", element).parent().text()) !== null && _k !== void 0 ? _k : "").length > 0) {
                views = $("i.fa-eye", element).parent().text().replace(/\s+/g, " ").trim().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " views";
            }
            else {
                views = "";
            }
            // Push results
            if (!collectedIds.includes(id)) {
                mangaTiles.push(createMangaTile({
                    id,
                    image,
                    title: createIconText({ text: title }),
                    subtitleText: createIconText({ text: views }),
                }));
                collectedIds.push(id);
            }
        }
        return mangaTiles;
    }
    // UTILITY METHODS
    // Chapter sorting
    sortChapters(chapters) {
        let sortedChapters = chapters.filter((obj, index, arr) => arr.map((mapObj) => mapObj.id).indexOf(obj.id) === index);
        sortedChapters.sort((a, b) => (a.chapNum - b.chapNum ? -1 : 1));
        return sortedChapters;
    }
    getImageSrc(imageObj) {
        var _a;
        let hasDataSrc = typeof (imageObj === null || imageObj === void 0 ? void 0 : imageObj.attr("data-src")) != "undefined";
        let image = hasDataSrc ? imageObj === null || imageObj === void 0 ? void 0 : imageObj.attr("data-src") : imageObj === null || imageObj === void 0 ? void 0 : imageObj.attr("src");
        return (_a = image === null || image === void 0 ? void 0 : image.trim()) !== null && _a !== void 0 ? _a : "";
    }
    decodeHTMLEntity(str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }
    coverGuess(url, mangaId, source) {
        return (url.endsWith("no-image.png") == true) ? `${source.baseUrl}/uploads/manga/${mangaId}/cover/cover_250x350.jpg` : url;
    }
}
exports.Parser = Parser;

},{"paperback-extensions-common":4}],28:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Mmrcms"), exports);
__exportStar(require("./MmrcmsParser"), exports);

},{"./Mmrcms":26,"./MmrcmsParser":27}],29:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);

},{"./base":28,"./models":34}],30:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],31:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./SourceCategory"), exports);

},{"./SourceCategory":30}],32:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],33:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./SourceTag"), exports);

},{"./SourceTag":32}],34:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./SourceCategory"), exports);
__exportStar(require("./SourceTag"), exports);

},{"./SourceCategory":31,"./SourceTag":33}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mangazuki = exports.MangazukiInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const __1 = require("../..");
exports.MangazukiInfo = {
    version: "1.0.0",
    name: "Mangazuki",
    description: "Extension that pulls manga from mangazuki.co",
    author: "Ankah",
    authorWebsite: "https://github.com/adrienseon",
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: "https://mangazuki.co",
    sourceTags: [
        {
            text: "Notifications",
            type: paperback_extensions_common_1.TagType.GREEN,
        },
        {
            text: "Cloudflare",
            type: paperback_extensions_common_1.TagType.RED,
        },
    ],
};
class Mangazuki extends __1.Mmrcms {
    constructor() {
        super(...arguments);
        this.name = exports.MangazukiInfo.name;
        this.baseUrl = exports.MangazukiInfo.websiteBaseURL;
        this.languageCode = paperback_extensions_common_1.LanguageCode.ENGLISH;
        this.sourceTraversalPathName = "manga";
    }
}
exports.Mangazuki = Mangazuki;

},{"../..":29,"paperback-extensions-common":4}]},{},[35])(35)
});
