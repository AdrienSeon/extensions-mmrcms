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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallenAngels = exports.FallenAngelsInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const __1 = require("..");
exports.FallenAngelsInfo = {
    version: "1.0.0",
    name: "Fallen Angels",
    description: "Extension that pulls manga from manga.fascans.com",
    author: "Ankah",
    authorWebsite: "https://github.com/adrienseon",
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: "https://manga.fascans.com",
    sourceTags: [
        {
            text: "Notifications",
            type: paperback_extensions_common_1.TagType.GREEN,
        },
    ],
};
class FallenAngels extends __1.Mmrcms {
    constructor() {
        super(...arguments);
        this.name = exports.FallenAngelsInfo.name;
        this.baseUrl = exports.FallenAngelsInfo.websiteBaseURL;
        this.languageCode = paperback_extensions_common_1.LanguageCode.ENGLISH;
        this.dateFormat = {
            format: "DD/MM/YYYY",
            todayTranslation: "today",
            yesterdayTranslation: "yesterday",
        };
        this.sourceCategories = [
            { id: "1", name: "Action" },
            { id: "2", name: "Adventure" },
            { id: "3", name: "Comedy" },
            { id: "4", name: "Doujinshi" },
            { id: "5", name: "Drama" },
            { id: "6", name: "Ecchi" },
            { id: "7", name: "Fantasy" },
            { id: "8", name: "Gender Bender" },
            { id: "9", name: "Harem" },
            { id: "10", name: "Historical" },
            { id: "11", name: "Horror" },
            { id: "12", name: "Josei" },
            { id: "13", name: "Martial Arts" },
            { id: "14", name: "Mature" },
            { id: "15", name: "Mecha" },
            { id: "16", name: "Mystery" },
            { id: "17", name: "One Shot" },
            { id: "18", name: "Psychological" },
            { id: "19", name: "Romance" },
            { id: "20", name: "School Life" },
            { id: "21", name: "Sci-fi" },
            { id: "22", name: "Seinen" },
            { id: "23", name: "Shoujo" },
            { id: "24", name: "Shoujo Ai" },
            { id: "25", name: "Shounen" },
            { id: "26", name: "Shounen Ai" },
            { id: "27", name: "Slice of Life" },
            { id: "28", name: "Sports" },
            { id: "29", name: "Supernatural" },
            { id: "30", name: "Tragedy" },
            { id: "31", name: "Yaoi" },
            { id: "32", name: "Yuri" },
            { id: "33", name: "4-Koma" },
            { id: "34", name: "Cooking" },
        ];
    }
}
exports.FallenAngels = FallenAngels;

},{"..":29,"paperback-extensions-common":4}],27:[function(require,module,exports){
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
         * Search endpoint for the source
         */
        this.sourceSearchUrl = "/search?query=";
        /**
         * The path that precedes a manga page not including the base url.
         * Eg. for https://submanga.io/manga/domestic-na-kanojo/ it would be 'manga'.
         * Used in all functions.
         */
        this.sourceTraversalPathName = "manga";
        /**
         * Is /latest-release page in list format (false if grid format)
         */
        this.latestIsInListFormat = true;
        /**
         * Cheerio selector for the manga link in /latest-release page in list format
         */
        this.latestListSelector = "a:first-of-type";
        /**
         * Cheerio selector for the list wrapper element in /filterList page
         */
        this.filterListElementsWrapper = "div[class^=col-sm], div.col-xs-6";
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
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseMangaDetails($, mangaId, this);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
                method: "GET",
                headers: this.constructHeaders({}),
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseChapterList($, mangaId, this);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/${chapterId}`,
                method: "GET",
                headers: this.constructHeaders({}),
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            return this.parser.parseChapterDetails($, mangaId, chapterId, this);
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.parser.parseTags(this);
        });
    }
    searchRequest(query, metadata) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizedQuery = encodeURIComponent((_a = query.title) !== null && _a !== void 0 ? _a : "").replace(" ", "+");
            const request = createRequestObject({
                url: `${this.baseUrl}${this.sourceSearchUrl}${sanitizedQuery}`,
                method: "GET",
                headers: this.constructHeaders({}),
            });
            const response = yield this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const json = response.data;
            const mangaTiles = this.parser.parseSearchResults(json, query, this);
            return createPagedResults({
                results: mangaTiles,
                metadata: undefined,
            });
        });
    }
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMangas = new Set(ids);
            let page = 1;
            let loadNextPage = true;
            while (loadNextPage) {
                const request = createRequestObject({
                    url: `${this.baseUrl}/latest-release?page=${page}`,
                    method: "GET",
                    headers: this.constructHeaders({}),
                });
                const response = yield this.requestManager.schedule(request, 1);
                this.CloudFlareError(response.status);
                const $ = this.cheerio.load(response.data);
                const updatedManga = this.latestIsInListFormat ? this.parser.filterUpdatedMangaList($, time, allMangas, this) : this.parser.filterUpdatedMangaGrid($, time, allMangas, this);
                loadNextPage = updatedManga.hasMore;
                if (loadNextPage) {
                    page++;
                }
                if (updatedManga.updates.length > 0) {
                    // If we found updates on this page, notify the app
                    // This is needed so that the app can save the updates
                    // in case the background job is killed by iOS
                    mangaUpdatesFoundCallback(createMangaUpdates({ ids: updatedManga.updates }));
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
                            console.log("getHomePageSections(): Invalid section ID");
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
            metadata = this.parser.isLastPage($) ? undefined : { page: page + 1 };
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

},{"./MmrcmsParser":28,"paperback-extensions-common":4}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
class Parser {
    constructor() {
        // UTILITY METHODS
        this.isLastPage = ($) => {
            return ($("ul.pagination").last().hasClass("disabled")) ? true : false;
        };
        this.getImageSrc = (imageObj) => {
            var _a;
            const hasDataSrc = typeof (imageObj === null || imageObj === void 0 ? void 0 : imageObj.attr("data-src")) != "undefined";
            const image = hasDataSrc ? imageObj === null || imageObj === void 0 ? void 0 : imageObj.attr("data-src") : imageObj === null || imageObj === void 0 ? void 0 : imageObj.attr("src");
            return (_a = image === null || image === void 0 ? void 0 : image.trim()) !== null && _a !== void 0 ? _a : "";
        };
    }
    parseMangaDetails($, mangaId, source) {
        var _a, _b;
        // metadata names translated for each mmrcms source language
        const altTitesTranslation = ["autres noms", "otros nombres", "أسماء أخرى"];
        const authorTranslations = ["author(s)", "autor(es)", "auteur(s)", "著作", "yazar(lar)", "mangaka(lar)", "pengarang/penulis", "pengarang", "penulis", "autor", "المؤلف", "перевод", "autor/autorzy"];
        const artistTranslations = ["artist(s)", "artiste(s)", "sanatçi(lar)", "artista(s)", "artist(s)/ilustrator", "الرسام", "seniman", "rysownik/rysownicy"];
        const genreTranslations = ["categories", "Demográfico", "categorías", "catégories", "ジャンル", "kategoriler", "categorias", "kategorie", "التصنيفات", "жанр", "kategori", "tagi"];
        const tagsTranslations = ["tags", "género"];
        const statusTranslations = ["status", "statut", "estado", "状態", "durum", "الحالة", "статус"];
        const statusCompleteTranslations = ["complete", "مكتملة", "complet", "completo", "zakończone"];
        const statusOngoingTranslations = ["ongoing", "مستمرة", "en cours", "em lançamento", "prace w toku"];
        const descriptionTranslations = ["description", "resumen"];
        // Thumbnail
        const image = this.getThumbnailSrc((_a = $(".row [class^=img-responsive]").first().attr("src")) !== null && _a !== void 0 ? _a : "", mangaId, source);
        // Rating
        const rating = Number(((_b = $("#item-rating").attr("data-score")) !== null && _b !== void 0 ? _b : "0").replace(/^\s+|\s+$/g, ""));
        // Description
        let desc = this.decodeHTMLEntity($(".row .well p").text().replace(/^\s+|\s+$/g, ""));
        let titles = [];
        let author = "Unknown";
        let artist = "Unknown";
        let status = paperback_extensions_common_1.MangaStatus.ONGOING;
        const genres = [];
        const tags = [];
        for (const element of $(".row .dl-horizontal dt").toArray()) {
            // Titles
            titles.push(this.decodeHTMLEntity($("h2.listmanga-header, h2.widget-title").first().text().replace(/^\s+|\s+$/g, "")));
            if (altTitesTranslation.includes($(element).text().trim().toLowerCase())) {
                for (const title of $(element).next().text().split(",")) {
                    titles.push(this.decodeHTMLEntity(title.replace(/^\s+|\s+$/g, "")));
                }
            }
            // Author
            if (authorTranslations.includes($(element).text().trim().toLowerCase()))
                author = this.decodeHTMLEntity($(element).next().text().replace(/^\s+|\s+$/g, ""));
            // Artist
            if (artistTranslations.includes($(element).text().trim().toLowerCase()))
                artist = this.decodeHTMLEntity($(element).next().text().replace(/^\s+|\s+$/g, ""));
            // Genres
            if (genreTranslations.includes($(element).text().trim().toLowerCase())) {
                for (const genreElement of $("a", $(element).next()).toArray()) {
                    genres.push(this.decodeHTMLEntity($(genreElement).text().replace(/^\s+|\s+$/g, "")));
                }
            }
            // Tags
            if (tagsTranslations.includes($(element).text().trim().toLowerCase())) {
                for (const tagElement of $("a", $(element).next()).toArray()) {
                    tags.push(this.decodeHTMLEntity($(tagElement).text().replace(/^\s+|\s+$/g, "")));
                }
            }
            // Status
            if (statusTranslations.includes($(element).text().trim().toLowerCase()) && statusOngoingTranslations.includes($(element).next().text().replace(/^\s+|\s+$/g, "").toLowerCase()))
                status = paperback_extensions_common_1.MangaStatus.ONGOING;
            if (statusTranslations.includes($(element).text().trim().toLowerCase()) && statusCompleteTranslations.includes($(element).next().text().replace(/^\s+|\s+$/g, "").toLowerCase()))
                status = paperback_extensions_common_1.MangaStatus.COMPLETED;
        }
        // When details are in a .panel instead of .row (spanish sources)
        for (const element of $("div.panel span.list-group-item, div.panel div.panel-body h3").toArray()) {
            const metadata = $(element).text().split(":");
            // Titles
            if (altTitesTranslation.includes(metadata[0].trim().toLowerCase())) {
                for (const title of metadata[1].split(",")) {
                    titles.push(this.decodeHTMLEntity(title.replace(/^\s+|\s+$/g, "")));
                }
            }
            // Author
            if (authorTranslations.includes(metadata[0].trim().toLowerCase()))
                author = this.decodeHTMLEntity(metadata[1].replace(/^\s+|\s+$/g, ""));
            // Artist
            if (artistTranslations.includes(metadata[0].trim().toLowerCase()))
                artist = this.decodeHTMLEntity(metadata[1].replace(/^\s+|\s+$/g, ""));
            // Genres
            if (genreTranslations.includes(metadata[0].trim().toLowerCase())) {
                for (const genreElement of $("a", $(element)).toArray()) {
                    genres.push(this.decodeHTMLEntity($(genreElement).text().replace(/^\s+|\s+$/g, "")));
                }
            }
            // Tags
            if (tagsTranslations.includes(metadata[0].trim().toLowerCase())) {
                for (const tagElement of $("a", $(element)).toArray()) {
                    tags.push(this.decodeHTMLEntity($(tagElement).text().replace(/^\s+|\s+$/g, "")));
                }
            }
            // Status
            if (statusTranslations.includes(metadata[0].trim().toLowerCase()) && statusOngoingTranslations.includes(metadata[1].replace(/^\s+|\s+$/g, "").toLowerCase()))
                status = paperback_extensions_common_1.MangaStatus.ONGOING;
            if (statusTranslations.includes(metadata[0].trim().toLowerCase()) && statusCompleteTranslations.includes(metadata[1].replace(/^\s+|\s+$/g, "").toLowerCase()))
                status = paperback_extensions_common_1.MangaStatus.COMPLETED;
            // Description
            if (descriptionTranslations.includes($("b", $(element)).text().trim().toLowerCase()))
                desc = this.decodeHTMLEntity($(element).text().trim());
        }
        // Hentai
        const hentai = tags.includes("smut") || tags.includes("Smut");
        // Tags
        const genresTags = [];
        for (const genre of genres) {
            genresTags.push(createTag({ id: genre.toLowerCase(), label: genre }));
        }
        const tagsTags = [];
        for (const tag of tags) {
            tagsTags.push(createTag({ id: tag.toLowerCase(), label: tag }));
        }
        const tagSections = [createTagSection({ id: "genres", label: "Genres", tags: genresTags }), createTagSection({ id: "tags", label: "Tags", tags: tagsTags })];
        // Last update
        let lastUpdate = undefined;
        if ($("ul[class^=chapters] > li:not(.btn)").length > 0)
            lastUpdate = new Date(Date.parse($("[class^=date-chapter-title-rtl]", $("ul[class^=chapters] > li:not(.btn)").first()).text().replace(/^\s+|\s+$/g, ""))).toString();
        if ($("table.table tr").length > 0)
            lastUpdate = new Date(Date.parse($(".glyphicon-time", $("table.table tr").first()).parent().text().replace(/^\s+|\s+$/g, ""))).toString();
        return createManga({
            id: mangaId,
            titles,
            image,
            author,
            artist,
            tags: tagSections,
            desc,
            status,
            rating,
            hentai,
            lastUpdate,
        });
    }
    parseChapterList($, mangaId, source) {
        var _a, _b, _c, _d, _e, _f;
        let chapters = [];
        const chaptersWrapper = $("ul[class^=chapters] > li:not(.btn)");
        if (chaptersWrapper.length > 0) {
            for (const element of chaptersWrapper.toArray().reverse()) {
                const chapterNode = source.name === "Mangas.in" ? $("i .capitulo_enlace", $(element)).first() : $("[class^=chapter-title-rtl] a", $(element)).first();
                const url = (_a = $(chapterNode).first().attr("href")) !== null && _a !== void 0 ? _a : "";
                const chapId = (_b = url.split("/").pop()) !== null && _b !== void 0 ? _b : "";
                const releaseDate = new Date(Date.parse($("[class^=date-chapter-title-rtl]", $(element)).text().replace(/^\s+|\s+$/g, "")));
                const chapNum = chapId.match(/\d+\.?\d+/g) ? Number(chapId.match(/\d+\.?\d+/g)[0]) : 0;
                const chapName = $("em", $(chapterNode).parent()).first().text().replace(/^\s+|\s+$/g, "");
                chapters.push(createChapter({
                    id: chapId,
                    mangaId: mangaId,
                    langCode: (_c = source.languageCode) !== null && _c !== void 0 ? _c : paperback_extensions_common_1.LanguageCode.UNKNOWN,
                    chapNum: Number.isNaN(chapNum) ? 0 : chapNum,
                    name: chapName ? chapName : "Chapter " + chapNum,
                    time: releaseDate,
                }));
            }
        }
        else {
            for (const element of $("table.table tr").toArray().reverse()) {
                if ($("td", $(element)).text() !== "") {
                    const url = (_d = $("td a", $(element)).first().attr("href")) !== null && _d !== void 0 ? _d : "";
                    const chapId = (_e = url.split("/").pop()) !== null && _e !== void 0 ? _e : "";
                    const releaseDate = new Date(Date.parse($(".glyphicon-time", $(element)).parent().text().replace(/^\s+|\s+$/g, "")));
                    const chapNum = chapId.match(/\d+\.?\d+/g) ? Number(chapId.match(/\d+\.?\d+/g)[0]) : 0;
                    const chapName = "Chapter " + chapNum;
                    chapters.push(createChapter({
                        id: chapId,
                        mangaId: mangaId,
                        langCode: (_f = source.languageCode) !== null && _f !== void 0 ? _f : paperback_extensions_common_1.LanguageCode.UNKNOWN,
                        chapNum: Number.isNaN(chapNum) ? 0 : chapNum,
                        name: chapName,
                        time: releaseDate,
                    }));
                }
            }
        }
        return chapters;
    }
    parseChapterDetails($, mangaId, chapterId, source) {
        let pages = [];
        for (const element of $("#all > .img-responsive").toArray()) {
            const url = this.getImageSrc($(element));
            if (url === null || url === void 0 ? void 0 : url.startsWith("//")) {
                pages.push(encodeURI(source.baseUrl.split("//")[0] + url));
            }
            else {
                pages.push(encodeURI(url));
            }
        }
        return createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
            longStrip: false,
        });
    }
    parseTags(source) {
        const genresTags = [];
        const tagsTags = [];
        for (const category of source.sourceCategories) {
            genresTags.push(createTag({ label: category.name, id: category.id }));
        }
        for (const tag of source.sourceTags) {
            tagsTags.push(createTag({ label: tag.name, id: tag.id }));
        }
        return [
            createTagSection({ id: "genres", label: "Genres", tags: genresTags }),
            createTagSection({ id: "tags", label: "Tags", tags: tagsTags })
        ];
    }
    parseSearchResults(data, query, source) {
        var _a;
        const mangaTiles = [];
        const results = source.name === "Mangas.in" ? data : data.suggestions;
        for (const element of results) {
            if ((element.value).toLowerCase().includes(((_a = query.title) !== null && _a !== void 0 ? _a : "").toLowerCase())) {
                const id = element.data;
                const title = element.value;
                const image = encodeURI(`${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`);
                mangaTiles.push(createMangaTile({
                    id: id,
                    title: title,
                    image: image,
                }));
            }
        }
        return mangaTiles;
    }
    filterUpdatedMangaList($, referenceTime, allMangas, source) {
        var _a, _b;
        const updatedMangas = [];
        const context = $("div.mangalist");
        for (const element of $("div.manga-item", context).toArray()) {
            const id = (_b = ((_a = $(source.latestListSelector, $(element)).attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
            const mangaDate = this.convertTime($("[style=\"direction: ltr;\"]", $(element)).text().replace(/^\s+|\s+$/g, ""), source);
            if (mangaDate >= referenceTime) {
                if (allMangas.has(id)) {
                    updatedMangas.push(id);
                }
            }
            else {
                return { updates: updatedMangas, hasMore: false };
            }
        }
        return { updates: updatedMangas, hasMore: true };
    }
    filterUpdatedMangaGrid($, referenceTime, allMangas, source) {
        var _a, _b;
        const updatedMangas = [];
        const context = $("div.mangalist, div.grid-manga, div#destacados");
        for (const element of $("div.manga-item, div.thumbnail", context).toArray()) {
            const id = (_b = ((_a = $("a.chart-title:first-of-type, .caption h3 a", $(element)).attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
            const mangaDate = this.convertTime($("[style=\"direction: ltr;\"]", $(element)).text().replace(/^\s+|\s+$/g, ""), source);
            if (mangaDate >= referenceTime) {
                if (allMangas.has(id)) {
                    updatedMangas.push(id);
                }
            }
            else {
                return { updates: updatedMangas, hasMore: false };
            }
        }
        return { updates: updatedMangas, hasMore: true };
    }
    parseLatestRelease($, source) {
        const mangaTiles = [];
        const collectedIds = new Set;
        return source.latestIsInListFormat ? this.parseLatestList($, collectedIds, mangaTiles, source) : this.parseLatestGrid($, collectedIds, mangaTiles, source);
    }
    parseLatestList($, collectedIds, mangaTiles, source) {
        var _a, _b, _c;
        const context = $("div.mangalist");
        let id = "";
        let image = "";
        let title = "";
        let chapter = "";
        for (const element of $("div.manga-item", context).toArray()) {
            id = (_b = ((_a = $(source.latestListSelector, $(element)).attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $(source.latestListSelector, $(element)).text().trim();
            chapter = "Chapter " + ((_c = $("h6.events-subtitle a", $(element)).text().replace(/\s+/g, " ").trim().match(/\d+\.?\d+/g)) !== null && _c !== void 0 ? _c : [""])[0];
            if (!collectedIds.has(id)) {
                mangaTiles.push(createMangaTile({
                    id,
                    image,
                    title: createIconText({ text: title }),
                    subtitleText: createIconText({ text: chapter }),
                }));
                collectedIds.add(id);
            }
        }
        return mangaTiles;
    }
    parseLatestGrid($, collectedIds, mangaTiles, source) {
        var _a, _b, _c;
        const context = $("div.mangalist, div.grid-manga, div#destacados");
        let id = "";
        let image = "";
        let title = "";
        let chapter = "";
        for (const element of $("div.manga-item, div.thumbnail", context).toArray()) {
            id = (_b = ((_a = $("a.chart-title:first-of-type, .caption h3 a", $(element)).attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $("a.chart-title:first-of-type, .caption h3 a", $(element)).text().trim();
            chapter = "Chapter " + ((_c = $("div.media-body a:last-of-type, .caption p", $(element)).text().replace(/\s+/g, " ").trim().match(/\d+\.?\d+/g)) !== null && _c !== void 0 ? _c : [""])[0];
            if (!collectedIds.has(id)) {
                mangaTiles.push(createMangaTile({
                    id,
                    image,
                    title: createIconText({ text: title }),
                    subtitleText: createIconText({ text: chapter }),
                }));
                collectedIds.add(id);
            }
        }
        return mangaTiles;
    }
    parseFilterList($, source) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const mangaTiles = [];
        const collectedIds = new Set;
        let id = "";
        let image = "";
        let title = "";
        let views = "";
        for (const element of $(source.filterListElementsWrapper).toArray()) {
            // Id and title
            const idNode = $(".chart-title", $(element));
            if (idNode.length > 0) {
                id = (_b = ((_a = idNode.attr("href")) !== null && _a !== void 0 ? _a : "").split("/").pop()) !== null && _b !== void 0 ? _b : "";
                title = this.decodeHTMLEntity(idNode.text().replace(/\s+/g, " ").trim());
            }
            else {
                id = (_d = ((_c = $("a").attr("href")) !== null && _c !== void 0 ? _c : "").split("/").pop()) !== null && _d !== void 0 ? _d : "";
                const captionNode = $("div.caption", $(element));
                const captionNodeH3 = $("h3", captionNode);
                if (captionNodeH3.length > 0) {
                    title = this.decodeHTMLEntity(captionNodeH3.text()); // Submanga
                }
                else {
                    title = this.decodeHTMLEntity(captionNode.text().replace(/\s+/g, " ").trim()); // HentaiShark
                }
            }
            // Image
            const imageNode = $("img", $(element));
            if (((_e = imageNode.attr("data-background-image")) !== null && _e !== void 0 ? _e : "").length > 0) {
                image = (_f = imageNode.attr("data-background-image")) !== null && _f !== void 0 ? _f : ""; // Utsukushii
            }
            else if (((_g = imageNode.attr("data-src")) !== null && _g !== void 0 ? _g : "").length > 0) {
                image = this.getThumbnailSrc((_h = imageNode.attr("data-src")) !== null && _h !== void 0 ? _h : "", id, source);
            }
            else {
                image = this.getThumbnailSrc((_j = imageNode.attr("src")) !== null && _j !== void 0 ? _j : "", id, source);
            }
            // Subtitle
            if (((_k = $("i.fa-eye", $(element)).parent().text()) !== null && _k !== void 0 ? _k : "").length > 0) {
                views =
                    $("i.fa-eye", $(element))
                        .parent()
                        .text()
                        .replace(/\s+/g, " ")
                        .trim()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " views";
            }
            else {
                views = "";
            }
            // Push results
            if (!collectedIds.has(id)) {
                mangaTiles.push(createMangaTile({
                    id,
                    image,
                    title: createIconText({ text: title }),
                    subtitleText: createIconText({ text: views }),
                }));
                collectedIds.add(id);
            }
        }
        return mangaTiles;
    }
    decodeHTMLEntity(str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }
    getThumbnailSrc(url, mangaId, source) {
        if (url.endsWith("no-image.png") === true)
            return encodeURI(`${source.baseUrl}/uploads/manga/${mangaId}/cover/cover_250x350.jpg`);
        if (url.startsWith("//"))
            return encodeURI(source.baseUrl.split("//")[0] + url); // Eg. Fallen Angels
        return encodeURI(url);
    }
    convertTime(time, source) {
        var _a;
        // Time ago format
        if (source.dateFormat.format === "timeAgo") {
            let trimmed = Number(((_a = /\d*/.exec(time)) !== null && _a !== void 0 ? _a : [])[0]);
            trimmed = trimmed == 0 && time.includes("a") ? 1 : trimmed;
            if (time.includes("mins") || time.includes("minutes") || time.includes("minute"))
                return new Date(Date.now() - trimmed * 60000);
            if (time.includes("hours") || time.includes("hour"))
                return new Date(Date.now() - trimmed * 3600000);
            if (time.includes("days") || time.includes("day"))
                return new Date(Date.now() - trimmed * 86400000);
            if (time.includes("years") || time.includes("year"))
                return new Date(Date.now() - trimmed * 31556952000);
            return new Date(time);
        }
        if (time.toLowerCase() === source.dateFormat.todayTranslation)
            return new Date(new Date().setHours(0, 0, 0, 0));
        if (time.toLowerCase() === source.dateFormat.yesterdayTranslation)
            return new Date(Date.now() - 1 * 86400000);
        // Rest of the world format
        const dateToParse = time.split("/");
        if (source.dateFormat.format === "DD/MM/YYYY")
            return new Date(Date.parse(dateToParse[2] + "/" + dateToParse[1] + "/" + dateToParse[0]));
        // Muricans format
        return new Date(Date.parse(time));
    }
}
exports.Parser = Parser;

},{"paperback-extensions-common":4}],29:[function(require,module,exports){
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
__exportStar(require("./models"), exports);

},{"./Mmrcms":27,"./models":33}],30:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],31:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],32:[function(require,module,exports){
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
__exportStar(require("./SourceCategory"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./DateFormat"), exports);

},{"./DateFormat":30,"./SourceCategory":31,"./SourceTag":32}]},{},[26])(26)
});
