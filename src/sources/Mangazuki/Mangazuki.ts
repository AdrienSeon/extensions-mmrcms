import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, DateFormat } from "../..";

export const MangazukiInfo: SourceInfo = {
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
			type: TagType.GREEN,
		},
		{
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class Mangazuki extends Mmrcms {
    name: string = MangazukiInfo.name;
    baseUrl: string = MangazukiInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.ENGLISH;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "T",
        yesterdayTranslation: "Y",
    };
}
