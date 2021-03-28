import { Chapter, ChapterDetails, LanguageCode, Manga, MangaStatus, MangaTile, Tag, TagSection } from "paperback-extensions-common";

export class Parser {
    parseMangaDetails($: CheerioSelector, source: any, mangaId: string): Manga {
        // metadata names translated for each mmrcms source language
        const altTitesTranslation: string[] = ["autres noms", "otros nombres", "أسماء أخرى"];
        const authorTranslations: string[] = ["author(s)", "autor(es)", "auteur(s)", "著作", "yazar(lar)", "mangaka(lar)", "pengarang/penulis", "pengarang", "penulis", "autor", "المؤلف", "перевод", "autor/autorzy"];
        const artistTranslations: string[] = ["artist(s)", "artiste(s)", "sanatçi(lar)", "artista(s)", "artist(s)/ilustrator", "الرسام", "seniman", "rysownik/rysownicy"];
        const genreTranslations: string[] = ["categories", "Demográfico", "categorías", "catégories", "ジャンル", "kategoriler", "categorias", "kategorie", "التصنيفات", "жанр", "kategori", "tagi"];
        const tagsTranslations: string[] = ["tags", "género"];
        const statusTranslations: string[] = ["status", "statut", "estado", "状態", "durum", "الحالة", "статус"];
        const statusCompleteTranslations: string[] = ["complete", "مكتملة", "complet", "completo", "zakończone"];
        const statusOngoingTranslations: string[] = ["ongoing", "مستمرة", "en cours", "em lançamento", "prace w toku"];
        const descriptionTranslations: string[] = ["description", "resumen"];
        // Thumbnail
        const image: string = this.getThumbnailSrc($(".row [class^=img-responsive]").first().attr("src") ?? "", mangaId, source);
        // Rating
        const rating: number = Number(($("#item-rating").attr("data-score") ?? "0").replace(/\s+|\n+/g, " ").trim());
        // Description
        let desc: string = this.decodeHTMLEntity($(".row .well p").text().replace(/\s+|\n+/g, " ").trim());
        let titles: string[] = [];
        let author: string = "";
        let artist: string = "";
        let status: MangaStatus = MangaStatus.ONGOING;
        const genres: string[] = [];
        const tags: string[] = [];
        for (const element of $(".row .dl-horizontal dt").toArray()) {
            // Titles
            titles.push(this.decodeHTMLEntity($("h2.listmanga-header, h2.widget-title").first().text().replace(/\s+|\n+/g, " ").trim()));
            if (altTitesTranslation.includes($(element).text().trim().toLowerCase())) {
                for (const title of $(element).next().text().split(",")) {
                    titles.push(this.decodeHTMLEntity(title.replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Author
            if (authorTranslations.includes($(element).text().trim().toLowerCase())) author = this.decodeHTMLEntity($(element).next().text().replace(/\s+|\n+/g, " ").trim());
            // Artist
            if (artistTranslations.includes($(element).text().trim().toLowerCase())) artist = this.decodeHTMLEntity($(element).next().text().replace(/\s+|\n+/g, " ").trim());
            // Genres
            if (genreTranslations.includes($(element).text().trim().toLowerCase())) {
                for (const genreElement of $("a", $(element).next()).toArray()) {
                    genres.push(this.decodeHTMLEntity($(genreElement).text().replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Tags
            if (tagsTranslations.includes($(element).text().trim().toLowerCase())) {
                for (const tagElement of $("a", $(element).next()).toArray()) {
                    tags.push(this.decodeHTMLEntity($(tagElement).text().replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Status
            if (statusTranslations.includes($(element).text().trim().toLowerCase()) && statusOngoingTranslations.includes($(element).next().text().replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.ONGOING;
            if (statusTranslations.includes($(element).text().trim().toLowerCase()) &&statusCompleteTranslations.includes($(element).next().text().replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.COMPLETED;
        }
        // When details are in a .panel instead of .row (spanish sources)
        for (const element of $("div.panel span.list-group-item, div.panel div.panel-body h3").toArray()) {
            const metadata = $(element).text().split(":");
            // Titles
            if (altTitesTranslation.includes(metadata[0].trim().toLowerCase())) {
                for (const title of metadata[1].split(",")) {
                    titles.push(this.decodeHTMLEntity(title.replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Author
            if (authorTranslations.includes(metadata[0].trim().toLowerCase())) author = this.decodeHTMLEntity(metadata[1].replace(/\s+|\n+/g, " ").trim());
            // Artist
            if (artistTranslations.includes(metadata[0].trim().toLowerCase())) artist = this.decodeHTMLEntity(metadata[1].replace(/\s+|\n+/g, " ").trim());
            // Genres
            if (genreTranslations.includes(metadata[0].trim().toLowerCase())) {
                for (const genreElement of $("a", $(element)).toArray()) {
                    genres.push(this.decodeHTMLEntity($(genreElement).text().replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Tags
            if (tagsTranslations.includes(metadata[0].trim().toLowerCase())) {
                for (const tagElement of $("a", $(element)).toArray()) {
                    tags.push(this.decodeHTMLEntity($(tagElement).text().replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Status
            if (statusTranslations.includes(metadata[0].trim().toLowerCase()) && statusOngoingTranslations.includes(metadata[1].replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.ONGOING;
            if (statusTranslations.includes(metadata[0].trim().toLowerCase()) && statusCompleteTranslations.includes(metadata[1].replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.COMPLETED;
            // Description
            if (descriptionTranslations.includes($("b", $(element)).text().trim().toLowerCase())) desc = this.decodeHTMLEntity($(element).text().trim());
        }
        // Hentai
        const hentai: boolean = tags.includes("smut") || tags.includes("Smut");
        // Tags
        const genresTags: Tag[] = [];
        for (const genre of genres) {
            genresTags.push(createTag({ id: genre.toLowerCase(), label: genre }));
        }
        const tagsTags: Tag[] = [];
        for (const tag of tags) {
            tagsTags.push(createTag({ id: tag.toLowerCase(), label: tag }));
        }
        const tagSections: TagSection[] = [createTagSection({ id: "genres", label: "Genres", tags: genresTags }), createTagSection({ id: "tags", label: "Tags", tags: tagsTags })];

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
            // lastUpdate // TODO
        });
    }

    parseChapterList($: CheerioSelector, source: any, mangaId: string): Chapter[] {
        let chapters: Chapter[] = [];
        const chaptersWrapper = $("ul[class^=chapters] > li:not(.btn)");
        if (chaptersWrapper.length > 0) {
            for (const element of chaptersWrapper.toArray()) {
                const chapterNode = source.name === "Mangas.in" ? $("i .capitulo_enlace", $(element)).first() : $("[class^=chapter-title-rtl] a", $(element)).first();
                const url = $(chapterNode).first().attr("href") ?? "";
                const chapId: string = url.split("/").pop() ?? "";
                const releaseDate: Date = new Date(Date.parse($("[class^=date-chapter-title-rtl]", $(element)).text().replace(/\s+|\n+/g, " ").trim()));
                const chapNum: number = chapId.match(/\d+\.?\d+/g) ? Number(chapId.match(/\d+\.?\d+/g)![0]) : 0;
                const chapName: string = $("em", $(chapterNode).parent()).first().text().replace(/\s+|\n+/g, " ").trim();
                chapters.push(
                    createChapter({
                        id: chapId,
                        mangaId: mangaId,
                        langCode: source.languageCode ?? LanguageCode.UNKNOWN,
                        chapNum: Number.isNaN(chapNum) ? 0 : chapNum,
                        name: chapName ? chapName : "Chapter " + chapNum,
                        time: releaseDate,
                    })
                );
            }
        } else {
            for (const element of $("table.table tr").toArray()) {
                if ($("td", $(element)).text() !== "") {
                    const url = $("td a", $(element)).first().attr("href") ?? "";
                    const chapId: string = url.split("/").pop() ?? "";
                    const releaseDate: Date = new Date(Date.parse($(".glyphicon-time", $(element)).parent().text().replace(/\s+|\n+/g, " ").trim()));
                    const chapNum: number = chapId.match(/\d+\.?\d+/g) ? Number(chapId.match(/\d+\.?\d+/g)![0]) : 0;
                    const chapName: string = "Chapter " + chapNum;
                    chapters.push(
                        createChapter({
                            id: chapId,
                            mangaId: mangaId,
                            langCode: source.languageCode ?? LanguageCode.UNKNOWN,
                            chapNum: Number.isNaN(chapNum) ? 0 : chapNum,
                            name: chapName,
                            time: releaseDate,
                        })
                    );
                }
            }
        }
        return chapters;
    }

    parseChapterDetails($: CheerioSelector, source: any, mangaId: string, chapterId: string): ChapterDetails {
        let pages: string[] = [];
        for (const element of $("#all > .img-responsive").toArray()) {
            const url = this.getImageSrc($(element));
            if (url?.startsWith("//")) {
                pages.push(encodeURI(source.baseUrl.split("//")[0] + url));
            } else {
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

    parseTags(source: any): TagSection[] {
        const tags: Tag[] = [];
        for (const category of source.sourceCategories) {
            tags.push(createTag({ label: category.name, id: category.id }));
        }
        for (const tag of source.sourceTags) {
            tags.push(createTag({ label: tag.name, id: tag.id }));
        }
        return [createTagSection({ id: "0", label: "Tags", tags })];
    }

    parseSearchResults(data: any, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        const results = source.name === "Mangas.in" ? data : data.suggestions;
        for (const element of results) {
            const id = element.data;
            const title = element.value;
            const image = encodeURI(`${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`);
            mangaTiles.push(
                createMangaTile({
                    id: id,
                    title: title,
                    image: image,
                })
            );
        }
        return mangaTiles;
    }

    filterUpdatedMangaList($: CheerioSelector, source: any, time: Date, ids: string[]): { updates: string[]; loadNextPage: boolean } {
        let passedReferenceTime = false;
        let updatedManga: string[] = [];
        const context: Cheerio = $("div.mangalist");
        for (const element of $("div.manga-item", context).toArray()) {
            const id = ($(source.latestListSelector, $(element)).attr("href") ?? "").split("/").pop() ?? "";
            let mangaTime = this.convertTime($("[style=\"direction: ltr;\"]", $(element)).text().replace(/\s+|\n+/g, " ").trim());
            passedReferenceTime = mangaTime <= time;
            if (!passedReferenceTime) {
                if (ids.includes(id)) {
                    updatedManga.push(id);
                }
            }
            if (typeof id === "undefined") {
                throw `Failed to parse homepage sections for ${source.baseUrl}`;
            }
        }
        if (!passedReferenceTime) {
            return { updates: updatedManga, loadNextPage: true };
        } else {
            return { updates: updatedManga, loadNextPage: false };
        }
    }

    filterUpdatedMangaGrid($: CheerioSelector, source: any, time: Date, ids: string[]): { updates: string[]; loadNextPage: boolean } {
        let passedReferenceTime = false;
        let updatedManga: string[] = [];
        const context: Cheerio = $("div.mangalist, div.grid-manga, div#destacados");
        for (const element of $("div.manga-item", context).toArray()) {
            const id = ($("a.chart-title:first-of-type, .caption h3 a", $(element)).attr("href") ?? "").split("/").pop() ?? "";
            let mangaTime = this.convertTime($("[style=\"direction: ltr;\"]", $(element)).text().replace(/\s+|\n+/g, " ").trim());
            passedReferenceTime = mangaTime <= time;
            if (!passedReferenceTime) {
                if (ids.includes(id)) {
                    updatedManga.push(id);
                }
            }
            if (typeof id === "undefined") {
                throw `Failed to parse homepage sections for ${source.baseUrl}`;
            }
        }
        if (!passedReferenceTime) {
            return { updates: updatedManga, loadNextPage: true };
        } else {
            return { updates: updatedManga, loadNextPage: false };
        }
    }
    parseLatestRelease($: CheerioStatic, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        const collectedIds: string[] = [];
        return source.latestIsInListFormat ? this.parseLatestList($, source, collectedIds, mangaTiles) : this.parseLatestGrid($, source, collectedIds, mangaTiles);
    }

    private parseLatestList($: CheerioStatic, source: any, collectedIds: string[], mangaTiles: MangaTile[]) {
        const context: Cheerio = $("div.mangalist");
        let id: string = "";
        let image: string = "";
        let title: string = "";
        let chapter: string = "";
        for (const element of $("div.manga-item", context).toArray()) {
            id = ($(source.latestListSelector, $(element)).attr("href") ?? "").split("/").pop() ?? "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $(source.latestListSelector, $(element)).text().trim();
            chapter = "Chapter " + ($("h6.events-subtitle a", $(element)).text().replace(/\s+/g, " ").trim().match(/\d+\.?\d+/g) ?? [""])[0];
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

    private parseLatestGrid($: CheerioStatic, source: any, collectedIds: string[], mangaTiles: MangaTile[]) {
        const context: Cheerio = $("div.mangalist, div.grid-manga, div#destacados");
        let id: string = "";
        let image: string = "";
        let title: string = "";
        let chapter: string = "";
        for (const element of $("div.manga-item, div.thumbnail", context).toArray()) {
            id = ($("a.chart-title:first-of-type, .caption h3 a", $(element)).attr("href") ?? "").split("/").pop() ?? "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $("a.chart-title:first-of-type, .caption h3 a", $(element)).text().trim();
            chapter = "Chapter " + ($("div.media-body a:last-of-type, .caption p", $(element)).text().replace(/\s+/g, " ").trim().match(/\d+\.?\d+/g) ?? [""])[0];
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

    parseFilterList($: CheerioStatic, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        const collectedIds: string[] = [];
        let id: string = "";
        let image: string = "";
        let title: string = "";
        let views: string = "";
        for (const element of $(source.filterListElementsWrapper).toArray()) {
            // Id and title
            const idNode = $(".chart-title", $(element));
            if (idNode.length > 0) {
                id = (idNode.attr("href") ?? "").split("/").pop() ?? "";
                title = this.decodeHTMLEntity(idNode.text().replace(/\s+/g, " ").trim());
            } else {
                id = ($("a").attr("href") ?? "").split("/").pop() ?? "";
                const captionNode = $("div.caption", $(element));
                const captionNodeH3 = $("h3", captionNode);
                if (captionNodeH3.length > 0) {
                    title = this.decodeHTMLEntity(captionNodeH3.text()); // Submanga
                } else {
                    title = this.decodeHTMLEntity(captionNode.text().replace(/\s+/g, " ").trim()); // HentaiShark
                }
            }
            // Image
            const imageNode = $("img", $(element));
            if ((imageNode.attr("data-background-image") ?? "").length > 0) {
                image = imageNode.attr("data-background-image") ?? ""; // Utsukushii
            } else if ((imageNode.attr("data-src") ?? "").length > 0) {
                image = this.getThumbnailSrc(imageNode.attr("data-src") ?? "", id, source);
            } else {
                image = this.getThumbnailSrc(imageNode.attr("src") ?? "", id, source);
            }
            // Subtitle
            if (($("i.fa-eye", $(element)).parent().text() ?? "").length > 0) {
                views =
                    $("i.fa-eye", $(element))
                        .parent()
                        .text()
                        .replace(/\s+/g, " ")
                        .trim()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " views";
            } else {
                views = "";
            }
            // Push results
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

    isLastPage = ($: CheerioSelector, source: any): boolean => {
        return ($("ul.pagination").last().attr("class") === "disabled") ? true : false;
    }

    sortChapters(chapters: Chapter[]): Chapter[] {
        let sortedChapters = chapters.filter((obj, index, arr) => arr.map((mapObj) => mapObj.id).indexOf(obj.id) === index);
        sortedChapters.sort((a, b) => (a.chapNum - b.chapNum ? -1 : 1));
        return sortedChapters;
    }

    getImageSrc = (imageObj: Cheerio | undefined): string => {
        const hasDataSrc = typeof imageObj?.attr("data-src") != "undefined";
        const image = hasDataSrc ? imageObj?.attr("data-src") : imageObj?.attr("src");
        return image?.trim() ?? "";
    };

    decodeHTMLEntity(str: string): string {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }

    getThumbnailSrc(url: string, mangaId: string, source: any): string {
        if (url.endsWith("no-image.png") === true) return encodeURI(`${source.baseUrl}/uploads/manga/${mangaId}/cover/cover_250x350.jpg`);
        if (url.startsWith("//")) return encodeURI(source.baseUrl.split("//")[0] + url); // Eg. Fallen Angels
        return encodeURI(url);
    }

    protected convertTime(timeAgo: string): Date {
        if (timeAgo.toLowerCase().includes("today") || timeAgo.toLowerCase().includes("hoy") || timeAgo.toLowerCase().includes("aujourd'hui")) return new Date(new Date().setHours(0,0,0,0));
        if (timeAgo.toLowerCase().includes("yesterday") || timeAgo.toLowerCase().includes("ayer") || timeAgo.toLowerCase().includes("hier")) return new Date(Date.now() - 1 * 86400000);
        let trimmed: number = Number((/\d*/.exec(timeAgo) ?? [])[0]);
        trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
        if (timeAgo.includes('mins') || timeAgo.includes('minutes') || timeAgo.includes('minute')) return new Date(Date.now() - trimmed * 60000);
        if (timeAgo.includes('hours') || timeAgo.includes('hour')) return new Date(Date.now() - trimmed * 3600000);
        if (timeAgo.includes('days') || timeAgo.includes('day')) return new Date(Date.now() - trimmed * 86400000);
        if (timeAgo.includes('year') || timeAgo.includes('years')) return new Date(Date.now() - trimmed * 31556952000);
        return new Date(timeAgo)
    }
}
