import { Chapter, ChapterDetails, LanguageCode, Manga, MangaStatus, MangaTile, SearchRequest, Tag, TagSection } from "paperback-extensions-common";

export class Parser {
    parseMangaDetails($: CheerioSelector, mangaId: string, source: any): Manga {
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
        const rating: number = Number(($("#item-rating").attr("data-score") ?? "0").replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim());
        // Description
        let desc: string = this.decodeHTMLEntity($(".row .well p").text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim());
        let titles: string[] = [];
        let author: string = "Unknown";
        let artist: string = "Unknown";
        let status: MangaStatus = MangaStatus.ONGOING;
        const genres: string[] = [];
        const tags: string[] = [];
        for (const element of $(".row .dl-horizontal dt").toArray()) {
            // Titles
            titles.push(this.decodeHTMLEntity($("h2.listmanga-header, h2.widget-title").first().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
            if (altTitesTranslation.includes($(element).text().trim().toLowerCase())) {
                for (const title of $(element).next().text().split(",")) {
                    titles.push(this.decodeHTMLEntity(title.replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Author
            if (authorTranslations.includes($(element).text().trim().toLowerCase())) author = this.decodeHTMLEntity($(element).next().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim());
            // Artist
            if (artistTranslations.includes($(element).text().trim().toLowerCase())) artist = this.decodeHTMLEntity($(element).next().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim());
            // Genres
            if (genreTranslations.includes($(element).text().trim().toLowerCase())) {
                for (const genreElement of $("a", $(element).next()).toArray()) {
                    genres.push(this.decodeHTMLEntity($(genreElement).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Tags
            if (tagsTranslations.includes($(element).text().trim().toLowerCase())) {
                for (const tagElement of $("a", $(element).next()).toArray()) {
                    tags.push(this.decodeHTMLEntity($(tagElement).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Status
            if (statusTranslations.includes($(element).text().trim().toLowerCase()) && statusOngoingTranslations.includes($(element).next().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.ONGOING;
            if (statusTranslations.includes($(element).text().trim().toLowerCase()) && statusCompleteTranslations.includes($(element).next().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.COMPLETED;
        }
        // When details are in a .panel instead of .row (spanish sources)
        for (const element of $("div.panel span.list-group-item, div.panel div.panel-body h3").toArray()) {
            const metadata = $(element).text().split(":");
            // Titles
            if (altTitesTranslation.includes(metadata[0].trim().toLowerCase())) {
                for (const title of metadata[1].split(",")) {
                    titles.push(this.decodeHTMLEntity(title.replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Author .replace(/\s+|\n+/g, " ") .replace(/^\s+|\s+$/g, "")
            if (authorTranslations.includes(metadata[0].trim().toLowerCase())) author = this.decodeHTMLEntity(metadata[1].replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim());
            // Artist
            if (artistTranslations.includes(metadata[0].trim().toLowerCase())) artist = this.decodeHTMLEntity(metadata[1].replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim());
            // Genres
            if (genreTranslations.includes(metadata[0].trim().toLowerCase())) {
                for (const genreElement of $("a", $(element)).toArray()) {
                    genres.push(this.decodeHTMLEntity($(genreElement).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Tags
            if (tagsTranslations.includes(metadata[0].trim().toLowerCase())) {
                for (const tagElement of $("a", $(element)).toArray()) {
                    tags.push(this.decodeHTMLEntity($(tagElement).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                }
            }
            // Status
            if (statusTranslations.includes(metadata[0].trim().toLowerCase()) && statusOngoingTranslations.includes(metadata[1].replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.ONGOING;
            if (statusTranslations.includes(metadata[0].trim().toLowerCase()) && statusCompleteTranslations.includes(metadata[1].replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim().toLowerCase())) status = MangaStatus.COMPLETED;
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
        // Last update
        let lastUpdate: string | undefined = undefined
        if ($("ul[class^=chapters] > li:not(.btn)").length > 0) lastUpdate = new Date(Date.parse($("[class^=date-chapter-title-rtl]", $("ul[class^=chapters] > li:not(.btn)").first()).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim())).toString();
        if ($("table.table tr").length > 0) lastUpdate = new Date(Date.parse($(".glyphicon-time", $("table.table tr").first()).parent().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim())).toString();

        if (!titles || !status) throw new Error("An error occured while parsing the requested manga");

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

    parseChapterList($: CheerioSelector, mangaId: string, source: any): Chapter[] {
        let chapters: Chapter[] = [];
        const chaptersWrapper = $("ul[class^=chapters] > li:not(.btn)");
        if (chaptersWrapper.length > 0) {
            for (const element of chaptersWrapper.toArray().reverse()) {
                const chapterNode = source.name === "Mangas.in" ? $("i .capitulo_enlace", $(element)).first() : $("[class^=chapter-title-rtl] a", $(element)).first();
                const url = $(chapterNode).first().attr("href") ?? "";
                const chapId: string = url.split("/").pop() ?? "";
                const releaseDate: Date = new Date(Date.parse($("[class^=date-chapter-title-rtl]", $(element)).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
                const chapNum: number = chapId.match(/\d+\.?\d+/g) ? Number(chapId.match(/\d+\.?\d+/g)![0]) : 0;
                const chapName: string = $("em", $(chapterNode).parent()).first().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim();
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
            for (const element of $("table.table tr").toArray().reverse()) {
                if ($("td", $(element)).text() !== "") {
                    const url = $("td a", $(element)).first().attr("href") ?? "";
                    const chapId: string = url.split("/").pop() ?? "";
                    const releaseDate: Date = new Date(Date.parse($(".glyphicon-time", $(element)).parent().text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim()));
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

    parseChapterDetails($: CheerioSelector, mangaId: string, chapterId: string, source: any): ChapterDetails {
        let pages: string[] = [];
        for (const element of $("#all > .img-responsive").toArray()) {
            const url = this.getImageSrc($(element));
            if (url?.startsWith("//")) {
                pages.push(encodeURI(source.baseUrl.split("//")[0] + url));
            } else {
                pages.push(encodeURI(url));
            }
        }

        if (!pages) throw new Error("An error occured while parsing pages for this chapter");

        return createChapterDetails({
            id: chapterId,
            mangaId,
            pages,
            longStrip: false,
        });
    }

    parseTags(source: any): TagSection[] {
        const genresTags: Tag[] = [];
        const tagsTags: Tag[] = [];
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

    parseSearchResults(data: any, query: SearchRequest, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        const results = source.name === "Mangas.in" ? data : data.suggestions;
        for (const element of results) {
            if ((element.value).toLowerCase().includes((query.title ?? "").toLowerCase())) {
                const id = element.data;
                const title = element.value;
                const image = encodeURI(`${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`);
                if (!id || !title) continue;
                mangaTiles.push(
                    createMangaTile({
                        id: id,
                        title: title,
                        image: image,
                    })
                );
            }
        }
        return mangaTiles;
    }

    filterUpdatedMangaList($: CheerioSelector, referenceTime: Date, allMangas: Set<string>, source: any): { updates: string[]; hasMore: boolean } {
        const updatedMangas: string[] = [];
        const context: Cheerio = $("div.mangalist");
        for (const element of $("div.manga-item", context).toArray()) {
            const id = ($(source.latestListSelector, $(element)).attr("href") ?? "").split("/").pop() ?? "";
            const mangaDate = this.convertTime($("[style=\"direction: ltr;\"]", $(element)).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim(), source);
            if (mangaDate >= referenceTime) {
                if (allMangas.has(id)) {
                    updatedMangas.push(id);
                }
            } else {
                return { updates: updatedMangas, hasMore: false };
            }
        }
        return { updates: updatedMangas, hasMore: true };
    }

    filterUpdatedMangaGrid($: CheerioSelector, referenceTime: Date, allMangas: Set<string>, source: any): { updates: string[]; hasMore: boolean } {
        const updatedMangas: string[] = [];
        const context: Cheerio = $("div.mangalist, div.grid-manga, div#destacados");
        for (const element of $("div.manga-item, div.thumbnail", context).toArray()) {
            const id = ($("a.chart-title:first-of-type, .caption h3 a", $(element)).attr("href") ?? "").split("/").pop() ?? "";
            const mangaDate = this.convertTime($("[style=\"direction: ltr;\"]", $(element)).text().replace(/\s+|\n+/g, " ").replace(/\s+|\n+/g, " ").trim(), source);
            if (mangaDate >= referenceTime) {
                if (allMangas.has(id)) {
                    updatedMangas.push(id);
                }
            } else {
                return { updates: updatedMangas, hasMore: false };
            }
        }
        return { updates: updatedMangas, hasMore: true };
    }

    parseLatestRelease($: CheerioStatic, collectedIds: Set<string>, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        return source.latestIsInListFormat ? this.parseLatestList($, collectedIds, mangaTiles, source) : this.parseLatestGrid($, collectedIds, mangaTiles, source);
    }

    private parseLatestList($: CheerioStatic, collectedIds: Set<string>, mangaTiles: MangaTile[], source: any) {
        const context: Cheerio = $("div.mangalist");
        let id: string = "";
        let image: string = "";
        let title: string = "";
        let chapter: string = "";
        for (const element of $("div.manga-item", context).toArray()) {
            id = ($(source.latestListSelector, $(element)).attr("href") ?? "").split("/").pop() ?? "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $(source.latestListSelector, $(element)).text().trim() ?? "";
            chapter = "Chapter " + ($("h6.events-subtitle a", $(element)).text().replace(/\s+/g, " ").trim().match(/\d+\.?\d+/g) ?? [""])[0];
            if (!id || !title) continue;
            if (!collectedIds.has(id)) {
                mangaTiles.push(
                    createMangaTile({
                        id,
                        image,
                        title: createIconText({ text: title }),
                        subtitleText: createIconText({ text: chapter }),
                    })
                );
                collectedIds.add(id);
            }
        }
        return mangaTiles;
    }

    private parseLatestGrid($: CheerioStatic, collectedIds: Set<string>, mangaTiles: MangaTile[], source: any) {
        const context: Cheerio = $("div.mangalist, div.grid-manga, div#destacados");
        let id: string = "";
        let image: string = "";
        let title: string = "";
        let chapter: string = "";
        for (const element of $("div.manga-item, div.thumbnail", context).toArray()) {
            id = ($("a.chart-title:first-of-type, .caption h3 a", $(element)).attr("href") ?? "").split("/").pop() ?? "";
            image = `${source.baseUrl}/uploads/manga/${id}/cover/cover_250x350.jpg`;
            title = $("a.chart-title:first-of-type, .caption h3 a", $(element)).text().trim() ?? "";
            chapter = "Chapter " + ($("div.media-body a:last-of-type, .caption p", $(element)).text().replace(/\s+/g, " ").trim().match(/\d+\.?\d+/g) ?? [""])[0];
            if (!id || !title) continue;
            if (!collectedIds.has(id)) {
                mangaTiles.push(
                    createMangaTile({
                        id,
                        image,
                        title: createIconText({ text: title }),
                        subtitleText: createIconText({ text: chapter }),
                    })
                );
                collectedIds.add(id);
            }
        }
        return mangaTiles;
    }

    parseFilterList($: CheerioStatic, collectedIds: Set<string>, source: any): MangaTile[] {
        const mangaTiles: MangaTile[] = [];
        let id: string = "";
        let image: string = "";
        let title: string = "";
        let views: string = "";
        for (const element of $(source.filterListElementsWrapper).toArray()) {
            // Id and title
            const idNode = $(".chart-title", $(element));
            if (idNode.length > 0) {
                id = (idNode.attr("href") ?? "").split("/").pop() ?? "";
                title = this.decodeHTMLEntity(idNode.text().replace(/\s+/g, " ").trim()) ?? "";
            } else {
                id = ($("a").attr("href") ?? "").split("/").pop() ?? "";
                const captionNode = $("div.caption", $(element));
                const captionNodeH3 = $("h3", captionNode);
                if (captionNodeH3.length > 0) {
                    title = this.decodeHTMLEntity(captionNodeH3.text()) ?? ""; // Submanga
                } else {
                    title = this.decodeHTMLEntity(captionNode.text().replace(/\s+/g, " ").trim()) ?? ""; // HentaiShark
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
                views = $("i.fa-eye", $(element)).parent().text().replace(/\s+/g, " ").trim().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " views";
            } else {
                views = "";
            }
            // Push results
            if (!id || !title) continue;
            if (!collectedIds.has(id)) {
                mangaTiles.push(
                    createMangaTile({
                        id,
                        image,
                        title: createIconText({ text: title }),
                        subtitleText: createIconText({ text: views }),
                    })
                );
                collectedIds.add(id);
            }
        }
        return mangaTiles;
    }

    // UTILITY METHODS

    isLastPage = ($: CheerioSelector): boolean => {
        return ($("ul.pagination").last().hasClass("disabled")) ? true : false;
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

    convertTime(time: string, source: any): Date {
        // Time ago format
        if (source.dateFormat.format=== "timeAgo") {
            let trimmed: number = Number((/\d*/.exec(time) ?? [])[0]);
            trimmed = trimmed == 0 && time.includes("a") ? 1 : trimmed;
            if (time.includes("mins") || time.includes("minutes") || time.includes("minute")) return new Date(Date.now() - trimmed * 60000);
            if (time.includes("hours") || time.includes("hour")) return new Date(Date.now() - trimmed * 3600000);
            if (time.includes("days") || time.includes("day")) return new Date(Date.now() - trimmed * 86400000);
            if (time.includes("years") || time.includes("year")) return new Date(Date.now() - trimmed * 31556952000);
            return new Date(time);
        }
        if (time.toLowerCase() === source.dateFormat.todayTranslation) return new Date(new Date().setHours(0,0,0,0));
        if (time.toLowerCase() === source.dateFormat.yesterdayTranslation) return new Date(Date.now() - 1 * 86400000);
        // Rest of the world format
        const dateToParse = time.split("/");
        if (source.dateFormat.format === "DD/MM/YYYY") return new Date(Date.parse(dateToParse[2] + "/" + dateToParse[1] + "/" + dateToParse[0]));
        // Muricans format
        return new Date(Date.parse(time));
    }
}
