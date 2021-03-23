import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const LEOMANGA_DOMAIN = "https://leomanga.me";

export const LeoMangaInfo: SourceInfo = {
	version: "1.0.0",
	name: "LeoManga",
	description: "Extension that pulls manga from leomanga.me",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: LEOMANGA_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Spanish",
			type: TagType.GREY,
		},
	],
};

export class LeoManga extends Mmrcms {
	baseUrl: string = LEOMANGA_DOMAIN;
	languageCode: LanguageCode = LanguageCode.SPANISH;
	sourceTraversalPathName: string = "manga";
}