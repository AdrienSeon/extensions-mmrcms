import { Chapter,ChapterDetails,HomeSection,LanguageCode,Manga,MangaTile,MangaUpdates,PagedResults, RequestHeaders,SearchRequest,Source, TagSection } from "paperback-extensions-common"
import { Parser } from './MmrcmsParser';
import { SourceCategory, SourceTag, DateFormat } from "./models";

export abstract class Mmrcms extends Source {
    /**
     * The name of the mMRCMS source. Eg. Fallen Angels
     */
    abstract name: string;

    /**
     * The url of the mMRCMS source. Eg. https://www.scan-vf.net
     */
    abstract baseUrl: string;

    /**
     * The language code which this mMRCMS source supports.
     */
    abstract languageCode: LanguageCode;

    /**
     * The date format and days translation which this mMRCMS source uses.
     */
    abstract dateFormat: DateFormat;

    /**
     * Search endpoint for the source
     */
    sourceSearchUrl: string = "/search?query=";

    /**
     * The path that precedes a manga page not including the base url.
     * Eg. for https://submanga.io/manga/domestic-na-kanojo/ it would be 'manga'.
     * Used in all functions.
     */
    sourceTraversalPathName: string = "manga";

    /**
     * Is /latest-release page in list format (false if grid format)
     */
    latestIsInListFormat: boolean = true;

    /**
     * Cheerio selector for the manga link in /latest-release page in list format
     */
    latestListSelector: string = "a:first-of-type";

    /**
     * Cheerio selector for the list wrapper element in /filterList page
     */
    filterListElementsWrapper: string = "div[class^=col-sm], div.col-xs-6";
    /**
     * Array of corresponding ids and categories for this mMRCMS source.
     */
    sourceCategories: SourceCategory[] = [];

    /**
     * Array of corresponding ids and tags for this mMRCMS source.
     */
    sourceTags: SourceTag[] = [];

    /**
     * Helps with CloudFlare for some sources, makes it worse for others; override with empty string if the latter is true
     */
    userAgentRandomizer: string = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/78.0${Math.floor(Math.random() * 100000)}`;

    parser = new Parser();

    getMangaShareUrl(mangaId: string): string | null {
        return `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`;
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);

        return this.parser.parseMangaDetails($, mangaId, this);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);

        return this.parser.parseChapterList($, mangaId, this);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/${chapterId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);

        return this.parser.parseChapterDetails($, mangaId, chapterId, this);
    }

    async getTags(): Promise<TagSection[] | null> {
        return this.parser.parseTags(this);
    }

    async searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const sanitizedQuery: string = encodeURIComponent(query.title ?? "").replace(" ", "+");
        const request = createRequestObject({
            url: `${this.baseUrl}${this.sourceSearchUrl}${sanitizedQuery}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const mangaTiles = this.parser.parseSearchResults(JSON.parse(response.data), query, this);
        return createPagedResults({
            results: mangaTiles,
            metadata: undefined,
        });
    }

    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        const allMangas = new Set(ids);
        let page: number = 1;
        let loadNextPage = true;
        while (loadNextPage) {
            const request = createRequestObject({
                url: `${this.baseUrl}/latest-release?page=${page}`,
                method: "GET",
            });
            const response = await this.requestManager.schedule(request, 1);
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
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const collectedIds: Set<string> = new Set();
        const sections = [
            {
                request: createRequestObject({
                    url: `${this.baseUrl}/latest-release`,
                    method: "GET",
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
                }),
                section: createHomeSection({
                    id: "2_currenty_trending",
                    title: "CURRENTLY TRENDING",
                    view_more: true,
                }),
            },
        ];
        const promises: Promise<void>[] = [];
        for (const section of sections) {
            // Loading empty sections
            sectionCallback(section.section);
            // Populating section data
            promises.push(
                this.requestManager.schedule(section.request, 1).then((response) => {
                    this.CloudFlareError(response.status);
                    const $ = this.cheerio.load(response.data);
                    switch (section.section.id) {
                        case "1_recently_updated": {
                            section.section.items = this.parser.parseLatestRelease($, collectedIds, this);
                            break;
                        }
                        case "2_currenty_trending": {
                            section.section.items = this.parser.parseFilterList($, collectedIds, this);
                            break;
                        }
                        default:
                            console.log("getHomePageSections(): Invalid section ID");
                    }
                    sectionCallback(section.section);
                })
            );
        }
        // Make sure the function completes
        await Promise.all(promises);
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
        let mangaTiles: MangaTile[] = [];
        const collectedIds: Set<string> = new Set();
        // So that there is enough MangaTiles on the page to trigger the refresh when scrolling on big screens like ipads
        const minimumNumberOfTiles: number = 22; // Worst case scenario to have 4 lines of tiles on ipad
        while (mangaTiles.length < minimumNumberOfTiles && typeof metadata !== "undefined") {
            const page: number = metadata?.page ?? 1;
            let param: string = "";
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
                param,
            });
            const response = await this.requestManager.schedule(request, 1);
            this.CloudFlareError(response.status);
            const $ = this.cheerio.load(response.data);
            switch (homepageSectionId) {
                case "1_recently_updated": {
                    mangaTiles = mangaTiles.concat(this.parser.parseLatestRelease($, collectedIds, this));
                    break;
                }
                case "2_currenty_trending": {
                    mangaTiles = mangaTiles.concat(this.parser.parseFilterList($, collectedIds, this));
                    break;
                }
                default:
                    return Promise.resolve(null);
            }
            metadata = this.parser.isLastPage($) ? undefined : { page: page + 1 };
        }
        return createPagedResults({
            results: mangaTiles,
            metadata,
        });
    }

    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${this.baseUrl}`,
            method: "GET",
        });
    }

    globalRequestHeaders(): RequestHeaders {
        if (this.userAgentRandomizer !== "") {
            return {
                referer: `${this.baseUrl}/`,
                "user-agent": this.userAgentRandomizer,
                accept: "image/avif,image/apng,image/jpeg;q=0.9,image/png;q=0.9,image/*;q=0.8",
            };
        } else {
            return {
                referer: `${this.baseUrl}/`,
                accept: "image/avif,image/apng,image/jpeg;q=0.9,image/png;q=0.9,image/*;q=0.8",
            };
        }
    }

    CloudFlareError(status: any) {
        if (status === 503) {
            throw new Error("CLOUDFLARE BYPASS ERROR: Please go to Settings > Sources > <The name of this source> and press Cloudflare Bypass");
        }
    }
}
