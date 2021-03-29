import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory, DateFormat } from "..";

export const HentaiSharkInfo: SourceInfo = {
    version: "1.0.0",
    name: "Hentai Shark",
    description: "Extension that pulls manga from hentaishark.com",
    author: "Ankah",
    authorWebsite: "https://github.com/adrienseon",
    icon: "icon.png",
    hentaiSource: true,
    websiteBaseURL: "https://www.hentaishark.com",
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN,
        },
        {
            text: "Cloudflare",
            type: TagType.RED,
        },
    ],
};

export class HentaiShark extends Mmrcms {
    name: string = HentaiSharkInfo.name;
    baseUrl: string = HentaiSharkInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.ENGLISH;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "today",
        yesterdayTranslation: "yesterday",
    };
    sourceCategories: SourceCategory[] = [
        { id: "1", name: "Doujinshi" },
        { id: "2", name: "Manga" },
        { id: "3", name: "Western" },
        { id: "4", name: "non-h" },
        { id: "5", name: "imageset" },
        { id: "6", name: "artistcg" },
        { id: "7", name: "misc" },
    ];
}
