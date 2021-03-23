import {
    Chapter,
    ChapterDetails,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    Tag,
    TagSection
} from "paperback-extensions-common";

export class Parser {
	parseMangaDetails($: CheerioSelector, mangaId: string): Manga {
		let numericId = $("a.wp-manga-action-button").attr("data-post");
		let title = this.decodeHTMLEntity($("div.post-title h1").first().text().replace(/NEW/, "").replace(/HOT/, "").replace("\\n", "").trim());
		let author = this.decodeHTMLEntity($("div.author-content").first().text().replace("\\n", "").trim()).replace("Updating", "Unknown");
		let artist = this.decodeHTMLEntity($("div.artist-content").first().text().replace("\\n", "").trim()).replace("Updating", "Unknown");
		let summary = this.decodeHTMLEntity($("div.description-summary").first().text()).replace("Show more", "").trim();
		let image = encodeURI(this.getImageSrc($("div.summary_image img").first()));
		let rating = $("span.total_votes").text().replace("Your Rating", "");
		let isOngoing = $("div.summary-content", $("div.post-content_item").last()).text().toLowerCase().trim() == "ongoing";
		let genres: Tag[] = [];
		let hentai = $(".manga-title-badges.adult").length > 0;

		// Grab genres and check for smut tag
		for (let obj of $("div.genres-content a").toArray()) {
			let label = $(obj).text();
			let id = $(obj).attr("href")?.split("/")[4] ?? label;
			if (label.toLowerCase().includes("smut")) hentai = true;
			genres.push(createTag({ label: label, id: id }));
		}
		let tagSections: TagSection[] = [createTagSection({ id: "0", label: "genres", tags: genres })];

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
			status: isOngoing ? MangaStatus.ONGOING : MangaStatus.COMPLETED,
			rating: Number(rating),
			hentai: hentai,
		});
	}

	parseChapterList($: CheerioSelector, mangaId: string, source: any): Chapter[] {
		let chapters: Chapter[] = [];

		// Capture the manga title, as this differs from the ID which this function is fed
		let realTitle = $("a", $("li.wp-manga-chapter  ").first())
			.attr("href")
			?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")
			.toLowerCase()
			.replace(/\/chapter.*/, "");

		if (!realTitle) {
			throw `Failed to parse the human-readable title for ${mangaId}`;
		}

		// For each available chapter..
		for (let obj of $("li.wp-manga-chapter  ").toArray()) {
			let id = ($("a", $(obj)).first().attr("href") || "").replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").replace(/\/$/, "");
			let chapNum = Number(
				$("a", $(obj))
					.first()
					.attr("href")
					?.toLowerCase()
					?.match(/chapter-\D*(\d*\.?\d*)/)
					?.pop()
			);
			let chapName = $("a", $(obj)).first().text();
			let releaseDate = $("i", $(obj)).length > 0 ? $("i", $(obj)).text() : $(".c-new-tag a", $(obj)).attr("title") ?? "";

			if (typeof id === "undefined") {
				throw `Could not parse out ID when getting chapters for ${mangaId}`;
			}
			chapters.push(
				createChapter({
					id: id,
					mangaId: mangaId,
					langCode: source.languageCode ?? LanguageCode.UNKNOWN,
					chapNum: Number.isNaN(chapNum) ? 0 : chapNum,
					name: Number.isNaN(chapNum) ? chapName : undefined,
					time: source.convertTime(releaseDate),
				})
			);
		}

		return this.sortChapters(chapters);
	}

	parseChapterDetails($: CheerioSelector, mangaId: string, chapterId: string): ChapterDetails {
		let pages: string[] = [];

		return createChapterDetails({
			id: chapterId,
			mangaId: mangaId,
			pages: pages,
			longStrip: false,
		});
	}

	parseTags($: CheerioSelector): TagSection[] {
		let genres: Tag[] = [];

		for (let obj of $(".menu-item-object-wp-manga-genre a", $(".second-menu")).toArray()) {
			let label = $(obj).text().trim();
			let id = $(obj).attr("href")?.split("/")[4] ?? label;
			genres.push(createTag({ label: label, id: id }));
		}

		return [createTagSection({ id: "0", label: "genres", tags: genres })];
	}

	parseSearchResults($: CheerioSelector, source: any): MangaTile[] {
		let results: MangaTile[] = [];
		for (let obj of $(source.searchMangaSelector).toArray()) {
			let id = ($("a", $(obj)).attr("href") ?? "").replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").replace(/\/$/, "");
			let title = createIconText({ text: this.decodeHTMLEntity($("a", $(obj)).attr("title") ?? "") });
			let image = encodeURI(this.getImageSrc($("img", $(obj))));

			if (!id || !image || !title.text) {
				if (id.includes(source.baseUrl.replace(/\/$/, ""))) continue;
				// Something went wrong with our parsing, return a detailed error
				throw `Failed to parse searchResult for ${source.baseUrl} using ${source.searchMangaSelector} as a loop selector`;
			}

			results.push(
				createMangaTile({
					id: id,
					title: title,
					image: image,
				})
			);
		}
		return results;
	}

	parseHomeSections($: CheerioStatic, source: any, sectionId: string): MangaTile[] {
		let mangaTiles: MangaTile[] = [];
        
		if (sectionId === "1_recently_updated") {
			mangaTiles = mangaTiles.concat(this.parseLatestRelease($, source));
		} else {
			mangaTiles = mangaTiles.concat(this.parseFilterList($, source));
		}

		return mangaTiles;
	}

	filterUpdatedManga($: CheerioSelector, time: Date, ids: string[], source: any): { updates: string[]; loadNextPage: boolean } {
		let passedReferenceTime = false;
		let updatedManga: string[] = [];

		for (let obj of $("div.page-item-detail").toArray()) {
			let id = $("a", $("h3.h5", obj)).attr("href")?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "").replace(/\/$/, "") ?? "";
			let mangaTime: Date;
			if ($(".c-new-tag a", obj).length > 0) {
				// Use blinking red NEW tag
				mangaTime = source.convertTime($(".c-new-tag a", obj).attr("title") ?? "");
			} else {
				// Use span
				mangaTime = source.convertTime($("span", $(".chapter-item", obj).first()).last().text() ?? "");
			}
			passedReferenceTime = mangaTime <= time;
			if (!passedReferenceTime) {
				if (ids.includes(id)) {
					updatedManga.push(id);
				}
			} else break;

			if (typeof id === "undefined") {
				throw `Failed to parse homepage sections for ${source.baseUrl}/${source.homePage}/`;
			}
		}
		if (!passedReferenceTime) {
			return { updates: updatedManga, loadNextPage: true };
		} else {
			return { updates: updatedManga, loadNextPage: false };
		}
	}

	private parseLatestRelease($: CheerioStatic, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        const collectedIds: string[] = [];
		const context = $("div.mangalist");
		let id: string = "";
		let image: string = "";
		let title: string = "";
		let chapter: string = "";
		for (const element of $("div.manga-item", context).toArray()) {
			id = ($("a", element).first().attr("href") ?? "").split("/").pop() ?? "";
			image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
			title = $("a", element).first().text().trim();
            chapter = "Chapter " + $(".manga-chapter a", element).text().trim();
            if (!collectedIds.includes(id)) {
                mangaTiles.push(
                    createMangaTile({
                        id,
                        image,
                        title: createIconText({ text: title }),
                        subtitleText: createIconText({ text: chapter }),
                    })
                );
                collectedIds.push(id);
            }
		}

		return mangaTiles;
	}

	private parseFilterList($: CheerioStatic, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        const collectedIds: string[] = [];
		let id: string = "";
		let image: string = "";
		let title: string = "";
		let views: string = "";
		for (const element of $(".media").toArray()) {
			id = ($("a.chart-title", element).attr("href") ?? "").split("/").pop() ?? "";
			image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
			title = $("a.chart-title", element).text().trim();
			views = $("i.fa-eye", element).parent().text().replace(/\s+/g, " ").trim().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " views";
            if (!collectedIds.includes(id)) {
                mangaTiles.push(
                    createMangaTile({
                        id,
                        image,
                        title: createIconText({ text: title }),
                        subtitleText: createIconText({ text: views }),
                    })
                );
                collectedIds.push(id);
            }
		}

		return mangaTiles;
	}

	// UTILITY METHODS

	// Chapter sorting
	sortChapters(chapters: Chapter[]): Chapter[] {
		let sortedChapters = chapters.filter((obj, index, arr) => arr.map((mapObj) => mapObj.id).indexOf(obj.id) === index);
		sortedChapters.sort((a, b) => (a.chapNum - b.chapNum ? -1 : 1));
		return sortedChapters;
	}

	getImageSrc(imageObj: Cheerio | undefined): string {
		let hasDataSrc = typeof imageObj?.attr("data-src") != "undefined";
		let image = hasDataSrc ? imageObj?.attr("data-src") : imageObj?.attr("src");
		return image?.trim() ?? "";
	}

	decodeHTMLEntity(str: string): string {
		return str.replace(/&#(\d+);/g, function (match, dec) {
			return String.fromCharCode(dec);
		});
	}
}
