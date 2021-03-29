import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory, DateFormat } from "../..";

export const ScanFrInfo: SourceInfo = {
	version: "1.0.0",
	name: "Scan-FR",
	description: "Extension that pulls manga from scan-fr.cc",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://www.scan-fr.cc",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "French",
			type: TagType.GREY,
		},
		{
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class ScanFr extends Mmrcms {
    name: string = ScanFrInfo.name;
    baseUrl: string = ScanFrInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.FRENCH;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "aujourd'hui",
        yesterdayTranslation: "hier",
    };
    sourceCategories: SourceCategory[] = [
        { id: "1", name: "Comedy" },
        { id: "2", name: "Doujinshi" },
        { id: "3", name: "Drama" },
        { id: "4", name: "Ecchi" },
        { id: "5", name: "Fantasy" },
        { id: "6", name: "Gender Bender" },
        { id: "7", name: "Josei" },
        { id: "8", name: "Mature" },
        { id: "9", name: "Mecha" },
        { id: "10", name: "Mystery" },
        { id: "11", name: "One Shot" },
        { id: "12", name: "Psychological" },
        { id: "13", name: "Romance" },
        { id: "14", name: "School Life" },
        { id: "15", name: "Sci-fi" },
        { id: "16", name: "Seinen" },
        { id: "17", name: "Shoujo" },
        { id: "18", name: "Shoujo Ai" },
        { id: "19", name: "Shounen" },
        { id: "20", name: "Shounen Ai" },
        { id: "21", name: "Slice of Life" },
        { id: "22", name: "Sports" },
        { id: "23", name: "Supernatural" },
        { id: "24", name: "Tragedy" },
        { id: "25", name: "Yaoi" },
        { id: "26", name: "Yuri" },
        { id: "27", name: "Comics" },
        { id: "28", name: "Autre" },
        { id: "29", name: "BD Occidentale" },
        { id: "30", name: "Manhwa" },
        { id: "31", name: "Action" },
        { id: "32", name: "Aventure" },
    ];
}
