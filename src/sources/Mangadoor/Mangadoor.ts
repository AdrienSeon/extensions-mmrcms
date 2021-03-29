import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, DateFormat } from "../..";

export const MangadoorInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangadoor",
	description: "Extension that pulls manga from mangadoor.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://mangadoor.com",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Spanish",
			type: TagType.GREY,
        },
		{
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class Mangadoor extends Mmrcms {
    name: string = MangadoorInfo.name;
    baseUrl: string = MangadoorInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.SPANISH;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "hoy",
        yesterdayTranslation: "ayer",
    };
}
